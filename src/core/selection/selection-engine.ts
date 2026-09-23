import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters/calendar-adapter";
import type {
  DateRange,
  MultipleValue,
  PartialDateRange,
  SelectionInput,
} from "../types/selection";

export function selectSingle(date: CalendarDate): CalendarDate {
  return date;
}

export function toggleMultiple(
  currentValue: MultipleValue,
  date: CalendarDate,
  adapter: CalendarAdapter,
): MultipleValue {
  const exists = currentValue.some((item) => adapter.isSameDay(item, date));

  if (exists) {
    return currentValue.filter((item) => !adapter.isSameDay(item, date));
  }

  return [...currentValue, date];
}

export function selectRangeDate(
  currentRange: PartialDateRange,
  date: CalendarDate,
  adapter: CalendarAdapter,
): PartialDateRange {
  const { start, end } = currentRange;

  // First click
  if (!start) {
    return {
      start: date,
      end: null,
    };
  }

  // Range is already complete.
  // Start a new range.
  if (end) {
    return {
      start: date,
      end: null,
    };
  }

  const comparison = adapter.compare(date, start);

  // Same date
  if (comparison === 0) {
    return {
      start,
      end: date,
    };
  }

  // Selected date is before the start.
  if (comparison < 0) {
    return {
      start: date,
      end: start,
    };
  }

  return {
    start,
    end: date,
  };
}

export function getCompletedRange(range: PartialDateRange): DateRange | null {
  if (!range.start || !range.end) {
    return null;
  }

  return {
    start: range.start,
    end: range.end,
  };
}

export function isDateInRange(
  date: CalendarDate,
  range: PartialDateRange,
  adapter: CalendarAdapter,
): boolean {
  if (!range.start || !range.end) {
    return false;
  }

  const afterOrEqualStart = adapter.compare(date, range.start) >= 0;

  const beforeOrEqualEnd = adapter.compare(date, range.end) <= 0;

  return afterOrEqualStart && beforeOrEqualEnd;
}

export function isRangeStart(
  date: CalendarDate,
  range: PartialDateRange,
  adapter: CalendarAdapter,
): boolean {
  return range.start !== null && adapter.isSameDay(date, range.start);
}

export function isRangeEnd(
  date: CalendarDate,
  range: PartialDateRange,
  adapter: CalendarAdapter,
): boolean {
  return range.end !== null && adapter.isSameDay(date, range.end);
}

export function isDateSelected(
  date: CalendarDate,
  selection: SelectionInput,
  adapter: CalendarAdapter,
): boolean {
  switch (selection.mode) {
    case "single":
      if (!selection.value) {
        return false;
      }

      return adapter.isSameDay(date, selection.value);

    case "multiple":
      return selection.value.some((item) => adapter.isSameDay(item, date));

    case "range":
      return isDateInRange(date, selection.value, adapter);

    case "multiple-range":
      return selection.value.some((range) =>
        isDateInRange(date, range, adapter),
      );
  }
}
