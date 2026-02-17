import { describe, expect, it } from "vitest";
import { computeDistanceKm, estimateDelivery, RESTAURANT_COORDINATES } from "@/lib/delivery";

describe("delivery helpers", () => {
  it("computes near-zero distance for same coordinates", () => {
    const distance = computeDistanceKm(RESTAURANT_COORDINATES, RESTAURANT_COORDINATES);
    expect(distance).toBeLessThan(0.01);
  });

  it("returns eligible estimate inside 20 km", () => {
    const estimate = estimateDelivery(6.2);
    expect(estimate.eligible).toBe(true);
    expect(estimate.minOrderEur).toBe(25);
    expect(estimate.feeEur).toBe(2);
  });

  it("returns non-eligible estimate outside 20 km", () => {
    const estimate = estimateDelivery(22);
    expect(estimate.eligible).toBe(false);
    expect(estimate.minOrderEur).toBeNull();
    expect(estimate.feeEur).toBeNull();
  });
});
