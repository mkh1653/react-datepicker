import type { CalendarDate } from "@internationalized/date";
import type { CalendarType } from "../../types";

export type CalendarIdentifier = "gregory" | "persian" | "islamic-civil";
export type DateValue = CalendarDate;

export type DayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface CalendarConfig {
  type: CalendarType;
  locale?: string;
  weekStartsOn?: number;
}
