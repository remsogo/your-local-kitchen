import { expect, Page, Route } from "@playwright/test";

const SUPABASE_ROUTE_PATTERNS = ["**/rest/v1/**", "**/storage/v1/**", "**/auth/v1/**"];
const MOCK_ADMIN_ACCESS_TOKEN = "mock-admin-access-token";
const MOCK_ADMIN_REFRESH_TOKEN = "mock-admin-refresh-token";

type MockMenuCategory = {
  id: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
};

type MockMenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
};

type MockMenuItemPrice = {
  item_id: string;
  label: string;
  price: string;
  sort_order: number;
};

type MockAdminBackendState = {
  categories: MockMenuCategory[];
  items: MockMenuItem[];
  prices: MockMenuItemPrice[];
};

const DEFAULT_ADMIN_BACKEND_STATE: MockAdminBackendState = {
  categories: [
    { id: "cat-delete", title: "A supprimer", subtitle: "Categorie de test", sort_order: 0 },
    { id: "cat-keep", title: "A conserver", subtitle: "Toujours visible", sort_order: 1 },
  ],
  items: [
    {
      id: "item-delete-1",
      category_id: "cat-delete",
      name: "Produit test",
      description: "Doit disparaitre avec la categorie",
      image_url: null,
      sort_order: 0,
    },
    {
      id: "item-keep-1",
      category_id: "cat-keep",
      name: "Produit garde",
      description: "Reste visible apres suppression",
      image_url: null,
      sort_order: 0,
    },
  ],
  prices: [
    { item_id: "item-delete-1", label: "", price: "9,90 EUR", sort_order: 0 },
    { item_id: "item-keep-1", label: "", price: "11,90 EUR", sort_order: 0 },
  ],
};

const MOCK_ADMIN_USER = {
  id: "admin-user-id",
  aud: "authenticated",
  role: "authenticated",
  email: "admin@example.test",
  email_confirmed_at: "2026-03-24T10:00:00.000Z",
  phone: "",
  confirmed_at: "2026-03-24T10:00:00.000Z",
  last_sign_in_at: "2026-03-24T10:00:00.000Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    email: "admin@example.test",
  },
  identities: [],
  created_at: "2026-03-24T10:00:00.000Z",
  updated_at: "2026-03-24T10:00:00.000Z",
};

const cloneState = (state: MockAdminBackendState): MockAdminBackendState => ({
  categories: state.categories.map((category) => ({ ...category })),
  items: state.items.map((item) => ({ ...item })),
  prices: state.prices.map((price) => ({ ...price })),
});

const fulfillJson = (route: Route, data: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(data),
  });

const parseRequestBody = <T>(body: string | null): T => {
  if (!body) return {} as T;
  return JSON.parse(body) as T;
};

const readEqFilter = (url: URL, field: string) => {
  const rawValue = url.searchParams.get(field);
  if (!rawValue?.startsWith("eq.")) return null;
  return rawValue.slice(3);
};

const readInFilter = (url: URL, field: string) => {
  const rawValue = url.searchParams.get(field);
  if (!rawValue?.startsWith("in.(") || !rawValue.endsWith(")")) return [];
  return rawValue.slice(4, -1).split(",").map((value) => value.trim()).filter(Boolean);
};

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

export const mockAdminSupabase = async (
  page: Page,
  overrides?: Partial<MockAdminBackendState>,
) => {
  const state = cloneState({
    categories: overrides?.categories || DEFAULT_ADMIN_BACKEND_STATE.categories,
    items: overrides?.items || DEFAULT_ADMIN_BACKEND_STATE.items,
    prices: overrides?.prices || DEFAULT_ADMIN_BACKEND_STATE.prices,
  });

  await page.route("**/auth/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (request.method() === "POST" && url.pathname.endsWith("/token")) {
      await fulfillJson(route, {
        access_token: MOCK_ADMIN_ACCESS_TOKEN,
        token_type: "bearer",
        expires_in: 3600,
        expires_at: 1_900_000_000,
        refresh_token: MOCK_ADMIN_REFRESH_TOKEN,
        user: MOCK_ADMIN_USER,
      });
      return;
    }

    if (request.method() === "GET" && url.pathname.endsWith("/user")) {
      await fulfillJson(route, MOCK_ADMIN_USER);
      return;
    }

    if (request.method() === "POST" && url.pathname.endsWith("/logout")) {
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    await route.continue();
  });

  await page.route("**/rest/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const table = url.pathname.split("/").pop();

    if (table === "user_roles" && request.method() === "GET") {
      await fulfillJson(route, { role: "admin" });
      return;
    }

    if (table === "menu_categories") {
      if (request.method() === "GET") {
        const categories = [...state.categories].sort((a, b) => a.sort_order - b.sort_order);
        await fulfillJson(route, categories);
        return;
      }

      if (request.method() === "POST") {
        const payload = parseRequestBody<MockMenuCategory | MockMenuCategory[]>(request.postData());
        const records = Array.isArray(payload) ? payload : [payload];
        state.categories.push(...records.map((record) => ({ ...record })));
        await fulfillJson(route, records);
        return;
      }

      if (request.method() === "PATCH") {
        const categoryId = readEqFilter(url, "id");
        const payload = parseRequestBody<Partial<MockMenuCategory>>(request.postData());
        state.categories = state.categories.map((category) =>
          category.id === categoryId ? { ...category, ...payload } : category,
        );
        await fulfillJson(route, []);
        return;
      }

      if (request.method() === "DELETE") {
        const categoryId = readEqFilter(url, "id");
        state.categories = state.categories.filter((category) => category.id !== categoryId);
        await fulfillJson(route, []);
        return;
      }
    }

    if (table === "menu_items") {
      if (request.method() === "GET") {
        const categoryId = readEqFilter(url, "category_id");
        const select = url.searchParams.get("select") || "";
        const items = [...state.items]
          .filter((item) => !categoryId || item.category_id === categoryId)
          .sort((a, b) => a.sort_order - b.sort_order);

        if (select === "id") {
          await fulfillJson(route, items.map((item) => ({ id: item.id })));
          return;
        }

        await fulfillJson(
          route,
          items.map((item) => ({
            ...item,
            menu_item_prices: state.prices
              .filter((price) => price.item_id === item.id)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((price) => ({ ...price })),
          })),
        );
        return;
      }

      if (request.method() === "POST") {
        const payload = parseRequestBody<MockMenuItem | MockMenuItem[]>(request.postData());
        const records = Array.isArray(payload) ? payload : [payload];
        state.items.push(...records.map((record) => ({ ...record })));
        await fulfillJson(route, records);
        return;
      }

      if (request.method() === "PATCH") {
        const itemId = readEqFilter(url, "id");
        const payload = parseRequestBody<Partial<MockMenuItem>>(request.postData());
        state.items = state.items.map((item) =>
          item.id === itemId ? { ...item, ...payload } : item,
        );
        await fulfillJson(route, []);
        return;
      }

      if (request.method() === "DELETE") {
        const itemId = readEqFilter(url, "id");
        const categoryId = readEqFilter(url, "category_id");
        const keptItems = state.items.filter((item) => {
          if (itemId) return item.id !== itemId;
          if (categoryId) return item.category_id !== categoryId;
          return true;
        });
        const deletedItemIds = state.items
          .filter((item) => !keptItems.some((keptItem) => keptItem.id === item.id))
          .map((item) => item.id);

        state.items = keptItems;
        if (deletedItemIds.length > 0) {
          state.prices = state.prices.filter((price) => !deletedItemIds.includes(price.item_id));
        }
        await fulfillJson(route, []);
        return;
      }
    }

    if (table === "menu_item_prices") {
      if (request.method() === "DELETE") {
        const itemId = readEqFilter(url, "item_id");
        const itemIds = itemId ? [itemId] : readInFilter(url, "item_id");
        if (itemIds.length > 0) {
          state.prices = state.prices.filter((price) => !itemIds.includes(price.item_id));
        }
        await fulfillJson(route, []);
        return;
      }
    }

    await route.continue();
  });

  return state;
};

export const loginAsMockAdmin = async (page: Page) => {
  await page.goto("/admin");
  await expect(page.getByTestId("admin-login-form")).toBeVisible();
  await page.getByTestId("admin-login-email").fill("admin@example.test");
  await page.getByTestId("admin-login-password").fill("not-used-by-mock");
  await page.getByTestId("admin-login-submit").click();
  await expect(page.getByTestId("admin-dashboard-title")).toBeVisible();
};
