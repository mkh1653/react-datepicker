import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters/calendar-adapter";
import { isDateDisabled, type DateConstraints } from "../constraints";
import type { SelectionInput } from "../types/selection";

import {
  getCompletedRange,
  selectRangeDate,
  selectSingle,
  toggleMultiple,
} from "./selection-engine";

export function selectDate(
  selection: SelectionInput,
  date: CalendarDate,
  adapter: CalendarAdapter,
  constraints: DateConstraints,
): SelectionInput {
  if (isDateDisabled(date, constraints, adapter)) {
    return selection;
  }
  
  switch (selection.mode) {
    case "single":
      return {
        mode: "single",
        value: selectSingle(date),
      };

    case "multiple":
      return {
        mode: "multiple",
        value: toggleMultiple(selection.value, date, adapter),
      };

    case "range":
      return {
        mode: "range",
        value: selectRangeDate(selection.value, date, adapter),
      };

    case "multiple-range": {
      const pendingRange = selectRangeDate(
        selection.pendingRange,
        date,
        adapter,
      );

      const completedRange = getCompletedRange(pendingRange);

      if (!completedRange) {
        return {
          mode: "multiple-range",
          value: selection.value,
          pendingRange,
        };
      }

      return {
        mode: "multiple-range",
        value: [...selection.value, completedRange],
        pendingRange: {
          start: null,
          end: null,
        },
      };
    }
  }
}
