import { expect, Page } from "@playwright/test";

const SUPABASE_ROUTE_PATTERNS = ["**/rest/v1/**", "**/storage/v1/**", "**/auth/v1/**"];

export const disableSupabaseNetwork = async (page: Page) => {
  // Force menu/sauces hooks to use their local fallback datasets for deterministic tests.
  await Promise.all(
    SUPABASE_ROUTE_PATTERNS.map((pattern) =>
      page.route(pattern, (route) => route.abort("failed")),
    ),
  );
};

export const waitForAppShell = async (page: Page) => {
  // Wait for the shared shell instead of arbitrary timeouts.
  await expect(page.getByTestId("site-header")).toBeVisible();
  await expect(page.getByTestId("app-main")).toBeVisible();
};

export const switchLanguage = async (page: Page) => {
  const desktopSwitch = page.getByTestId("language-switch-desktop");
  if (await desktopSwitch.isVisible()) {
    await desktopSwitch.click();
    return;
  }

  // Mobile nav exposes language switch inside the drawer panel.
  await page.getByTestId("mobile-nav-toggle").click();
  await page.getByTestId("language-switch-mobile").click();
};

export const clickMainNavLink = async (page: Page, testId: string) => {
  const desktopLink = page.getByTestId(testId);
  if (await desktopLink.isVisible()) {
    await desktopLink.click();
    return;
  }

  // Re-open panel every time because it closes after each mobile navigation click.
  await page.getByTestId("mobile-nav-toggle").click();
  await page.getByTestId(`mobile-${testId}`).click();
};

