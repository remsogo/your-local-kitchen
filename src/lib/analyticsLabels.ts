/**
 * Maps technical analytics target ids to human-readable labels for the admin UI.
 * It supports both current naming conventions and legacy ids already stored in DB.
 */
export const formatInteractionLabel = (rawTarget: string) => {
  if (rawTarget.startsWith("menu.tab.select:")) {
    const category = rawTarget.replace("menu.tab.select:", "").trim();
    return `Menu -> Onglet "${category}"`;
  }

  if (rawTarget.startsWith("menu.tab.select")) {
    const category = rawTarget.replace("menu.tab.select", "").replace(/^[:._-]+/, "").trim();
    return `Menu -> Onglet "${category || "Categorie"}"`;
  }

  if (rawTarget.startsWith("cta.home.open_menu")) return "Accueil -> CTA Voir le menu";
  if (rawTarget.startsWith("cta.home.open_contact")) return "Accueil -> CTA Nous contacter";

  if (rawTarget.startsWith("cta.contact.order_call:")) {
    const phone = rawTarget.split(":")[1] || "";
    return `Contact -> CTA Commander (${phone})`;
  }

  if (rawTarget.startsWith("cta.contact.call:")) {
    const phone = rawTarget.split(":")[1] || "";
    return `Contact -> Appel (${phone})`;
  }

  if (rawTarget.startsWith("cta.sticky.call:")) {
    const phone = rawTarget.split(":")[1] || "";
    return `Bandeau fixe -> Appel (${phone})`;
  }

  if (rawTarget.startsWith("cta.contact.open_website")) return "Contact -> Ouvrir le site";

  return rawTarget.replace(/[._:]+/g, " ").trim();
};

