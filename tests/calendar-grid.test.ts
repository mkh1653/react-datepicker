import { describe, expect, it, vi } from "vitest";

import { CalendarDate, createCalendar } from "@internationalized/date";

import { getCalendarAdapter } from "../src/core/adapters";
import { createCalendarGrid } from "../src/core/calendar";

describe("createCalendarGrid", () => {
  it("creates a Gregorian month grid", () => {
    const adapter = getCalendarAdapter("gregorian");

    const date = new CalendarDate(2026, 9, 1);

    const grid = createCalendarGrid(adapter, {
      date,
      locale: "en-US",
      firstDayOfWeek: "sun",
      today: new CalendarDate(2026, 9, 23),
    });

    expect(grid.weeks.length).toBe(5);

    expect(grid.weeks.every((week) => week.days.length === 7)).toBe(true);

    expect(grid.weeks[0].days[0].date).toEqual(new CalendarDate(2026, 8, 30));

    expect(grid.weeks[4].days[6].date).toEqual(new CalendarDate(2026, 10, 3));
  });

  it("marks days outside the current month", () => {
    const adapter = getCalendarAdapter("gregorian");

    const date = new CalendarDate(2026, 9, 1);

    const grid = createCalendarGrid(adapter, {
      date,
      locale: "en-US",
      firstDayOfWeek: "sun",
      today: new CalendarDate(2026, 9, 23),
    });

    const allDays = grid.weeks.flatMap((week) => week.days);

    const outsideDays = allDays.filter((day) => !day.isCurrentMonth);
    const currentMonthDays = allDays.filter((day) => day.isCurrentMonth);

    expect(outsideDays).toHaveLength(5);
    expect(currentMonthDays).toHaveLength(30);

    expect(allDays.slice(0, 2).map((day) => day.date.day)).toEqual([30, 31]);
    expect(allDays.slice(-3).map((day) => day.date.day)).toEqual([1, 2, 3]);
  });

  it("works with Persian calendar", () => {
    const adapter = getCalendarAdapter("persian");

    const persianCalendar = createCalendar("persian");

    const date = new CalendarDate(persianCalendar, 1405, 6, 1);

    const grid = createCalendarGrid(adapter, {
      date,
      locale: "fa-IR",
      firstDayOfWeek: "sat",
      today: new CalendarDate(2026, 9, 23),
    });

    expect(grid.weeks.length).toBeGreaterThanOrEqual(4);

    expect(grid.weeks.every((week) => week.days.length === 7)).toBe(true);

    expect(
      grid.weeks.flatMap((week) => week.days).some((day) => day.isCurrentMonth),
    ).toBe(true);
  });

  it("works with Islamic calendar", () => {
    const adapter = getCalendarAdapter("islamic");

    const islamicCalendar = createCalendar("islamic-civil");

    const date = new CalendarDate(islamicCalendar, 1448, 1, 1);

    const grid = createCalendarGrid(adapter, {
      date,
      locale: "en",
      firstDayOfWeek: "sun",
      today: new CalendarDate(2026, 9, 23),
    });

    expect(grid.weeks.length).toBeGreaterThanOrEqual(4);

    expect(grid.weeks.every((week) => week.days.length === 7)).toBe(true);
  });

  it("marks the provided date as today", () => {
    const adapter = getCalendarAdapter("gregorian");

    const today = new CalendarDate(2026, 9, 23);

    const grid = createCalendarGrid(adapter, {
      date: new CalendarDate(2026, 9, 1),
      locale: "en-US",
      firstDayOfWeek: "sun",
      today,
    });

    const allDays = grid.weeks.flatMap((week) => week.days);

    const todayDays = allDays.filter((day) => day.isToday);

    expect(todayDays).toHaveLength(1);
    expect(todayDays[0].date).toEqual(today);
  });
});
