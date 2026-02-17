import { describe, expect, it } from "vitest";
import { toGaClickPayload } from "@/lib/analyticsEvents";

describe("toGaClickPayload", () => {
  it("maps menu tab clicks to GA4-friendly payload", () => {
    const payload = toGaClickPayload("menu.tab.select:Tex-mex", "/menu");
    expect(payload).toEqual({
      eventName: "menu_tab_click",
      params: {
        page_path: "/menu",
        menu_category: "tex_mex",
      },
    });
  });

  it("maps phone CTA to call_click payload", () => {
    const payload = toGaClickPayload("cta.sticky.call:06.84.06.93.85", "/");
    expect(payload).toEqual({
      eventName: "call_click",
      params: {
        page_path: "/",
        call_source: "sticky",
        phone_number: "0684069385",
      },
    });
  });

  it("keeps CTA variant for home menu button", () => {
    const payload = toGaClickPayload("cta.home.open_menu:decouvrir", "/");
    expect(payload).toEqual({
      eventName: "home_menu_cta_click",
      params: {
        page_path: "/",
        variant: "decouvrir",
      },
    });
  });

  it("falls back to generic interaction payload", () => {
    const payload = toGaClickPayload("custom.event_example:foo", "/menu");
    expect(payload).toEqual({
      eventName: "interaction_click",
      params: {
        page_path: "/menu",
        target: "custom_event_example_foo",
      },
    });
  });

  it("maps language switch clicks to dedicated event", () => {
    const payload = toGaClickPayload("language.switch:en", "/menu");
    expect(payload).toEqual({
      eventName: "language_switch_click",
      params: {
        page_path: "/menu",
        locale: "en",
      },
    });
  });

  it("maps contact form mailto action", () => {
    const payload = toGaClickPayload("cta.contact.form_mailto", "/contact");
    expect(payload).toEqual({
      eventName: "contact_form_mailto_click",
      params: {
        page_path: "/contact",
      },
    });
  });
});
