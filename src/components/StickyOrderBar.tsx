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
    <div className="fixed left-0 right-0 top-16 z-40 border-b border-primary/40 bg-background/95 backdrop-blur-md">
      {/* Mobile: stacked CTAs for readability. Desktop: compact horizontal row. */}
      <div className="container mx-auto grid grid-cols-1 gap-2 px-4 py-2 sm:flex sm:h-12 sm:items-center sm:gap-2 sm:overflow-x-auto sm:py-0">
        {phoneNumbers.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            // Track CTA phone taps to measure conversion intent from each page.
            onClick={() =>
              trackAnalyticsEvent({
                event_type: "click",
                page_path: location.pathname,
                target: `cta.sticky.call:${phone}`,
              })
            }
            className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto sm:shrink-0 sm:text-sm"
            aria-label={`Commander au ${phone}`}
          >
            <Phone size={14} />
            Commander: {phone}
          </a>
        ))}
      </div>
    </div>
  );
};

export default StickyOrderBar;
