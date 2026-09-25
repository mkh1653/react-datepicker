import { assertType, expectTypeOf } from "vitest";
import type { CalendarDate } from "@internationalized/date";

import type {
  DatePickerProps,
  DateRangeOutput,
  MultipleDateOutput,
  MultipleRangeOutput,
} from "../src/types";

const date = new Date();
const calendarDate = {} as CalendarDate;

const controlledSingle: DatePickerProps = {
  value: date,
  onChange: (value) => {
    assertType<Date | null>(value);
  },
};

const uncontrolledSingle: DatePickerProps = {
  defaultValue: date,
};

const controlledMultiple: DatePickerProps = {
  selectionMode: "multiple",
  value: [date],
  onChange: (value) => {
    assertType<MultipleDateOutput>(value);
  },
};

const uncontrolledRange: DatePickerProps = {
  selectionMode: "range",
  defaultValue: {
    start: date,
    end: null,
  },
};

const controlledRange: DatePickerProps = {
  selectionMode: "range",
  value: {
    start: date,
    end: date,
  },
  onChange: (value) => {
    assertType<DateRangeOutput>(value);
  },
};

const controlledMultipleRange: DatePickerProps = {
  selectionMode: "multiple-range",
  value: [
    {
      start: date,
      end: date,
    },
  ],
  onChange: (value) => {
    assertType<MultipleRangeOutput>(value);
  },
};

const controlledOpen: DatePickerProps = {
  open: true,
  onOpenChange: (open) => {
    assertType<boolean>(open);
  },
};

const uncontrolledOpen: DatePickerProps = {
  defaultOpen: true,
};

const controlledVisibleDate: DatePickerProps = {
  visibleDate: date,
  onVisibleDateChange: (value) => {
    assertType<Date>(value);
  },
};

const uncontrolledVisibleDate: DatePickerProps = {
  defaultVisibleDate: date,
};

// @ts-expect-error controlled and uncontrolled value cannot be combined
const invalidValue: DatePickerProps = {
  value: date,
  defaultValue: date,
};

// @ts-expect-error controlled and uncontrolled open state cannot be combined
const invalidOpen: DatePickerProps = {
  open: true,
  defaultOpen: false,
};

// @ts-expect-error controlled and uncontrolled visible date cannot be combined
const invalidVisibleDate: DatePickerProps = {
  visibleDate: date,
  defaultVisibleDate: date,
};

expectTypeOf(controlledSingle).toMatchTypeOf<DatePickerProps>();
expectTypeOf(uncontrolledSingle).toMatchTypeOf<DatePickerProps>();
expectTypeOf(controlledMultiple).toMatchTypeOf<DatePickerProps>();
expectTypeOf(uncontrolledRange).toMatchTypeOf<DatePickerProps>();
expectTypeOf(controlledRange).toMatchTypeOf<DatePickerProps>();
expectTypeOf(controlledMultipleRange).toMatchTypeOf<DatePickerProps>();
expectTypeOf(controlledOpen).toMatchTypeOf<DatePickerProps>();
expectTypeOf(uncontrolledOpen).toMatchTypeOf<DatePickerProps>();
expectTypeOf(controlledVisibleDate).toMatchTypeOf<DatePickerProps>();
expectTypeOf(uncontrolledVisibleDate).toMatchTypeOf<DatePickerProps>();

const validSingleWithCalendarDate: DatePickerProps = {
  value: calendarDate,
  onChange: (value) => {
    assertType<Date | null>(value);
  },
};

const validMultipleWithCalendarDate: DatePickerProps = {
  selectionMode: "multiple",
  value: [calendarDate, date],
  onChange: (value) => {
    assertType<MultipleDateOutput>(value);
  },
};

const validRangeWithPartialValue: DatePickerProps = {
  selectionMode: "range",
  value: {
    start: date,
    end: null,
  },
  onChange: (value) => {
    assertType<DateRangeOutput>(value);
  },
};

// @ts-expect-error single mode cannot receive an array value
const invalidSingleValue: DatePickerProps = {
  selectionMode: "single",
  value: [date],
  onChange: () => {},
};

// @ts-expect-error multiple mode requires an array value
const invalidMultipleValue: DatePickerProps = {
  selectionMode: "multiple",
  value: date,
  onChange: () => {},
};

// @ts-expect-error range mode cannot receive a single date
const invalidRangeValue: DatePickerProps = {
  selectionMode: "range",
  value: date,
  onChange: () => {},
};



// @ts-expect-error single mode cannot receive multiple-range data
const invalidMultipleRangeForSingle: DatePickerProps = {
  selectionMode: "single",
  value: [
    {
      start: date,
      end: date,
    },
  ],
  onChange: () => {},
};
