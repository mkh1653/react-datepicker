import type { CalendarType, DateInput } from "../../types/public";
import { getCalendarAdapter } from "../adapters";
import { getSystemLocale } from "./system-locale";

export interface FormatDateOptions {
  calendar?: CalendarType;
  locale?: string;
  timeZone?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

export function formatDate(
  value: DateInput | null | undefined,
  options: FormatDateOptions = {},
): string {
  if (value == null) {
    return "";
  }

  const systemLocale = getSystemLocale();

  const calendar = options.calendar ?? systemLocale.calendar;
  const locale = options.locale ?? systemLocale.locale;
  const timeZone = options.timeZone ?? systemLocale.timeZone;

  const adapter = getCalendarAdapter(calendar);

  const calendarDate =
    value instanceof Date
      ? adapter.fromDate(value, timeZone)
      : adapter.getCalendarDate(value);

  return adapter.format(calendarDate, locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options.formatOptions,
  });
}
