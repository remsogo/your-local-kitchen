import { Link } from "react-router-dom";
import { Clock, MapPin, Truck, ChevronRight, Phone } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { openingHours, deliveryZones, deliveryHours, restaurantInfo } from "@/data/menuData";

const Index = () => {
  const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
    .map((n) => n.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Pizza artisanale" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="font-display text-6xl sm:text-8xl text-gradient mb-4">Pizz'Atiq</h1>
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Promo lun-jeu
          </div>
          <p className="mx-auto mb-4 max-w-3xl rounded-lg border border-border/70 bg-background/40 px-4 py-3 text-sm sm:text-base text-foreground">
            OFFRES PIZZA (du lundi au jeudi) : 1 pizza achetée = la 2ème à -50% / 2 pizzas achetées = la 3ème offerte (à emporter seulement).
          </p>
          <p className="text-lg sm:text-xl text-foreground/80 mb-2">Pizza • Burger • Sandwich • Tacos</p>
          <p className="text-sm text-muted-foreground mb-8">58 Rue André Thome, 78120 Sonchamp</p>

          <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
            {phoneNumbers.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
                aria-label={`Appeler ${restaurantInfo.name}`}
              >
                <Phone size={18} />
                Commander : {phone}
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-secondary transition-colors"
            >
              Voir le menu <ChevronRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-secondary transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Horaires */}
      <section className="section-dark py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl sm:text-5xl text-center text-gradient mb-12">
            <Clock className="inline mr-3 text-primary" size={36} />
            Nos Horaires
          </h2>
          <div className="max-w-lg mx-auto bg-card rounded-xl p-6 card-glow">
            <div className="space-y-3">
              {openingHours.map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{item.day}</span>
                  <span className="text-muted-foreground">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Livraison */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl sm:text-5xl text-center text-gradient mb-4">
            <Truck className="inline mr-3 text-primary" size={36} />
            Livraison
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Horaires de livraison : {deliveryHours}
          </p>

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deliveryZones.map((zone) => (
              <div key={zone.zone} className="bg-card rounded-xl p-5 card-glow">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  <h3 className="font-semibold text-foreground">{zone.zone}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Commande minimum : <span className="text-foreground font-medium">{zone.minOrder}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Frais de livraison : <span className="text-primary font-medium">{zone.deliveryFee}</span>
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Livraison disponible dans toute ville à 20 km ou moins de Sonchamp.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
