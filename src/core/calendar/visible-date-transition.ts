import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters";

export type VisibleDateChangeUnit = "month" | "year";

export function changeVisibleDate(
  visibleDate: CalendarDate,
  amount: number,
  unit: VisibleDateChangeUnit,
  adapter: CalendarAdapter,
): CalendarDate {
  if (unit === "month") {
    return adapter.addMonths(visibleDate, amount);
  }

  return adapter.addYears(visibleDate, amount);
}
