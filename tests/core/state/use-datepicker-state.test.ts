import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CalendarDate, createCalendar } from "@internationalized/date";

import { useDatePickerState } from "../../../src/core/state/use-datepicker-state";
import { DatePickerProps } from "../../../src/types";

describe("useDatePickerState", () => {
  it("initializes uncontrolled single state", () => {
    const defaultDate = new CalendarDate(2026, 9, 15);

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        defaultValue: defaultDate,
      }),
    );

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: defaultDate,
    });
  });

  it("updates uncontrolled selection", () => {
    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
      }),
    );

    const date = new CalendarDate(2026, 9, 15);

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date,
      });
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: date,
    });
  });

  it("calls onChange for controlled single selection", () => {
    const initialDate = new Date("2026-09-10T00:00:00.000Z");
    const nextDate = new CalendarDate(2026, 9, 15);

    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        value: initialDate,
        onChange,
      }),
    );

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: nextDate,
      });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(
      new Date("2026-09-15T00:00:00.000Z"),
    );
  });

  it("calls onChange for controlled multiple selection", () => {
    const firstDate = new Date("2026-09-10T00:00:00.000Z");
    const secondDate = new CalendarDate(2026, 9, 15);

    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        selectionMode: "multiple",
        value: [firstDate],
        onChange,
      }),
    );

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: secondDate,
      });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      firstDate,
      new Date("2026-09-15T00:00:00.000Z"),
    ]);
  });

  it("calls onChange for controlled range selection", () => {
    const start = new Date("2026-09-10T00:00:00.000Z");
    const end = new CalendarDate(2026, 9, 20);

    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        selectionMode: "range",
        value: {
          start,
          end: null,
        },
        onChange,
      }),
    );

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: end,
      });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      start,
      end: new Date("2026-09-20T00:00:00.000Z"),
    });
  });

  it("calls onChange for controlled multiple-range selection", () => {
    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        selectionMode: "multiple-range",
        value: [],
        onChange,
      }),
    );

    const start = new CalendarDate(2026, 9, 10);
    const end = new CalendarDate(2026, 9, 20);

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: start,
      });
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: end,
      });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      {
        start: new Date("2026-09-10T00:00:00.000Z"),
        end: new Date("2026-09-20T00:00:00.000Z"),
      },
    ]);
  });

  it("does not change controlled selection internally", () => {
    const initialDate = new Date("2026-09-10T00:00:00.000Z");

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        value: initialDate,
        onChange: () => {},
      }),
    );

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: new CalendarDate(2026, 9, 15),
      });
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: new CalendarDate(2026, 9, 10),
    });
  });

  it("updates uncontrolled open state", () => {
    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
      }),
    );

    expect(result.current.state.open).toBe(false);

    act(() => {
      result.current.dispatch({
        type: "open",
      });
    });

    expect(result.current.state.open).toBe(true);

    act(() => {
      result.current.dispatch({
        type: "close",
      });
    });

    expect(result.current.state.open).toBe(false);
  });

  it("calls onOpenChange for controlled open state", () => {
    const onOpenChange = vi.fn();

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        open: false,
        onOpenChange,
      }),
    );

    act(() => {
      result.current.dispatch({
        type: "open",
      });
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);

    expect(result.current.state.open).toBe(false);
  });

  it("updates uncontrolled visibleDate", () => {
    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        defaultVisibleDate: new CalendarDate(2026, 9, 15),
      }),
    );

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 9, 1),
    );

    act(() => {
      result.current.dispatch({
        type: "change-visible-date",
        amount: 1,
        unit: "month",
      });
    });

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 10, 1),
    );
  });

  it("calls onVisibleDateChange for controlled visibleDate", () => {
    const onVisibleDateChange = vi.fn();

    const { result } = renderHook(() =>
      useDatePickerState({
        calendar: "gregorian",
        locale: "en-US",
        timeZone: "UTC",
        visibleDate: new CalendarDate(2026, 9, 15),
        onVisibleDateChange,
      }),
    );

    act(() => {
      result.current.dispatch({
        type: "change-visible-date",
        amount: 1,
        unit: "month",
      });
    });

    expect(onVisibleDateChange).toHaveBeenCalledTimes(1);
    expect(onVisibleDateChange.mock.calls[0][0]).toEqual(
      new Date("2026-10-01T00:00:00.000Z"),
    );

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 9, 1),
    );
  });

  it("reflects controlled value changes after rerender", () => {
    const firstDate = new Date("2026-09-10T00:00:00.000Z");
    const secondDate = new Date("2026-10-20T00:00:00.000Z");

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          value: firstDate,
          onChange: () => {},
        },
      },
    );

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: new CalendarDate(2026, 9, 10),
    });

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      value: secondDate,
      onChange: () => {},
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: new CalendarDate(2026, 10, 20),
    });
  });

  it("reflects controlled open changes after rerender", () => {
    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          open: false,
          onOpenChange: () => {},
        },
      },
    );

    expect(result.current.state.open).toBe(false);

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      open: true,
      onOpenChange: () => {},
    });

    expect(result.current.state.open).toBe(true);
  });

  it("reflects controlled visibleDate changes after rerender", () => {
    const firstDate = new CalendarDate(2026, 9, 15);
    const secondDate = new CalendarDate(2026, 11, 20);

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          visibleDate: firstDate,
          onVisibleDateChange: () => {},
        },
      },
    );

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 9, 1),
    );

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      visibleDate: secondDate,
      onVisibleDateChange: () => {},
    });

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 11, 1),
    );
  });

  it("changes calendar while preserving the selected date", () => {
    const selectedDate = new Date("2026-09-20T00:00:00.000Z");

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          defaultValue: selectedDate,
        },
      },
    );

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: new CalendarDate(2026, 9, 20),
    });

    rerender({
      calendar: "jalali",
      locale: "en-US",
      timeZone: "UTC",
      defaultValue: selectedDate,
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: new CalendarDate(createCalendar("persian"), 1405, 6, 29),
    });
  });

  it("changes calendar while preserving the visible date", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          defaultVisibleDate: visibleDate,
        },
      },
    );

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 9, 1),
    );

    rerender({
      calendar: "jalali",
      locale: "en-US",
      timeZone: "UTC",
      defaultVisibleDate: visibleDate,
    });

    expect(result.current.state.visibleDate.calendar.identifier).toBe(
      "persian",
    );
    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(createCalendar("persian"), 1405, 6, 1),
    );
  });

  it("changes timezone without changing the current selection", () => {
    const selectedDate = new CalendarDate(2026, 9, 20);

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          defaultValue: selectedDate,
        },
      },
    );

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: selectedDate,
    });

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "Asia/Tehran",
      defaultValue: selectedDate,
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: selectedDate,
    });
  });

  it("changes timezone without changing the current visible date", () => {
    const visibleDate = new CalendarDate(2026, 9, 15);

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          defaultVisibleDate: visibleDate,
        },
      },
    );

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 9, 1),
    );

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "Asia/Tehran",
      defaultVisibleDate: visibleDate,
    });

    expect(result.current.state.visibleDate).toEqual(
      new CalendarDate(2026, 9, 1),
    );
  });

  it("uses updated closeOnSelect after rerender", () => {
    const onChange = vi.fn();

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          closeOnSelect: false,
          defaultOpen: true,
          onChange,
        },
      },
    );

    const firstDate = new CalendarDate(2026, 9, 10);

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: firstDate,
      });
    });

    expect(result.current.state.open).toBe(true);

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      closeOnSelect: true,
      defaultOpen: true,
      onChange,
    });

    const secondDate = new CalendarDate(2026, 9, 15);

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: secondDate,
      });
    });

    expect(result.current.state.open).toBe(false);
  });

  it("uses updated constraints after rerender", () => {
    const firstMinDate = new Date("2026-09-10T00:00:00.000Z");
    const secondMinDate = new Date("2026-10-01T00:00:00.000Z");

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          minDate: firstMinDate,
        },
      },
    );

    const firstDate = new CalendarDate(2026, 9, 15);

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: firstDate,
      });
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: firstDate,
    });

    rerender({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      minDate: secondMinDate,
    });

    const disabledDate = new CalendarDate(2026, 9, 20);

    act(() => {
      result.current.dispatch({
        type: "select-date",
        date: disabledDate,
      });
    });

    expect(result.current.state.selection).toEqual({
      mode: "single",
      value: firstDate,
    });
  });

  it("uses the updated calendar after rerender", () => {
    const visibleDate = new CalendarDate(2026, 9, 1);

    const { result, rerender } = renderHook(
      (props: DatePickerProps) => useDatePickerState(props),
      {
        initialProps: {
          calendar: "gregorian",
          locale: "en-US",
          timeZone: "UTC",
          defaultVisibleDate: visibleDate,
        },
      },
    );

    expect(result.current.state.visibleDate.calendar.identifier).toBe(
      "gregory",
    );

    rerender({
      calendar: "jalali",
      locale: "en-US",
      timeZone: "UTC",
      defaultVisibleDate: visibleDate,
    });

    expect(result.current.state.visibleDate.calendar.identifier).toBe(
      "persian",
    );

    act(() => {
      result.current.dispatch({
        type: "change-visible-date",
        amount: 1,
        unit: "month",
      });
    });

    expect(result.current.state.visibleDate.calendar.identifier).toBe(
      "persian",
    );
  });
});
