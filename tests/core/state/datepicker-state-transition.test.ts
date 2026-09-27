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

  it("opens the date picker", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      defaultOpen: false,
    });

    const action: DatePickerStateAction = {
      type: "open",
    };

    const result = transitionDatePickerState(state, action);

    expect(result.open).toBe(true);
  });

  it("closes the date picker", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      defaultOpen: true,
    });

    const action: DatePickerStateAction = {
      type: "close",
    };

    const result = transitionDatePickerState(state, action);

    expect(result.open).toBe(false);
  });

  it("does not change other state when opening or closing", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      defaultOpen: false,
    });

    const opened = transitionDatePickerState(state, {
      type: "open",
    });

    expect(opened.selection).toEqual(state.selection);
    expect(opened.visibleDate).toEqual(state.visibleDate);
    expect(opened.today).toEqual(state.today);
    expect(opened.constraints).toEqual(state.constraints);

    const closed = transitionDatePickerState(opened, {
      type: "close",
    });

    expect(closed.selection).toEqual(state.selection);
    expect(closed.visibleDate).toEqual(state.visibleDate);
    expect(closed.today).toEqual(state.today);
    expect(closed.constraints).toEqual(state.constraints);
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

  it("closes after selecting a single date when closeOnSelect is enabled", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: true,
      defaultOpen: true,
    });

    const date = new CalendarDate(2026, 9, 15);

    const result = transitionDatePickerState(state, {
      type: "select-date",
      date,
    });

    expect(result.selection).toEqual({
      mode: "single",
      value: date,
    });

    expect(result.open).toBe(false);
  });

  it("keeps the date picker open when closeOnSelect is disabled", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: false,
      defaultOpen: true,
    });

    const date = new CalendarDate(2026, 9, 15);

    const result = transitionDatePickerState(state, {
      type: "select-date",
      date,
    });

    expect(result.open).toBe(true);
  });

  it("keeps the range picker open after the first range click", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "range",
      closeOnSelect: true,
      defaultOpen: true,
    });

    const start = new CalendarDate(2026, 9, 10);

    const result = transitionDatePickerState(state, {
      type: "select-date",
      date: start,
    });

    expect(result.selection).toEqual({
      mode: "range",
      value: {
        start,
        end: null,
      },
    });

    expect(result.open).toBe(true);
  });

  it("closes the range picker after the range is completed", () => {
    const start = new CalendarDate(2026, 9, 10);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "range",
      closeOnSelect: true,
      defaultOpen: true,
      defaultValue: {
        start,
        end: null,
      },
    });

    const end = new CalendarDate(2026, 9, 20);

    const result = transitionDatePickerState(state, {
      type: "select-date",
      date: end,
    });

    expect(result.selection).toEqual({
      mode: "range",
      value: {
        start,
        end,
      },
    });

    expect(result.open).toBe(false);
  });

  it("keeps multiple selection open after selecting a date", () => {
    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple",
      closeOnSelect: true,
      defaultOpen: true,
    });

    const date = new CalendarDate(2026, 9, 15);

    const result = transitionDatePickerState(state, {
      type: "select-date",
      date,
    });

    expect(result.open).toBe(true);
  });

  it("keeps multiple-range selection open after completing a range", () => {
    const start = new CalendarDate(2026, 9, 10);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple-range",
      closeOnSelect: true,
      defaultOpen: true,
    });

    const first = transitionDatePickerState(state, {
      type: "select-date",
      date: start,
    });

    const end = new CalendarDate(2026, 9, 20);

    const result = transitionDatePickerState(first, {
      type: "select-date",
      date: end,
    });

    expect(result.selection).toEqual({
      mode: "multiple-range",
      value: [
        {
          start,
          end,
        },
      ],
      pendingRange: {
        start: null,
        end: null,
      },
    });

    expect(result.open).toBe(true);
  });

  it("does not close when a disabled date is clicked", () => {
    const selectedDate = new CalendarDate(2026, 9, 10);
    const disabledDate = new CalendarDate(2026, 9, 15);

    const state = createInitialDatePickerState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: true,
      value: selectedDate,
      onChange: () => {},
      disabledDates: [disabledDate],
      defaultOpen: true,
    });

    const result = transitionDatePickerState(state, {
      type: "select-date",
      date: disabledDate,
    });

    expect(result.selection).toEqual(state.selection);
    expect(result.open).toBe(true);
  });
});
