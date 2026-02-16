import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { extractSearchQuery, trackAnalyticsEvent } from "@/lib/analyticsEvents";

const SITE_URL = "https://pizzatiq.fr";

const upsertMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const PageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const canonicalUrl = `${SITE_URL}${path}`;

    let title = "Pizz'Atiq - Pizzeria a Sonchamp";
    let description = "Pizz'Atiq a Sonchamp: pizzas, burgers, tacos, livraison et commande par telephone.";
    let robots = "index,follow";

    if (path === "/menu") {
      title = "Menu Pizz'Atiq - Pizzas, Burgers, Tacos a Sonchamp";
      description = "Consultez le menu Pizz'Atiq a Sonchamp: pizzas, burgers, sandwichs, tacos, salades et supplements.";
    } else if (path === "/contact") {
      title = "Contact Pizz'Atiq - Sonchamp";
      description = "Adresse, telephones, horaires et livraison Pizz'Atiq a Sonchamp.";
    } else if (path === "/mentions-legales") {
      title = "Mentions legales - Pizz'Atiq";
      description = "Mentions legales et informations reglementaires du site Pizz'Atiq.";
    } else if (path === "/admin") {
      title = "Administration - Pizz'Atiq";
      description = "Espace d'administration Pizz'Atiq.";
      robots = "noindex,nofollow";
    } else if (path !== "/") {
      title = "Page introuvable - Pizz'Atiq";
      description = "La page demandee est introuvable.";
      robots = "noindex,nofollow";
    }

    document.title = title;
    upsertMeta("description", description);
    upsertMeta("author", "Pizz'Atiq");
    upsertMeta("robots", robots);
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:locale", "fr_FR", "property");
    upsertMeta("og:url", canonicalUrl, "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertLink("canonical", canonicalUrl);

    // Do not mix back-office traffic with customer analytics.
    const shouldTrackAnalytics = path !== "/admin";

    // SPA route changes are tracked manually so page_view is sent on each route transition.
    if (shouldTrackAnalytics && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: title,
        page_path: path,
        page_location: canonicalUrl,
      });
    }

    // Store source query when available so admin can see which searches drive page impressions.
    const searchQuery = extractSearchQuery(document.referrer || "");
    if (shouldTrackAnalytics) {
      trackAnalyticsEvent({
        event_type: "page_view",
        page_path: path,
        target: title,
        search_query: searchQuery,
        referrer: document.referrer || null,
      });
    }
  }, [location.pathname]);

  return null;
};

export default PageMeta;
