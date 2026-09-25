import { CalendarDate } from "@internationalized/date";
import { describe, expect, it, vi } from "vitest";

import { getCalendarAdapter } from "../src/core/adapters";
import { isDateDisabled } from "../src/core/constraints";

describe("date constraints", () => {
  const adapter = getCalendarAdapter("gregorian");

  it("allows a date inside the min and max range", () => {
    const date = new CalendarDate(2026, 9, 15);

    expect(
      isDateDisabled(
        date,
        {
          minDate: new CalendarDate(2026, 9, 10),
          maxDate: new CalendarDate(2026, 9, 20),
        },
        adapter,
      ),
    ).toBe(false);
  });

  it("disables dates before minDate", () => {
    const date = new CalendarDate(2026, 9, 9);

    expect(
      isDateDisabled(
        date,
        {
          minDate: new CalendarDate(2026, 9, 10),
        },
        adapter,
      ),
    ).toBe(true);
  });

  it("disables dates after maxDate", () => {
    const date = new CalendarDate(2026, 9, 21);

    expect(
      isDateDisabled(
        date,
        {
          maxDate: new CalendarDate(2026, 9, 20),
        },
        adapter,
      ),
    ).toBe(true);
  });

  it("keeps minDate selectable", () => {
    const date = new CalendarDate(2026, 9, 10);

    expect(
      isDateDisabled(
        date,
        {
          minDate: new CalendarDate(2026, 9, 10),
        },
        adapter,
      ),
    ).toBe(false);
  });

  it("keeps maxDate selectable", () => {
    const date = new CalendarDate(2026, 9, 20);

    expect(
      isDateDisabled(
        date,
        {
          maxDate: new CalendarDate(2026, 9, 20),
        },
        adapter,
      ),
    ).toBe(false);
  });

  it("disables dates listed in disabledDates", () => {
    const disabledDate = new CalendarDate(2026, 9, 15);

    expect(
      isDateDisabled(
        disabledDate,
        {
          disabledDates: [
            new CalendarDate(2026, 9, 10),
            disabledDate,
            new CalendarDate(2026, 9, 20),
          ],
        },
        adapter,
      ),
    ).toBe(true);
  });

  it("allows dates not listed in disabledDates", () => {
    const date = new CalendarDate(2026, 9, 15);

    expect(
      isDateDisabled(
        date,
        {
          disabledDates: [
            new CalendarDate(2026, 9, 10),
            new CalendarDate(2026, 9, 20),
          ],
        },
        adapter,
      ),
    ).toBe(false);
  });

  it("uses the custom isDateDisabled callback", () => {
    const isDateDisabledCallback = vi.fn(
      (date: CalendarDate) => date.day === 15,
    );

    const disabledDate = new CalendarDate(2026, 9, 15);
    const selectableDate = new CalendarDate(2026, 9, 16);

    expect(
      isDateDisabled(
        disabledDate,
        {
          isDateDisabled: isDateDisabledCallback,
        },
        adapter,
      ),
    ).toBe(true);

    expect(
      isDateDisabled(
        selectableDate,
        {
          isDateDisabled: isDateDisabledCallback,
        },
        adapter,
      ),
    ).toBe(false);

    expect(isDateDisabledCallback).toHaveBeenCalledTimes(2);
  });

  it("disables a date when any constraint matches", () => {
    const date = new CalendarDate(2026, 9, 15);

    expect(
      isDateDisabled(
        date,
        {
          minDate: new CalendarDate(2026, 9, 10),
          maxDate: new CalendarDate(2026, 9, 20),
          disabledDates: [date],
          isDateDisabled: () => false,
        },
        adapter,
      ),
    ).toBe(true);
  });

  it("allows a date when no constraint matches", () => {
    const date = new CalendarDate(2026, 9, 15);

    expect(
      isDateDisabled(
        date,
        {
          minDate: new CalendarDate(2026, 9, 10),
          maxDate: new CalendarDate(2026, 9, 20),
          disabledDates: [new CalendarDate(2026, 9, 14)],
          isDateDisabled: () => false,
        },
        adapter,
      ),
    ).toBe(false);
  });
});
