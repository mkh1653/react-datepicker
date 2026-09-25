import type { ReactNode } from "react";
import type {
  CalendarType,
  DateInput,
  DateRangeInput,
  DateRangeOutput,
  Direction,
  MultipleDateInput,
  MultipleDateOutput,
  MultipleRangeInput,
  MultipleRangeOutput,
} from "./public";

export interface DatePickerCommonProps {
  calendar?: CalendarType;

  locale?: string;

  timeZone?: string;

  direction?: Direction;

  minDate?: DateInput;

  maxDate?: DateInput;

  disabledDates?: DateInput[];

  isDateDisabled?: (date: Date) => boolean;

  open?: boolean;

  defaultOpen?: boolean;

  onOpenChange?: (open: boolean) => void;

  closeOnSelect?: boolean;

  visibleDate?: DateInput;

  defaultVisibleDate?: DateInput;

  onVisibleDateChange?: (date: Date) => void;

  disabled?: boolean;

  readOnly?: boolean;

  children?: ReactNode;
}

interface ControlledValueProps<TInput, TOutput> {
  value: TInput;

  onChange: (value: TOutput) => void;

  defaultValue?: never;
}

interface UncontrolledValueProps<TInput, TOutput> {
  value?: never;

  defaultValue?: TInput;

  onChange?: (value: TOutput) => void;
}

type ValueProps<TInput, TOutput> =
  | ControlledValueProps<TInput, TOutput>
  | UncontrolledValueProps<TInput, TOutput>;

export type SingleDatePickerProps = DatePickerCommonProps & {
  selectionMode?: "single";
} & ValueProps<DateInput | null, Date | null>;

export type MultipleDatePickerProps = DatePickerCommonProps & {
  selectionMode: "multiple";
} & ValueProps<MultipleDateInput, MultipleDateOutput>;

export type RangeDatePickerProps = DatePickerCommonProps & {
  selectionMode: "range";
} & ValueProps<DateRangeInput, DateRangeOutput>;

export type MultipleRangeDatePickerProps = DatePickerCommonProps & {
  selectionMode: "multiple-range";
} & ValueProps<MultipleRangeInput, MultipleRangeOutput>;

export type DatePickerProps =
  | SingleDatePickerProps
  | MultipleDatePickerProps
  | RangeDatePickerProps
  | MultipleRangeDatePickerProps;
