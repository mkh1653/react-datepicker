import { describe, expect, it } from "vitest";
import { CalendarDate } from "@internationalized/date";

import { createInitialDatePickerState } from "../../../src/core/state";
import {
  transitionDatePickerState,
  type DatePickerStateAction,
} from "../../../src/core/state";

describe("transitionDatePickerState", () => {
  it("selects a date in single mode", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
    });

    const date = new CalendarDate(2026, 9, 15);

    const action: DatePickerStateAction = {
      type: "select-date",
      date,
    };

    const result = transitionDatePickerState(state, action);

    expect(result.selection).toEqual({
      mode: "single",
      value: date,
    });

    expect(result.visibleDate).toEqual(state.visibleDate);
    expect(result.open).toBe(state.open);
  });

  it("adds a date in multiple mode", () => {
    const firstDate = new CalendarDate(2026, 9, 10);
    const secondDate = new CalendarDate(2026, 9, 15);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple",
      defaultValue: [firstDate],
    });

    const action: DatePickerStateAction = {
      type: "select-date",
      date: secondDate,
    };

    const result = transitionDatePickerState(state, action);

    expect(result.selection).toEqual({
      mode: "multiple",
      value: [firstDate, secondDate],
    });
  });

  it("starts a range in range mode", () => {
    const date = new CalendarDate(2026, 9, 10);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "range",
    });

    const action: DatePickerStateAction = {
      type: "select-date",
      date,
    };

    const result = transitionDatePickerState(state, action);

    expect(result.selection).toEqual({
      mode: "range",
      value: {
        start: date,
        end: null,
      },
    });
  });

  it("starts a pending range in multiple-range mode", () => {
    const date = new CalendarDate(2026, 9, 10);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple-range",
    });

    const action: DatePickerStateAction = {
      type: "select-date",
      date,
    };

    const result = transitionDatePickerState(state, action);

    expect(result.selection).toEqual({
      mode: "multiple-range",
      value: [],
      pendingRange: {
        start: date,
        end: null,
      },
    });
  });

  it("changes visible date without changing selection", () => {
    const selectedDate = new CalendarDate(2026, 9, 10);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: selectedDate,
      onChange: () => {},
    });

    const action: DatePickerStateAction = {
      type: "change-visible-date",
      amount: 1,
      unit: "month",
    };

    const result = transitionDatePickerState(state, action);

    expect(result.visibleDate).toEqual(new CalendarDate(2026, 10, 10));

    expect(result.selection).toEqual(state.selection);
    expect(result.open).toBe(state.open);
  });

  it("does not mutate the previous state", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
    });

    const originalVisibleDate = state.visibleDate;

    const result = transitionDatePickerState(state, {
      type: "change-visible-date",
      amount: 1,
      unit: "month",
    });

    expect(result).not.toBe(state);
    expect(result.visibleDate).not.toBe(originalVisibleDate);
    expect(state.visibleDate).toEqual(originalVisibleDate);
  });
});
