import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters/calendar-adapter";
import { normalizeDate, toDate } from "../value";
import type {
  DateInput,
  DateRangeInput,
  DateRangeOutput,
  MultipleDateInput,
  MultipleDateOutput,
  MultipleRangeInput,
  MultipleRangeOutput,
} from "../../types/public";
import type { MultipleRangeValue, PartialDateRange } from "../types/selection";

export function normalizeSingleValue(
  value: DateInput | null,
  adapter: CalendarAdapter,
  timeZone?: string,
): CalendarDate | null {
  if (value === null) {
    return null;
  }

  return normalizeDate(value, adapter, { timeZone });
}

export function normalizeMultipleValue(
  value: MultipleDateInput,
  adapter: CalendarAdapter,
  timeZone?: string,
): CalendarDate[] {
  return value.map((item) => normalizeDate(item, adapter, { timeZone }));
}

export function normalizeRangeValue(
  value: DateRangeInput,
  adapter: CalendarAdapter,
  timeZone?: string,
): PartialDateRange {
  return {
    start:
      value.start === null
        ? null
        : normalizeDate(value.start, adapter, { timeZone }),

    end:
      value.end === null
        ? null
        : normalizeDate(value.end, adapter, { timeZone }),
  };
}

export function normalizeMultipleRangeValue(
  value: MultipleRangeInput,
  adapter: CalendarAdapter,
  timeZone?: string,
): MultipleRangeValue {
  return value.map((range) => ({
    start: normalizeDate(range.start, adapter, { timeZone }),
    end: normalizeDate(range.end, adapter, { timeZone }),
  }));
}

export function toSingleValue(
  value: CalendarDate | null,
  adapter: CalendarAdapter,
  timeZone?: string,
): Date | null {
  if (value === null) {
    return null;
  }

  return toDate(value, adapter, { timeZone });
}

export function toMultipleValue(
  value: CalendarDate[],
  adapter: CalendarAdapter,
  timeZone?: string,
): MultipleDateOutput {
  return value.map((item) => toDate(item, adapter, { timeZone }));
}

export function toRangeValue(
  value: PartialDateRange,
  adapter: CalendarAdapter,
  timeZone?: string,
): DateRangeOutput {
  return {
    start:
      value.start === null ? null : toDate(value.start, adapter, { timeZone }),

    end: value.end === null ? null : toDate(value.end, adapter, { timeZone }),
  };
}

export function toMultipleRangeValue(
  value: MultipleRangeValue,
  adapter: CalendarAdapter,
  timeZone?: string,
): MultipleRangeOutput {
  return value.map((range) => ({
    start: toDate(range.start, adapter, { timeZone }),

    end: toDate(range.end, adapter, { timeZone }),
  }));
}
