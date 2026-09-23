import { CalendarDate, createCalendar } from "@internationalized/date";

import { describe, expect, it } from "vitest";

import { getCalendarAdapter } from "../src/core/adapters";

import { normalizeDate, toDate } from "../src/core/value";

describe("date conversion", () => {
  it("converts JavaScript Date to Gregorian CalendarDate", () => {
    const adapter = getCalendarAdapter("gregorian");

    const date = new Date("2026-09-23T00:00:00.000Z");

    const result = normalizeDate(date, adapter, {
      timeZone: "UTC",
    });

    expect(result.calendar.identifier).toBe("gregory");

    expect(result.year).toBe(2026);
    expect(result.month).toBe(9);
    expect(result.day).toBe(23);
  });

  it("converts JavaScript Date to Persian CalendarDate", () => {
    const adapter = getCalendarAdapter("persian");

    const date = new Date("2026-09-23T00:00:00.000Z");

    const result = normalizeDate(date, adapter, {
      timeZone: "UTC",
    });

    expect(result.calendar.identifier).toBe("persian");

    expect(result.year).toBe(1405);
    expect(result.month).toBe(7);
    expect(result.day).toBe(1);
  });

  it("converts CalendarDate to the requested calendar", () => {
    const gregorianCalendar = createCalendar("gregory");

    const source = new CalendarDate(gregorianCalendar, 2026, 9, 23);

    const adapter = getCalendarAdapter("persian");

    const result = normalizeDate(source, adapter, {
      timeZone: "UTC",
    });

    expect(result.calendar.identifier).toBe("persian");

    expect(result.year).toBe(1405);
    expect(result.month).toBe(7);
    expect(result.day).toBe(1);
  });

  it("converts CalendarDate back to JavaScript Date", () => {
    const adapter = getCalendarAdapter("persian");

    const sourceCalendar = createCalendar("persian");

    const source = new CalendarDate(sourceCalendar, 1405, 7, 1);

    const result = toDate(source, adapter, {
      timeZone: "UTC",
    });

    expect(result).toEqual(new Date("2026-09-23T00:00:00.000Z"));
  });

  it("rejects an invalid JavaScript Date", () => {
    const adapter = getCalendarAdapter("gregorian");

    const invalidDate = new Date("invalid");

    expect(() =>
      normalizeDate(invalidDate, adapter, {
        timeZone: "UTC",
      }),
    ).toThrow("Invalid Date");
  });
});
