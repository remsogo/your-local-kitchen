import { Link } from "react-router-dom";
import { Clock, MapPin, Truck, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { openingHours, deliveryZones, deliveryHours } from "@/data/menuData";

const Index = () => {
  return (
    <div className="min-h-screen pt-32">
      <section className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Pizza artisanale" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 animate-fade-in px-4 text-center">
          <h1 className="mb-4 font-display text-5xl text-gradient sm:text-7xl">Pizz'Atiq</h1>
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Promo lun-jeu
          </div>
          <p className="mx-auto mb-4 max-w-3xl rounded-lg border border-border/70 bg-background/40 px-4 py-3 text-sm text-foreground sm:text-base">
            OFFRES PIZZA SENIOR (du lundi au jeudi) : 1 pizza Senior achetee = la 2eme Senior a -50% / 2 pizzas Senior achetees = la 3eme Senior offerte (a emporter seulement).
          </p>
          <p className="mb-2 text-lg text-foreground/80 sm:text-xl">Pizza - Burger - Sandwich - Tacos</p>
          <p className="mb-8 text-sm text-muted-foreground">58 Rue Andre Thome, 78120 Sonchamp</p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Voir le menu <ChevronRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <section className="section-dark py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-4xl text-gradient sm:text-5xl">
            <Clock className="mr-3 inline text-primary" size={36} />
            Nos Horaires
          </h2>
          <div className="card-glow mx-auto max-w-lg rounded-xl bg-card p-6">
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
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center font-display text-4xl text-gradient sm:text-5xl">
            <Truck className="mr-3 inline text-primary" size={36} />
            Livraison
          </h2>
          <p className="mb-12 text-center text-muted-foreground">Horaires de livraison : {deliveryHours}</p>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {deliveryZones.map((zone) => (
              <div key={zone.zone} className="card-glow rounded-xl bg-card p-5">
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
      </section>
    </div>
  );
};

export default Index;
