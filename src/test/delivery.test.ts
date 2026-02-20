import { afterEach, describe, expect, it, vi } from "vitest";
import {
  computeDeliveryDistance,
  computeDistanceKm,
  computeRouteDistanceKm,
  estimateDelivery,
  RESTAURANT_COORDINATES,
} from "@/lib/delivery";

describe("delivery helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("computes near-zero distance for same coordinates", () => {
    const distance = computeDistanceKm(RESTAURANT_COORDINATES, RESTAURANT_COORDINATES);
    expect(distance).toBeLessThan(0.01);
  });

  it("returns eligible estimate inside 15 km", () => {
    const estimate = estimateDelivery(6.2);
    expect(estimate.eligible).toBe(true);
    expect(estimate.minOrderEur).toBe(25);
    expect(estimate.feeEur).toBe(2);
  });

  it("returns non-eligible estimate outside 15 km", () => {
    const estimate = estimateDelivery(16);
    expect(estimate.eligible).toBe(false);
    expect(estimate.minOrderEur).toBeNull();
    expect(estimate.feeEur).toBeNull();
  });

  it("returns route distance when routing API responds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        code: "Ok",
        routes: [{ distance: 8400 }],
      }),
    } as unknown as Response);

    const distance = await computeRouteDistanceKm(RESTAURANT_COORDINATES, { lat: 48.6, lng: 1.95 });
    expect(distance).toBe(8.4);
  });

  it("keeps the shortest distance among alternative routes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        code: "Ok",
        routes: [{ distance: 8400 }, { distance: 7200 }, { distance: 7900 }],
      }),
    } as unknown as Response);

    const distance = await computeRouteDistanceKm(RESTAURANT_COORDINATES, { lat: 48.6, lng: 1.95 });
    expect(distance).toBe(7.2);
  });

  it("falls back to crow-flies distance when routing is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("routing down"));

    const result = await computeDeliveryDistance(RESTAURANT_COORDINATES, { lat: 48.6, lng: 1.95 });
    expect(result.source).toBe("air");
    expect(result.distanceKm).toBeGreaterThan(0);
  });

  it("uses road distance source when routing is available", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        code: "Ok",
        routes: [{ distance: 5600 }],
      }),
    } as unknown as Response);

    const result = await computeDeliveryDistance(RESTAURANT_COORDINATES, { lat: 48.6, lng: 1.95 });
    expect(result.source).toBe("road");
    expect(result.distanceKm).toBe(5.6);
  });
});
