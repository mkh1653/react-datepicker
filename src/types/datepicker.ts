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

  closeOnSelect?: boolean;

  disabled?: boolean;

  readOnly?: boolean;

  children?: ReactNode;
}

interface ControlledOpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

interface UncontrolledOpenProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type OpenProps = ControlledOpenProps | UncontrolledOpenProps;

interface ControlledVisibleDateProps {
  visibleDate: DateInput;
  onVisibleDateChange: (date: Date) => void;
  defaultVisibleDate?: never;
}

interface UncontrolledVisibleDateProps {
  visibleDate?: never;
  defaultVisibleDate?: DateInput;
  onVisibleDateChange?: (date: Date) => void;
}

type VisibleDateProps =
  | ControlledVisibleDateProps
  | UncontrolledVisibleDateProps;

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

export type SingleDatePickerProps = DatePickerCommonProps &
  OpenProps &
  VisibleDateProps & {
    selectionMode?: "single";
  } & ValueProps<DateInput | null, Date | null>;

export type MultipleDatePickerProps = DatePickerCommonProps &
  OpenProps &
  VisibleDateProps & {
    selectionMode: "multiple";
  } & ValueProps<MultipleDateInput, MultipleDateOutput>;

export type RangeDatePickerProps = DatePickerCommonProps &
  OpenProps &
  VisibleDateProps & {
    selectionMode: "range";
  } & ValueProps<DateRangeInput, DateRangeOutput>;

export type MultipleRangeDatePickerProps = DatePickerCommonProps &
  OpenProps &
  VisibleDateProps & {
    selectionMode: "multiple-range";
  } & ValueProps<MultipleRangeInput, MultipleRangeOutput>;

export type DatePickerProps =
  | SingleDatePickerProps
  | MultipleDatePickerProps
  | RangeDatePickerProps
  | MultipleRangeDatePickerProps;
