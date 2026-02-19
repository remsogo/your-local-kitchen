import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoPizzatiq from "@/assets/logo_pizzatiq.webp";
import { getLocaleFromPathname, Locale, toLanguageRoute } from "@/lib/i18n";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";

type NavLinkItem = { to: string; label: string; testId: string };

const navLinksByLocale: Record<Locale, NavLinkItem[]> = {
  fr: [
    { to: "/", label: "Accueil", testId: "nav-link-home" },
    { to: "/menu", label: "Menu", testId: "nav-link-menu" },
    { to: "/contact", label: "Contact", testId: "nav-link-contact" },
    { to: "/actualites", label: "Actualites", testId: "nav-link-news" },
    { to: "/mentions-legales", label: "Mentions legales", testId: "nav-link-legal" },
  ],
  en: [
    { to: "/en", label: "Home", testId: "nav-link-home" },
    { to: "/en/menu", label: "Our Menu", testId: "nav-link-menu" },
    { to: "/en/contact", label: "Contact", testId: "nav-link-contact" },
    { to: "/en/news", label: "News", testId: "nav-link-news" },
    { to: "/en/legal-notice", label: "Legal Notice", testId: "nav-link-legal" },
  ],
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const navLinks = navLinksByLocale[locale];
  const switchLocale = locale === "fr" ? "en" : "fr";
  const switchPath = toLanguageRoute(location.pathname, switchLocale);
  const switchLabel = locale === "fr" ? "EN" : "FR";
  const homePath = locale === "fr" ? "/" : "/en";
  const isLinkActive = (to: string) => {
    if (to === "/" || to === "/en") return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <header
      data-testid="site-header"
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/90 shadow-[0_10px_28px_-24px_hsl(30_100%_50%_/_0.6)] backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={homePath} className="group inline-flex items-center gap-2" data-testid="brand-link-home">
          <img
            src={logoPizzatiq}
            alt={
              locale === "fr"
                ? "Logo Pizz'Atiq, snack pizza et kebab a Sonchamp"
                : "Pizz'Atiq logo, pizza, kebab and snack in Sonchamp"
            }
            className="h-10 w-10 rounded-lg border border-border/70 bg-card/95 p-0.5 object-contain shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
          />
          <span className="font-display text-[2.02rem] leading-none text-gradient tracking-[0.04em] sm:text-[2.22rem]">
            Pizz'Atiq
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" data-testid="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-testid={link.testId}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                isLinkActive(link.to)
                  ? "text-primary after:absolute after:-bottom-[10px] after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={switchPath}
            data-testid="language-switch-desktop"
            onClick={() =>
              trackAnalyticsEvent({
                event_type: "click",
                page_path: location.pathname,
                target: `language.switch:${switchLocale}`,
              })
            }
            className="rounded-md border border-border/70 bg-card/80 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            aria-label={locale === "fr" ? "Switch to English" : "Passer en francais"}
          >
            {switchLabel}
          </Link>
        </nav>

        <button
          className="rounded-md p-1.5 text-foreground transition-colors hover:bg-secondary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={locale === "fr" ? "Menu de navigation" : "Navigation menu"}
          data-testid="mobile-nav-toggle"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-b border-border/80 bg-background/98 md:hidden" data-testid="mobile-nav-panel">
          <Link
            to={switchPath}
            data-testid="language-switch-mobile"
            onClick={() => {
              setOpen(false);
              trackAnalyticsEvent({
                event_type: "click",
                page_path: location.pathname,
                target: `language.switch:${switchLocale}`,
              });
            }}
            className="block px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary/70"
          >
            {locale === "fr" ? "Version anglaise" : "French version"}
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-testid={`mobile-${link.testId}`}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary/70 ${
                isLinkActive(link.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
