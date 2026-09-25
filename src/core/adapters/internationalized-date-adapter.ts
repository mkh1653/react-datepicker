import {
  CalendarDate,
  createCalendar,
  fromDate,
  getLocalTimeZone,
  getDayOfWeek,
  getWeeksInMonth,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  toCalendar,
  toCalendarDate,
  today,
} from "@internationalized/date";

import type { CalendarAdapter } from "./calendar-adapter";
import type { CalendarIdentifier, DayOfWeek } from "../types/calendar";
import type { CalendarType } from "../../types";

export class InternationalizedDateAdapter implements CalendarAdapter {
  readonly type: CalendarType;
  readonly identifier: CalendarIdentifier;

  private readonly calendar;

  constructor(type: CalendarType, identifier: CalendarIdentifier) {
    this.type = type;
    this.identifier = identifier;
    this.calendar = createCalendar(identifier);
  }

  getCalendarDate(value: CalendarDate): CalendarDate {
    if (value.calendar.identifier === this.identifier) {
      return value;
    }

    const julianDay = value.calendar.toJulianDay(value);

    return this.calendar.fromJulianDay(julianDay);
  }

  fromDate(date: Date, timeZone: string): CalendarDate {
    const zonedDate = fromDate(date, timeZone);
    const converted = toCalendar(zonedDate, this.calendar);

    return toCalendarDate(converted);
  }

  toDate(date: CalendarDate, timeZone: string): Date {
    const calendarDate = this.getCalendarDate(date);
    return calendarDate.toDate(timeZone);
  }

  getMonthName(date: CalendarDate, locale: string): string {
    const formatter = new Intl.DateTimeFormat(locale, {
      calendar: this.identifier,
      month: "long",
      timeZone: "UTC",
    });

    return formatter.format(date.toDate("UTC"));
  }

  getWeekdayName(
    weekday: number,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): string {
    const referenceDate = this.today("UTC");
    const weekStart = startOfWeek(
      referenceDate,
      locale,
      firstDayOfWeek,
    ) as CalendarDate;

    const date = weekStart.add({
      days: weekday,
    });

    const formatter = new Intl.DateTimeFormat(locale, {
      calendar: this.identifier,
      weekday: "long",
      timeZone: "UTC",
    });

    return formatter.format(date.toDate("UTC"));
  }

  getDayOfWeek(
    date: CalendarDate,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): number {
    return getDayOfWeek(this.getCalendarDate(date), locale, firstDayOfWeek);
  }

  getStartOfWeek(
    date: CalendarDate,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): CalendarDate {
    return startOfWeek(
      this.getCalendarDate(date),
      locale,
      firstDayOfWeek,
    ) as CalendarDate;
  }

  getWeeksInMonth(
    date: CalendarDate,
    locale: string,
    firstDayOfWeek?: DayOfWeek,
  ): number {
    return getWeeksInMonth(this.getCalendarDate(date), locale, firstDayOfWeek);
  }

  getDaysInMonth(date: CalendarDate): number {
    const calendarDate = this.getCalendarDate(date);

    return calendarDate.calendar.getDaysInMonth(calendarDate);
  }

  getStartOfMonth(date: CalendarDate): CalendarDate {
    return startOfMonth(this.getCalendarDate(date));
  }

  addMonths(date: CalendarDate, amount: number): CalendarDate {
    return this.getCalendarDate(date).add({
      months: amount,
    });
  }

  addDays(date: CalendarDate, amount: number): CalendarDate {
    return this.getCalendarDate(date).add({
      days: amount,
    });
  }

  addYears(date: CalendarDate, amount: number): CalendarDate {
    return this.getCalendarDate(date).add({
      years: amount,
    });
  }

  isSameDay(a: CalendarDate, b: CalendarDate): boolean {
    return isSameDay(this.getCalendarDate(a), this.getCalendarDate(b));
  }

  isSameMonth(a: CalendarDate, b: CalendarDate): boolean {
    return isSameMonth(this.getCalendarDate(a), this.getCalendarDate(b));
  }

  compare(a: CalendarDate, b: CalendarDate): number {
    return this.getCalendarDate(a).compare(this.getCalendarDate(b));
  }

  today(timeZone = getLocalTimeZone()): CalendarDate {
    const currentDate = today(timeZone);

    if (currentDate.calendar.identifier === this.identifier) {
      return currentDate;
    }

    const julianDay = currentDate.calendar.toJulianDay(currentDate);
    return this.calendar.fromJulianDay(julianDay);
  }

  format(
    date: CalendarDate,
    locale: string,
    options: Intl.DateTimeFormatOptions = {},
  ): string {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      calendar: this.identifier,
      timeZone: "UTC",
    });

    return formatter.format(this.getCalendarDate(date).toDate("UTC"));
  }
}
