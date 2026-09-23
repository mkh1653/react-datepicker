import { CalendarDate } from "@internationalized/date";

import { describe, expect, it } from "vitest";

import { getCalendarAdapter } from "../src/core/adapters";

import {
  getCompletedRange,
  isDateInRange,
  isDateSelected,
  selectRangeDate,
  selectSingle,
  toggleMultiple,
} from "../src/core/selection";

describe("selection engine", () => {
  const adapter = getCalendarAdapter("gregorian");

  it("selects a single date", () => {
    const date = new CalendarDate(2026, 9, 10);

    const result = selectSingle(date);

    expect(result).toEqual(date);
  });

  it("adds a date to multiple selection", () => {
    const date1 = new CalendarDate(2026, 9, 10);

    const date2 = new CalendarDate(2026, 9, 15);

    const result = toggleMultiple([date1], date2, adapter);

    expect(result).toEqual([date1, date2]);
  });

  it("removes a selected date from multiple selection", () => {
    const date1 = new CalendarDate(2026, 9, 10);

    const date2 = new CalendarDate(2026, 9, 15);

    const result = toggleMultiple([date1, date2], date1, adapter);

    expect(result).toEqual([date2]);
  });

  it("starts a range on the first click", () => {
    const date = new CalendarDate(2026, 9, 10);

    const result = selectRangeDate(
      {
        start: null,
        end: null,
      },
      date,
      adapter,
    );

    expect(result).toEqual({
      start: date,
      end: null,
    });
  });

  it("completes a range on the second click", () => {
    const start = new CalendarDate(2026, 9, 10);

    const end = new CalendarDate(2026, 9, 20);

    const result = selectRangeDate(
      {
        start,
        end: null,
      },
      end,
      adapter,
    );

    expect(result).toEqual({
      start,
      end,
    });
  });

  it("normalizes a reversed range", () => {
    const start = new CalendarDate(2026, 9, 20);

    const end = new CalendarDate(2026, 9, 10);

    const result = selectRangeDate(
      {
        start,
        end: null,
      },
      end,
      adapter,
    );

    expect(result).toEqual({
      start: end,
      end: start,
    });
  });

  it("creates a single-day range", () => {
    const date = new CalendarDate(2026, 9, 10);

    const result = selectRangeDate(
      {
        start: null,
        end: null,
      },
      date,
      adapter,
    );

    const completed = selectRangeDate(result, date, adapter);

    expect(completed).toEqual({
      start: date,
      end: date,
    });
  });

  it("starts a new range after a completed range", () => {
    const firstStart = new CalendarDate(2026, 9, 10);

    const firstEnd = new CalendarDate(2026, 9, 20);

    const newDate = new CalendarDate(2026, 10, 5);

    const result = selectRangeDate(
      {
        start: firstStart,
        end: firstEnd,
      },
      newDate,
      adapter,
    );

    expect(result).toEqual({
      start: newDate,
      end: null,
    });
  });

  it("returns a completed range", () => {
    const start = new CalendarDate(2026, 9, 10);

    const end = new CalendarDate(2026, 9, 20);

    const result = getCompletedRange({
      start,
      end,
    });

    expect(result).toEqual({
      start,
      end,
    });
  });

  it("checks dates inside a range", () => {
    const start = new CalendarDate(2026, 9, 10);

    const end = new CalendarDate(2026, 9, 20);

    const inside = new CalendarDate(2026, 9, 15);

    const outside = new CalendarDate(2026, 9, 25);

    const range = {
      start,
      end,
    };

    expect(isDateInRange(inside, range, adapter)).toBe(true);

    expect(isDateInRange(outside, range, adapter)).toBe(false);
  });

  it("checks selected state", () => {
    const date = new CalendarDate(2026, 9, 10);

    expect(isDateSelected(date, { mode: "single", value: date }, adapter)).toBe(
      true,
    );

    expect(
      isDateSelected(date, { mode: "multiple", value: [date] }, adapter),
    ).toBe(true);

    expect(
      isDateSelected(
        date,
        {
          mode: "range",
          value: {
            start: new CalendarDate(2026, 9, 1),
            end: new CalendarDate(2026, 9, 20),
          },
        },
        adapter,
      ),
    ).toBe(true);

    expect(
      isDateSelected(
        date,
        {
          mode: "multiple-range",
          value: [
            {
              start: new CalendarDate(2026, 9, 1),
              end: new CalendarDate(2026, 9, 5),
            },
            {
              start: new CalendarDate(2026, 9, 10),
              end: new CalendarDate(2026, 9, 20),
            },
          ],
        },
        adapter,
      ),
    ).toBe(true);
  });

  it("returns false when date is not selected", () => {
    const selectedDate = new CalendarDate(2026, 9, 10);

    const otherDate = new CalendarDate(2026, 9, 25);

    expect(
      isDateSelected(
        otherDate,
        {
          mode: "single",
          value: selectedDate,
        },
        adapter,
      ),
    ).toBe(false);

    expect(
      isDateSelected(
        otherDate,
        {
          mode: "multiple",
          value: [selectedDate],
        },
        adapter,
      ),
    ).toBe(false);

    expect(
      isDateSelected(
        otherDate,
        {
          mode: "range",
          value: {
            start: new CalendarDate(2026, 9, 1),
            end: new CalendarDate(2026, 9, 20),
          },
        },
        adapter,
      ),
    ).toBe(false);

    expect(
      isDateSelected(
        otherDate,
        {
          mode: "multiple-range",
          value: [
            {
              start: new CalendarDate(2026, 9, 1),
              end: new CalendarDate(2026, 9, 5),
            },
            {
              start: new CalendarDate(2026, 9, 10),
              end: new CalendarDate(2026, 9, 20),
            },
          ],
        },
        adapter,
      ),
    ).toBe(false);
  });
});
