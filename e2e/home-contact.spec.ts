import { expect, test } from "@playwright/test";
import { disableSupabaseNetwork, switchLanguage, waitForAppShell } from "./helpers";

test.beforeEach(async ({ page }) => {
  await disableSupabaseNetwork(page);
});

test("renders home sections and CTA links end-to-end", async ({ page }) => {
  await page.goto("/");
  await waitForAppShell(page);

  // Core above-the-fold content and sticky ordering controls should be visible.
  await expect(page.getByTestId("home-title")).toHaveText("Pizz'Atiq");
  await expect(page.getByTestId("sticky-order-bar")).toBeVisible();
  await expect(page.locator('[data-testid^="sticky-order-call-"]').first()).toBeVisible();
  await expect(page.getByTestId("home-opening-hours")).toBeVisible();
  await expect(page.getByTestId("home-delivery")).toBeVisible();

  // CTA to menu should route correctly.
  await page.getByTestId("home-cta-menu").click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/menu");
  await expect(page.getByTestId("menu-page")).toBeVisible();

  // CTA to contact should route correctly.
  await page.goto("/");
  await page.getByTestId("home-cta-contact").click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/contact");
  await expect(page.getByTestId("contact-page")).toBeVisible();
});

test("validates contact form in French and English", async ({ page }) => {
  await page.goto("/contact");
  await waitForAppShell(page);

  // 1) Missing consent must be blocked.
  await page.getByTestId("contact-submit").click();
  await expect(page.getByTestId("contact-form-error")).toHaveText(
    "Le consentement est obligatoire pour envoyer le formulaire.",
  );

  // 2) Consent without message must also be blocked.
  await page.getByTestId("contact-consent-checkbox").check();
  await page.getByTestId("contact-submit").click();
  await expect(page.getByTestId("contact-form-error")).toHaveText("Merci d'indiquer au minimum votre message.");

  // 3) Same validation behavior must be translated in English.
  await switchLanguage(page);
  await expect.poll(() => new URL(page.url()).pathname).toBe("/en/contact");
  await page.getByTestId("contact-consent-checkbox").uncheck();
  await page.getByTestId("contact-submit").click();
  await expect(page.getByTestId("contact-form-error")).toHaveText("Consent is required before sending.");

  await page.getByTestId("contact-consent-checkbox").check();
  await page.getByTestId("contact-message-input").fill("");
  await page.getByTestId("contact-submit").click();
  await expect(page.getByTestId("contact-form-error")).toHaveText("Please provide at least your message.");
});

