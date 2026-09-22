import type { CalendarDate } from "@internationalized/date";
import type { CalendarType } from "../types/calendar";

export interface CalendarAdapter {
  readonly type: CalendarType;
  readonly identifier: string;

  getCalendarDate(value: CalendarDate): CalendarDate;

  getMonthName(date: CalendarDate, locale: string): string;

  getWeekdayName(weekday: number, locale: string): string;

  getDaysInMonth(date: CalendarDate): number;

  getStartOfMonth(date: CalendarDate): CalendarDate;

  addMonths(date: CalendarDate, amount: number): CalendarDate;

  addYears(date: CalendarDate, amount: number): CalendarDate;

  isSameDay(a: CalendarDate, b: CalendarDate): boolean;

  isSameMonth(a: CalendarDate, b: CalendarDate): boolean;

  compare(a: CalendarDate, b: CalendarDate): number;

  today(timeZone?: string): CalendarDate;

  format(
    date: CalendarDate,
    locale: string,
    options?: Intl.DateTimeFormatOptions,
  ): string;
}
