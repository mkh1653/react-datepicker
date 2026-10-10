import { useState } from "react";

import { createCalendarGrid } from "../../core/calendar";
import type {
  DatePickerContext,
  DatePickerState,
  DatePickerStateAction,
} from "../../core/state";

import { CalendarGrid as CalendarGridView } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";

interface CalendarProps {
  state: DatePickerState;
  context: DatePickerContext;
  dispatch: (action: DatePickerStateAction) => void;
}

type CalendarView = "days" | "months" | "years";

export function Calendar({ state, context, dispatch }: CalendarProps) {
  const [view, setView] = useState<CalendarView>("days");
  const [yearRangeOffset, setYearRangeOffset] = useState(0);

  const { adapter, locale } = context;
  const visibleDate = state.visibleDate;

  const previousArrow = context.direction === "rtl" ? "›" : "‹";

  const nextArrow = context.direction === "rtl" ? "‹" : "›";

  const monthLabel = adapter.format(visibleDate, locale, {
    month: "long",
  });

  const yearLabel = adapter.format(visibleDate, locale, {
    year: "numeric",
  });

  const fullMonthLabel = adapter.format(visibleDate, locale, {
    year: "numeric",
    month: "long",
  });

  const grid = createCalendarGrid(adapter, {
    date: visibleDate,
    locale,
    today: context.today,
  });

  const isPersian = /^fa(?:-|$)/i.test(locale);

  const labels = {
    selectMonth: isPersian ? "انتخاب ماه" : "Select month",
    selectYear: isPersian ? "انتخاب سال" : "Select year",
    back: isPersian ? "بازگشت به تقویم" : "Back to calendar",
    previousYears: isPersian ? "۱۲ سال قبل" : "Previous years",
    nextYears: isPersian ? "۱۲ سال بعد" : "Next years",
  };

  const firstMonthOfYear = adapter.addMonths(
    visibleDate,
    1 - visibleDate.month,
  );

  const months = Array.from({ length: 12 }, (_, index) =>
    adapter.addMonths(firstMonthOfYear, index),
  );

  const firstYear = visibleDate.year - 5 + yearRangeOffset * 12;

  const years = Array.from({ length: 12 }, (_, index) => {
    const year = firstYear + index;

    return {
      year,
      date: adapter.addYears(visibleDate, year - visibleDate.year),
    };
  });

  const formatYear = (date: typeof visibleDate) =>
    adapter.format(date, locale, {
      year: "numeric",
    });

  const handleMonthSelect = (month: number) => {
    dispatch({
      type: "change-visible-date",
      amount: month - visibleDate.month,
      unit: "month",
    });

    setView("days");
  };

  const handleYearSelect = (year: number) => {
    dispatch({
      type: "change-visible-date",
      amount: year - visibleDate.year,
      unit: "year",
    });

    setYearRangeOffset(0);
    setView("days");
  };

  return (
    <div
      data-testid='calendar'
      dir={context.direction}
      className='flex h-[23rem] w-full min-w-0 flex-col'>
      {view === "days" && (
        <>
          <CalendarHeader
            monthLabel={monthLabel}
            yearLabel={yearLabel}
            fullMonthLabel={fullMonthLabel}
            direction={context.direction}
            locale={locale}
            onPreviousMonth={() =>
              dispatch({
                type: "change-visible-date",
                amount: -1,
                unit: "month",
              })
            }
            onNextMonth={() =>
              dispatch({
                type: "change-visible-date",
                amount: 1,
                unit: "month",
              })
            }
            onSelectMonth={() => setView("months")}
            onSelectYear={() => {
              setYearRangeOffset(0);
              setView("years");
            }}
          />

          <div className='min-h-0 flex-1'>
            <CalendarGridView
              grid={grid}
              monthLabel={fullMonthLabel}
              state={state}
              context={context}
              dispatch={dispatch}
            />
          </div>
        </>
      )}

      {view === "months" && (
        <>
          <div className='mb-4 flex h-10 items-center justify-between gap-2'>
            <button
              type='button'
              aria-label={labels.back}
              onClick={() => setView("days")}
              className='datepicker-nav-button'>
              x
            </button>

            <button
              type='button'
              aria-label={labels.selectYear}
              onClick={() => {
                setYearRangeOffset(0);
                setView("years");
              }}
              className='rounded-md px-2 py-1 font-semibold'>
              {yearLabel}
            </button>

            <span className='text-sm'>{labels.selectMonth}</span>
          </div>

          <div
            role='group'
            aria-label={labels.selectMonth}
            className='grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-2'>
            {months.map((monthDate) => {
              const label = adapter.format(monthDate, locale, {
                month: "long",
              });

              const selected = monthDate.month === visibleDate.month;

              return (
                <button
                  key={monthDate.toString()}
                  type='button'
                  aria-label={label}
                  data-selected={selected ? "true" : undefined}
                  onClick={() => handleMonthSelect(monthDate.month)}
                  className='datepicker-option'>
                  {label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {view === "years" && (
        <>
          <div className='mb-4 flex h-10 items-center justify-between gap-2'>
            <button
              type='button'
              aria-label={labels.previousYears}
              onClick={() => setYearRangeOffset((offset) => offset - 1)}
              className='datepicker-nav-button'>
              {previousArrow}
            </button>

            <h2 className='text-sm font-semibold'>
              {formatYear(years[0].date)} –{" "}
              {formatYear(years[years.length - 1].date)}
            </h2>

            <button
              type='button'
              aria-label={labels.nextYears}
              onClick={() => setYearRangeOffset((offset) => offset + 1)}
              className='datepicker-nav-button'>
              {nextArrow}
            </button>
          </div>

          <div
            role='group'
            aria-label={labels.selectYear}
            className='grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-2'>
            {years.map(({ year, date }) => (
              <button
                key={year}
                type='button'
                aria-label={formatYear(date)}
                data-selected={year === visibleDate.year ? "true" : undefined}
                onClick={() => handleYearSelect(year)}
                className='datepicker-option'>
                {formatYear(date)}
              </button>
            ))}
          </div>
          <button
            type='button'
            aria-label={labels.back}
            onClick={() => setView("days")}
            className='datepicker-back-button'>
            {labels.back}
          </button>
        </>
      )}
    </div>
  );
}
