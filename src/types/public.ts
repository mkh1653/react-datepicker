import type { CalendarDate } from "@internationalized/date";

export type CalendarType = "gregorian" | "jalali" | "islamic";
export type SelectionMode = "single" | "multiple" | "range" | "multiple-range";
export type Direction = "ltr" | "rtl" | "auto";

export type DateInput = Date | CalendarDate;

export interface DateRangeInput {
  start: DateInput | null;
  end: DateInput | null;
}
export interface DateRangeOutput {
  start: Date | null;
  end: Date | null;
}

export type MultipleDateInput = DateInput[];
export type MultipleDateOutput = Date[];

export type MultipleRangeInput = {
  start: DateInput;
  end: DateInput;
}[];
export type MultipleRangeOutput = {
  start: Date;
  end: Date;
}[];
