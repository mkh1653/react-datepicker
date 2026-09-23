import type { CalendarDate } from "@internationalized/date";

export type DateInput = Date | CalendarDate;

export type DateOutput = Date;

export interface DateRangeInput {
  start: DateInput;
  end: DateInput;
}

export interface DateRangeOutput {
  start: Date;
  end: Date;
}

export type MultipleDateInput = DateInput[];

export type MultipleDateOutput = Date[];

export type MultipleRangeInput = DateRangeInput[];

export type MultipleRangeOutput = DateRangeOutput[];
