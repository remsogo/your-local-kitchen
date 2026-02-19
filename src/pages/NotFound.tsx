import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getLocaleFromPathname } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const homePath = locale === "fr" ? "/" : "/en";

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted" data-testid="not-found-page">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold" data-testid="not-found-code">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {locale === "fr" ? "Page introuvable" : "Oops! Page not found"}
        </p>
        <a href={homePath} className="text-primary underline hover:text-primary/90" data-testid="not-found-home-link">
          {locale === "fr" ? "Retour a l'accueil" : "Return to Home"}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
