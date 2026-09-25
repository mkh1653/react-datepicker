import type { DateValue } from "./calendar";
import type { SelectionMode } from "../../types";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}
export type { SelectionMode };

export interface PartialDateRange {
  start: DateValue | null;
  end: DateValue | null;
}

export type SingleValue = DateValue | null;

export type MultipleValue = DateValue[];

export type RangeValue = DateRange | null;

export type MultipleRangeValue = DateRange[];

export type SelectionValue =
  | SingleValue
  | MultipleValue
  | RangeValue
  | MultipleRangeValue;

export type SelectionInput =
  | {
      mode: "single";
      value: DateValue | null;
    }
  | {
      mode: "multiple";
      value: DateValue[];
    }
  | {
      mode: "range";
      value: PartialDateRange;
    }
  | {
      mode: "multiple-range";
      value: MultipleRangeValue;
    };
