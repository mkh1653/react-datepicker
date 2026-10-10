interface CalendarHeaderProps {
  monthLabel: string;
  yearLabel: string;
  fullMonthLabel: string;
  locale: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: () => void;
  direction: "ltr" | "rtl";
  onSelectYear: () => void;
}

export function CalendarHeader({
  monthLabel,
  yearLabel,
  fullMonthLabel,
  locale,
  onPreviousMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
  direction,
}: CalendarHeaderProps) {
  const isPersian = /^fa(?:-|$)/i.test(locale);

  return (
    <div className='mb-4 flex items-center justify-between gap-2'>
      <button
        type='button'
        aria-label={isPersian ? "ماه قبل" : "Previous month"}
        onClick={onPreviousMonth}
        className='datepicker-nav-button'>
        <span aria-hidden='true'>{direction === "rtl" ? "›" : "‹"}</span>
      </button>

      <h2
        aria-label={fullMonthLabel}
        className='flex min-w-0 items-center justify-center gap-1 font-semibold'>
        <span className='sr-only'>{fullMonthLabel}</span>

        <button
          type='button'
          aria-label={isPersian ? "انتخاب ماه" : "Select month"}
          onClick={onSelectMonth}
          className='rounded-md px-1 py-1 hover:bg-[var(--datepicker-hover,transparent)]'>
          {monthLabel}
        </button>

        <button
          type='button'
          aria-label={isPersian ? "انتخاب سال" : "Select year"}
          onClick={onSelectYear}
          className='rounded-md px-1 py-1 hover:bg-[var(--datepicker-hover,transparent)]'>
          {yearLabel}
        </button>
      </h2>

      <button
        type='button'
        aria-label={isPersian ? "ماه بعد" : "Next month"}
        onClick={onNextMonth}
        className='datepicker-nav-button'>
        <span aria-hidden='true'>{direction === "rtl" ? "‹" : "›"}</span>
      </button>
    </div>
  );
}
