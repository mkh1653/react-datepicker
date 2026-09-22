import type { DateValue } from "./calendar";

export type SelectionMode = "single" | "multiple" | "range";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export type SingleValue = DateValue | null;

export type MultipleValue = DateValue[];

export type RangeValue = DateRange | null;

export type SelectionValue = SingleValue | MultipleValue | RangeValue;
