import { cloneElement, isValidElement, useId } from "react";

import type { MouseEventHandler, ReactElement } from "react";

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
    ? cloneElement(trigger, {
        onClick: handleTriggerClick,
        disabled: props.disabled || trigger.props.disabled,
        "aria-haspopup": "dialog",
        "aria-expanded": state.open,
        "aria-controls": calendarId,
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
    <div className='relative inline-block'>
      {triggerNode}

      {state.open && (
        <div
          id={calendarId}
          role='dialog'
          aria-label='Choose date'
          className='absolute left-0 top-full z-50 mt-2 rounded-md border border-slate-200 bg-white p-3 shadow-lg'>
          <Calendar
            state={state}
            context={context}
            dispatch={handleCalendarAction}
          />
        </div>
      )}
    </div>
  );
}
