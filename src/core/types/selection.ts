import type { DateValue } from "./calendar";
import type {
  DateRange as GenericDateRange,
  PartialDateRange as GenericPartialDateRange,
} from "../../types/range";

export type DateRange = GenericDateRange<DateValue>;

export type PartialDateRange = GenericPartialDateRange<DateValue>;

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
