import type { CalendarDate } from "@internationalized/date";

import type { CalendarAdapter } from "../adapters";
import { isDateDisabled, type DateConstraints } from "../constraints";
import type { SelectionInput } from "../types/selection";

export interface ResolveInitialVisibleDateOptions {
  visibleDate?: CalendarDate;
  defaultVisibleDate?: CalendarDate;
  selection?: SelectionInput;
  today: CalendarDate;
  constraints: DateConstraints;
  adapter: CalendarAdapter;
}

const MAX_SEARCH_DAYS = 50 * 366;

function getSelectionDate(
  selection: SelectionInput | undefined,
): CalendarDate | null {
  if (!selection) {
    return null;
  }

  switch (selection.mode) {
    case "single":
      return selection.value;

    case "multiple":
      return selection.value[0] ?? null;

    case "range":
      return selection.value.start;

    case "multiple-range":
      return selection.value[0]?.start ?? null;
  }
}

function findNearestSelectableDate(
  today: CalendarDate,
  constraints: DateConstraints,
  adapter: CalendarAdapter,
): CalendarDate {
  if (!isDateDisabled(today, constraints, adapter)) {
    return today;
  }

  let canSearchAfter = true;
  let canSearchBefore = true;

  for (let distance = 1; distance <= MAX_SEARCH_DAYS; distance++) {
    if (canSearchAfter) {
      const after = adapter.addDays(today, distance);

      if (
        constraints.maxDate &&
        adapter.compare(after, constraints.maxDate) > 0
      ) {
        canSearchAfter = false;
      } else if (!isDateDisabled(after, constraints, adapter)) {
        return after;
      }
    }

    if (canSearchBefore) {
      const before = adapter.addDays(today, -distance);

      if (
        constraints.minDate &&
        adapter.compare(before, constraints.minDate) < 0
      ) {
        canSearchBefore = false;
      } else if (!isDateDisabled(before, constraints, adapter)) {
        return before;
      }
    }

    if (!canSearchAfter && !canSearchBefore) {
      break;
    }
  }

  return today;
}

export function resolveInitialVisibleDate({
  visibleDate,
  defaultVisibleDate,
  selection,
  today,
  constraints,
  adapter,
}: ResolveInitialVisibleDateOptions): CalendarDate {
  if (visibleDate) {
    return visibleDate;
  }

  if (defaultVisibleDate) {
    return defaultVisibleDate;
  }

  const selectionDate = getSelectionDate(selection);

  if (selectionDate) {
    return selectionDate;
  }

  return findNearestSelectableDate(today, constraints, adapter);
}
