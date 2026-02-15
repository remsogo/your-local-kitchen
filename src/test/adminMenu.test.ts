import { describe, expect, it } from "vitest";
import { createCategoryPayload, createItemPayload, sanitizePrices, toSupabaseErrorMessage } from "@/lib/adminMenu";

describe("adminMenu helpers", () => {
  it("builds a category payload with trimmed values", () => {
    const payload = createCategoryPayload("  Pizzas  ", "  Junior / Senior  ", 3, () => "cat-id-1");
    expect(payload).toEqual({
      id: "cat-id-1",
      title: "Pizzas",
      subtitle: "Junior / Senior",
      sort_order: 3,
    });
  });

  it("turns empty subtitle into null", () => {
    const payload = createCategoryPayload("Burgers", "   ", 1, () => "cat-id-2");
    expect(payload.subtitle).toBeNull();
  });

  it("builds item payload and trims strings", () => {
    const payload = createItemPayload(
      "cat-x",
      {
        name: "  4 Fromages ",
        description: "  Creme, mozzarella ",
        imageUrl: "  https://img.example/pizza.jpg  ",
        prices: [{ label: "Senior", price: "12,50EUR" }],
      },
      7,
    );
    expect(payload).toEqual({
      category_id: "cat-x",
      name: "4 Fromages",
      description: "Creme, mozzarella",
      image_url: "https://img.example/pizza.jpg",
      sort_order: 7,
    });
  });

  it("sanitizes and filters invalid prices", () => {
    const prices = sanitizePrices([
      { label: " Junior ", price: " 7,00EUR " },
      { label: "Mega", price: "   " },
    ]);
    expect(prices).toEqual([{ label: "Junior", price: "7,00EUR" }]);
  });

  it("extracts supabase error message safely", () => {
    expect(toSupabaseErrorMessage({ message: "RLS denied" }, "fallback")).toBe("RLS denied");
    expect(toSupabaseErrorMessage({}, "fallback")).toBe("fallback");
  });
});
