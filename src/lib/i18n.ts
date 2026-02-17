export type Locale = "fr" | "en";

export type RouteKey = "home" | "menu" | "contact" | "legal" | "news";

export const localizedRoutes: Record<RouteKey, Record<Locale, string>> = {
  home: { fr: "/", en: "/en" },
  menu: { fr: "/menu", en: "/en/menu" },
  contact: { fr: "/contact", en: "/en/contact" },
  legal: { fr: "/mentions-legales", en: "/en/legal-notice" },
  news: { fr: "/actualites", en: "/en/news" },
};

export const getLocaleFromPathname = (pathname: string): Locale =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";

export const localizePath = (route: RouteKey, locale: Locale): string => localizedRoutes[route][locale];

export const getRouteKeyFromPathname = (pathname: string): RouteKey | null => {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  for (const [route, variants] of Object.entries(localizedRoutes) as Array<[RouteKey, Record<Locale, string>]>) {
    if (variants.fr === normalized || variants.en === normalized) return route;
  }
  return null;
};

export const toLanguageRoute = (pathname: string, locale: Locale): string => {
  const routeKey = getRouteKeyFromPathname(pathname);
  if (!routeKey) return locale === "fr" ? "/" : "/en";
  return localizePath(routeKey, locale);
};
