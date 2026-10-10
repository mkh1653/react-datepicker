import type { CalendarDate } from "@internationalized/date";

import { normalizeDateConstraints, type DateConstraints } from "../constraints";
import { getCalendarAdapter, type CalendarAdapter } from "../adapters";
import type { DatePickerProps } from "../../types";
import { getSystemLocale } from "../locale";

type ResolvedDirection = "ltr" | "rtl";

const RTL_LANGUAGES = new Set([
  "ar",
  "arc",
  "ckb",
  "dv",
  "fa",
  "he",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
]);

const RTL_SCRIPTS = new Set(["adlm", "arab", "hebr", "nkoo", "syrc", "thaa"]);

function resolveDirection(
  direction: DatePickerProps["direction"],
  locale: string,
): ResolvedDirection {
  // Explicit direction always takes priority.
  if (direction === "ltr" || direction === "rtl") {
    return direction;
  }

  // "auto" or an omitted value: infer from locale.
  const parts = locale.toLowerCase().split("-");
  const language = parts[0];
  const script = parts.find((part) => /^[a-z]{4}$/.test(part));

  if (script) {
    return RTL_SCRIPTS.has(script) ? "rtl" : "ltr";
  }

  return RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
}

export interface DatePickerContext {
  adapter: CalendarAdapter;
  locale: string;
  timeZone: string;
  today: CalendarDate;
  constraints: DateConstraints;
  closeOnSelect: boolean;
  direction: ResolvedDirection;
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
    direction: resolveDirection(props.direction, locale),
  };
}
