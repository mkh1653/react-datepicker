import { describe, expect, it } from "vitest";
import { getCalendarAdapter } from "../../../src/core/adapters";
import { InternationalizedDateAdapter } from "../../../src/core/adapters";

describe("calendar registry", () => {
  it("returns a Gregorian adapter", () => {
    const adapter = getCalendarAdapter("gregorian");

    expect(adapter.type).toBe("gregorian");
    expect(adapter.identifier).toBe("gregory");
  });

  it("returns a Persian adapter", () => {
    const adapter = getCalendarAdapter("jalali");

    expect(adapter.type).toBe("jalali");
    expect(adapter.identifier).toBe("persian");
  });

  it("returns an Islamic adapter", () => {
    const adapter = getCalendarAdapter("islamic");

    expect(adapter.type).toBe("islamic");
    expect(adapter.identifier).toBe("islamic-civil");
  });

  it("reuses the same adapter", () => {
    const first = getCalendarAdapter("jalali");
    const second = getCalendarAdapter("jalali");

    expect(first).toBe(second);
  });

  it("maps jalali to the persian calendar identifier", () => {
    const adapter = getCalendarAdapter("jalali");

    expect(adapter.type).toBe("jalali");
    expect(adapter.identifier).toBe("persian");
  });
});
