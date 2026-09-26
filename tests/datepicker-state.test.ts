import { describe, expect, it, vi } from "vitest";
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
});
