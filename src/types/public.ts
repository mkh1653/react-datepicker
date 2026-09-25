import type { CalendarDate } from "@internationalized/date";
import type { DateRange, PartialDateRange } from "./range";

export type CalendarType = "gregorian" | "jalali" | "islamic";
export type SelectionMode = "single" | "multiple" | "range" | "multiple-range";
export type Direction = "ltr" | "rtl" | "auto";

export type DateInput = Date | CalendarDate;

export type DateRangeInput = PartialDateRange<DateInput>;
export type DateRangeOutput = PartialDateRange<Date>;

export type MultipleDateInput = DateInput[];
export type MultipleDateOutput = Date[];

export type MultipleRangeInput = DateRange<DateInput>[];
export type MultipleRangeOutput = DateRange<Date>[];
