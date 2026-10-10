import type { CalendarDate } from "@internationalized/date";
import { isDateDisabled } from "../../core/constraints";

import type {
  CalendarDay,
  CalendarGrid as CalendarGridData,
} from "../../core/calendar";

import type {
  DatePickerContext,
  DatePickerState,
  DatePickerStateAction,
} from "../../core/state";

interface CalendarGridProps {
  grid: CalendarGridData;
  monthLabel: string;
  state: DatePickerState;
  context: DatePickerContext;
  dispatch: (action: DatePickerStateAction) => void;
}

function isSelectedDay(
  day: CalendarDay,
  state: DatePickerState,
  context: DatePickerContext,
): boolean {
  const { selection } = state;

  switch (selection.mode) {
    case "single":
      return (
        selection.value !== null &&
        context.adapter.isSameDay(day.date, selection.value)
      );

    case "multiple":
      return selection.value.some((date) =>
        context.adapter.isSameDay(day.date, date),
      );

    case "range": {
      const { start, end } = selection.value;

      if (!start) return false;

      if (!end) {
        return context.adapter.isSameDay(day.date, start);
      }

      return (
        context.adapter.compare(day.date, start) >= 0 &&
        context.adapter.compare(day.date, end) <= 0
      );
    }

    case "multiple-range":
      return selection.value.some(
        (range) =>
          context.adapter.compare(day.date, range.start) >= 0 &&
          context.adapter.compare(day.date, range.end) <= 0,
      );
  }
}

function getDayLabel(date: CalendarDate, context: DatePickerContext): string {
  return context.adapter.format(date, context.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CalendarGrid({
  grid,
  monthLabel,
  state,
  context,
  dispatch,
}: CalendarGridProps) {
  const weekdays = grid.weeks[0]?.days ?? [];
  const numberFormatter = new Intl.NumberFormat(context.locale);

  return (
    <div role='grid' aria-label={monthLabel} className='datepicker-day-grid'>
      {weekdays.map((day) => (
        <div
          key={day.dayOfWeek}
          role='columnheader'
          className='datepicker-weekday flex min-w-0 items-center justify-center whitespace-nowrap px-0.5 py-1 text-xs sm:text-sm'>
          {context.adapter.getWeekdayName(day.dayOfWeek, context.locale)}
        </div>
      ))}

      {grid.weeks.map((week) => (
        <div key={week.days[0].date.toString()} role='row' className='contents'>
          {week.days.map((day) => {
            const selected = isSelectedDay(day, state, context);
            const disabled = isDateDisabled(
              day.date,
              context.constraints,
              context.adapter,
            );

            return (
              <div
                key={day.date.toString()}
                role='gridcell'
                aria-selected={selected}>
                <button
                  type='button'
                  aria-label={getDayLabel(day.date, context)}
                  aria-current={day.isToday ? "date" : undefined}
                  data-selected={selected ? "true" : undefined}
                  data-outside-month={!day.isCurrentMonth ? "true" : undefined}
                  disabled={disabled}
                  data-today={day.isToday ? "true" : undefined}
                  onClick={() => {
                    if (disabled) return;

                    dispatch({
                      type: "select-calendar-date",
                      date: day.date,
                    });
                  }}
                  className='datepicker-day flex h-10 w-full items-center justify-center rounded-md'>
                  {numberFormatter.format(day.date.day)}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
