import type { CalendarDate } from "@internationalized/date";

export type CalendarType = "gregorian" | "persian" | "islamic";
export type CalendarIdentifier = "gregory" | "persian" | "islamic-civil";
export type DateValue = CalendarDate;

export type DayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface CalendarConfig {
  type: CalendarType;
  locale?: string;
  weekStartsOn?: number;
}
