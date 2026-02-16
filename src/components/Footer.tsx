import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";
import logoPizzatiq from "@/assets/logo_pizzatiq.jpg";

const Footer = () => (
  <footer className="bg-secondary border-t border-border py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="mb-4 inline-flex items-center gap-2">
          <img
            src={logoPizzatiq}
            alt="Logo Pizz'Atiq"
            className="h-8 w-8 rounded-md object-cover"
          />
          <h3 className="font-display text-2xl text-gradient">Pizz'Atiq</h3>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground text-sm mb-2">
          <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>{restaurantInfo.address}, {restaurantInfo.city}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock size={16} className="shrink-0 text-primary" />
          <span>10:30-14:30 / 18:00-22:00</span>
        </div>
      </div>

      <div>
        <h4 className="font-display text-xl text-foreground mb-4">Navigation</h4>
        <div className="flex flex-col gap-2">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
          <Link to="/menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">Menu</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          <Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mentions legales</Link>
        </div>
      </div>

      <div>
        <h4 className="font-display text-xl text-foreground mb-4">Livraison</h4>
        <p className="text-sm text-muted-foreground">
          Livraison disponible dans un rayon de 20 km autour de Sonchamp.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Frais de livraison : 1,50EUR
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Horaires : 11:00-14:30 / 18:00-22:00
        </p>
      </div>
    </div>

    <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
      Copyright {new Date().getFullYear()} Pizz'Atiq - Tous droits reserves
    </div>
  </footer>
);

export default Footer;
