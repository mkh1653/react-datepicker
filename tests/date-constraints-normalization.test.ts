import { CalendarDate } from "@internationalized/date";
import { describe, expect, it, vi } from "vitest";

import { getCalendarAdapter } from "../src/core/adapters";
import { normalizeDateConstraints } from "../src/core/constraints";

describe("date constraints normalization", () => {
  it("normalizes min and max dates", () => {
    const adapter = getCalendarAdapter("persian");

    const result = normalizeDateConstraints(
      {
        minDate: new Date("2026-09-23T00:00:00.000Z"),
        maxDate: new Date("2026-09-30T00:00:00.000Z"),
      },
      adapter,
      "UTC",
    );

    expect(result.minDate).toEqual(
      new CalendarDate(adapter.today().calendar, 1405, 7, 1),
    );

    expect(result.maxDate).toEqual(
      new CalendarDate(adapter.today().calendar, 1405, 7, 8),
    );
  });

  it("normalizes disabled dates", () => {
    const adapter = getCalendarAdapter("persian");

    const result = normalizeDateConstraints(
      {
        disabledDates: [
          new Date("2026-09-23T00:00:00.000Z"),
          new Date("2026-09-24T00:00:00.000Z"),
        ],
      },
      adapter,
      "UTC",
    );

    expect(result.disabledDates).toHaveLength(2);

    expect(result.disabledDates?.[0].year).toBe(1405);
    expect(result.disabledDates?.[0].month).toBe(7);
    expect(result.disabledDates?.[0].day).toBe(1);

    expect(result.disabledDates?.[1].day).toBe(2);
  });

  it("normalizes CalendarDate inputs using the target calendar", () => {
    const adapter = getCalendarAdapter("persian");

    const result = normalizeDateConstraints(
      {
        minDate: new CalendarDate(2026, 9, 23),
      },
      adapter,
      "UTC",
    );

    expect(result.minDate?.calendar.identifier).toBe("persian");
    expect(result.minDate?.year).toBe(1405);
    expect(result.minDate?.month).toBe(7);
    expect(result.minDate?.day).toBe(1);
  });

  it("adapts the public isDateDisabled callback", () => {
    const adapter = getCalendarAdapter("gregorian");

    const callback = vi.fn((date: Date) => date.getUTCDate() === 25);

    const result = normalizeDateConstraints(
      {
        isDateDisabled: callback,
      },
      adapter,
      "UTC",
    );

    const disabledDate = new CalendarDate(2026, 9, 25);
    const selectableDate = new CalendarDate(2026, 9, 26);

    expect(result.isDateDisabled?.(disabledDate)).toBe(true);
    expect(result.isDateDisabled?.(selectableDate)).toBe(false);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("preserves the provided timezone for the public callback", () => {
    const adapter = getCalendarAdapter("gregorian");

    const callback = vi.fn((date: Date) => date.getUTCDate() === 23);

    const result = normalizeDateConstraints(
      {
        isDateDisabled: callback,
      },
      adapter,
      "Asia/Tehran",
    );

    const date = new CalendarDate(2026, 9, 23);

    result.isDateDisabled?.(date);

    expect(callback).toHaveBeenCalledWith(new Date("2026-09-22T20:30:00.000Z"));
  });

  it("throws when minDate is after maxDate", () => {
    const adapter = getCalendarAdapter("gregorian");

    expect(() =>
      normalizeDateConstraints(
        {
          minDate: new Date("2026-09-20T00:00:00.000Z"),
          maxDate: new Date("2026-09-10T00:00:00.000Z"),
        },
        adapter,
        "UTC",
      ),
    ).toThrow(RangeError);
  });

  it("allows minDate and maxDate to be the same date", () => {
    const adapter = getCalendarAdapter("gregorian");

    expect(() =>
      normalizeDateConstraints(
        {
          minDate: new Date("2026-09-10T00:00:00.000Z"),
          maxDate: new Date("2026-09-10T00:00:00.000Z"),
        },
        adapter,
        "UTC",
      ),
    ).not.toThrow();
  });
});
