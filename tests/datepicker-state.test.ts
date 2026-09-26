import { describe, expect, it } from "vitest";
import { CalendarDate } from "@internationalized/date";

import { createInitialDatePickerState } from "../src/core/state/datepicker-state";
import { getSystemLocale } from "../src/core/locale";
import type { DatePickerProps } from "../src/types";

describe("createInitialDatePickerState", () => {
  it("creates default single-date state from system settings", () => {
    const system = getSystemLocale();
    const state = createInitialDatePickerState({});

    expect(state.open).toBe(false);

    expect(state.locale).toBe(system.locale);
    expect(state.timeZone).toBe(system.timeZone);
    expect(state.adapter.type).toBe(system.calendar);

    expect(state.selection).toEqual({
      mode: "single",
      value: null,
    });

    expect(state.visibleDate).toEqual(state.today);
    expect(state.constraints).toEqual({});
  });

  it("uses the selected date as the initial visible date", () => {
    const selectedDate = new CalendarDate(2026, 12, 5);

    const props: DatePickerProps = {
      value: selectedDate,
      onChange: () => {},
    };

    const state = createInitialDatePickerState(props);

    expect(state.selection).toEqual({
      mode: "single",
      value: selectedDate,
    });

    expect(state.visibleDate).toEqual(selectedDate);
  });

  it("prefers defaultVisibleDate over selection", () => {
    const defaultVisibleDate = new CalendarDate(2027, 2, 15);
    const selectedDate = new CalendarDate(2026, 12, 5);

    const state = createInitialDatePickerState({
      defaultVisibleDate,
      value: selectedDate,
      onChange: () => {},
    });

    expect(state.visibleDate).toEqual(defaultVisibleDate);
  });

  it("uses explicit locale, calendar and timezone over system settings", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "America/New_York",
    });

    expect(state.locale).toBe("en-US");
    expect(state.timeZone).toBe("America/New_York");
    expect(state.adapter.type).toBe("gregorian");
  });

  it("initializes multiple selection from defaultValue", () => {
    const firstDate = new CalendarDate(2026, 11, 5);
    const secondDate = new CalendarDate(2026, 12, 10);

    const state = createInitialDatePickerState({
      selectionMode: "multiple",
      defaultValue: [firstDate, secondDate],
    });

    expect(state.selection).toEqual({
      mode: "multiple",
      value: [firstDate, secondDate],
    });
  });

  it("initializes range selection from a partial defaultValue", () => {
    const start = new CalendarDate(2026, 10, 10);

    const state = createInitialDatePickerState({
      selectionMode: "range",
      defaultValue: {
        start,
        end: null,
      },
    });

    expect(state.selection).toEqual({
      mode: "range",
      value: {
        start,
        end: null,
      },
    });
  });

  it("initializes multiple-range selection from defaultValue", () => {
    const firstStart = new CalendarDate(2026, 11, 5);
    const firstEnd = new CalendarDate(2026, 11, 10);

    const secondStart = new CalendarDate(2026, 12, 1);
    const secondEnd = new CalendarDate(2026, 12, 5);

    const state = createInitialDatePickerState({
      selectionMode: "multiple-range",
      defaultValue: [
        {
          start: firstStart,
          end: firstEnd,
        },
        {
          start: secondStart,
          end: secondEnd,
        },
      ],
    });

    expect(state.selection).toEqual({
      mode: "multiple-range",
      value: [
        {
          start: firstStart,
          end: firstEnd,
        },
        {
          start: secondStart,
          end: secondEnd,
        },
      ],
      pendingRange: {
        start: null,
        end: null,
      },
    });
  });

  it("initializes single selection from defaultValue", () => {
    const defaultDate = new CalendarDate(2026, 12, 5);

    const state = createInitialDatePickerState({
      defaultValue: defaultDate,
    });

    expect(state.selection).toEqual({
      mode: "single",
      value: defaultDate,
    });
  });

  it("initializes open state from defaultOpen", () => {
    const state = createInitialDatePickerState({
      defaultOpen: true,
    });

    expect(state.open).toBe(true);
  });

  it("initializes open state from controlled open", () => {
    const state = createInitialDatePickerState({
      open: true,
      onOpenChange: () => {},
    });

    expect(state.open).toBe(true);
  });

  it("uses defaultVisibleDate as initial visible date", () => {
    const defaultVisibleDate = new CalendarDate(2027, 2, 15);

    const state = createInitialDatePickerState({
      defaultVisibleDate,
    });

    expect(state.visibleDate).toEqual(defaultVisibleDate);
  });
});
