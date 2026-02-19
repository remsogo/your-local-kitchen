import { expect, test } from "@playwright/test";
import { disableSupabaseNetwork, switchLanguage, waitForAppShell } from "./helpers";

test.beforeEach(async ({ page }) => {
  await disableSupabaseNetwork(page);
});

test("updates document language and SEO links when locale changes", async ({ page }) => {
  await page.goto("/menu");
  await waitForAppShell(page);

  // French route must publish French language and matching canonical URL.
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/menu$/);
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute("href", /\/menu$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/menu$/);

  // Locale switch should update all SEO-critical language tags.
  await switchLanguage(page);
  await expect.poll(() => new URL(page.url()).pathname).toBe("/en/menu");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/menu$/);
});

test("renders news and legal pages in both locales", async ({ page }) => {
  await page.goto("/actualites");
  await waitForAppShell(page);
  await expect(page.getByTestId("news-title")).toHaveText("Actualites");
  await expect(page.getByTestId("news-item-promo-lun-jeu")).toBeVisible();

  await page.goto("/mentions-legales");
  await expect(page.getByTestId("legal-title")).toHaveText("Mentions legales");

  await page.goto("/en/news");
  await expect(page.getByTestId("news-title")).toHaveText("News");

  await page.goto("/en/legal-notice");
  await expect(page.getByTestId("legal-title")).toHaveText("Legal notice");
});

test("shows localized 404 pages for unknown routes", async ({ page }) => {
  await page.goto("/cette-page-n-existe-pas");
  await waitForAppShell(page);
  await expect(page.getByTestId("not-found-page")).toBeVisible();
  await expect(page.getByTestId("not-found-code")).toHaveText("404");
  await expect(page.getByText("Page introuvable")).toBeVisible();

  await page.goto("/en/this-page-does-not-exist");
  await expect(page.getByTestId("not-found-page")).toBeVisible();
  await expect(page.getByText("Oops! Page not found")).toBeVisible();
});

