import { CalendarDate, createCalendar } from "@internationalized/date";

import { describe, expect, it } from "vitest";

import { getCalendarAdapter } from "../src/core/adapters";

import {
  normalizeMultipleRangeValue,
  normalizeMultipleValue,
  normalizeRangeValue,
  normalizeSingleValue,
  toMultipleRangeValue,
  toMultipleValue,
  toRangeValue,
  toSingleValue,
} from "../src/core/selection";

describe("selection value conversion", () => {
  const adapter = getCalendarAdapter("persian");

  const firstDate = new Date("2026-09-23T00:00:00.000Z");

  const secondDate = new Date("2026-09-24T00:00:00.000Z");

  it("normalizes a single Date", () => {
    const result = normalizeSingleValue(firstDate, adapter, "UTC");

    expect(result).not.toBeNull();
    expect(result?.calendar.identifier).toBe("persian");
    expect(result?.year).toBe(1405);
    expect(result?.month).toBe(7);
    expect(result?.day).toBe(1);
  });

  it("normalizes a CalendarDate", () => {
    const gregorian = createCalendar("gregory");

    const value = new CalendarDate(gregorian, 2026, 9, 23);

    const result = normalizeSingleValue(value, adapter, "UTC");

    expect(result?.calendar.identifier).toBe("persian");

    expect(result?.year).toBe(1405);
    expect(result?.month).toBe(7);
    expect(result?.day).toBe(1);
  });

  it("normalizes multiple dates", () => {
    const result = normalizeMultipleValue(
      [firstDate, secondDate],
      adapter,
      "UTC",
    );

    expect(result).toHaveLength(2);

    expect(result[0].calendar.identifier).toBe("persian");

    expect(result[1].calendar.identifier).toBe("persian");
  });

  it("normalizes a range", () => {
    const result = normalizeRangeValue(
      {
        start: firstDate,
        end: secondDate,
      },
      adapter,
      "UTC",
    );

    expect(result.start).not.toBeNull();
    expect(result.end).not.toBeNull();

    expect(result.start?.day).toBe(1);
    expect(result.end?.day).toBe(2);
  });

  it("normalizes a partial range", () => {
    const result = normalizeRangeValue(
      {
        start: firstDate,
        end: null,
      },
      adapter,
      "UTC",
    );

    expect(result.start).not.toBeNull();
    expect(result.end).toBeNull();
  });

  it("normalizes multiple ranges", () => {
    const result = normalizeMultipleRangeValue(
      [
        {
          start: firstDate,
          end: secondDate,
        },
        {
          start: secondDate,
          end: new Date("2026-09-25T00:00:00.000Z"),
        },
      ],
      adapter,
      "UTC",
    );

    expect(result).toHaveLength(2);
    expect(result[0].start.day).toBe(1);
    expect(result[0].end.day).toBe(2);
    expect(result[1].start.day).toBe(2);
    expect(result[1].end.day).toBe(3);
  });

  it("converts a single value back to Date", () => {
    const internal = normalizeSingleValue(firstDate, adapter, "UTC");

    const result = toSingleValue(internal, adapter, "UTC");

    expect(result).toEqual(firstDate);
  });

  it("converts multiple values back to Date", () => {
    const internal = normalizeMultipleValue(
      [firstDate, secondDate],
      adapter,
      "UTC",
    );

    const result = toMultipleValue(internal, adapter, "UTC");

    expect(result).toEqual([firstDate, secondDate]);
  });

  it("converts a range back to Dates", () => {
    const internal = normalizeRangeValue(
      {
        start: firstDate,
        end: secondDate,
      },
      adapter,
      "UTC",
    );

    const result = toRangeValue(internal, adapter, "UTC");

    expect(result).toEqual({
      start: firstDate,
      end: secondDate,
    });
  });

  it("converts multiple ranges back to Dates", () => {
    const input = [
      {
        start: firstDate,
        end: secondDate,
      },
    ];

    const internal = normalizeMultipleRangeValue(input, adapter, "UTC");

    const result = toMultipleRangeValue(internal, adapter, "UTC");

    expect(result).toEqual(input);
  });

  it("preserves null for single and partial range values", () => {
    expect(normalizeSingleValue(null, adapter, "UTC")).toBeNull();

    expect(toSingleValue(null, adapter, "UTC")).toBeNull();

    const range = normalizeRangeValue(
      {
        start: firstDate,
        end: null,
      },
      adapter,
      "UTC",
    );

    const result = toRangeValue(range, adapter, "UTC");

    expect(result.end).toBeNull();
  });
});
