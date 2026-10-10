import { describe, expect, it, vi } from "vitest";

import { CalendarDate, createCalendar } from "@internationalized/date";
import { getCalendarAdapter } from "../../../src/core/adapters";

describe("calendar adapter", () => {
  describe("getWeekdayName", () => {
    it("uses the locale default week start", () => {
      const gregorianAdapter = getCalendarAdapter("gregorian");

      // en-US → Sunday is the first day of the week
      expect(gregorianAdapter.getWeekdayName(0, "en-US")).toBe("Sun");
      expect(gregorianAdapter.getWeekdayName(1, "en-US")).toBe("Mon");
      expect(gregorianAdapter.getWeekdayName(2, "en-US")).toBe("Tue");

      // fr-FR → Monday is the first day of the week
      expect(gregorianAdapter.getWeekdayName(0, "fr-FR")).toBe("lun.");
      expect(gregorianAdapter.getWeekdayName(1, "fr-FR")).toBe("mar.");
      expect(gregorianAdapter.getWeekdayName(2, "fr-FR")).toBe("mer.");

      const persianAdapter = getCalendarAdapter("jalali");

      // fa-IR → Saturday is the first day of the week
      expect(persianAdapter.getWeekdayName(0, "fa-IR")).toBe("شنب");
      expect(persianAdapter.getWeekdayName(1, "fa-IR")).toBe("یک");
      expect(persianAdapter.getWeekdayName(2, "fa-IR")).toBe("دو");
    });

    it("uses an explicit first day of week when provided", () => {
      const gregorianAdapter = getCalendarAdapter("gregorian");

      // Sunday-first
      expect(gregorianAdapter.getWeekdayName(0, "en-US", "sun")).toBe("Sun");
      expect(gregorianAdapter.getWeekdayName(1, "en-US", "sun")).toBe("Mon");

      // Monday-first
      expect(gregorianAdapter.getWeekdayName(0, "en-US", "mon")).toBe("Mon");
      expect(gregorianAdapter.getWeekdayName(1, "en-US", "mon")).toBe("Tue");

      // Saturday-first
      expect(gregorianAdapter.getWeekdayName(0, "en-US", "sat")).toBe(
        "Sat",
      );
      expect(gregorianAdapter.getWeekdayName(1, "en-US", "sat")).toBe("Sun");

      const persianAdapter = getCalendarAdapter("jalali");

      // Explicit Sunday-first should override fa-IR default.
      expect(persianAdapter.getWeekdayName(0, "fa-IR", "sun")).toBe("یک");
      expect(persianAdapter.getWeekdayName(1, "fa-IR", "sun")).toBe("دو");

      // Explicit Saturday-first.
      expect(persianAdapter.getWeekdayName(0, "fa-IR", "sat")).toBe("شنب");
      expect(persianAdapter.getWeekdayName(1, "fa-IR", "sat")).toBe("یک");
    });

    it("uses compact weekday labels for Persian locale", () => {
      const adapter = getCalendarAdapter("jalali");

      const labels = Array.from({ length: 7 }, (_, index) =>
        adapter.getWeekdayName(index, "fa-IR"),
      );

      expect(labels).toEqual(["شنب", "یک", "دو", "سه", "چهار", "پنج", "جمع"]);
    });
  });

  it("formats calendar dates independently of the runtime timezone", () => {
    const adapter = getCalendarAdapter("gregorian");

    vi.stubEnv("TZ", "America/Los_Angeles");

    try {
      const date = new CalendarDate(2026, 9, 1);

      expect(adapter.getMonthName(date, "en-US")).toBe("September");

      expect(adapter.getWeekdayName(0, "en-US")).toBe("Sun");

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
    const adapter = getCalendarAdapter("jalali");

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
