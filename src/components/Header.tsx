import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
  { to: "/mentions-legales", label: "Mentions légales" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""].map((n) => n.trim()).filter(Boolean);
  const primaryPhone = phoneNumbers[0];
  const primaryPhoneHref = primaryPhone ? `tel:${primaryPhone.replace(/[^\d+]/g, "")}` : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-3xl text-gradient tracking-wider">
          Pizz'Atiq
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {primaryPhone && (
            <a
              href={primaryPhoneHref}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              aria-label={`Appeler ${restaurantInfo.name}`}
            >
              <Phone size={16} />
              Appeler
            </a>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-background border-b border-border">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {phoneNumbers.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-secondary transition-colors"
              aria-label={`Appeler ${restaurantInfo.name}`}
            >
              Appeler: {phone}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
