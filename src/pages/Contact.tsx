import { MapPin, Clock, Phone, Globe } from "lucide-react";
import { restaurantInfo, deliveryHours } from "@/data/menuData";

const Contact = () => (
  <div className="min-h-screen pt-20 pb-16">
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="font-display text-5xl sm:text-6xl text-gradient text-center mb-12">Contact</h1>

      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 card-glow">
          <h2 className="font-display text-2xl text-foreground mb-4">Nous trouver</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin size={18} className="text-primary shrink-0" />
              <span>{restaurantInfo.address}, {restaurantInfo.city}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock size={18} className="text-primary shrink-0" />
              <span>10:30–14:30 / 18:00–22:00 (tous les jours)</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe size={18} className="text-primary shrink-0" />
              <a href={`https://${restaurantInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                {restaurantInfo.website}
              </a>
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div className="bg-card rounded-xl overflow-hidden card-glow">
          <iframe
            title="Localisation Pizz'Atiq"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2638.5!2d1.8614!3d48.5818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDM0JzU0LjUiTiAxwrA1MScxNy4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="bg-card rounded-xl p-6 card-glow">
          <h2 className="font-display text-2xl text-foreground mb-4">Livraison</h2>
          <p className="text-muted-foreground text-sm">
            Nous livrons dans toutes les villes à 20 km ou moins de Sonchamp.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Horaires de livraison : <span className="text-foreground font-medium">{deliveryHours}</span>
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Frais de livraison : <span className="text-primary font-medium">1,50€</span> — Minimum de commande de 20€ à 35€ selon la distance.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
