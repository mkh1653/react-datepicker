import { cloneElement, isValidElement, useId } from "react";
import type { MouseEventHandler, ReactElement } from "react";

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
} from "../../core/state";
import { Calendar } from "../Calendar";

interface TriggerProps {
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  "aria-haspopup"?: "dialog";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
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
    ? cloneElement(
        trigger,
        getReferenceProps({
          onClick: handleTriggerClick,
          disabled: props.disabled || trigger.props.disabled,
          "aria-haspopup": "dialog",
          "aria-expanded": state.open,
          "aria-controls": calendarId,
        }),
      )
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
                className='relative max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto rounded-md bg-white p-3 shadow-xl'>
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
              className='z-[1000] max-h-[calc(100vh-1rem)] max-w-[calc(100vw-1rem)] overflow-auto rounded-md border border-slate-200 bg-white p-3 shadow-lg'>
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
