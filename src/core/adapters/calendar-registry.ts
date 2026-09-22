import { InternationalizedDateAdapter } from "./internationalized-date-adapter";

import type { CalendarAdapter } from "./calendar-adapter";
import type { CalendarIdentifier, CalendarType } from "../types/calendar";

const CALENDAR_IDENTIFIERS: Record<CalendarType, CalendarIdentifier> = {
  gregorian: "gregory",
  persian: "persian",
  islamic: "islamic-civil",
};

const adapters = new Map<CalendarIdentifier, CalendarAdapter>();

export function getCalendarAdapter(type: CalendarType): CalendarAdapter {
  const identifier = CALENDAR_IDENTIFIERS[type];

  const existing = adapters.get(identifier);

  if (existing) {
    return existing;
  }

  const adapter = new InternationalizedDateAdapter(type, identifier);

  adapters.set(identifier, adapter);

  return adapter;
}
