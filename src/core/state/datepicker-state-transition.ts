import type { CalendarDate } from "@internationalized/date";

import { changeVisibleDate, type VisibleDateChangeUnit } from "../calendar";
import { selectDate, isSelectionComplete } from "../selection";
import type { DatePickerContext } from "./datepicker-context";
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
    }
  | {
      type: "select-calendar-date";
      date: CalendarDate;
    };

export function transitionDatePickerState(
  state: DatePickerState,
  action: DatePickerStateAction,
  context: DatePickerContext
): DatePickerState {
  switch (action.type) {
    case "select-date":
      if (isDateDisabled(action.date, context.constraints, context.adapter)) {
        return state;
      }
      const selection = selectDate(
        state.selection,
        action.date,
        context.adapter,
        context.constraints,
      );

      return {
        ...state,
        selection,
        open:
          context.closeOnSelect && isSelectionComplete(selection)
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
          context.adapter,
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
      
    case "select-calendar-date": {
      if (isDateDisabled(action.date, context.constraints, context.adapter)) {
        return state;
      }

      const visibleDate = context.adapter.isSameMonth(
        state.visibleDate,
        action.date,
      )
        ? state.visibleDate
        : context.adapter.getStartOfMonth(action.date);

      const selection = selectDate(
        state.selection,
        action.date,
        context.adapter,
        context.constraints,
      );

      return {
        ...state,
        visibleDate,
        selection,
        open:
          context.closeOnSelect && isSelectionComplete(selection)
            ? false
            : state.open,
      };
    }
  }
}
