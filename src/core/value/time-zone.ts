import { getLocalTimeZone } from "@internationalized/date";

export function resolveTimeZone(timeZone?: string): string {
  return timeZone ?? getLocalTimeZone();
}
