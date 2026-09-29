import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { CalendarDate } from "@internationalized/date";
import { DatePickerProps } from "../../../src/types";
import {
  createInitialDatePickerState,
  createInitialDatePickerContext,
  transitionDatePickerState,
  type DatePickerStateAction,
  useDatePickerState,
} from "../../../src/core/state";

describe("transitionDatePickerState", () => {
  it("selects a date in single mode", () => {
    const context = createInitialDatePickerContext({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
    });
    const state = createInitialDatePickerState(
      {
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
      },
      context,
    );

    const date = new CalendarDate(2026, 9, 15);

    const action: DatePickerStateAction = {
      type: "select-date",
      date,
    };

    const result = transitionDatePickerState(state, action, context);

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

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple",
      defaultValue: [firstDate],
    };

    const context = createInitialDatePickerContext(props);

    const state = createInitialDatePickerState(props, context);

    const action: DatePickerStateAction = {
      type: "select-date",
      date: secondDate,
    };

    const result = transitionDatePickerState(state, action, context);

    expect(result.selection).toEqual({
      mode: "multiple",
      value: [firstDate, secondDate],
    });
  });

  it("starts a range in range mode", () => {
    const date = new CalendarDate(2026, 9, 10);

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "range",
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const action: DatePickerStateAction = {
      type: "select-date",
      date,
    };

    const result = transitionDatePickerState(state, action, context);

    expect(result.selection).toEqual({
      mode: "range",
      value: {
        start: date,
        end: null,
      },
    });
  });

  it("starts a pending range in multiple-range mode", () => {
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple-range",
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const date = new CalendarDate(2026, 9, 10);

    const action: DatePickerStateAction = {
      type: "select-date",
      date,
    };

    const result = transitionDatePickerState(state, action, context);

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
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: selectedDate,
      onChange: () => {},
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const action: DatePickerStateAction = {
      type: "change-visible-date",
      amount: 1,
      unit: "month",
    };

    const result = transitionDatePickerState(state, action, context);

    expect(result.visibleDate).toEqual(new CalendarDate(2026, 10, 1));

    expect(result.selection).toEqual(state.selection);
    expect(result.open).toBe(state.open);
  });

  it("opens the date picker", () => {
    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        defaultOpen: false,
      }),
    );

    expect(result.current.state.open).toBe(false);

    act(() => {
      result.current.dispatch({
        type: "open",
      });
    });

    expect(result.current.state.open).toBe(true);
  });

  it("closes the date picker", () => {
    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        defaultOpen: true,
      }),
    );

    expect(result.current.state.open).toBe(true);

    act(() => {
      result.current.dispatch({
        type: "close",
      });
    });

    expect(result.current.state.open).toBe(false);
  });

  it("does not change other state when opening or closing", () => {
    const selectedDate = new CalendarDate(2026, 9, 10);

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        defaultValue: selectedDate,
        defaultOpen: false,
      }),
    );

    const initialSelection = result.current.state.selection;
    const initialVisibleDate = result.current.state.visibleDate;

    act(() => {
      result.current.dispatch({
        type: "open",
      });
    });

    expect(result.current.state.open).toBe(true);
    expect(result.current.state.selection).toEqual(initialSelection);
    expect(result.current.state.visibleDate).toEqual(initialVisibleDate);

    act(() => {
      result.current.dispatch({
        type: "close",
      });
    });

    expect(result.current.state.open).toBe(false);
    expect(result.current.state.selection).toEqual(initialSelection);
    expect(result.current.state.visibleDate).toEqual(initialVisibleDate);
  });

  it("does not mutate the previous state", () => {
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const originalVisibleDate = state.visibleDate;

    const result = transitionDatePickerState(
      state,
      {
        type: "change-visible-date",
        amount: 1,
        unit: "month",
      },
      context,
    );

    expect(result).not.toBe(state);
    expect(result.visibleDate).not.toBe(originalVisibleDate);
    expect(state.visibleDate).toEqual(originalVisibleDate);
  });

  it("closes after selecting a single date when closeOnSelect is enabled", () => {
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: true,
      defaultOpen: true,
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const date = new CalendarDate(2026, 9, 15);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date,
      },
      context,
    );

    expect(result.selection).toEqual({
      mode: "single",
      value: date,
    });

    expect(result.open).toBe(false);
  });

  it("keeps the date picker open when closeOnSelect is disabled", () => {
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: false,
      defaultOpen: true,
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const date = new CalendarDate(2026, 9, 15);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date,
      },
      context,
    );

    expect(result.open).toBe(true);
  });

  it("keeps the range picker open after the first range click", () => {
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "range",
      closeOnSelect: true,
      defaultOpen: true,
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const start = new CalendarDate(2026, 9, 10);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date: start,
      },
      context,
    );

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
    const props: DatePickerProps = {
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
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const end = new CalendarDate(2026, 9, 20);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date: end,
      },
      context,
    );

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
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple",
      closeOnSelect: true,
      defaultOpen: true,
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const date = new CalendarDate(2026, 9, 15);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date,
      },
      context,
    );

    expect(result.open).toBe(true);
  });

  it("keeps multiple-range selection open after completing a range", () => {
    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      selectionMode: "multiple-range",
      closeOnSelect: true,
      defaultOpen: true,
    };
    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const start = new CalendarDate(2026, 9, 10);
    const first = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date: start,
      },
      context,
    );

    const end = new CalendarDate(2026, 9, 20);
    const result = transitionDatePickerState(
      first,
      {
        type: "select-date",
        date: end,
      },
      context,
    );

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

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: true,
      value: selectedDate,
      onChange: () => {},
      disabledDates: [disabledDate],
      defaultOpen: true,
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-date",
        date: disabledDate,
      },
      context,
    );

    expect(result.selection).toEqual(state.selection);
    expect(result.open).toBe(true);
  });
});

describe("select-calendar-date", () => {
  it("selects a date from the current visible month without changing visibleDate", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);
    const selectedDate = new CalendarDate(2026, 9, 20);

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: visibleDate,
      onChange: () => {},
      defaultVisibleDate: visibleDate,
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-calendar-date",
        date: selectedDate,
      },
      context,
    );

    expect(result.selection).toEqual({
      mode: "single",
      value: selectedDate,
    });

    expect(result.visibleDate).toEqual(new CalendarDate(2026, 9, 1));
  });

  it("moves visibleDate to the clicked date's month before selecting it", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);
    const selectedDate = new CalendarDate(2026, 10, 1);

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: visibleDate,
      onChange: () => {},
      defaultVisibleDate: visibleDate,
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-calendar-date",
        date: selectedDate,
      },
      context,
    );

    expect(result.visibleDate).toEqual(selectedDate);

    expect(result.selection).toEqual({
      mode: "single",
      value: selectedDate,
    });
  });

  it("moves visibleDate to the previous month when an adjacent date is selected", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);
    const selectedDate = new CalendarDate(2026, 8, 31);

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: visibleDate,
      onChange: () => {},
      defaultVisibleDate: visibleDate,
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-calendar-date",
        date: selectedDate,
      },
      context,
    );

    expect(result.visibleDate).toEqual(new CalendarDate(2026, 8, 1));

    expect(result.selection).toEqual({
      mode: "single",
      value: selectedDate,
    });
  });

  it("does not change visibleDate when the clicked date is disabled", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);
    const disabledDate = new CalendarDate(2026, 10, 1);

    const props: DatePickerProps = {
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: visibleDate,
      onChange: () => {},
      defaultVisibleDate: visibleDate,
      disabledDates: [disabledDate],
      defaultOpen: true,
    };

    const context = createInitialDatePickerContext(props);
    const state = createInitialDatePickerState(props, context);

    const result = transitionDatePickerState(
      state,
      {
        type: "select-calendar-date",
        date: disabledDate,
      },
      context,
    );

    expect(result.visibleDate).toEqual(new CalendarDate(2026, 9, 1));
    expect(result.selection).toEqual(state.selection);
    expect(result.open).toBe(true);
  });
});
