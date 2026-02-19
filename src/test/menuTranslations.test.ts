import { describe, expect, it } from "vitest";
import { MenuCategory, menuData } from "@/data/menuData";
import { localizeMenu, localizeSauceNames } from "@/lib/menuTranslations";

describe("menu translations", () => {
  it("keeps menu untouched in french locale", () => {
    const localized = localizeMenu(menuData, "fr");
    expect(localized).toBe(menuData);
  });

  it("translates known category and item copy in english locale", () => {
    const localized = localizeMenu(menuData, "en");
    expect(localized[2]?.title).toBe("Sandwiches");
    expect(localized[2]?.subtitle).toBe("Served with fries - 7.50 EUR each");
    expect(localized[0]?.items[0]?.name).toBe("Margherita");
    expect(localized[0]?.items[0]?.description).toBe("Tomato, mozzarella, oregano");
  });

  it("translates default french sauce labels in english locale", () => {
    const localized = localizeSauceNames(["Blanche", "Harissa", "Algerienne"], "en");
    expect(localized).toEqual(["White sauce", "Harissa", "Algerian sauce"]);
  });

  it("translates updated ingredient compositions via fallback token mapping", () => {
    const customMenu: MenuCategory[] = [
      {
        id: "custom",
        title: "Pizzas",
        items: [
          {
            name: "Kebab",
            description: "Creme, mozzarella, emince de kebab, oignon, artichaut",
            prices: [{ label: "Junior", price: "11,00 EUR" }],
          },
        ],
      },
    ];

    const localized = localizeMenu(customMenu, "en");
    expect(localized[0]?.items[0]?.name).toBe("Kebab");
    expect(localized[0]?.items[0]?.description).toBe("cream, mozzarella, kebab meat strips, onion, artichoke");
  });
});
