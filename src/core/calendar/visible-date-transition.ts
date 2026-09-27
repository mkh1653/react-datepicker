import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters";

export type VisibleDateChangeUnit = "month" | "year";

export function changeVisibleDate(
  visibleDate: CalendarDate,
  amount: number,
  unit: VisibleDateChangeUnit,
  adapter: CalendarAdapter,
): CalendarDate {
  const currentMonth = adapter.getStartOfMonth(visibleDate);

  const nextDate =
    unit === "month"
      ? adapter.addMonths(currentMonth, amount)
      : adapter.addYears(currentMonth, amount);

  return adapter.getStartOfMonth(nextDate);
}
