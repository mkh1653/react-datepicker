import { describe, expect, it, vi } from "vitest";

import { CalendarDate, createCalendar } from "@internationalized/date";
import { getCalendarAdapter } from "../src/core/adapters";

describe("calendar adapter", () => {
  describe("getWeekdayName", () => {
    it("uses the locale default week start", () => {
      const gregorianAdapter = getCalendarAdapter("gregorian");

      // en-US → Sunday is the first day of the week
      expect(gregorianAdapter.getWeekdayName(0, "en-US")).toBe("Sunday");
      expect(gregorianAdapter.getWeekdayName(1, "en-US")).toBe("Monday");
      expect(gregorianAdapter.getWeekdayName(2, "en-US")).toBe("Tuesday");

      // fr-FR → Monday is the first day of the week
      expect(gregorianAdapter.getWeekdayName(0, "fr-FR")).toBe("lundi");
      expect(gregorianAdapter.getWeekdayName(1, "fr-FR")).toBe("mardi");
      expect(gregorianAdapter.getWeekdayName(2, "fr-FR")).toBe("mercredi");

      const persianAdapter = getCalendarAdapter("persian");

      // fa-IR → Saturday is the first day of the week
      expect(persianAdapter.getWeekdayName(0, "fa-IR")).toBe("شنبه");
      expect(persianAdapter.getWeekdayName(1, "fa-IR")).toBe("یکشنبه");
      expect(persianAdapter.getWeekdayName(2, "fa-IR")).toBe("دوشنبه");
    });

    it("uses an explicit first day of week when provided", () => {
      const gregorianAdapter = getCalendarAdapter("gregorian");

      // Sunday-first
      expect(gregorianAdapter.getWeekdayName(0, "en-US", "sun")).toBe("Sunday");
      expect(gregorianAdapter.getWeekdayName(1, "en-US", "sun")).toBe("Monday");

      // Monday-first
      expect(gregorianAdapter.getWeekdayName(0, "en-US", "mon")).toBe("Monday");
      expect(gregorianAdapter.getWeekdayName(1, "en-US", "mon")).toBe(
        "Tuesday",
      );

      // Saturday-first
      expect(gregorianAdapter.getWeekdayName(0, "en-US", "sat")).toBe(
        "Saturday",
      );
      expect(gregorianAdapter.getWeekdayName(1, "en-US", "sat")).toBe("Sunday");

      const persianAdapter = getCalendarAdapter("persian");

      // Explicit Sunday-first should override fa-IR default.
      expect(persianAdapter.getWeekdayName(0, "fa-IR", "sun")).toBe("یکشنبه");
      expect(persianAdapter.getWeekdayName(1, "fa-IR", "sun")).toBe("دوشنبه");

      // Explicit Saturday-first.
      expect(persianAdapter.getWeekdayName(0, "fa-IR", "sat")).toBe("شنبه");
      expect(persianAdapter.getWeekdayName(1, "fa-IR", "sat")).toBe("یکشنبه");
    });
  });

  it("formats calendar dates independently of the runtime timezone", () => {
    const adapter = getCalendarAdapter("gregorian");

    vi.stubEnv("TZ", "America/Los_Angeles");

    try {
      const date = new CalendarDate(2026, 9, 1);

      expect(adapter.getMonthName(date, "en-US")).toBe("September");

      expect(adapter.getWeekdayName(0, "en-US")).toBe("Sunday");

      expect(
        adapter.format(date, "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ).toBe("September 1, 2026");
    } finally {
      vi.unstubAllEnvs();
    }
  });
  
  it("always formats using the adapter calendar", () => {
    const adapter = getCalendarAdapter("persian");

    const date = new CalendarDate(createCalendar("persian"), 1405, 7, 1);

    const result = adapter.format(date, "en-US", {
      calendar: "gregory",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    expect(result).toContain("1405");
  });
});
