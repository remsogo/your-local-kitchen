import { MapPin, Clock, Phone, Globe } from "lucide-react";
import { restaurantInfo, deliveryHours } from "@/data/menuData";

const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
  .map((n) => n.trim())
  .filter(Boolean);

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
            {phoneNumbers.map((phone) => (
              <div key={phone} className="flex items-center gap-3 text-muted-foreground">
                <Phone size={18} className="text-primary shrink-0" />
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-primary transition-colors font-medium">
                  {phone}
                </a>
              </div>
            ))}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe size={18} className="text-primary shrink-0" />
              <a href={`https://${restaurantInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                {restaurantInfo.website}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl overflow-hidden card-glow">
          <iframe
            title="Localisation Pizz'Atiq"
            src="https://maps.google.com/maps?q=58%20Rue%20Andr%C3%A9%20Thome%2C%2078120%20Sonchamp&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
          <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {phoneNumbers.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                aria-label={`Appeler ${restaurantInfo.name}`}
              >
                <Phone size={16} />
                Commander : {phone}
              </a>
            ))}
          </div>
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
