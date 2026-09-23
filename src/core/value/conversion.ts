import { getLocalTimeZone, type CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters/calendar-adapter";
import type { DateInput } from "../../types/public";

export interface DateConversionOptions {
  timeZone?: string;
}

export function normalizeDate(
  value: DateInput,
  adapter: CalendarAdapter,
  options: DateConversionOptions = {},
): CalendarDate {
  const timeZone = options.timeZone ?? getLocalTimeZone();

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new RangeError("Invalid Date");
    }

    return adapter.fromDate(value, timeZone);
  }

  return adapter.getCalendarDate(value);
}

export function toDate(
  value: CalendarDate,
  adapter: CalendarAdapter,
  options: DateConversionOptions = {},
): Date {
  const timeZone = options.timeZone ?? getLocalTimeZone();
  return adapter.toDate(value, timeZone);
}
