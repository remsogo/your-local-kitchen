import { expect, test } from "@playwright/test";

test("admin authentication works with provided credentials", async ({ page }) => {
  const runAdminE2E = process.env.PLAYWRIGHT_RUN_ADMIN_E2E === "1";
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  // Explicit opt-in prevents failing the default public E2E suite when secure env is not configured.
  test.skip(
    !runAdminE2E || !email || !password,
    "Set PLAYWRIGHT_RUN_ADMIN_E2E=1 with PLAYWRIGHT_ADMIN_EMAIL and PLAYWRIGHT_ADMIN_PASSWORD to run this test.",
  );

  await page.goto("/admin");
  await expect(page.getByTestId("admin-login-form")).toBeVisible();

  await page.getByTestId("admin-login-email").fill(email || "");
  await page.getByTestId("admin-login-password").fill(password || "");
  await page.getByTestId("admin-login-submit").click();

  // Successful auth lands on dashboard.
  await expect(page.getByTestId("admin-dashboard-title")).toBeVisible();
});
