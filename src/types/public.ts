import type { CalendarDate } from "@internationalized/date";

export type DateInput = Date | CalendarDate;

export type DateOutput = Date;

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

export type MultipleRangeInput = DateRangeInput[];

export type MultipleRangeOutput = DateRangeOutput[];
