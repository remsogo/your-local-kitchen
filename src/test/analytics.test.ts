import { describe, expect, it } from "vitest";
import { extractSearchQuery } from "@/lib/analyticsEvents";
import { buildAnalyticsOverview, RawEvent } from "@/hooks/useAnalyticsOverview";

describe("analytics helpers", () => {
  it("extracts known search query params by engine", () => {
    expect(extractSearchQuery("https://www.google.com/search?q=pizza+sonchamp")).toBe("pizza sonchamp");
    expect(extractSearchQuery("https://www.bing.com/search?q=burger")).toBe("burger");
    expect(extractSearchQuery("https://search.yahoo.com/search?p=tacos")).toBe("tacos");
  });

  it("returns null for unknown or invalid referrer", () => {
    expect(extractSearchQuery("https://example.com/?q=ignored")).toBeNull();
    expect(extractSearchQuery("not-a-url")).toBeNull();
    expect(extractSearchQuery("")).toBeNull();
  });

  it("aggregates impressions, clicks, top target and top search", () => {
    const rows: RawEvent[] = [
      { event_type: "page_view", page_path: "/", target: "Home", search_query: "pizza", created_at: "2026-01-01" },
      { event_type: "page_view", page_path: "/", target: "Home", search_query: "pizza", created_at: "2026-01-02" },
      { event_type: "page_view", page_path: "/menu", target: "Menu", search_query: "menu pizza", created_at: "2026-01-03" },
      { event_type: "click", page_path: "/", target: "cta.home.open_menu", search_query: null, created_at: "2026-01-04" },
      { event_type: "click", page_path: "/", target: "cta.home.open_menu", search_query: null, created_at: "2026-01-05" },
      { event_type: "click", page_path: "/menu", target: "cta.sticky.call:0684069385", search_query: null, created_at: "2026-01-06" },
    ];

    const result = buildAnalyticsOverview(rows);
    expect(result.totalImpressions).toBe(3);
    expect(result.totalClicks).toBe(3);
    expect(result.ctr).toBe(100);
    expect(result.pages[0]).toEqual({
      page: "/",
      impressions: 2,
      clicks: 2,
      topSearch: "pizza",
    });
    expect(result.topTargets[0]).toEqual({ target: "cta.home.open_menu", clicks: 2 });
  });
});
