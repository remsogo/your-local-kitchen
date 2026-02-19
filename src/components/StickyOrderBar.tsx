import { Phone } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";
import { useLocation } from "react-router-dom";
import { getLocaleFromPathname } from "@/lib/i18n";

const StickyOrderBar = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
    .map((n) => n.trim())
    .filter(Boolean);

  if (phoneNumbers.length === 0) return null;

  return (
    <div
      className="fixed left-0 right-0 top-16 z-40 border-b border-primary/25 bg-background/82 backdrop-blur-md"
      data-testid="sticky-order-bar"
    >
      <div className="container mx-auto flex h-14 items-center justify-center gap-2 overflow-x-auto px-4">
        <span className="hidden shrink-0 rounded-full border border-border/70 bg-card/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:inline-flex">
          {locale === "fr" ? "Commande rapide" : "Quick order"}
        </span>
        {phoneNumbers.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            data-testid={`sticky-order-call-${phone.replace(/[^\d+]/g, "")}`}
            onClick={() =>
              trackAnalyticsEvent({
                event_type: "click",
                page_path: location.pathname,
                target: `cta.sticky.call:${phone}`,
              })
            }
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/55 bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_-14px_hsl(30_100%_50%_/_0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
            aria-label={`${locale === "fr" ? "Commander au" : "Call to order"} ${phone}`}
          >
            <Phone size={14} />
            <span className="sm:hidden">{phone}</span>
            <span className="hidden sm:inline">{locale === "fr" ? "Commander" : "Order"}: {phone}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default StickyOrderBar;
