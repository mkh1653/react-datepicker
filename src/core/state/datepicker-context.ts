import type { CalendarDate } from "@internationalized/date";

import { normalizeDateConstraints, type DateConstraints } from "../constraints";
import { getCalendarAdapter, type CalendarAdapter } from "../adapters";
import type { DatePickerProps } from "../../types";
import { getSystemLocale } from "../locale";

export interface DatePickerContext {
  adapter: CalendarAdapter;
  locale: string;
  timeZone: string;
  today: CalendarDate;
  constraints: DateConstraints;
  closeOnSelect: boolean;
}

export function createInitialDatePickerContext(
  props: DatePickerProps = {},
): DatePickerContext {
  const systemLocale = getSystemLocale();

  const calendar = props.calendar ?? systemLocale.calendar;
  const locale = props.locale ?? systemLocale.locale;
  const timeZone = props.timeZone ?? systemLocale.timeZone;

  const adapter = getCalendarAdapter(calendar);

  const today = adapter.today(timeZone);

  const constraints = normalizeDateConstraints(
    {
      minDate: props.minDate,
      maxDate: props.maxDate,
      disabledDates: props.disabledDates,
      isDateDisabled: props.isDateDisabled,
    },
    adapter,
    timeZone,
  );

  return {
    adapter,
    locale,
    timeZone,
    today,
    constraints,
    closeOnSelect: props.closeOnSelect ?? true,
  };
}
