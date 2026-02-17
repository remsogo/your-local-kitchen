import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEventType = "page_view" | "click";

type AnalyticsEventInput = {
  event_type: AnalyticsEventType;
  page_path?: string | null;
  target?: string | null;
  search_query?: string | null;
  referrer?: string | null;
};

type GaClickPayload = {
  eventName: string;
  params: Record<string, string>;
};

const toSafeParamValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

export const toGaClickPayload = (target: string, pagePath: string): GaClickPayload => {
  if (target.startsWith("menu.tab.select:")) {
    const category = target.split(":")[1] || "unknown";
    return {
      eventName: "menu_tab_click",
      params: {
        page_path: pagePath,
        menu_category: toSafeParamValue(category),
      },
    };
  }

  if (target.startsWith("cta.home.open_menu")) {
    const variant = target.split(":")[1] || "voir";
    return {
      eventName: "home_menu_cta_click",
      params: {
        page_path: pagePath,
        variant: toSafeParamValue(variant),
      },
    };
  }

  if (target.startsWith("cta.home.open_contact")) {
    return {
      eventName: "home_contact_cta_click",
      params: { page_path: pagePath },
    };
  }

  if (target.startsWith("cta.contact.open_website")) {
    return {
      eventName: "website_click",
      params: { page_path: pagePath },
    };
  }

  if (target.startsWith("cta.contact.form_mailto")) {
    return {
      eventName: "contact_form_mailto_click",
      params: { page_path: pagePath },
    };
  }

  if (target.startsWith("language.switch:")) {
    const locale = target.split(":")[1] || "fr";
    return {
      eventName: "language_switch_click",
      params: {
        page_path: pagePath,
        locale: toSafeParamValue(locale),
      },
    };
  }

  const callMatch = target.match(/^cta\.(sticky|contact)\.(?:call|order_call):(.+)$/);
  if (callMatch) {
    const source = callMatch[1];
    const phone = callMatch[2].replace(/[^\d+]/g, "");
    return {
      eventName: "call_click",
      params: {
        page_path: pagePath,
        call_source: toSafeParamValue(source),
        phone_number: phone,
      },
    };
  }

  return {
    eventName: "interaction_click",
    params: {
      page_path: pagePath,
      target: toSafeParamValue(target || "unknown"),
    },
  };
};

const sendGaEvent = (event: AnalyticsEventInput) => {
  if (event.event_type !== "click") return;
  if (event.page_path === "/admin") return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const pagePath = event.page_path || "/";
  const target = event.target || "unknown";
  const payload = toGaClickPayload(target, pagePath);
  const debugMode = import.meta.env.VITE_GA_DEBUG_MODE === "true";

  window.gtag("event", payload.eventName, {
    ...payload.params,
    debug_mode: debugMode,
  });
};

export const trackAnalyticsEvent = async (event: AnalyticsEventInput) => {
  sendGaEvent(event);
  try {
    // Fire-and-forget insert: analytics must never block user interactions.
    // Target naming convention: "<area>.<surface>.<action>[:detail]".
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
