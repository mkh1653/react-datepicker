import { afterEach, describe, expect, it, vi } from "vitest";

import { getSystemLocale } from "../../../src/core/locale/system-locale";

const resolvedOptionsSpy = vi.spyOn(
  Intl.DateTimeFormat.prototype,
  "resolvedOptions",
);

afterEach(() => {
  resolvedOptionsSpy.mockReset();
});

describe("getSystemLocale", () => {
  it("returns locale, calendar and timezone from the system", () => {
    resolvedOptionsSpy.mockReturnValue({
      locale: "fa-IR",
      calendar: "persian",
      numberingSystem: "arabext",
      timeZone: "Asia/Tehran",
    });

    expect(getSystemLocale()).toEqual({
      locale: "fa-IR",
      calendar: "jalali",
      timeZone: "Asia/Tehran",
    });
  });

  it("maps gregory to gregorian", () => {
    resolvedOptionsSpy.mockReturnValue({
      locale: "en-US",
      calendar: "gregory",
      numberingSystem: "latn",
      timeZone: "America/New_York",
    });

    expect(getSystemLocale()).toEqual({
      locale: "en-US",
      calendar: "gregorian",
      timeZone: "America/New_York",
    });
  });

  it("maps islamic calendar variants to islamic", () => {
    resolvedOptionsSpy.mockReturnValue({
      locale: "ar-SA",
      calendar: "islamic-umalqura",
      numberingSystem: "arab",
      timeZone: "Asia/Riyadh",
    });

    expect(getSystemLocale()).toEqual({
      locale: "ar-SA",
      calendar: "islamic",
      timeZone: "Asia/Riyadh",
    });
  });

  it("falls back to gregorian for unsupported system calendars", () => {
    resolvedOptionsSpy.mockReturnValue({
      locale: "en-US",
      calendar: "buddhist",
      numberingSystem: "latn",
      timeZone: "Asia/Bangkok",
    });

    expect(getSystemLocale()).toEqual({
      locale: "en-US",
      calendar: "gregorian",
      timeZone: "Asia/Bangkok",
    });
  });
});
