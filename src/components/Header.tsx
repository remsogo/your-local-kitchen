import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoPizzatiq from "@/assets/logo_pizzatiq.jpg";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
  { to: "/mentions-legales", label: "Mentions legales" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/90 shadow-[0_10px_28px_-24px_hsl(30_100%_50%_/_0.6)] backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group inline-flex items-center gap-2">
          <img
            src={logoPizzatiq}
            alt="Logo Pizz'Atiq"
            className="h-10 w-10 rounded-lg border border-border/70 bg-card/95 p-0.5 object-contain shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
          />
          <span className="font-display text-[2.05rem] leading-none text-gradient tracking-[0.045em]">Pizz'Atiq</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary after:absolute after:-bottom-[10px] after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="rounded-md p-1.5 text-foreground transition-colors hover:bg-secondary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-b border-border/80 bg-background/98 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary/70 ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
