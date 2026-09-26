import { describe, expect, it } from "vitest";
import { CalendarDate } from "@internationalized/date";

import { getCalendarAdapter } from "../src/core/adapters";
import { selectDate } from "../src/core/selection";
import type { DateConstraints } from "../src/core/constraints";
import type {
  MultipleRangeSelection,
  SelectionInput,
} from "../src/core/types/selection";

describe("selectDate", () => {
  const adapter = getCalendarAdapter("gregorian");
  const emptyConstraints: DateConstraints = {};

  describe("single", () => {
    it("selects the clicked date", () => {
      const date = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "single",
        value: null,
      };

      const result = selectDate(selection, date, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "single",
        value: date,
      });
    });

    it("replaces the existing selected date", () => {
      const currentDate = new CalendarDate(2026, 9, 10);
      const newDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "single",
        value: currentDate,
      };

      const result = selectDate(selection, newDate, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "single",
        value: newDate,
      });
    });
  });

  describe("multiple", () => {
    it("adds an unselected date", () => {
      const firstDate = new CalendarDate(2026, 9, 10);
      const newDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "multiple",
        value: [firstDate],
      };

      const result = selectDate(selection, newDate, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "multiple",
        value: [firstDate, newDate],
      });
    });

    it("removes an already selected date", () => {
      const firstDate = new CalendarDate(2026, 9, 10);
      const secondDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "multiple",
        value: [firstDate, secondDate],
      };

      const result = selectDate(
        selection,
        firstDate,
        adapter,
        emptyConstraints,
      );

      expect(result).toEqual({
        mode: "multiple",
        value: [secondDate],
      });
    });
  });

  describe("range", () => {
    it("starts a range on the first click", () => {
      const date = new CalendarDate(2026, 9, 10);

      const selection: SelectionInput = {
        mode: "range",
        value: {
          start: null,
          end: null,
        },
      };

      const result = selectDate(selection, date, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "range",
        value: {
          start: date,
          end: null,
        },
      });
    });

    it("completes a range on the second click", () => {
      const start = new CalendarDate(2026, 9, 10);
      const end = new CalendarDate(2026, 9, 20);

      const selection: SelectionInput = {
        mode: "range",
        value: {
          start,
          end: null,
        },
      };

      const result = selectDate(selection, end, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "range",
        value: {
          start,
          end,
        },
      });
    });

    it("reorders a range when the second date is before the start", () => {
      const start = new CalendarDate(2026, 9, 20);
      const end = new CalendarDate(2026, 9, 10);

      const selection: SelectionInput = {
        mode: "range",
        value: {
          start,
          end: null,
        },
      };

      const result = selectDate(selection, end, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "range",
        value: {
          start: end,
          end: start,
        },
      });
    });

    it("creates a single-day range when the same date is clicked twice", () => {
      const date = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "range",
        value: {
          start: date,
          end: null,
        },
      };

      const result = selectDate(selection, date, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "range",
        value: {
          start: date,
          end: date,
        },
      });
    });
  });

  describe("multiple-range", () => {
    it("starts a pending range on the first click", () => {
      const date = new CalendarDate(2026, 9, 10);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start: null,
          end: null,
        },
      };

      const result = selectDate(selection, date, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start: date,
          end: null,
        },
      });
    });

    it("completes a pending range on the second click", () => {
      const start = new CalendarDate(2026, 9, 10);
      const end = new CalendarDate(2026, 9, 20);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start,
          end: null,
        },
      };

      const result = selectDate(selection, end, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "multiple-range",
        value: [
          {
            start,
            end,
          },
        ],
        pendingRange: {
          start: null,
          end: null,
        },
      });
    });

    it("adds a completed range to existing ranges", () => {
      const existingStart = new CalendarDate(2026, 9, 1);
      const existingEnd = new CalendarDate(2026, 9, 5);

      const pendingStart = new CalendarDate(2026, 9, 10);
      const pendingEnd = new CalendarDate(2026, 9, 20);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [
          {
            start: existingStart,
            end: existingEnd,
          },
        ],
        pendingRange: {
          start: pendingStart,
          end: null,
        },
      };

      const result = selectDate(
        selection,
        pendingEnd,
        adapter,
        emptyConstraints,
      );

      expect(result).toEqual({
        mode: "multiple-range",
        value: [
          {
            start: existingStart,
            end: existingEnd,
          },
          {
            start: pendingStart,
            end: pendingEnd,
          },
        ],
        pendingRange: {
          start: null,
          end: null,
        },
      });
    });

    it("normalizes a reversed pending range", () => {
      const start = new CalendarDate(2026, 9, 20);
      const end = new CalendarDate(2026, 9, 10);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start,
          end: null,
        },
      };

      const result = selectDate(selection, end, adapter, emptyConstraints);

      expect(result).toEqual({
        mode: "multiple-range",
        value: [
          {
            start: end,
            end: start,
          },
        ],
        pendingRange: {
          start: null,
          end: null,
        },
      });
    });

    it("creates a single-day range when the same date is clicked twice", () => {
      const date = new CalendarDate(2026, 9, 15);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start: date,
          end: null,
        },
      };

      const result = selectDate(selection, date, adapter, emptyConstraints);

      expect(result).toEqual({
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
      });
    });
  });

  describe("disabled dates", () => {
    it("does not change single selection when the date is disabled", () => {
      const currentDate = new CalendarDate(2026, 9, 10);
      const disabledDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "single",
        value: currentDate,
      };

      const constraints: DateConstraints = {
        disabledDates: [disabledDate],
      };

      const result = selectDate(selection, disabledDate, adapter, constraints);

      expect(result).toEqual(selection);
    });

    it("does not add a disabled date to multiple selection", () => {
      const selectedDate = new CalendarDate(2026, 9, 10);
      const disabledDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "multiple",
        value: [selectedDate],
      };

      const constraints: DateConstraints = {
        disabledDates: [disabledDate],
      };

      const result = selectDate(selection, disabledDate, adapter, constraints);

      expect(result).toEqual(selection);
    });

    it("does not start a range with a disabled date", () => {
      const disabledDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "range",
        value: {
          start: null,
          end: null,
        },
      };

      const constraints: DateConstraints = {
        disabledDates: [disabledDate],
      };

      const result = selectDate(selection, disabledDate, adapter, constraints);

      expect(result).toEqual(selection);
    });

    it("does not complete a range with a disabled date", () => {
      const start = new CalendarDate(2026, 9, 10);
      const disabledDate = new CalendarDate(2026, 9, 15);

      const selection: SelectionInput = {
        mode: "range",
        value: {
          start,
          end: null,
        },
      };

      const constraints: DateConstraints = {
        disabledDates: [disabledDate],
      };

      const result = selectDate(selection, disabledDate, adapter, constraints);

      expect(result).toEqual(selection);
    });

    it("does not start a multiple-range with a disabled date", () => {
      const disabledDate = new CalendarDate(2026, 9, 15);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start: null,
          end: null,
        },
      };

      const constraints: DateConstraints = {
        disabledDates: [disabledDate],
      };

      const result = selectDate(selection, disabledDate, adapter, constraints);

      expect(result).toEqual(selection);
    });

    it("does not complete a multiple-range with a disabled date", () => {
      const start = new CalendarDate(2026, 9, 10);
      const disabledDate = new CalendarDate(2026, 9, 15);

      const selection: MultipleRangeSelection = {
        mode: "multiple-range",
        value: [],
        pendingRange: {
          start,
          end: null,
        },
      };

      const constraints: DateConstraints = {
        disabledDates: [disabledDate],
      };

      const result = selectDate(selection, disabledDate, adapter, constraints);

      expect(result).toEqual(selection);
    });
  });
});
