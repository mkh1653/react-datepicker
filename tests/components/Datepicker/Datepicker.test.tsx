import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CalendarDate } from "@internationalized/date";

import { Datepicker } from "../../../src/components/Datepicker";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

describe("Datepicker", () => {
  it("renders the provided trigger without changing its styling", () => {
    render(
      <Datepicker>
        <button type='button' className='custom-trigger'>
          Choose date
        </button>
      </Datepicker>,
    );

    const trigger = screen.getByRole("button", {
      name: "Choose date",
    });

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass("custom-trigger");
    expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
  });

  it("opens the calendar when the trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Datepicker
        calendar='gregorian'
        locale='en-US'
        timeZone='UTC'
        defaultVisibleDate={new CalendarDate(2026, 9, 1)}>
        <button type='button'>Choose date</button>
      </Datepicker>,
    );

    await user.click(screen.getByRole("button", { name: "Choose date" }));

    expect(screen.getByTestId("calendar")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "September 2026",
      }),
    ).toBeInTheDocument();
  });

  it("does not render the calendar while closed", () => {
    render(
      <Datepicker
        calendar='gregorian'
        locale='en-US'
        timeZone='UTC'
        defaultOpen={false}>
        <button type='button'>Choose date</button>
      </Datepicker>,
    );

    expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
  });

  it("calls onChange when a date is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Datepicker
        calendar='gregorian'
        locale='en-US'
        timeZone='UTC'
        defaultOpen
        defaultVisibleDate={new CalendarDate(2026, 9, 1)}
        value={new Date("2026-09-10T00:00:00.000Z")}
        onChange={onChange}>
        <button type='button'>Choose date</button>
      </Datepicker>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "September 15, 2026",
      }),
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(new Date("2026-09-15T00:00:00.000Z"));
  });

  it("does not open the calendar when disabled", async () => {
    const user = userEvent.setup();

    render(
      <Datepicker calendar='gregorian' locale='en-US' timeZone='UTC' disabled>
        <button type='button'>Choose date</button>
      </Datepicker>,
    );

    const trigger = screen.getByRole("button", {
      name: "Choose date",
    });

    await user.click(trigger);

    expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
  });
});
