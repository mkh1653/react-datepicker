import { useReducer } from "react";

import type { SelectionInput } from "../types/selection";
import type { DatePickerProps } from "../../types";
import { normalizeDate, toDate } from "../value";
import {
  createInitialDatePickerContext,
  type DatePickerContext,
} from "./datepicker-context";

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
  context: DatePickerContext,
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
          context.adapter,
          context.timeZone,
        ),
      };

    case "range":
      return {
        mode: "range" as const,
        value: normalizeRangeValue(
          props.value,
          context.adapter,
          context.timeZone,
        ),
      };

    case "multiple-range":
      return {
        mode: "multiple-range" as const,
        value: normalizeMultipleRangeValue(
          props.value,
          context.adapter,
          context.timeZone,
        ),
        pendingRange:
          state.selection.mode === "multiple-range"
            ? state.selection.pendingRange
            : {
                start: null,
                end: null,
              },
      };

    default:
      return {
        mode: "single" as const,
        value: normalizeSingleValue(
          props.value,
          context.adapter,
          context.timeZone,
        ),
      };
  }
}

function convertSelectionToCalendar(
  selection: SelectionInput,
  context: DatePickerContext,
): SelectionInput {
  switch (selection.mode) {
    case "single":
      return {
        mode: "single",
        value: normalizeSingleValue(
          selection.value,
          context.adapter,
          context.timeZone,
        ),
      };

    case "multiple":
      return {
        mode: "multiple",
        value: normalizeMultipleValue(
          selection.value,
          context.adapter,
          context.timeZone,
        ),
      };

    case "range":
      return {
        mode: "range",
        value: normalizeRangeValue(
          selection.value,
          context.adapter,
          context.timeZone,
        ),
      };

    case "multiple-range":
      return {
        mode: "multiple-range",
        value: normalizeMultipleRangeValue(
          selection.value,
          context.adapter,
          context.timeZone,
        ),
        pendingRange: normalizeRangeValue(
          selection.pendingRange,
          context.adapter,
          context.timeZone,
        ),
      };
  }
}

function getEffectiveState(
  internalState: DatePickerState,
  props: DatePickerProps,
  context: DatePickerContext,
): DatePickerState {
  const selection =
    "value" in props
      ? getControlledSelection(props, context, internalState)
      : convertSelectionToCalendar(internalState.selection, context);

  const visibleDate =
    "visibleDate" in props
      ? context.adapter.getStartOfMonth(
          normalizeDate(props.visibleDate, context.adapter, {
            timeZone: context.timeZone,
          }),
        )
      : context.adapter.getStartOfMonth(
          context.adapter.getCalendarDate(internalState.visibleDate),
        );

  const open = "open" in props ? props.open : internalState.open;

  return {
    ...internalState,
    selection,
    visibleDate,
    open,
  };
}

function hasSelectionValueChanged(
  previous: DatePickerState["selection"],
  next: DatePickerState["selection"],
  context: DatePickerContext,
): boolean {
  if (previous.mode !== next.mode) {
    return true;
  }

  switch (next.mode) {
    case "single":
      if (previous.mode !== "single") {
        return true;
      }

      if (previous.value === null || next.value === null) {
        return previous.value !== next.value;
      }

      return !context.adapter.isSameDay(previous.value, next.value);

    case "multiple":
      if (previous.mode !== "multiple") {
        return true;
      }

      if (previous.value.length !== next.value.length) {
        return true;
      }

      return next.value.some(
        (date, index) =>
          !context.adapter.isSameDay(date, previous.value[index]),
      );

    case "range":
      if (previous.mode !== "range") {
        return true;
      }

      if (previous.value.start === null || next.value.start === null) {
        if (previous.value.start !== next.value.start) {
          return true;
        }
      } else if (
        !context.adapter.isSameDay(previous.value.start, next.value.start)
      ) {
        return true;
      }

      if (previous.value.end === null || next.value.end === null) {
        return previous.value.end !== next.value.end;
      }

      return !context.adapter.isSameDay(previous.value.end, next.value.end);

    case "multiple-range":
      if (previous.mode !== "multiple-range") {
        return true;
      }

      if (previous.value.length !== next.value.length) {
        return true;
      }

      return next.value.some((range, index) => {
        const previousRange = previous.value[index];

        return (
          !context.adapter.isSameDay(range.start, previousRange.start) ||
          !context.adapter.isSameDay(range.end, previousRange.end)
        );
      });
  }
}

export function useDatePickerState(
  props: DatePickerProps = {},
): UseDatePickerStateResult {
  const context = createInitialDatePickerContext(props);

  const [internalState, dispatchInternal] = useReducer(
    (state: DatePickerState, action: DatePickerStateAction) =>
      transitionDatePickerState(state, action, context),
    props,
    (initialProps) => {
      const initialContext = createInitialDatePickerContext(initialProps);

      return createInitialDatePickerState(initialProps, initialContext);
    },
  );

  const state = getEffectiveState(internalState, props, context);

  const dispatch = (action: DatePickerStateAction) => {
    const nextState = transitionDatePickerState(state, action, context);

    if (
      "value" in props &&
      hasSelectionValueChanged(state.selection, nextState.selection, context)
    ) {
      switch (props.selectionMode) {
        case "multiple":
          if (nextState.selection.mode === "multiple") {
            props.onChange?.(
              toMultipleValue(
                nextState.selection.value,
                context.adapter,
                context.timeZone,
              ),
            );
          }
          break;

        case "range":
          if (nextState.selection.mode === "range") {
            props.onChange?.(
              toRangeValue(
                nextState.selection.value,
                context.adapter,
                context.timeZone,
              ),
            );
          }
          break;

        case "multiple-range":
          if (nextState.selection.mode === "multiple-range") {
            props.onChange?.(
              toMultipleRangeValue(
                nextState.selection.value,
                context.adapter,
                context.timeZone,
              ),
            );
          }
          break;

        default:
          if (nextState.selection.mode === "single") {
            props.onChange?.(
              toSingleValue(
                nextState.selection.value,
                context.adapter,
                context.timeZone,
              ),
            );
          }
          break;
      }
    }

    if ("open" in props && nextState.open !== state.open) {
      props.onOpenChange(nextState.open);
    }

    if ("visibleDate" in props && nextState.visibleDate !== state.visibleDate) {
      props.onVisibleDateChange(
        toDate(nextState.visibleDate, context.adapter, {
          timeZone: context.timeZone,
        }),
      );
    }

    dispatchInternal(action);
  };

  return {
    state,
    dispatch,
  };
}
