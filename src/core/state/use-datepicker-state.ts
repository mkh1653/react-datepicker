import { useCallback, useReducer } from "react";

import type { DatePickerProps } from "../../types";
import { normalizeDate, toDate } from "../value";
import {
  createInitialDatePickerState,
  type DatePickerState,
} from "./datepicker-state";
import {
  transitionDatePickerState,
  type DatePickerStateAction,
} from "./datepicker-state-transition";
import {
  normalizeMultipleRangeValue,
  normalizeMultipleValue,
  normalizeRangeValue,
  normalizeSingleValue,
  toMultipleRangeValue,
  toMultipleValue,
  toRangeValue,
  toSingleValue,
} from "../selection";

export interface UseDatePickerStateResult {
  state: DatePickerState;
  dispatch: (action: DatePickerStateAction) => void;
}

function getControlledSelection(
  props: DatePickerProps,
  state: DatePickerState,
) {
  if (!("value" in props)) {
    return state.selection;
  }

  switch (props.selectionMode) {
    case "multiple":
      return {
        mode: "multiple" as const,
        value: normalizeMultipleValue(
          props.value,
          state.adapter,
          state.timeZone,
        ),
      };

    case "range":
      return {
        mode: "range" as const,
        value: normalizeRangeValue(props.value, state.adapter, state.timeZone),
      };

    case "multiple-range":
      return {
        mode: "multiple-range" as const,
        value: normalizeMultipleRangeValue(
          props.value,
          state.adapter,
          state.timeZone,
        ),
        pendingRange: {
          start: null,
          end: null,
        },
      };

    default:
      return {
        mode: "single" as const,
        value: normalizeSingleValue(props.value, state.adapter, state.timeZone),
      };
  }
}

function getEffectiveState(
  internalState: DatePickerState,
  props: DatePickerProps,
): DatePickerState {
  const selection = getControlledSelection(props, internalState);

  const visibleDate =
    "visibleDate" in props
      ? internalState.adapter.getStartOfMonth(
          normalizeDate(props.visibleDate, internalState.adapter, {
            timeZone: internalState.timeZone,
          }),
        )
      : internalState.visibleDate;

  const open = "open" in props ? props.open : internalState.open;

  return {
    ...internalState,
    selection,
    visibleDate,
    open,
  };
}

export function useDatePickerState(
  props: DatePickerProps = {},
): UseDatePickerStateResult {
  const [internalState, dispatchInternal] = useReducer(
    transitionDatePickerState,
    props,
    createInitialDatePickerState,
  );

  const state = getEffectiveState(internalState, props);

  const dispatch = useCallback(
    (action: DatePickerStateAction) => {
      const nextState = transitionDatePickerState(state, action);

      if ("value" in props && nextState.selection !== state.selection) {
        switch (props.selectionMode) {
          case "multiple":
            if (nextState.selection.mode === "multiple") {
              props.onChange?.(
                toMultipleValue(
                  nextState.selection.value,
                  nextState.adapter,
                  nextState.timeZone,
                ),
              );
            }
            break;

          case "range":
            if (nextState.selection.mode === "range") {
              props.onChange?.(
                toRangeValue(
                  nextState.selection.value,
                  nextState.adapter,
                  nextState.timeZone,
                ),
              );
            }
            break;

          case "multiple-range":
            if (nextState.selection.mode === "multiple-range") {
              props.onChange?.(
                toMultipleRangeValue(
                  nextState.selection.value,
                  nextState.adapter,
                  nextState.timeZone,
                ),
              );
            }
            break;

          default:
            if (nextState.selection.mode === "single") {
              props.onChange?.(
                toSingleValue(
                  nextState.selection.value,
                  nextState.adapter,
                  nextState.timeZone,
                ),
              );
            }
            break;
        }
      }

      if ("open" in props && nextState.open !== state.open) {
        props.onOpenChange(nextState.open);
      }

      if (
        "visibleDate" in props &&
        nextState.visibleDate !== state.visibleDate
      ) {
        props.onVisibleDateChange(
          toDate(nextState.visibleDate, nextState.adapter, {
            timeZone: nextState.timeZone,
          }),
        );
      }

      dispatchInternal(action);
    },
    [props, state],
  );

  return {
    state,
    dispatch,
  };
}
