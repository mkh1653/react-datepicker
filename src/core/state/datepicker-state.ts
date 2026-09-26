import type { CalendarDate } from "@internationalized/date";

import { normalizeDateConstraints, type DateConstraints } from "../constraints";
import { resolveInitialVisibleDate } from "../calendar";
import type { SelectionInput } from "../types/selection";
import { getSystemLocale } from "../locale/system-locale";
import type { CalendarAdapter } from "../adapters";
import type { DatePickerProps } from "../../types";
import { getCalendarAdapter } from "../adapters";
import { normalizeDate } from "../value";

import {
  normalizeMultipleRangeValue,
  normalizeMultipleValue,
  normalizeRangeValue,
  normalizeSingleValue,
} from "../selection";

export interface DatePickerState {
  adapter: CalendarAdapter;
  locale: string;
  timeZone: string;

  today: CalendarDate;
  visibleDate: CalendarDate;

  selection: SelectionInput;

  constraints: DateConstraints;

  open: boolean;
}

function getInitialSelection(
  props: DatePickerProps,
  adapter: CalendarAdapter,
  timeZone: string,
): SelectionInput {
  if (props.selectionMode === "multiple") {
    const value = "value" in props ? props.value : (props.defaultValue ?? []);

    return {
      mode: "multiple",
      value: normalizeMultipleValue(value, adapter, timeZone),
    };
  }

  if (props.selectionMode === "range") {
    const value =
      "value" in props
        ? props.value
        : (props.defaultValue ?? {
            start: null,
            end: null,
          });

    return {
      mode: "range",
      value: normalizeRangeValue(value, adapter, timeZone),
    };
  }

  if (props.selectionMode === "multiple-range") {
    const value = "value" in props ? props.value : (props.defaultValue ?? []);

    return {
      mode: "multiple-range",
      value: normalizeMultipleRangeValue(value, adapter, timeZone),
      pendingRange: {
        start: null,
        end: null,
      },
    };
  }

  const value = "value" in props ? props.value : (props.defaultValue ?? null);

  return {
    mode: "single",
    value: normalizeSingleValue(value, adapter, timeZone),
  };
}

function getInitialVisibleDate(
  props: DatePickerProps,
  selection: SelectionInput,
  today: CalendarDate,
  constraints: DateConstraints,
  adapter: CalendarAdapter,
  timeZone: string,
): CalendarDate {
  const visibleDate =
    "visibleDate" in props
      ? normalizeDate(props.visibleDate, adapter, { timeZone })
      : undefined;

  const defaultVisibleDate =
    "defaultVisibleDate" in props
      ? normalizeDate(props.defaultVisibleDate, adapter, {
          timeZone,
        })
      : undefined;

  return resolveInitialVisibleDate({
    visibleDate,
    defaultVisibleDate,
    selection,
    today,
    constraints,
    adapter,
  });
}

export function createInitialDatePickerState(
  props: DatePickerProps = {},
): DatePickerState {
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

  const selection = getInitialSelection(props, adapter, timeZone);

  const visibleDate = getInitialVisibleDate(
    props,
    selection,
    today,
    constraints,
    adapter,
    timeZone,
  );

  const open = "open" in props ? props.open : (props.defaultOpen ?? false);

  return {
    adapter,
    locale,
    timeZone,
    today,
    visibleDate,
    selection,
    constraints,
    open,
  };
}
