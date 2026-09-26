import type { CalendarType } from "../../types/public";

export interface SystemLocale {
  locale: string;
  calendar: CalendarType;
  timeZone: string;
}

function resolveCalendar(calendar: string): CalendarType {
  if (calendar === "persian") {
    return "jalali";
  }

  if (calendar === "gregory" || calendar === "gregorian") {
    return "gregorian";
  }

  if (calendar.startsWith("islamic")) {
    return "islamic";
  }

  return "gregorian";
}

export function getSystemLocale(): SystemLocale {
  const resolved = new Intl.DateTimeFormat().resolvedOptions();

  return {
    locale: resolved.locale,
    calendar: resolveCalendar(resolved.calendar),
    timeZone: resolved.timeZone,
  };
}
