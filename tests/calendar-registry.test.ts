import { describe, expect, it } from "vitest";
import { getCalendarAdapter } from "../src/core/adapters";

describe("calendar registry", () => {
  it("returns a Gregorian adapter", () => {
    const adapter = getCalendarAdapter("gregorian");

    expect(adapter.type).toBe("gregorian");
    expect(adapter.identifier).toBe("gregory");
  });

  it("returns a Persian adapter", () => {
    const adapter = getCalendarAdapter("persian");

    expect(adapter.type).toBe("persian");
    expect(adapter.identifier).toBe("persian");
  });

  it("returns an Islamic adapter", () => {
    const adapter = getCalendarAdapter("islamic");

    expect(adapter.type).toBe("islamic");
    expect(adapter.identifier).toBe("islamic-civil");
  });

  it("reuses the same adapter", () => {
    const first = getCalendarAdapter("persian");
    const second = getCalendarAdapter("persian");

    expect(first).toBe(second);
  });
});
