import { describe, expect, it } from "vitest";
import { CalendarDate, createCalendar } from "@internationalized/date";

import { getCalendarAdapter } from "../../../src/core/adapters";
import { changeVisibleDate } from "../../../src/core/calendar";

describe("changeVisibleDate", () => {
  const adapter = getCalendarAdapter("gregorian");

  it("moves one month forward", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const result = changeVisibleDate(visibleDate, 1, "month", adapter);

    expect(result).toEqual(new CalendarDate(2026, 10, 1));
  });

  it("moves one month backward", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const result = changeVisibleDate(visibleDate, -1, "month", adapter);

    expect(result).toEqual(new CalendarDate(2026, 8, 1));
  });

  it("moves one year forward", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const result = changeVisibleDate(visibleDate, 1, "year", adapter);

    expect(result).toEqual(new CalendarDate(2027, 9, 1));
  });

  it("moves one year backward", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const result = changeVisibleDate(visibleDate, -1, "year", adapter);

    expect(result).toEqual(new CalendarDate(2025, 9, 1));
  });

  it("supports moving multiple months at once", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const result = changeVisibleDate(visibleDate, 3, "month", adapter);

    expect(result).toEqual(new CalendarDate(2026, 12, 1));
  });

  it("supports moving multiple years at once", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const result = changeVisibleDate(visibleDate, 3, "year", adapter);

    expect(result).toEqual(new CalendarDate(2029, 9, 1));
  });

  it("works with the active calendar", () => {
    const persianAdapter = getCalendarAdapter("jalali");

    const visibleDate = new CalendarDate(createCalendar("persian"), 1405, 7, 1);

    const result = changeVisibleDate(visibleDate, 1, "month", persianAdapter);

    expect(result.calendar.identifier).toBe("persian");
  });

  it("returns the first day of the target month", () => {
    const visibleDate = new CalendarDate(2026, 1, 31);
    const result = changeVisibleDate(visibleDate, 1, "month", adapter);

    expect(result).toEqual(new CalendarDate(2026, 2, 1));
  });
});
