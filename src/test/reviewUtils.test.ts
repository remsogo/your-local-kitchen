import { describe, expect, it, vi } from "vitest";
import { getSessionRandomIndex } from "@/lib/reviewUtils";

const createStorageMock = (initial: Record<string, string> = {}) => {
  const state = { ...initial };
  return {
    getItem: vi.fn((key: string) => (key in state ? state[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      state[key] = value;
    }),
  };
};

describe("getSessionRandomIndex", () => {
  it("reuses stored index when valid", () => {
    const storage = createStorageMock({ review: "2" });
    const index = getSessionRandomIndex(storage, "review", 5, () => 0.9);
    expect(index).toBe(2);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("stores a random index when none exists", () => {
    const storage = createStorageMock();
    const index = getSessionRandomIndex(storage, "review", 4, () => 0.6);
    expect(index).toBe(2);
    expect(storage.setItem).toHaveBeenCalledWith("review", "2");
  });

  it("returns zero when pool is empty", () => {
    const storage = createStorageMock();
    const index = getSessionRandomIndex(storage, "review", 0, () => 0.5);
    expect(index).toBe(0);
  });
});
