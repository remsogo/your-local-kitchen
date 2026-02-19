import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, MapPin, Truck, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import heroBgWebp from "@/assets/hero-bg.webp";
import { openingHours, deliveryZones, deliveryHours } from "@/data/menuData";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";
import DeliveryAreaSeo from "@/components/DeliveryAreaSeo";
import ReviewHighlight from "@/components/ReviewHighlight";
import { getBusinessStatus } from "@/lib/businessStatus";
import { getLocaleFromPathname, localizePath } from "@/lib/i18n";

const openingDayLabelsEn: Record<string, string> = {
  Lundi: "Monday",
  Mardi: "Tuesday",
  Mercredi: "Wednesday",
  Jeudi: "Thursday",
  Vendredi: "Friday",
  Samedi: "Saturday",
  Dimanche: "Sunday",
};

const Index = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const [menuCtaVariant, setMenuCtaVariant] = useState<"voir" | "decouvrir">("voir");
  const [businessStatus, setBusinessStatus] = useState(() => getBusinessStatus(locale));

  useEffect(() => {
    const key = `home_menu_cta_variant_${locale}`;
    const existing = window.localStorage.getItem(key);
    if (existing === "voir" || existing === "decouvrir") {
      setMenuCtaVariant(existing);
      return;
    }
    const variant = Math.random() < 0.5 ? "voir" : "decouvrir";
    window.localStorage.setItem(key, variant);
    setMenuCtaVariant(variant);
  }, [locale]);

  useEffect(() => {
    setBusinessStatus(getBusinessStatus(locale));
    const interval = window.setInterval(() => {
      setBusinessStatus(getBusinessStatus(locale));
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [locale]);

  const labels = useMemo(
    () =>
      locale === "fr"
        ? {
            heading: "Pizz'Atiq",
            description:
              "Snack local a Sonchamp: pizzas, burgers, sandwichs et tacos, sur place, a emporter et en livraison.",
            heroAlt: "Pizza artisanale cuite au four a Sonchamp, specialite de Pizz'Atiq",
            promoBadge: "Promo lun-jeu",
            promoText:
              "OFFRES PIZZA SENIOR (du lundi au jeudi) : 1 pizza Senior achetee = la 2eme Senior a -50% / 2 pizzas Senior achetees = la 3eme Senior offerte (a emporter seulement).",
            menuLine: "Pizza - Burger - Sandwich - Tacos",
            address: "58 Rue Andre Thome, 78120 Sonchamp",
            viewMenu: menuCtaVariant === "voir" ? "Voir le menu" : "Decouvrir le menu",
            contact: "Nous contacter",
            openingHours: "Nos Horaires",
            delivery: "Livraison",
            deliverySchedulePrefix: "Horaires de livraison",
            deliveryNote: "Livraison disponible dans toute ville a 20 km ou moins de Sonchamp.",
          }
        : {
            heading: "Pizz'Atiq",
            description:
              "Local snack in Sonchamp: pizzas, burgers, sandwiches and tacos for dine-in, takeaway and delivery.",
            heroAlt: "Wood-fired artisanal pizza in Sonchamp, Pizz'Atiq specialty",
            promoBadge: "Mon-Thu promo",
            promoText:
              "SENIOR PIZZA OFFER (Monday to Thursday): buy 1 Senior pizza, get 50% off the second / buy 2, get the third free (takeaway only).",
            menuLine: "Pizza - Burger - Sandwich - Tacos",
            address: "58 Rue Andre Thome, 78120 Sonchamp",
            viewMenu: menuCtaVariant === "voir" ? "View menu" : "Discover menu",
            contact: "Contact us",
            openingHours: "Opening Hours",
            delivery: "Delivery",
            deliverySchedulePrefix: "Delivery hours",
            deliveryNote: "Delivery available in towns within 20 km from Sonchamp.",
          },
    [locale, menuCtaVariant],
  );
  const localizedOpeningHours = useMemo(
    () =>
      openingHours.map((item) => ({
        ...item,
        day: locale === "fr" ? item.day : (openingDayLabelsEn[item.day] ?? item.day),
      })),
    [locale],
  );

  const menuPath = localizePath("menu", locale);
  const contactPath = localizePath("contact", locale);
  const statusClass = businessStatus.isOpen
    ? "border-green-400/40 bg-green-500/15 text-green-300"
    : "border-red-400/40 bg-red-500/15 text-red-300";

  return (
    <div className="min-h-screen pt-32" data-testid="home-page">
      <section className="relative isolate flex min-h-[calc(100vh-7.5rem)] items-center justify-center overflow-hidden">
        <picture>
          <source srcSet={heroBgWebp} type="image/webp" />
          <img
            src={heroBg}
            alt={labels.heroAlt}
            className="absolute inset-0 h-full w-full object-cover object-center md:scale-[1.03]"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 w-full max-w-4xl animate-fade-in px-4 text-center">
          <h1
            className="mb-3 font-display text-6xl text-gradient drop-shadow-[0_0_18px_hsl(30_100%_50%_/_0.22)] sm:text-8xl"
            data-testid="home-title"
          >
            {labels.heading}
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-base text-foreground/95 sm:text-[1.2rem]">
            {labels.description}
          </p>
          <div className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary promo-badge">
            {labels.promoBadge}
          </div>
          <p className="promo-banner mx-auto mb-5 max-w-3xl rounded-xl px-4 py-3 text-base font-medium text-white sm:text-[1.08rem]">
            {labels.promoText}
          </p>
          <p className="mb-2 text-2xl text-foreground/95 sm:text-3xl">{labels.menuLine}</p>
          <p className="mb-4 text-base text-muted-foreground">{labels.address}</p>
          <div className={`mx-auto mb-8 inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${statusClass}`}>
            {businessStatus.label} - {businessStatus.detail}
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={menuPath}
              data-testid="home-cta-menu"
              onClick={() =>
                trackAnalyticsEvent({
                  event_type: "click",
                  page_path: location.pathname,
                  target: `cta.home.open_menu:${menuCtaVariant}`,
                })
              }
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-primary/70 bg-primary px-8 py-3 text-xl font-semibold text-primary-foreground shadow-[0_18px_32px_-24px_hsl(30_100%_50%_/_0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
            >
              {labels.viewMenu} <ChevronRight size={20} />
            </Link>
            <Link
              to={contactPath}
              data-testid="home-cta-contact"
              onClick={() =>
                trackAnalyticsEvent({ event_type: "click", page_path: location.pathname, target: "cta.home.open_contact" })
              }
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-background/30 px-8 py-3 text-xl font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-background/45"
            >
              {labels.contact}
            </Link>
          </div>

          <ReviewHighlight locale={locale} />
        </div>
      </section>

      <section className="py-20" data-testid="home-opening-hours">
        <div className="container mx-auto px-4">
          <div className="section-shell mx-auto max-w-5xl rounded-2xl p-6 sm:p-8">
            <h2 className="mb-10 text-center font-display text-4xl text-gradient sm:text-5xl">
              <Clock className="mr-3 inline text-primary" size={36} />
              {labels.openingHours}
            </h2>
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-background/45 p-5 backdrop-blur-sm">
              <div className="space-y-3">
                {localizedOpeningHours.map((item) => (
                  <div key={item.day} className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{item.day}</span>
                    <span className="text-muted-foreground">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20" data-testid="home-delivery">
        <div className="container mx-auto px-4">
          <div className="section-shell mx-auto max-w-5xl rounded-2xl p-6 sm:p-8">
            <h2 className="mb-4 text-center font-display text-4xl text-gradient sm:text-5xl">
              <Truck className="mr-3 inline text-primary" size={36} />
              {labels.delivery}
            </h2>
            <p className="mb-10 text-center text-body-muted">
              {labels.deliverySchedulePrefix}: {deliveryHours}
            </p>

            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              {deliveryZones.map((zone) => (
                <div
                  key={zone.zone}
                  className="rounded-xl border border-white/10 bg-background/45 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_20px_30px_-26px_hsl(30_100%_50%_/_0.9)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <h3 className="font-semibold text-foreground">{zone.zone}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Commande minimum" : "Minimum order"}:{" "}
                    <span className="font-medium text-foreground">{zone.minOrder}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Frais de livraison" : "Delivery fee"}:{" "}
                    <span className="font-medium text-primary">{zone.deliveryFee}</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {labels.deliveryNote}
            </p>
          </div>
        </div>
      </section>

      <div className="pb-20">
        <div className="container mx-auto px-4">
          <DeliveryAreaSeo locale={locale} />
        </div>
      </div>
    </div>
  );
};

export default Index;
