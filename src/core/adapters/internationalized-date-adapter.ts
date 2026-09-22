import {
  createCalendar,
  getLocalTimeZone,
  isSameDay,
  isSameMonth,
  startOfMonth,
  today,
  CalendarDate,
} from "@internationalized/date";

import type { CalendarAdapter } from "./calendar-adapter";
import type { CalendarIdentifier, CalendarType } from "../types/calendar";

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

    return value.calendar.fromJulianDay(this.calendar.toJulianDay(value));
  }

  getMonthName(date: CalendarDate, locale: string): string {
    const formatter = new Intl.DateTimeFormat(locale, {
      calendar: this.identifier,
      month: "long",
    });

    return formatter.format(date.toDate("UTC"));
  }

  getWeekdayName(weekday: number, locale: string): string {
    const referenceDate = new CalendarDate(this.calendar, 2024, 1, 1).add({
      days: weekday,
    });

    const formatter = new Intl.DateTimeFormat(locale, {
      calendar: this.identifier,
      weekday: "long",
    });

    return formatter.format(referenceDate.toDate("UTC"));
  }

  getDaysInMonth(date: CalendarDate): number {
    return this.getCalendarDate(date).calendar.getDaysInMonth(
      this.getCalendarDate(date),
    );
  }

  getStartOfMonth(date: CalendarDate): CalendarDate {
    return startOfMonth(this.getCalendarDate(date));
  }

  addMonths(date: CalendarDate, amount: number): CalendarDate {
    return this.getCalendarDate(date).add({
      months: amount,
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
    return today(timeZone).calendar.identifier === this.identifier
      ? today(timeZone)
      : this.calendar.fromJulianDay(
          today(timeZone).calendar.toJulianDay(today(timeZone)),
        );
  }

  format(
    date: CalendarDate,
    locale: string,
    options: Intl.DateTimeFormatOptions = {},
  ): string {
    const formatter = new Intl.DateTimeFormat(locale, {
      calendar: this.identifier,
      ...options,
    });

    return formatter.format(this.getCalendarDate(date).toDate("UTC"));
  }
}
