import { MenuItem } from "@/data/menuData";

export const toSupabaseErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
};

export const createCategoryPayload = (
  title: string,
  subtitle: string,
  sortOrder: number,
  uuidFactory: () => string = () => crypto.randomUUID(),
) => ({
  id: uuidFactory(),
  title: title.trim(),
  subtitle: subtitle.trim() || null,
  sort_order: sortOrder,
});

export const createItemPayload = (
  categoryId: string,
  form: MenuItem,
  sortOrder: number,
) => ({
  category_id: categoryId,
  name: form.name.trim(),
  description: form.description.trim(),
  image_url: form.imageUrl?.trim() || null,
  sort_order: sortOrder,
});

export const sanitizePrices = (prices: MenuItem["prices"]) =>
  prices
    .map((p) => ({ label: p.label.trim(), price: p.price.trim() }))
    .filter((p) => p.price);
