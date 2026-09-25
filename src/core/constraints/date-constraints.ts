import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters";
import type { DateInput } from "../../types/public";
import { normalizeDate, toDate } from "../value";

export interface DateConstraintsInput {
  minDate?: DateInput;
  maxDate?: DateInput;
  disabledDates?: DateInput[];
  isDateDisabled?: (date: Date) => boolean;
}

export interface DateConstraints {
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  disabledDates?: CalendarDate[];
  isDateDisabled?: (date: CalendarDate) => boolean;
}

export function normalizeDateConstraints(
  constraints: DateConstraintsInput,
  adapter: CalendarAdapter,
  timeZone?: string,
): DateConstraints {
  const minDate =
    constraints.minDate === undefined
      ? undefined
      : normalizeDate(constraints.minDate, adapter, { timeZone });

  const maxDate =
    constraints.maxDate === undefined
      ? undefined
      : normalizeDate(constraints.maxDate, adapter, { timeZone });

  if (minDate && maxDate && adapter.compare(minDate, maxDate) > 0) {
    throw new RangeError("minDate must be before or equal to maxDate");
  }

  const isDateDisabledCallback = constraints.isDateDisabled;

  return {
    minDate,
    maxDate,
    disabledDates: constraints.disabledDates?.map((date) =>
      normalizeDate(date, adapter, { timeZone }),
    ),

    isDateDisabled: isDateDisabledCallback
      ? (date) => isDateDisabledCallback(toDate(date, adapter, { timeZone }))
      : undefined,
  };
}

export function isDateDisabled(
  date: CalendarDate,
  constraints: DateConstraints,
  adapter: CalendarAdapter,
): boolean {
  const { minDate, maxDate, disabledDates, isDateDisabled } = constraints;

  if (minDate && adapter.compare(date, minDate) < 0) {
    return true;
  }

  if (maxDate && adapter.compare(date, maxDate) > 0) {
    return true;
  }

  if (
    disabledDates?.some((disabledDate) => adapter.isSameDay(date, disabledDate))
  ) {
    return true;
  }

  if (isDateDisabled?.(date)) {
    return true;
  }

  return false;
}
