import { cloneElement, isValidElement, useId } from "react";
import type { MouseEventHandler, ReactElement } from "react";
import type { CalendarDate } from "@internationalized/date";

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

import type { DatePickerProps } from "../../types";
import {
  useDatePickerState,
  type DatePickerStateAction,
  type DatePickerContext,
  type DatePickerState,
} from "../../core/state";
import { Calendar } from "../Calendar";

interface TriggerProps {
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  "aria-haspopup"?: "dialog";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
}

function formatCalendarDate(
  date: CalendarDate,
  context: DatePickerContext,
): string {
  return context.adapter.format(date, context.locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatSelectionValue(
  state: DatePickerState,
  context: DatePickerContext,
): string {
  const format = (date: CalendarDate) => formatCalendarDate(date, context);

  const formatRange = (
    start: CalendarDate | null,
    end: CalendarDate | null,
  ) => {
    if (!start) return end ? format(end) : "";
    if (!end) return format(start);

    return `${format(start)} – ${format(end)}`;
  };

  switch (state.selection.mode) {
    case "single":
      return state.selection.value ? format(state.selection.value) : "";

    case "multiple":
      return state.selection.value.map(format).join(", ");

    case "range":
      return formatRange(
        state.selection.value.start,
        state.selection.value.end,
      );

    case "multiple-range":
      return state.selection.value
        .map((range) => formatRange(range.start, range.end))
        .join(", ");
  }
}

export function Datepicker(props: DatePickerProps) {
  const { state, context, dispatch } = useDatePickerState(props);

  const calendarId = useId();
  const displayMode = props.displayMode ?? "popup";

  const {
    refs,
    floatingStyles,
    context: floatingContext,
  } = useFloating({
    open: state.open,
    onOpenChange: (open) => {
      dispatch({
        type: open ? "open" : "close",
      });
    },
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: displayMode === "dropdown" ? autoUpdate : undefined,
  });

  const dismiss = useDismiss(floatingContext, {
    escapeKey: true,
    outsidePress: true,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const trigger = isValidElement<TriggerProps>(props.children)
    ? (props.children as ReactElement<TriggerProps>)
    : null;

  const formattedInputValue = formatSelectionValue(state, context);

  const shouldFormatInput =
    trigger !== null &&
    trigger.type === "input" &&
    (trigger.props.type === undefined || trigger.props.type === "text") &&
    trigger.props.value === undefined &&
    trigger.props.defaultValue === undefined;

  const handleTriggerClick: MouseEventHandler<HTMLElement> = (event) => {
    if (props.disabled || trigger?.props.disabled) {
      event.preventDefault();
      return;
    }

    trigger?.props.onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    dispatch({
      type: state.open ? "close" : "open",
    });
  };

  const triggerNode = trigger
    ? cloneElement(trigger, {
        ...getReferenceProps({
          onClick: handleTriggerClick,
          disabled: props.disabled || trigger.props.disabled,
          "aria-haspopup": "dialog",
          "aria-expanded": state.open,
          "aria-controls": calendarId,
        }),
        ...(shouldFormatInput ? { value: formattedInputValue } : {}),
      })
    : props.children;

  const handleCalendarAction = (action: DatePickerStateAction) => {
    if (props.disabled) {
      return;
    }

    if (props.readOnly && action.type === "select-calendar-date") {
      return;
    }

    dispatch(action);
  };

  return (
    <div ref={refs.setReference} className='relative inline-block'>
      {triggerNode}

      {state.open && (
        <FloatingPortal>
          {displayMode === "popup" ? (
            <div
              data-testid='datepicker-overlay'
              className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/40'>
              <div
                {...getFloatingProps({
                  id: calendarId,
                  role: "dialog",
                  "aria-label": "Choose date",
                  "aria-modal": true,
                })}
                ref={refs.setFloating}
                className='datepicker-surface relative box-border w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-auto rounded-md p-3 shadow-xl'>
                <Calendar
                  state={state}
                  context={context}
                  dispatch={handleCalendarAction}
                />
              </div>
            </div>
          ) : (
            <div
              {...getFloatingProps({
                id: calendarId,
                role: "dialog",
                "aria-label": "Choose date",
              })}
              ref={refs.setFloating}
              style={floatingStyles}
              className='datepicker-surface z-[1000] box-border w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-1rem)] overflow-auto rounded-md p-3 shadow-lg'>
              <Calendar
                state={state}
                context={context}
                dispatch={handleCalendarAction}
              />
            </div>
          )}
        </FloatingPortal>
      )}
    </div>
  );
}
