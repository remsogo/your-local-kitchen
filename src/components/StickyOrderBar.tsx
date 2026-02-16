import { Phone } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";
import { useLocation } from "react-router-dom";

const StickyOrderBar = () => {
  const location = useLocation();
  const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
    .map((n) => n.trim())
    .filter(Boolean);

  if (phoneNumbers.length === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-16 z-40 border-b border-primary/25 bg-background/82 backdrop-blur-md">
      <div className="container mx-auto flex h-12 items-center gap-2 overflow-x-auto px-4">
        <span className="hidden shrink-0 rounded-full border border-border/70 bg-card/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline-flex">
          Commande rapide
        </span>
        {phoneNumbers.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            onClick={() =>
              trackAnalyticsEvent({
                event_type: "click",
                page_path: location.pathname,
                target: `cta.sticky.call:${phone}`,
              })
            }
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/55 bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_8px_18px_-14px_hsl(30_100%_50%_/_0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 sm:px-4 sm:text-sm"
            aria-label={`Commander au ${phone}`}
          >
            <Phone size={14} />
            <span className="sm:hidden">{phone}</span>
            <span className="hidden sm:inline">Commander: {phone}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default StickyOrderBar;
