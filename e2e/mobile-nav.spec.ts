import { expect, test } from "@playwright/test";
import { disableSupabaseNetwork, waitForAppShell } from "./helpers";

test.beforeEach(async ({ page }) => {
  await disableSupabaseNetwork(page);
});

test("mobile drawer opens, switches language, and navigates to contact", async ({ page, isMobile }) => {
  test.skip(!isMobile, "This scenario targets the dedicated mobile project only.");

  await page.goto("/");
  await waitForAppShell(page);

  // Drawer starts closed and must open via the mobile toggle button.
  await expect(page.getByTestId("mobile-nav-panel")).toHaveCount(0);
  await page.getByTestId("mobile-nav-toggle").click();
  await expect(page.getByTestId("mobile-nav-panel")).toBeVisible();

  // Locale switch is available inside the drawer on mobile.
  await page.getByTestId("language-switch-mobile").click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/en");

  // Re-open drawer, then navigate through mobile-specific link selectors.
  await page.getByTestId("mobile-nav-toggle").click();
  await page.getByTestId("mobile-nav-link-contact").click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/en/contact");
  await expect(page.getByTestId("contact-page")).toBeVisible();
});

