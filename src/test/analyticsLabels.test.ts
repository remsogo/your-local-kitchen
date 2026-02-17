import { describe, expect, it } from "vitest";
import { formatInteractionLabel } from "@/lib/analyticsLabels";

describe("formatInteractionLabel", () => {
  it("formats new menu tab ids", () => {
    expect(formatInteractionLabel("menu.tab.select:Burgers")).toBe('Menu -> Onglet "Burgers"');
  });

  it("formats legacy menu tab ids", () => {
    expect(formatInteractionLabel("menu.tab.selectTex-mex")).toBe('Menu -> Onglet "Tex-mex"');
  });

  it("formats known CTA ids", () => {
    expect(formatInteractionLabel("cta.home.open_menu")).toBe("Accueil -> CTA Voir le menu");
    expect(formatInteractionLabel("cta.home.open_menu:decouvrir")).toBe("Accueil -> CTA Decouvrir le menu");
    expect(formatInteractionLabel("cta.contact.call:0684069385")).toBe("Contact -> Appel (0684069385)");
    expect(formatInteractionLabel("cta.sticky.call:0134849346")).toBe("Bandeau fixe -> Appel (0134849346)");
    expect(formatInteractionLabel("cta.contact.form_mailto")).toBe("Contact -> Formulaire email");
    expect(formatInteractionLabel("language.switch:en")).toBe("Navigation -> Changer langue (EN)");
  });

  it("keeps unknown ids readable", () => {
    expect(formatInteractionLabel("custom.event_example:foo")).toBe("custom event example foo");
  });
});
