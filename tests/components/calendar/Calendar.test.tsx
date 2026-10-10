import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CalendarDate } from "@internationalized/date";
import { userEvent } from "@testing-library/user-event";

import { Calendar } from "../../../src/components/Calendar";
import {
  createInitialDatePickerContext,
  createInitialDatePickerState,
  type DatePickerStateAction,
} from "../../../src/core/state";
import type { DatePickerProps } from "../../../src/types";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

function createCalendarState(
  props: DatePickerProps = {
    calendar: "gregorian",
    locale: "en-US",
    timeZone: "UTC",
    defaultVisibleDate: new CalendarDate(2026, 9, 1),
  },
) {
  const context = createInitialDatePickerContext(props);
  const state = createInitialDatePickerState(props, context);

  return {
    state,
    context,
  };
}

describe("Calendar", () => {
  it("renders the visible month days", () => {
    const { state, context } = createCalendarState();

    render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "September 1, 2026" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "September 15, 2026" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "September 30, 2026" }),
    ).toBeInTheDocument();
  });

  it("renders the visible month from visibleDate", () => {
    const visibleDate = new CalendarDate(2026, 12, 1);

    const { state, context } = createCalendarState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      defaultVisibleDate: visibleDate,
    });

    render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

    expect(screen.getByText("December 2026")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "December 15, 2026" }),
    ).toBeInTheDocument();
  });

  it("dispatches date selection when a day is clicked", async () => {
    const user = userEvent.setup();

    const { state, context } = createCalendarState();

    const dispatch = vi.fn<(action: DatePickerStateAction) => void>();

    render(<Calendar state={state} context={context} dispatch={dispatch} />);

    const day = screen.getByRole("button", {
      name: /September 15, 2026/i,
    });

    await user.click(day);

    expect(dispatch).toHaveBeenCalledTimes(1);

    expect(dispatch).toHaveBeenCalledWith({
      type: "select-calendar-date",
      date: new CalendarDate(2026, 9, 15),
    });
  });

  it("dispatches next month navigation", async () => {
    const user = userEvent.setup();

    const { state, context } = createCalendarState();

    const dispatch = vi.fn<(action: DatePickerStateAction) => void>();

    render(<Calendar state={state} context={context} dispatch={dispatch} />);

    await user.click(
      screen.getByRole("button", {
        name: /next month/i,
      }),
    );

    expect(dispatch).toHaveBeenCalledTimes(1);

    expect(dispatch).toHaveBeenCalledWith({
      type: "change-visible-date",
      amount: 1,
      unit: "month",
    });
  });

  it("dispatches previous month navigation", async () => {
    const user = userEvent.setup();

    const { state, context } = createCalendarState();

    const dispatch = vi.fn<(action: DatePickerStateAction) => void>();

    render(<Calendar state={state} context={context} dispatch={dispatch} />);

    await user.click(
      screen.getByRole("button", {
        name: /previous month/i,
      }),
    );

    expect(dispatch).toHaveBeenCalledTimes(1);

    expect(dispatch).toHaveBeenCalledWith({
      type: "change-visible-date",
      amount: -1,
      unit: "month",
    });
  });

  it("renders the calendar using the active calendar", () => {
    const { state, context } = createCalendarState({
      calendar: "jalali",
      locale: "fa-IR",
      timeZone: "UTC",
      defaultVisibleDate: new CalendarDate("persian", 1405, 7, 1),
    });

    render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

    expect(context.adapter.identifier).toBe("persian");

    expect(
      screen.getByText(new Intl.NumberFormat("fa-IR").format(15)),
    ).toBeInTheDocument();
  });

  it("disables dates from disabledDates and prevents selection", async () => {
    const user = userEvent.setup();

    const disabledDate = new CalendarDate(2026, 9, 15);

    const { state, context } = createCalendarState({
      calendar: "gregorian",
      locale: "en-US",
      timeZone: "UTC",
      defaultVisibleDate: new CalendarDate(2026, 9, 1),
      disabledDates: [disabledDate],
    });

    const dispatch = vi.fn<(action: DatePickerStateAction) => void>();

    render(<Calendar state={state} context={context} dispatch={dispatch} />);

    const day = screen.getByRole("button", {
      name: "September 15, 2026",
    });

    expect(day).toBeDisabled();

    await user.click(day);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("opens the month selection view when the month is clicked", async () => {
    const user = userEvent.setup();
    const { state, context } = createCalendarState();

    render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Select month" }));

    expect(
      screen.getByRole("group", { name: "Select month" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "October" })).toBeInTheDocument();

    expect(
      screen.queryByRole("grid", { name: "September 2026" }),
    ).not.toBeInTheDocument();
  });

  it("changes the visible month when a month is selected", async () => {
    const user = userEvent.setup();
    const { state, context } = createCalendarState();
    const dispatch = vi.fn<(action: DatePickerStateAction) => void>();

    render(<Calendar state={state} context={context} dispatch={dispatch} />);

    await user.click(screen.getByRole("button", { name: "Select month" }));

    await user.click(screen.getByRole("button", { name: "October" }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "change-visible-date",
      amount: 1,
      unit: "month",
    });

    expect(
      screen.queryByRole("group", { name: "Select month" }),
    ).not.toBeInTheDocument();
  });

  it("opens the year selection view and changes the visible year", async () => {
    const user = userEvent.setup();
    const { state, context } = createCalendarState();
    const dispatch = vi.fn<(action: DatePickerStateAction) => void>();

    render(<Calendar state={state} context={context} dispatch={dispatch} />);

    await user.click(screen.getByRole("button", { name: "Select year" }));

    expect(
      screen.getByRole("group", { name: "Select year" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2028" }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "change-visible-date",
      amount: 2,
      unit: "year",
    });

    expect(
      screen.queryByRole("group", { name: "Select year" }),
    ).not.toBeInTheDocument();
  });

  it.each([
    {
      name: "Gregorian calendar with Persian locale",
      props: {
        calendar: "gregorian" as const,
        locale: "fa-IR",
        timeZone: "UTC",
        defaultVisibleDate: new CalendarDate(2026, 9, 1),
      },
      expected: ["شنب", "یک", "دو", "سه", "چهار", "پنج", "جمع"],
    },
    {
      name: "Jalali calendar with Persian locale",
      props: {
        calendar: "jalali" as const,
        locale: "fa-IR",
        timeZone: "UTC",
        defaultVisibleDate: new CalendarDate("persian", 1405, 7, 1),
      },
      expected: ["شنب", "یک", "دو", "سه", "چهار", "پنج", "جمع"],
    },
    {
      name: "Gregorian calendar with English locale",
      props: {
        calendar: "gregorian" as const,
        locale: "en-US",
        timeZone: "UTC",
        defaultVisibleDate: new CalendarDate(2026, 9, 1),
      },
      expected: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    {
      name: "Jalali calendar with English locale",
      props: {
        calendar: "jalali" as const,
        locale: "en-US",
        timeZone: "UTC",
        defaultVisibleDate: new CalendarDate("persian", 1405, 7, 1),
      },
      expected: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
  ])("uses locale-based weekday order: $name", ({ props, expected }) => {
    const { state, context } = createCalendarState(props);

    render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

    expect(
      screen.getAllByRole("columnheader").map((item) => item.textContent),
    ).toEqual(expected);
  });

  it.each([
    {
      name: "defaults to RTL for Persian locale",
      locale: "fa-IR",
      requestedDirection: undefined,
      expectedDirection: "rtl",
    },
    {
      name: "defaults to LTR for English locale",
      locale: "en-US",
      requestedDirection: undefined,
      expectedDirection: "ltr",
    },
    {
      name: "allows LTR with Persian locale",
      locale: "fa-IR",
      requestedDirection: "ltr" as const,
      expectedDirection: "ltr",
    },
    {
      name: "allows RTL with English locale",
      locale: "en-US",
      requestedDirection: "rtl" as const,
      expectedDirection: "rtl",
    },
  ])(
    "sets visual direction: $name",
    ({ locale, requestedDirection, expectedDirection }) => {
      const props: DatePickerProps = {
        calendar: "gregorian",
        locale,
        timeZone: "UTC",
        defaultVisibleDate: new CalendarDate(2026, 9, 1),
        ...(requestedDirection ? { direction: requestedDirection } : {}),
      };

      const { state, context } = createCalendarState(props);

      render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

      expect(screen.getByTestId("calendar")).toHaveAttribute(
        "dir",
        expectedDirection,
      );
    },
  );

  it("keeps locale weekday order when direction is explicitly LTR", () => {
    const { state, context } = createCalendarState({
      calendar: "gregorian",
      locale: "fa-IR",
      timeZone: "UTC",
      direction: "ltr",
      defaultVisibleDate: new CalendarDate(2026, 9, 1),
    });

    render(<Calendar state={state} context={context} dispatch={vi.fn()} />);

    expect(
      screen.getAllByRole("columnheader").map((item) => item.textContent),
    ).toEqual(["شنب", "یک", "دو", "سه", "چهار", "پنج", "جمع"]);
  });
});
