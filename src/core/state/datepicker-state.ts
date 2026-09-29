import type { CalendarDate } from "@internationalized/date";

import { normalizeDateConstraints, type DateConstraints } from "../constraints";
import {
  createInitialDatePickerContext,
  type DatePickerContext,
} from "./datepicker-context";
import { getSystemLocale } from "../locale/system-locale";
import type { SelectionInput } from "../types/selection";
import { resolveInitialVisibleDate } from "../calendar";
import type { DatePickerProps } from "../../types";
import type { CalendarAdapter } from "../adapters";
import { getCalendarAdapter } from "../adapters";
import { normalizeDate } from "../value";

import {
  normalizeMultipleRangeValue,
  normalizeMultipleValue,
  normalizeRangeValue,
  normalizeSingleValue,
} from "../selection";

export interface DatePickerState {
  visibleDate: CalendarDate;
  selection: SelectionInput;
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
  context: DatePickerContext = createInitialDatePickerContext(props),
): DatePickerState {
  const selection = getInitialSelection(
    props,
    context.adapter,
    context.timeZone,
  );

  const visibleDate = getInitialVisibleDate(
    props,
    selection,
    context.today,
    context.constraints,
    context.adapter,
    context.timeZone,
  );

  const open = "open" in props ? props.open : (props.defaultOpen ?? false);

  return {
    visibleDate,
    selection,
    open,
  };
}
