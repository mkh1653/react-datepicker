import { CalendarDate } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { getCalendarAdapter } from "../src/core/adapters";
import type { DateConstraints } from "../src/core/constraints";
import type { SelectionInput } from "../src/core/types/selection";
import { resolveInitialVisibleDate } from "../src/core/calendar/initial-visible-date";

describe("resolveInitialVisibleDate", () => {
  const adapter = getCalendarAdapter("gregorian");

  const today = new CalendarDate(2026, 9, 25);
  const visibleDate = new CalendarDate(2026, 11, 10);
  const defaultVisibleDate = new CalendarDate(2026, 10, 15);

  const emptyConstraints: DateConstraints = {};

  it("uses explicit visibleDate first", () => {
    const result = resolveInitialVisibleDate({
      visibleDate,
      defaultVisibleDate,
      selection: undefined,
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(visibleDate);
  });

  it("uses defaultVisibleDate when visibleDate is not provided", () => {
    const result = resolveInitialVisibleDate({
      defaultVisibleDate,
      selection: undefined,
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(defaultVisibleDate);
  });

  it("uses the single selection when no visible date is provided", () => {
    const selection: SelectionInput = {
      mode: "single",
      value: new CalendarDate(2026, 12, 5),
    };

    const result = resolveInitialVisibleDate({
      selection,
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(selection.value);
  });

  it("uses the first date for multiple selection", () => {
    const firstDate = new CalendarDate(2026, 11, 5);

    const selection: SelectionInput = {
      mode: "multiple",
      value: [firstDate, new CalendarDate(2026, 12, 10)],
    };

    const result = resolveInitialVisibleDate({
      selection,
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(firstDate);
  });

  it("uses the range start for range selection", () => {
    const start = new CalendarDate(2026, 10, 10);

    const selection: SelectionInput = {
      mode: "range",
      value: {
        start,
        end: new CalendarDate(2026, 10, 20),
      },
    };

    const result = resolveInitialVisibleDate({
      selection,
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(start);
  });

  it("uses the first range start for multiple-range selection", () => {
    const firstStart = new CalendarDate(2026, 11, 5);

    const selection: SelectionInput = {
      mode: "multiple-range",
      value: [
        {
          start: firstStart,
          end: new CalendarDate(2026, 11, 10),
        },
        {
          start: new CalendarDate(2026, 12, 1),
          end: new CalendarDate(2026, 12, 5),
        },
      ],
    };

    const result = resolveInitialVisibleDate({
      selection,
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(firstStart);
  });

  it("uses today when no visible date or selection exists", () => {
    const result = resolveInitialVisibleDate({
      today,
      constraints: emptyConstraints,
      adapter,
    });

    expect(result).toEqual(today);
  });

  it("uses the nearest selectable date when today is disabled", () => {
    const constraints: DateConstraints = {
      minDate: new CalendarDate(2026, 9, 20),
      maxDate: new CalendarDate(2026, 9, 30),
      isDateDisabled: (date) =>
        adapter.isSameDay(date, today) ||
        adapter.isSameDay(date, new CalendarDate(2026, 9, 24)),
    };

    const result = resolveInitialVisibleDate({
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(new CalendarDate(2026, 9, 26));
  });

  it("prefers the future date when both nearest dates are equally distant", () => {
    const constraints: DateConstraints = {
      minDate: new CalendarDate(2026, 9, 20),
      maxDate: new CalendarDate(2026, 9, 30),
      isDateDisabled: (date) => adapter.isSameDay(date, today),
    };

    const result = resolveInitialVisibleDate({
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(new CalendarDate(2026, 9, 26));
  });

  it("uses the selection even when the selected date is disabled", () => {
    const selectedDate = new CalendarDate(2026, 9, 15);

    const selection: SelectionInput = {
      mode: "single",
      value: selectedDate,
    };

    const constraints: DateConstraints = {
      minDate: new CalendarDate(2026, 9, 20),
    };

    const result = resolveInitialVisibleDate({
      selection,
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(selectedDate);
  });

  it("returns today when no selectable date exists within the allowed range", () => {
    const constraints: DateConstraints = {
      minDate: new CalendarDate(2026, 9, 20),
      maxDate: new CalendarDate(2026, 9, 30),
      isDateDisabled: () => true,
    };

    const result = resolveInitialVisibleDate({
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(today);
  });

  it("uses the nearest selectable date before today when the future boundary is exhausted", () => {
    const constraints: DateConstraints = {
      maxDate: new CalendarDate(2026, 9, 26),
      isDateDisabled: (date) =>
        adapter.isSameDay(date, today) ||
        adapter.isSameDay(date, new CalendarDate(2026, 9, 26)),
    };

    const result = resolveInitialVisibleDate({
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(new CalendarDate(2026, 9, 24));
  });

  it("uses the nearest selectable date after today when the past boundary is exhausted", () => {
    const constraints: DateConstraints = {
      minDate: new CalendarDate(2026, 9, 24),
      isDateDisabled: (date) =>
        adapter.isSameDay(date, today) ||
        adapter.isSameDay(date, new CalendarDate(2026, 9, 24)),
    };

    const result = resolveInitialVisibleDate({
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(new CalendarDate(2026, 9, 26));
  });

  it("returns today when no selectable date is found", () => {
    const constraints: DateConstraints = {
      isDateDisabled: () => true,
    };

    const result = resolveInitialVisibleDate({
      today,
      constraints,
      adapter,
    });

    expect(result).toEqual(today);
  });
});
