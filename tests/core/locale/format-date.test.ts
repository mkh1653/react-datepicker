import { describe, expect, it } from "vitest";
import { CalendarDate, createCalendar } from "@internationalized/date";

import { formatDate } from "../../../src/core/locale/format-date";

describe("formatDate", () => {
  it("uses the requested calendar even when locale is different", () => {
    const date = new CalendarDate(createCalendar("persian"), 1405, 1, 1);

    const result = formatDate(date, {
      calendar: "jalali",
      locale: "en-US",
      timeZone: "UTC",
      formatOptions: {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    });

    expect(result).toContain("1405");
  });

  it("keeps Gregorian calendar when Persian locale is requested", () => {
    const date = new CalendarDate(2026, 3, 21);

    const result = formatDate(date, {
      calendar: "gregorian",
      locale: "fa-IR",
      timeZone: "UTC",
      formatOptions: {
        year: "numeric",
        month: "long",
        day: "numeric",
        numberingSystem: "latn",
      },
    });

    expect(result).toContain("2026");
    expect(result).not.toContain("1405");
  });

  it("uses system locale defaults when options are omitted", () => {
    expect(() =>
      formatDate(new Date("2026-09-22T12:00:00.000Z")),
    ).not.toThrow();
  });

  it("returns an empty string when there is no selected date", () => {
    expect(formatDate(null)).toBe("");
  });
});
