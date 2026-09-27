import type { CalendarDate } from "@internationalized/date";
import type {
  PartialDateRange,
  MultipleRangeSelection,
} from "../../src/core/types/selection";

const date = {} as CalendarDate;

const emptyRange: PartialDateRange = {
  start: null,
  end: null,
};

const partialRange: PartialDateRange = {
  start: date,
  end: null,
};

const completedRange: PartialDateRange = {
  start: date,
  end: date,
};

// @ts-expect-error end cannot exist without start
const invalidRange: PartialDateRange = {
  start: null,
  end: date,
};

void emptyRange;
void partialRange;
void completedRange;
void invalidRange;

const multipleRangeSelection: MultipleRangeSelection = {
  mode: "multiple-range",
  value: [
    {
      start: date,
      end: date,
    },
  ],
  pendingRange: {
    start: null,
    end: null,
  },
};

void multipleRangeSelection;

const pendingMultipleRangeSelection: MultipleRangeSelection = {
  mode: "multiple-range",
  value: [],
  pendingRange: {
    start: date,
    end: null,
  },
};

void pendingMultipleRangeSelection;
