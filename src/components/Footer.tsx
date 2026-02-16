import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";
import logoPizzatiq from "@/assets/logo_pizzatiq.jpg";

const Footer = () => (
  <footer className="relative border-t soft-divider bg-secondary/85 py-12">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_160%_at_50%_-30%,hsl(30_100%_50%_/_0.09),transparent_70%)]" />
    <div className="container relative mx-auto grid grid-cols-1 gap-5 px-4 md:grid-cols-3 md:gap-8">
      <section className="rounded-xl border border-border/60 bg-card/35 p-4 md:bg-transparent md:p-0">
        <div className="mb-4 inline-flex items-center gap-2.5">
          <img
            src={logoPizzatiq}
            alt="Logo Pizz'Atiq"
            className="h-9 w-9 rounded-md border border-border/65 bg-card p-0.5 object-contain"
          />
          <h3 className="font-display text-2xl leading-none text-gradient">Pizz'Atiq</h3>
        </div>
        <div className="mb-2 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>
            {restaurantInfo.address}, {restaurantInfo.city}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} className="shrink-0 text-primary" />
          <span>10:30-14:30 / 18:00-22:00</span>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card/35 p-4 md:bg-transparent md:p-0">
        <h4 className="mb-4 font-display text-xl text-foreground">Navigation</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Accueil</Link>
          <Link to="/menu" className="text-sm text-muted-foreground transition-colors hover:text-primary">Menu</Link>
          <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact</Link>
          <Link to="/mentions-legales" className="text-sm text-muted-foreground transition-colors hover:text-primary">Mentions legales</Link>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card/35 p-4 md:bg-transparent md:p-0">
        <h4 className="mb-4 font-display text-xl text-foreground">Livraison</h4>
        <p className="text-sm leading-6 text-muted-foreground">
          Livraison disponible dans un rayon de 20 km autour de Sonchamp.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Frais de livraison : 1,50EUR
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Horaires : 11:00-14:30 / 18:00-22:00
        </p>
      </section>
    </div>

    <div className="container mx-auto mt-8 border-t soft-divider px-4 pt-8 text-center text-xs text-muted-foreground">
      Copyright {new Date().getFullYear()} Pizz'Atiq - Tous droits reserves
    </div>
  </footer>
);

export default Footer;
