import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEventType = "page_view" | "click";

type AnalyticsEventInput = {
  event_type: AnalyticsEventType;
  page_path?: string | null;
  target?: string | null;
  search_query?: string | null;
  referrer?: string | null;
};

export const trackAnalyticsEvent = async (event: AnalyticsEventInput) => {
  try {
    // Fire-and-forget insert: analytics must never block user interactions.
    await supabase.from("analytics_events").insert({
      event_type: event.event_type,
      page_path: event.page_path ?? null,
      target: event.target ?? null,
      search_query: event.search_query ?? null,
      referrer: event.referrer ?? null,
    });
  } catch (err) {
    console.error("[Analytics] track failed", err);
  }
};

export const extractSearchQuery = (referrer: string): string | null => {
  if (!referrer) return null;
  try {
    // Keep this parser intentionally narrow to avoid storing noisy unknown params.
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes("google.")) return url.searchParams.get("q");
    if (host.includes("bing.com")) return url.searchParams.get("q");
    if (host.includes("yahoo.")) return url.searchParams.get("p");
    return null;
  } catch {
    return null;
  }
};
