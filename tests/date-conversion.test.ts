import { describe, expect, it } from "vitest";
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
} from "@internationalized/date";

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

  it("converts JavaScript Date to Islamic CalendarDate", () => {
    const adapter = getCalendarAdapter("islamic");

    const date = new Date("2026-09-23T00:00:00.000Z");

    const result = normalizeDate(date, adapter, {
      timeZone: "UTC",
    });

    expect(result.calendar.identifier).toBe("islamic-civil");

    expect(result.year).toBeGreaterThan(0);
    expect(result.month).toBeGreaterThan(0);
    expect(result.day).toBeGreaterThan(0);
  });

  it("converts Gregorian CalendarDate to Persian", () => {
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

  it("converts Persian CalendarDate to Gregorian", () => {
    const persianCalendar = createCalendar("persian");

    const source = new CalendarDate(persianCalendar, 1405, 7, 1);

    const adapter = getCalendarAdapter("gregorian");

    const result = normalizeDate(source, adapter, {
      timeZone: "UTC",
    });

    expect(result.calendar.identifier).toBe("gregory");

    expect(result.year).toBe(2026);
    expect(result.month).toBe(9);
    expect(result.day).toBe(23);
  });

  it("converts Persian CalendarDate to JavaScript Date", () => {
    const persianCalendar = createCalendar("persian");

    const source = new CalendarDate(persianCalendar, 1405, 7, 1);

    const adapter = getCalendarAdapter("persian");

    const result = toDate(source, adapter, {
      timeZone: "UTC",
    });

    expect(result).toEqual(new Date("2026-09-23T00:00:00.000Z"));
  });

  it("respects the provided timezone when normalizing a Date", () => {
    const adapter = getCalendarAdapter("gregorian");

    const date = new Date("2026-09-22T21:00:00.000Z");

    const utcResult = normalizeDate(date, adapter, {
      timeZone: "UTC",
    });

    const tehranResult = normalizeDate(date, adapter, {
      timeZone: "Asia/Tehran",
    });

    expect(utcResult.year).toBe(2026);
    expect(utcResult.month).toBe(9);
    expect(utcResult.day).toBe(22);

    expect(tehranResult.year).toBe(2026);
    expect(tehranResult.month).toBe(9);
    expect(tehranResult.day).toBe(23);
  });

  it("respects the provided timezone when converting to Date", () => {
    const persianCalendar = createCalendar("persian");

    const source = new CalendarDate(persianCalendar, 1405, 7, 1);

    const adapter = getCalendarAdapter("persian");

    const utcDate = toDate(source, adapter, {
      timeZone: "UTC",
    });

    const tehranDate = toDate(source, adapter, {
      timeZone: "Asia/Tehran",
    });

    expect(utcDate).toEqual(new Date("2026-09-23T00:00:00.000Z"));

    expect(tehranDate).toEqual(new Date("2026-09-22T20:30:00.000Z"));
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

  it("uses the system timezone when timezone is omitted", () => {
    const adapter = getCalendarAdapter("gregorian");

    const date = new Date("2026-09-22T21:00:00.000Z");

    const implicitResult = normalizeDate(date, adapter);

    const explicitResult = normalizeDate(date, adapter, {
      timeZone: getLocalTimeZone(),
    });

    expect(implicitResult).toEqual(explicitResult);
  });

  it("uses the system timezone when converting to Date", () => {
    const persianCalendar = createCalendar("persian");

    const source = new CalendarDate(persianCalendar, 1405, 7, 1);

    const adapter = getCalendarAdapter("persian");

    const implicitResult = toDate(source, adapter);

    const explicitResult = toDate(source, adapter, {
      timeZone: getLocalTimeZone(),
    });

    expect(implicitResult).toEqual(explicitResult);
  });
});
