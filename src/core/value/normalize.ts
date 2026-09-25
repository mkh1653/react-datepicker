import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters/calendar-adapter";
import type { DateInput } from "../../types/public";

export interface NormalizeDateOptions {
  timeZone: string;
}

export function normalizeDate(
  value: DateInput,
  adapter: CalendarAdapter,
  options: NormalizeDateOptions,
): CalendarDate {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new RangeError("Invalid Date");
    }

    return adapter.fromDate(value, options.timeZone);
  }

  return adapter.getCalendarDate(value);
}
