import type { CalendarDate } from "@internationalized/date";
import { createCalendarGrid, type CalendarDay } from "../../core/calendar";
import { isDateDisabled } from "../../core/constraints";
import type {
  DatePickerContext,
  DatePickerState,
  DatePickerStateAction,
} from "../../core/state";

interface CalendarProps {
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

      if (!start) {
        return false;
      }

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

export function Calendar({ state, context, dispatch }: CalendarProps) {
  const grid = createCalendarGrid(context.adapter, {
    date: state.visibleDate,
    locale: context.locale,
    today: context.today,
  });

  const monthLabel = context.adapter.format(state.visibleDate, context.locale, {
    year: "numeric",
    month: "long",
  });

  const weekdays = grid.weeks[0]?.days ?? [];

  return (
    <div data-testid='calendar' className='w-full max-w-md'>
      <div className='mb-4 flex items-center justify-between'>
        <button
          type='button'
          aria-label='Previous month'
          onClick={() =>
            dispatch({
              type: "change-visible-date",
              amount: -1,
              unit: "month",
            })
          }>
          Previous
        </button>

        <h2>{monthLabel}</h2>

        <button
          type='button'
          aria-label='Next month'
          onClick={() =>
            dispatch({
              type: "change-visible-date",
              amount: 1,
              unit: "month",
            })
          }>
          Next
        </button>
      </div>

      <div
        role='grid'
        aria-label={monthLabel}
        className='grid grid-cols-7 gap-1'>
        {weekdays.map((day) => (
          <div key={day.dayOfWeek} role='columnheader' className='text-center'>
            {context.adapter.getWeekdayName(day.dayOfWeek, context.locale)}
          </div>
        ))}

        {grid.weeks.map((week) => (
          <div
            key={week.days[0].date.toString()}
            role='row'
            className='contents'>
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
                    disabled={disabled}
                    onClick={() => {
                      if (disabled) {
                        return;
                      }
                      dispatch({
                        type: "select-calendar-date",
                        date: day.date,
                      });
                    }}
                    className={[
                      "flex h-10 w-full items-center justify-center rounded",
                      !day.isCurrentMonth && "opacity-40",
                      day.isToday && "font-bold",
                      selected && "font-semibold underline",
                      disabled && "cursor-not-allowed opacity-40",
                    ]
                      .filter(Boolean)
                      .join(" ")}>
                    {day.date.day}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
