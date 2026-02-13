import { Phone } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";

const StickyOrderBar = () => {
  const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
    .map((n) => n.trim())
    .filter(Boolean);

  if (phoneNumbers.length === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-16 z-40 border-b border-primary/40 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-12 items-center gap-2 overflow-x-auto px-4">
        {phoneNumbers.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:text-sm"
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
