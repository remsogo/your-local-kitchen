import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { extractSearchQuery, trackAnalyticsEvent } from "@/lib/analyticsEvents";
import { DELIVERY_MAX_KM } from "@/lib/delivery";
import { getLocaleFromPathname, getRouteKeyFromPathname, localizePath, type Locale } from "@/lib/i18n";

const SITE_URL = "https://www.pizzatiq.fr";

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

const upsertAlternate = (hreflang: string, href: string) => {
  let tag = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "alternate");
    tag.setAttribute("hreflang", hreflang);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const removeAlternateLinks = () => {
  document
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((node) => node.parentElement?.removeChild(node));
};

const copyByLocale = (locale: Locale) =>
  locale === "fr"
    ? {
        homeTitle: "Pizz'Atiq - Snack, Kebab, Pizza et Restaurant a Sonchamp",
        homeDescription:
          `Snack, kebab, pizza et restaurant a Sonchamp. Pizz'Atiq: menu, horaires et livraison dans un rayon de ${DELIVERY_MAX_KM} km autour de Sonchamp.`,
        menuTitle: "Menu Pizz'Atiq - Pizza, Kebab, Snack et Restaurant a Sonchamp",
        menuDescription:
          "Menu snack a Sonchamp: pizzas, kebabs, burgers, sandwichs, tacos, salades et supplements. Livraison locale autour de Sonchamp.",
        contactTitle: "Contact Pizz'Atiq - Snack, Kebab, Pizza a Sonchamp",
        contactDescription:
          `Adresse, telephones, horaires et zone de livraison Pizz'Atiq a Sonchamp et autour (${DELIVERY_MAX_KM} km).`,
        legalTitle: "Mentions legales - Pizz'Atiq",
        legalDescription: "Mentions legales, RGPD et informations reglementaires du site Pizz'Atiq.",
        newsTitle: "Actualites Pizz'Atiq - Offres et infos locales",
        newsDescription: "Offres, informations et nouveautes Pizz'Atiq a Sonchamp.",
      }
    : {
        homeTitle: "Pizz'Atiq - Pizza, Kebab and Snack in Sonchamp",
        homeDescription:
          `Local snack in Sonchamp with pizzas, kebab, burgers and delivery within ${DELIVERY_MAX_KM} km around Sonchamp.`,
        menuTitle: "Pizz'Atiq Menu - Pizza, Kebab, Burgers and Tacos",
        menuDescription:
          "Browse Pizz'Atiq menu in Sonchamp: pizzas, kebab, burgers, sandwiches, tacos and extras.",
        contactTitle: "Contact Pizz'Atiq - Sonchamp",
        contactDescription: "Address, phones, opening hours and delivery area around Sonchamp.",
        legalTitle: "Legal Notice - Pizz'Atiq",
        legalDescription: "Legal notice, GDPR and regulatory information for Pizz'Atiq.",
        newsTitle: "Pizz'Atiq News - Offers and local updates",
        newsDescription: "Latest offers and local updates from Pizz'Atiq in Sonchamp.",
      };

const PageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const locale = getLocaleFromPathname(path);
    const routeKey = getRouteKeyFromPathname(path);
    const canonicalUrl = `${SITE_URL}${path}`;
    const copy = copyByLocale(locale);
    document.documentElement.lang = locale;

    let title = copy.homeTitle;
    let description = copy.homeDescription;
    let keywords =
      "snack Sonchamp, kebab Sonchamp, pizza Sonchamp, restaurant Sonchamp, livraison Sonchamp, snack Rambouillet, kebab Rambouillet";
    let robots = "index,follow";

    if (routeKey === "menu") {
      title = copy.menuTitle;
      description = copy.menuDescription;
      keywords = "menu pizza Sonchamp, menu kebab Sonchamp, snack Sonchamp menu, restaurant Sonchamp menu";
    } else if (routeKey === "contact") {
      title = copy.contactTitle;
      description = copy.contactDescription;
      keywords = "contact snack Sonchamp, livraison kebab Sonchamp, pizza Rambouillet livraison";
    } else if (routeKey === "legal") {
      title = copy.legalTitle;
      description = copy.legalDescription;
      keywords = "mentions legales pizzeria Sonchamp, rgpd snack Sonchamp";
    } else if (routeKey === "news") {
      title = copy.newsTitle;
      description = copy.newsDescription;
      keywords = "actualites pizzeria Sonchamp, promo pizza Sonchamp";
    } else if (path === "/admin") {
      title = "Administration - Pizz'Atiq";
      description = "Espace d'administration Pizz'Atiq.";
      robots = "noindex,nofollow";
    } else if (!routeKey && path !== "/") {
      title = locale === "fr" ? "Page introuvable - Pizz'Atiq" : "Page not found - Pizz'Atiq";
      description = locale === "fr" ? "La page demandee est introuvable." : "The requested page cannot be found.";
      robots = "noindex,nofollow";
    }

    document.title = title;
    upsertMeta("description", description);
    upsertMeta("keywords", keywords);
    upsertMeta("author", "Pizz'Atiq");
    upsertMeta("robots", robots);
    upsertMeta("geo.region", "FR-78");
    upsertMeta("geo.placename", "Sonchamp");
    upsertMeta("geo.position", "48.575896;1.878415");
    upsertMeta("ICBM", "48.575896, 1.878415");
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:locale", locale === "fr" ? "fr_FR" : "en_GB", "property");
    upsertMeta("og:url", canonicalUrl, "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertLink("canonical", canonicalUrl);

    removeAlternateLinks();
    if (routeKey) {
      const frPath = localizePath(routeKey, "fr");
      const enPath = localizePath(routeKey, "en");
      upsertAlternate("fr", `${SITE_URL}${frPath}`);
      upsertAlternate("en", `${SITE_URL}${enPath}`);
      upsertAlternate("x-default", `${SITE_URL}${frPath}`);
    }

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
