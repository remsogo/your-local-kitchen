import { expect, test } from "@playwright/test";
import { clickMainNavLink, disableSupabaseNetwork, switchLanguage, waitForAppShell } from "./helpers";

test.beforeEach(async ({ page }) => {
  await disableSupabaseNetwork(page);
});

test("switches language on the same route and translates menu categories", async ({ page }) => {
  await page.goto("/menu");
  await waitForAppShell(page);

  // Validate French menu content before switching locale.
  await expect(page.getByTestId("menu-title")).toHaveText("Notre Menu");
  await expect(page.getByTestId("menu-category-button-sandwichs")).toHaveText("Sandwichs");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/menu");

  // Locale switch should keep users on the equivalent English route.
  await switchLanguage(page);
  await expect.poll(() => new URL(page.url()).pathname).toBe("/en/menu");
  await expect(page.getByTestId("menu-title")).toHaveText("Our Menu");
  await expect(page.getByTestId("menu-category-button-sandwichs")).toHaveText("Sandwiches");

  // Switching back must restore French path/content pair.
  await switchLanguage(page);
  await expect.poll(() => new URL(page.url()).pathname).toBe("/menu");
  await expect(page.getByTestId("menu-title")).toHaveText("Notre Menu");
});

test("navigates every public route in French then English from the main menu", async ({ page }) => {
  const frenchRoutes = [
    { navTestId: "nav-link-home", expectedPath: "/", pageTestId: "home-page" },
    { navTestId: "nav-link-menu", expectedPath: "/menu", pageTestId: "menu-page" },
    { navTestId: "nav-link-contact", expectedPath: "/contact", pageTestId: "contact-page" },
    { navTestId: "nav-link-news", expectedPath: "/actualites", pageTestId: "news-page" },
    { navTestId: "nav-link-legal", expectedPath: "/mentions-legales", pageTestId: "legal-page" },
  ];
  const englishRoutes = [
    { navTestId: "nav-link-home", expectedPath: "/en", pageTestId: "home-page" },
    { navTestId: "nav-link-menu", expectedPath: "/en/menu", pageTestId: "menu-page" },
    { navTestId: "nav-link-contact", expectedPath: "/en/contact", pageTestId: "contact-page" },
    { navTestId: "nav-link-news", expectedPath: "/en/news", pageTestId: "news-page" },
    { navTestId: "nav-link-legal", expectedPath: "/en/legal-notice", pageTestId: "legal-page" },
  ];

  await page.goto("/");
  await waitForAppShell(page);

  // Walk all French routes from header navigation.
  for (const route of frenchRoutes) {
    await clickMainNavLink(page, route.navTestId);
    await expect.poll(() => new URL(page.url()).pathname).toBe(route.expectedPath);
    await expect(page.getByTestId(route.pageTestId)).toBeVisible();
  }

  // Switch language and verify route parity from the currently opened page.
  await switchLanguage(page);
  await expect.poll(() => new URL(page.url()).pathname).toBe("/en/legal-notice");

  // Walk all English routes from the same navigation controls.
  for (const route of englishRoutes) {
    await clickMainNavLink(page, route.navTestId);
    await expect.poll(() => new URL(page.url()).pathname).toBe(route.expectedPath);
    await expect(page.getByTestId(route.pageTestId)).toBeVisible();
  }
});

