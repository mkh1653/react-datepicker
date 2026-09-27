import type { CalendarDate } from "@internationalized/date";

import { changeVisibleDate, type VisibleDateChangeUnit } from "../calendar";
import { selectDate } from "../selection";
import type { DatePickerState } from "./datepicker-state";

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
      return {
        ...state,
        selection: selectDate(
          state.selection,
          action.date,
          state.adapter,
          state.constraints,
        ),
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
