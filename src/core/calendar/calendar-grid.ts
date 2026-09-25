import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters/calendar-adapter";
import type { DayOfWeek } from "../types/calendar";

export interface CalendarDay {
  date: CalendarDate;
  dayOfWeek: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarGrid {
  weeks: CalendarWeek[];
}

export interface CreateCalendarGridOptions {
  date: CalendarDate;
  locale: string;
  today: CalendarDate;
  firstDayOfWeek?: DayOfWeek;
}

export function createCalendarGrid(
  adapter: CalendarAdapter,
  options: CreateCalendarGridOptions,
): CalendarGrid {
  const { date, locale, firstDayOfWeek, today } = options;

  const monthStart = adapter.getStartOfMonth(date);

  const gridStart = adapter.getStartOfWeek(monthStart, locale, firstDayOfWeek);

  const weeksInMonth = adapter.getWeeksInMonth(
    monthStart,
    locale,
    firstDayOfWeek,
  );

  const totalDays = weeksInMonth * 7;

  const days: CalendarDay[] = [];

  let currentDate = gridStart;

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    days.push({
      date: currentDate,

      dayOfWeek: adapter.getDayOfWeek(currentDate, locale, firstDayOfWeek),

      isCurrentMonth: adapter.isSameMonth(currentDate, monthStart),

      isToday: adapter.isSameDay(currentDate, today),
    });

    currentDate = adapter.addDays(currentDate, 1);
  }

  const weeks: CalendarWeek[] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push({
      days: days.slice(index, index + 7),
    });
  }

  return { weeks };
}
