import { MapPin, Clock, Phone, Globe } from "lucide-react";
import { useLocation } from "react-router-dom";
import { restaurantInfo, deliveryHours } from "@/data/menuData";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";

const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
  .map((n) => n.trim())
  .filter(Boolean);

const Contact = () => {
  const location = useLocation();

  const trackClick = (target: string) => {
    trackAnalyticsEvent({
      event_type: "click",
      page_path: location.pathname,
      target,
    });
  };

  return (
    <div className="min-h-screen pt-40 pb-16 sm:pt-32">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-display text-5xl sm:text-6xl text-gradient text-center mb-12">Contact</h1>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 card-glow">
            <h2 className="font-display text-2xl text-foreground mb-4">Nous trouver</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>
                  {restaurantInfo.address}, {restaurantInfo.city}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock size={18} className="text-primary shrink-0" />
                <span>10:30-14:30 / 18:00-22:00 (tous les jours)</span>
              </div>
              {phoneNumbers.map((phone) => (
                <div key={phone} className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={18} className="text-primary shrink-0" />
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    onClick={() => trackClick(`cta.contact.call:${phone}`)}
                    className="hover:text-primary transition-colors font-medium"
                  >
                    {phone}
                  </a>
                </div>
              ))}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe size={18} className="text-primary shrink-0" />
                <a
                  href={`https://${restaurantInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("cta.contact.open_website")}
                  className="hover:text-primary transition-colors"
                >
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
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {phoneNumbers.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  onClick={() => trackClick(`cta.contact.order_call:${phone}`)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
                  aria-label={`Appeler ${restaurantInfo.name}`}
                >
                  <Phone size={16} />
                  Commander : {phone}
                </a>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">Nous livrons dans toutes les villes a 20 km ou moins de Sonchamp.</p>
            <p className="text-muted-foreground text-sm mt-2">
              Horaires de livraison : <span className="text-foreground font-medium">{deliveryHours}</span>
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Frais de livraison : <span className="text-primary font-medium">1,50EUR</span> - Minimum de commande de 20EUR a 35EUR selon la distance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
