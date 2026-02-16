import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Truck, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { openingHours, deliveryZones, deliveryHours } from "@/data/menuData";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";

const Index = () => {
  const [menuCtaVariant, setMenuCtaVariant] = useState<"voir" | "decouvrir">("voir");

  useEffect(() => {
    const key = "home_menu_cta_variant";
    const existing = window.localStorage.getItem(key);
    if (existing === "voir" || existing === "decouvrir") {
      setMenuCtaVariant(existing);
      return;
    }
    const variant = Math.random() < 0.5 ? "voir" : "decouvrir";
    window.localStorage.setItem(key, variant);
    setMenuCtaVariant(variant);
  }, []);

  const menuCtaLabel = menuCtaVariant === "voir" ? "Voir le menu" : "Decouvrir le menu";

  return (
    <div className="min-h-screen pt-32">
      <section className="relative isolate flex min-h-[calc(100vh-7.5rem)] items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Pizza artisanale"
          className="absolute inset-0 h-full w-full object-cover object-center md:scale-[1.03]"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 w-full max-w-4xl animate-fade-in px-4 text-center">
          <h1 className="mb-3 font-display text-6xl text-gradient drop-shadow-[0_0_18px_hsl(30_100%_50%_/_0.22)] sm:text-8xl">
            Pizz'Atiq
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-sm text-foreground/90 sm:text-base">
            Snack local a Sonchamp: pizzas, burgers, sandwichs et tacos, sur place, a emporter et en livraison.
          </p>
          <div className="mb-3 inline-flex items-center rounded-full border border-primary/45 bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Promo lun-jeu
          </div>
          <p className="glass-panel mx-auto mb-5 max-w-3xl rounded-xl px-4 py-3 text-sm text-foreground sm:text-base">
            OFFRES PIZZA SENIOR (du lundi au jeudi) : 1 pizza Senior achetee = la 2eme Senior a -50% / 2 pizzas Senior achetees = la 3eme Senior offerte (a emporter seulement).
          </p>
          <p className="mb-2 text-lg text-foreground/90 sm:text-xl">Pizza - Burger - Sandwich - Tacos</p>
          <p className="mb-8 text-sm text-muted-foreground">58 Rue Andre Thome, 78120 Sonchamp</p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/menu"
              onClick={() =>
                trackAnalyticsEvent({
                  event_type: "click",
                  page_path: "/",
                  target: `cta.home.open_menu:${menuCtaVariant}`,
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/70 bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-[0_18px_32px_-24px_hsl(30_100%_50%_/_0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
            >
              {menuCtaLabel} <ChevronRight size={20} />
            </Link>
            <Link
              to="/contact"
              onClick={() => trackAnalyticsEvent({ event_type: "click", page_path: "/", target: "cta.home.open_contact" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-background/30 px-8 py-3 text-lg font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-background/45"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="section-shell mx-auto max-w-5xl rounded-2xl p-6 sm:p-8">
            <h2 className="mb-10 text-center font-display text-4xl text-gradient sm:text-5xl">
              <Clock className="mr-3 inline text-primary" size={36} />
              Nos Horaires
            </h2>
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-background/45 p-5 backdrop-blur-sm">
              <div className="space-y-3">
                {openingHours.map((item) => (
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

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="section-shell mx-auto max-w-5xl rounded-2xl p-6 sm:p-8">
            <h2 className="mb-4 text-center font-display text-4xl text-gradient sm:text-5xl">
              <Truck className="mr-3 inline text-primary" size={36} />
              Livraison
            </h2>
            <p className="mb-10 text-center text-muted-foreground">Horaires de livraison : {deliveryHours}</p>

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
                    Commande minimum : <span className="font-medium text-foreground">{zone.minOrder}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Frais de livraison : <span className="font-medium text-primary">{zone.deliveryFee}</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Livraison disponible dans toute ville a 20 km ou moins de Sonchamp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
