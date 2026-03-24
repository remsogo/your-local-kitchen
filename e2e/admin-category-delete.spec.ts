import { expect, test } from "@playwright/test";
import { loginAsMockAdmin, mockAdminSupabase } from "./helpers";

test.beforeEach(async ({ page }) => {
  await mockAdminSupabase(page);
});

test("deletes a category and its products from the admin dashboard", async ({ page }) => {
  await loginAsMockAdmin(page);

  await expect(page.getByTestId("admin-category-section-cat-delete")).toBeVisible();
  await expect(page.getByText("Produit test")).toBeVisible();
  await expect(page.getByTestId("admin-category-section-cat-keep")).toBeVisible();

  await page.getByTestId("admin-category-delete-cat-delete").click();

  await expect(page.getByTestId("admin-category-delete-dialog")).toBeVisible();
  await expect(page.getByText('La categorie "A supprimer" et ses 1 produit(s) seront supprimes definitivement.')).toBeVisible();

  await page.getByTestId("admin-category-delete-confirm").click();

  await expect(page.getByTestId("admin-message")).toHaveText("Categorie supprimee.");
  await expect(page.getByTestId("admin-category-section-cat-delete")).toHaveCount(0);
  await expect(page.getByText("Produit test")).toHaveCount(0);
  await expect(page.getByTestId("admin-category-section-cat-keep")).toBeVisible();
  await expect(page.getByText("Produit garde")).toBeVisible();
});

test("creates then deletes a category without affecting existing categories", async ({ page }) => {
  await loginAsMockAdmin(page);

  const title = "Categorie E2E";
  const subtitle = "Creee puis supprimee";

  await page.getByTestId("admin-category-title-input").fill(title);
  await page.getByTestId("admin-category-subtitle-input").fill(subtitle);
  await page.getByTestId("admin-category-create").click();

  await expect(page.getByTestId("admin-message")).toHaveText("Categorie creee.");
  const createdSection = page.locator("section", { hasText: title });
  await expect(createdSection).toBeVisible();
  await expect(createdSection.getByText(subtitle)).toBeVisible();
  await expect(page.getByTestId("admin-category-section-cat-keep")).toBeVisible();

  await createdSection.getByRole("button", { name: "Supprimer la categorie" }).click();
  await expect(page.getByTestId("admin-category-delete-dialog")).toBeVisible();
  await page.getByTestId("admin-category-delete-confirm").click();

  await expect(page.getByTestId("admin-message")).toHaveText("Categorie supprimee.");
  await expect(page.locator("section", { hasText: title })).toHaveCount(0);
  await expect(page.getByTestId("admin-category-section-cat-keep")).toBeVisible();
  await expect(page.getByText("Produit garde")).toBeVisible();
});

test("edits a category title and subtitle without affecting other categories", async ({ page }) => {
  await loginAsMockAdmin(page);

  const updatedTitle = "Categorie renommee";
  const updatedSubtitle = "Sous-titre mis a jour";

  await page.getByTestId("admin-category-edit-cat-delete").click();
  await expect(page.getByTestId("admin-category-edit-dialog")).toBeVisible();

  await page.getByTestId("admin-category-edit-title").fill(updatedTitle);
  await page.getByTestId("admin-category-edit-subtitle").fill(updatedSubtitle);
  await page.getByTestId("admin-category-edit-save").click();

  const renamedSection = page.getByTestId("admin-category-section-cat-delete");
  await expect(page.getByTestId("admin-message")).toHaveText("Categorie mise a jour.");
  await expect(renamedSection.getByRole("heading", { name: updatedTitle })).toBeVisible();
  await expect(renamedSection.getByText(updatedSubtitle)).toBeVisible();
  await expect(renamedSection.getByText("A supprimer")).toHaveCount(0);

  const untouchedSection = page.getByTestId("admin-category-section-cat-keep");
  await expect(untouchedSection.getByRole("heading", { name: "A conserver" })).toBeVisible();
  await expect(untouchedSection.getByText("Toujours visible")).toBeVisible();
});
