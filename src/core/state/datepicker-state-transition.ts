import type { CalendarDate } from "@internationalized/date";

import { changeVisibleDate, type VisibleDateChangeUnit } from "../calendar";
import { selectDate, isSelectionComplete } from "../selection";
import type { DatePickerState } from "./datepicker-state";
import { isDateDisabled } from "../constraints";

export type DatePickerStateAction =
  | {
      type: "select-date";
      date: CalendarDate;
    }
  | {
      type: "change-visible-date";
      amount: number;
      unit: VisibleDateChangeUnit;
    }
  | {
      type: "open";
    }
  | {
      type: "close";
    };

export function transitionDatePickerState(
  state: DatePickerState,
  action: DatePickerStateAction,
): DatePickerState {
  switch (action.type) {
    case "select-date":
      if (isDateDisabled(action.date, state.constraints, state.adapter)) {
        return state;
      }
      const selection = selectDate(
        state.selection,
        action.date,
        state.adapter,
        state.constraints,
      );

      return {
        ...state,
        selection,
        open:
          state.closeOnSelect && isSelectionComplete(selection)
            ? false
            : state.open,
      };

    case "change-visible-date":
      return {
        ...state,
        visibleDate: changeVisibleDate(
          state.visibleDate,
          action.amount,
          action.unit,
          state.adapter,
        ),
      };

    case "open":
      return {
        ...state,
        open: true,
      };

    case "close":
      return {
        ...state,
        open: false,
      };
  }
}
