import { describe, expect, it } from "vitest";
import { getLocaleFromPathname, getRouteKeyFromPathname, localizePath, toLanguageRoute } from "@/lib/i18n";

describe("i18n helpers", () => {
  it("detects locale from pathname", () => {
    expect(getLocaleFromPathname("/")).toBe("fr");
    expect(getLocaleFromPathname("/en/menu")).toBe("en");
  });

  it("maps known routes", () => {
    expect(getRouteKeyFromPathname("/menu")).toBe("menu");
    expect(getRouteKeyFromPathname("/en/legal-notice")).toBe("legal");
    expect(getRouteKeyFromPathname("/unknown")).toBeNull();
  });

  it("localizes route key", () => {
    expect(localizePath("news", "fr")).toBe("/actualites");
    expect(localizePath("news", "en")).toBe("/en/news");
  });

  it("switches language for known route", () => {
    expect(toLanguageRoute("/menu", "en")).toBe("/en/menu");
    expect(toLanguageRoute("/en/contact", "fr")).toBe("/contact");
  });
});
