import { describe, expect, it } from "vitest";
import { getBusinessStatus } from "@/lib/businessStatus";

describe("getBusinessStatus", () => {
  it("returns open during service window", () => {
    const status = getBusinessStatus("fr", new Date("2026-02-16T11:15:00+01:00"));
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe("Ouvert");
  });

  it("returns closed between services", () => {
    const status = getBusinessStatus("fr", new Date("2026-02-16T15:15:00+01:00"));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe("Ferme");
    expect(status.detail).toContain("18h00");
  });

  it("returns english labels when locale is en", () => {
    const status = getBusinessStatus("en", new Date("2026-02-16T15:15:00+01:00"));
    expect(status.label).toBe("Closed");
  });
});
