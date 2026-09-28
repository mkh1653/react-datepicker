import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CalendarDate } from "@internationalized/date";

import { useDatePickerState } from "../../../src/core/state/use-datepicker-state";

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
});
