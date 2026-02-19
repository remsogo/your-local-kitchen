import { MenuCategory } from "@/data/menuData";
import { Locale } from "@/lib/i18n";

const stripDiacritics = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeKey = (value: string) =>
  stripDiacritics(value)
    .trim()
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toNormalizedMap = (entries: Record<string, string>): Record<string, string> =>
  Object.fromEntries(Object.entries(entries).map(([key, value]) => [normalizeKey(key), value]));

const findFromMap = (value: string, map: Record<string, string>): string | null =>
  map[normalizeKey(value)] ?? null;

const CATEGORY_TITLE_EN = toNormalizedMap({
  Pizzas: "Pizzas",
  Burgers: "Burgers",
  Sandwichs: "Sandwiches",
  Tacos: "Tacos",
  Croques: "Croques",
  Assiettes: "Plates",
  Salades: "Salads",
  Supplements: "Extras",
});

const CATEGORY_SUBTITLE_EN = toNormalizedMap({
  "Junior - Senior - Mega": "Junior - Senior - Mega",
  "Servis avec frites & boisson": "Served with fries & drink",
  "Servis avec frites - 7,50 EUR au choix": "Served with fries - 7.50 EUR each",
  "Viandes au choix : steak hache, emince de kebab, nuggets, merguez, chicken tikka, cordon bleu":
    "Choice of meats: minced beef steak, kebab meat, nuggets, merguez, chicken tikka, cordon bleu",
  "Servies avec viande, salade, tomate, oignon et frites - 10,00 EUR":
    "Served with meat, lettuce, tomato, onion and fries - 10.00 EUR",
  "8,50 EUR": "8.50 EUR",
  "1,00 EUR chacun": "1.00 EUR each",
});

const ITEM_NAME_EN = toNormalizedMap({
  "4 Fromages": "4 Cheeses",
  "4 Jambons": "4 Hams",
  Americain: "American",
  Americaine: "American",
  Bleu: "Blue Cheese",
  Chevre: "Goat Cheese",
  "Chevre Chaud": "Warm Goat Cheese",
  "Chevre Miel": "Goat Cheese & Honey",
  Fermiere: "Farmhouse",
  "Figue Miel": "Fig & Honey",
  Hawaienne: "Hawaiian",
  Italienne: "Italian",
  Marguerita: "Margherita",
  Mexicaine: "Mexican",
  Montagnarde: "Mountain",
  Napolitaine: "Neapolitan",
  Norvegienne: "Norwegian",
  Orientale: "Oriental",
  Paysanne: "Country",
  "Pizz'Dessert": "Dessert Pizza",
  Poivrons: "Bell Peppers",
  Reine: "Queen",
  Savoyarde: "Savoyard",
  Vegetarienne: "Vegetarian",
  "Viande Hachee": "Minced Beef",
  "Croq' Madame": "Croque Madame",
  "Croq' Monsieur": "Croque Monsieur",
  Kebab: "Kebab",
});

const ITEM_DESCRIPTION_EN = toNormalizedMap({
  "1 viande au choix": "1 choice of meat",
  "2 steaks + bacon + boursin + cheddar": "2 beef patties + bacon + boursin + cheddar",
  "2 steaks + cheddar": "2 beef patties + cheddar",
  "2 steaks + galette de pomme de terre + cheddar": "2 beef patties + hash brown + cheddar",
  "2 viandes au choix": "2 choices of meat",
  "3 steaks + cheddar": "3 beef patties + cheddar",
  "3 viandes au choix": "3 choices of meat",
  "Champignons frais": "Fresh mushrooms",
  "Cordon bleu, salade, tomate": "Cordon bleu, lettuce, tomato",
  "Cordon bleu, salade, tomate, oignon, frites": "Cordon bleu, lettuce, tomato, onion, fries",
  "Creme tomate, mozzarella, boursin, oeuf, viande hachee":
    "Tomato cream, mozzarella, boursin, egg, minced beef",
  "Creme, mozzarella, chevre, figue, miel": "Cream, mozzarella, goat cheese, fig, honey",
  "Creme, mozzarella, chevre, miel": "Cream, mozzarella, goat cheese, honey",
  "Creme, mozzarella, lardon, oignon, oeuf": "Cream, mozzarella, bacon bits, onion, egg",
  "Creme, mozzarella, lardon, pomme de terre, raclette": "Cream, mozzarella, bacon bits, potato, raclette cheese",
  "Creme, mozzarella, poulet ou v.hachee, pomme de terre, oignon":
    "Cream, mozzarella, chicken or minced beef, potato, onion",
  "Creme, mozzarella, saumon fume, rondelle citron": "Cream, mozzarella, smoked salmon, lemon slice",
  "Double steak, cheddar, salade, tomate": "Double beef patty, cheddar, lettuce, tomato",
  "Fromage bleu": "Blue cheese",
  "Fromage de chevre": "Goat cheese",
  "Fromage raclette": "Raclette cheese",
  "Jambon + cheddar + oeuf": "Ham + cheddar + egg",
  "Jambon + cheddar": "Ham + cheddar",
  "Maxi steak, cheddar, salade, tomate": "Maxi beef patty, cheddar, lettuce, tomato",
  "Poivrons frais": "Fresh bell peppers",
  "Poulet marine + cheddar": "Marinated chicken + cheddar",
  "Poulet pane, salade, tomate, sauce": "Breaded chicken, lettuce, tomato, sauce",
  "Poulet, salade, tomate, oignon, frites": "Chicken, lettuce, tomato, onion, fries",
  "Radis, chou rouge, oignon rouge, avocat, tomate, mais": "Radish, red cabbage, red onion, avocado, tomato, corn",
  "Salade, tomate, avocat, ananas, poulet": "Lettuce, tomato, avocado, pineapple, chicken",
  "Salade, tomate, lardon, chevre, crouton": "Lettuce, tomato, bacon bits, goat cheese, croutons",
  "Salade, tomate, saumon fume, oignon": "Lettuce, tomato, smoked salmon, onion",
  "Sauce barbecue, mozzarella, viande hachee, oignon": "Barbecue sauce, mozzarella, minced beef, onion",
  "Steak hache, salade, tomate, oignon, frites": "Minced beef steak, lettuce, tomato, onion, fries",
  "Steak, cheddar, salade, tomate": "Beef patty, cheddar, lettuce, tomato",
  "Steak, galette de pomme de terre, cheddar": "Beef patty, hash brown, cheddar",
  "Tomate, mozzarella, anchois, capre, olive": "Tomato, mozzarella, anchovies, capers, olives",
  "Tomate, mozzarella, brie, chevre, parmesan": "Tomato, mozzarella, brie, goat cheese, parmesan",
  "Tomate, mozzarella, champignon, oignon, poivron": "Tomato, mozzarella, mushroom, onion, bell pepper",
  "Tomate, mozzarella, jambon, ananas": "Tomato, mozzarella, ham, pineapple",
  "Tomate, mozzarella, jambon, champignon": "Tomato, mozzarella, ham, mushroom",
  "Tomate, mozzarella, jambon, chorizo, bacon, lardons": "Tomato, mozzarella, ham, chorizo, bacon, bacon bits",
  "Tomate, mozzarella, jambon, oeuf, champignon ou poulet ou 4 fromages ou v.hachee":
    "Tomato, mozzarella, ham, egg, mushroom or chicken or four cheeses or minced beef",
  "Tomate, mozzarella, kebab, oignon, ail, tomate fraiche, salade, piment jalapeno, sauce blanche":
    "Tomato, mozzarella, kebab meat, onion, garlic, fresh tomato, lettuce, jalapeno pepper, white sauce",
  "Tomate, mozzarella, lardon, oeuf": "Tomato, mozzarella, bacon bits, egg",
  "Tomate, mozzarella, merguez, poivron, olive, oeuf": "Tomato, mozzarella, merguez, bell pepper, olives, egg",
  "Tomate, mozzarella, origan": "Tomato, mozzarella, oregano",
  "Tomate, mozzarella, poulet, champignon, oignon": "Tomato, mozzarella, chicken, mushroom, onion",
  "Tomate, mozzarella, thon, poivron, oeuf": "Tomato, mozzarella, tuna, bell pepper, egg",
  "Tomate, mozzarella, tomate cerise, roquette, burrata": "Tomato, mozzarella, cherry tomato, arugula, burrata",
  "Tomate, mozzarella, v. hachee, olive, poivron, champignon": "Tomato, mozzarella, minced beef, olives, bell pepper, mushroom",
  "Tomate, mozzarella, v.kebab, oignon, tomate cerise, sauce blanche":
    "Tomato, mozzarella, kebab meat, onion, cherry tomato, white sauce",
  "Tomate, mozzarella, viande hachee, champignon, oeuf": "Tomato, mozzarella, minced beef, mushroom, egg",
  "Tomate, mozzarella, viande hachee, pomme de terre, raclette": "Tomato, mozzarella, minced beef, potato, raclette cheese",
  "Triple steak, cheddar, salade, tomate": "Triple beef patty, cheddar, lettuce, tomato",
  "Viande de kebab + steaks + cheddar": "Kebab meat + beef patties + cheddar",
  "Viande kebab, salade, tomate, oignon": "Kebab meat, lettuce, tomato, onion",
  "Viande kebab, salade, tomate, oignon, frites": "Kebab meat, lettuce, tomato, onion, fries",
});

const PRICE_LABEL_EN = toNormalizedMap({
  Junior: "Junior",
  Senior: "Senior",
  Mega: "Mega",
});

const SAUCE_NAME_EN = toNormalizedMap({
  Blanche: "White sauce",
  Harissa: "Harissa",
  Barbecue: "Barbecue",
  Algerienne: "Algerian sauce",
  Samourai: "Samurai sauce",
  Ketchup: "Ketchup",
  Mayonnaise: "Mayonnaise",
  Andalouse: "Andalouse sauce",
});

const FALLBACK_TERM_EN = toNormalizedMap({
  "viande de kebab": "kebab meat",
  "viande kebab": "kebab meat",
  "emince de kebab": "kebab meat strips",
  "v.kebab": "kebab meat",
  "v kebab": "kebab meat",
  "viande hachee": "minced beef",
  "steak hache": "minced beef steak",
  "v.hachee": "minced beef",
  "v hachee": "minced beef",
  "galette de pomme de terre": "hash brown",
  "pomme de terre": "potato",
  "sauce blanche": "white sauce",
  "sauce barbecue": "barbecue sauce",
  "piment jalapeno": "jalapeno pepper",
  "rondelle citron": "lemon slice",
  "chou rouge": "red cabbage",
  "oignon rouge": "red onion",
  "tomate cerise": "cherry tomato",
  "tomate fraiche": "fresh tomato",
  "saumon fume": "smoked salmon",
  "poulet pane": "breaded chicken",
  "poulet marine": "marinated chicken",
  lardons: "bacon bits",
  lardon: "bacon bits",
  champignons: "mushrooms",
  champignon: "mushroom",
  poivrons: "bell peppers",
  poivron: "bell pepper",
  croutons: "croutons",
  crouton: "crouton",
  anchois: "anchovies",
  capre: "capers",
  roquette: "arugula",
  mozzarella: "mozzarella",
  cheddar: "cheddar",
  boursin: "boursin",
  burrata: "burrata",
  brie: "brie",
  parmesan: "parmesan",
  raclette: "raclette cheese",
  chevre: "goat cheese",
  jambon: "ham",
  jambons: "hams",
  fromage: "cheese",
  fromages: "cheeses",
  tomate: "tomato",
  salade: "lettuce",
  oignon: "onion",
  frites: "fries",
  thon: "tuna",
  "œuf": "egg",
  "œufs": "eggs",
  oeufs: "eggs",
  oeuf: "egg",
  olives: "olives",
  olive: "olive",
  poulet: "chicken",
  steaks: "beef patties",
  steak: "beef patty",
  viande: "meat",
  viandes: "meats",
  radis: "radish",
  avocat: "avocado",
  ananas: "pineapple",
  artichaut: "artichoke",
  figue: "fig",
  miel: "honey",
  origan: "oregano",
  ail: "garlic",
  mais: "corn",
  "au choix": "of your choice",
  chacun: "each",
  boisson: "drink",
  servis: "served",
  servies: "served",
  avec: "with",
  frais: "fresh",
  "creme tomate": "tomato cream",
  creme: "cream",
  et: "and",
  ou: "or",
});

const ACCENT_CHAR_PATTERN: Record<string, string> = {
  a: "[aàáâäãå]",
  c: "[cç]",
  e: "[eéèêë]",
  i: "[iîïíì]",
  n: "[nñ]",
  o: "[oôöòóõ]",
  u: "[uùúûü]",
  y: "[yÿ]",
};

const termToAccentInsensitiveRegex = (term: string) => {
  const patternParts: string[] = [];
  for (let i = 0; i < term.length; i += 1) {
    const twoChars = term.slice(i, i + 2).toLowerCase();
    if (twoChars === "oe") {
      // Support oe ligature found in live menu content (oeuf / œuf).
      patternParts.push("(oe|œ)");
      i += 1;
      continue;
    }
    if (twoChars === "ae") {
      patternParts.push("(ae|æ)");
      i += 1;
      continue;
    }

    const char = term[i];
    if (!char) continue;
      const lower = char.toLowerCase();
      if (ACCENT_CHAR_PATTERN[lower]) {
        patternParts.push(ACCENT_CHAR_PATTERN[lower]);
      } else if (char === " ") {
        patternParts.push("\\s+");
      } else if (char === "'") {
        patternParts.push("['’]");
      } else if (char === ".") {
        patternParts.push("\\.");
      } else if (char === "-") {
        patternParts.push("\\s*-\\s*");
      } else {
        patternParts.push(escapeRegExp(char));
      }
  }

  const pattern = patternParts.join("");

  return new RegExp(`(^|[^\\p{L}\\p{N}])(${pattern})(?=$|[^\\p{L}\\p{N}])`, "giu");
};

const FALLBACK_PATTERNS = Object.entries(FALLBACK_TERM_EN)
  .sort((a, b) => b[0].length - a[0].length)
  .map(([term, replacement]) => ({
    replacement,
    pattern: termToAccentInsensitiveRegex(term),
  }));

const fallbackTranslate = (value: string): string => {
  let next = value;
  let changed = false;
  for (const { pattern, replacement } of FALLBACK_PATTERNS) {
    const replaced = next.replace(pattern, (_match, prefix: string) => `${prefix}${replacement}`);
    if (replaced !== next) {
      changed = true;
      next = replaced;
    }
  }

  if (!changed) return value;

  return next
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s*:\s*/g, ": ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const translateValue = (
  value: string,
  exactMap: Record<string, string>,
  options: { allowFallback?: boolean } = {},
) => {
  const exact = findFromMap(value, exactMap);
  if (exact) return exact;
  return options.allowFallback === false ? value : fallbackTranslate(value);
};

export const localizeMenu = (menu: MenuCategory[], locale: Locale): MenuCategory[] => {
  if (locale === "fr") return menu;

  return menu.map((category) => ({
    ...category,
    title: translateValue(category.title, CATEGORY_TITLE_EN),
    subtitle: category.subtitle
      ? translateValue(category.subtitle, CATEGORY_SUBTITLE_EN, { allowFallback: true })
      : undefined,
    items: category.items.map((item) => ({
      ...item,
      // Keep product naming predictable: exact overrides only.
      name: translateValue(item.name, ITEM_NAME_EN, { allowFallback: false }),
      // Descriptions evolve in admin, so we keep token-based fallback translation enabled.
      description: translateValue(item.description, ITEM_DESCRIPTION_EN, { allowFallback: true }),
      prices: item.prices.map((price) => ({
        ...price,
        label: price.label ? translateValue(price.label, PRICE_LABEL_EN) : price.label,
      })),
    })),
  }));
};

export const localizeSauceNames = (names: string[], locale: Locale): string[] => {
  if (locale === "fr") return names;
  return names.map((name) => translateValue(name, SAUCE_NAME_EN));
};
