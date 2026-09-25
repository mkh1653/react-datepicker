import type { CalendarDate } from "@internationalized/date";
import type { DayOfWeek } from "../types/calendar";
import type { CalendarType } from "../../types/public";

export interface CalendarAdapter {
  readonly type: CalendarType;
  readonly identifier: string;

  getCalendarDate(value: CalendarDate): CalendarDate;

  fromDate(date: Date, timeZone: string): CalendarDate;

  toDate(date: CalendarDate, timeZone: string): Date;

  // Month
  getMonthName(date: CalendarDate, locale: string): string;

  getStartOfMonth(date: CalendarDate): CalendarDate;

  addMonths(date: CalendarDate, amount: number): CalendarDate;

  isSameMonth(a: CalendarDate, b: CalendarDate): boolean;

  // Week
  getWeekdayName(
    weekday: number,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): string;

  getStartOfWeek(
    date: CalendarDate,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): CalendarDate;

  getWeeksInMonth(
    date: CalendarDate,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): number;

  // Day
  getDaysInMonth(date: CalendarDate): number;

  getDayOfWeek(
    date: CalendarDate,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): number;

  addDays(date: CalendarDate, amount: number): CalendarDate;

  isSameDay(a: CalendarDate, b: CalendarDate): boolean;

  // Year
  addYears(date: CalendarDate, amount: number): CalendarDate;

  compare(a: CalendarDate, b: CalendarDate): number;

  today(timeZone?: string): CalendarDate;

  format(
    date: CalendarDate,
    locale: string,
    options?: Intl.DateTimeFormatOptions,
  ): string;
}
