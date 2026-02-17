export interface MenuItem {
  name: string;
  description: string;
  prices: { label: string; price: string }[];
  imageUrl?: string;
  dbId?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "pizzas",
    title: "Pizzas",
    subtitle: "Junior - Senior - Mega",
    items: [
      { name: "Marguerita", description: "Tomate, mozzarella, origan", prices: [{ label: "Junior", price: "7,00 EUR" }, { label: "Senior", price: "10,00 EUR" }, { label: "Mega", price: "14,00 EUR" }] },
      { name: "4 Jambons", description: "Tomate, mozzarella, jambon, chorizo, bacon, lardons", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Kebab", description: "Tomate, mozzarella, v.kebab, oignon, tomate cerise, sauce blanche", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Napolitaine", description: "Tomate, mozzarella, anchois, capre, olive", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Campione", description: "Tomate, mozzarella, viande hachee, champignon, oeuf", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Calzone", description: "Tomate, mozzarella, jambon, oeuf, champignon ou poulet ou 4 fromages ou v.hachee", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Reine", description: "Tomate, mozzarella, jambon, champignon", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Montagnarde", description: "Tomate, mozzarella, viande hachee, pomme de terre, raclette", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Mexicaine", description: "Tomate, mozzarella, v. hachee, olive, poivron, champignon", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "4 Fromages", description: "Tomate, mozzarella, brie, chevre, parmesan", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Paysanne", description: "Tomate, mozzarella, lardon, oeuf", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Hawaienne", description: "Tomate, mozzarella, jambon, ananas", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Orientale", description: "Tomate, mozzarella, merguez, poivron, olive, oeuf", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Vegetarienne", description: "Tomate, mozzarella, champignon, oignon, poivron", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Chicken", description: "Tomate, mozzarella, poulet, champignon, oignon", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Thon", description: "Tomate, mozzarella, thon, poivron, oeuf", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Savoyarde", description: "Creme, mozzarella, lardon, pomme de terre, raclette", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Americaine", description: "Creme tomate, mozzarella, boursin, oeuf, viande hachee", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Figue Miel", description: "Creme, mozzarella, chevre, figue, miel", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Tartiflette", description: "Creme, mozzarella, lardon, pomme de terre, raclette", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Miami", description: "Creme, mozzarella, poulet ou v.hachee, pomme de terre, oignon", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Fermiere", description: "Creme, mozzarella, lardon, oignon, oeuf", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Chevre Miel", description: "Creme, mozzarella, chevre, miel", prices: [{ label: "Junior", price: "9,50 EUR" }, { label: "Senior", price: "12,50 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Barbecue", description: "Sauce barbecue, mozzarella, viande hachee, oignon", prices: [{ label: "Junior", price: "7,00 EUR" }, { label: "Senior", price: "9,00 EUR" }, { label: "Mega", price: "13,00 EUR" }] },
      { name: "Pizz'Atiq", description: "Tomate, mozzarella, kebab, oignon, ail, tomate fraiche, salade, piment jalapeno, sauce blanche", prices: [{ label: "Junior", price: "10,00 EUR" }, { label: "Senior", price: "13,00 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Italienne", description: "Tomate, mozzarella, tomate cerise, roquette, burrata", prices: [{ label: "Junior", price: "10,00 EUR" }, { label: "Senior", price: "13,00 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Venezia", description: "Creme, mozzarella, saumon fume, rondelle citron", prices: [{ label: "Junior", price: "10,00 EUR" }, { label: "Senior", price: "13,00 EUR" }, { label: "Mega", price: "19,00 EUR" }] },
      { name: "Pizz'Dessert", description: "Sauce barbecue, mozzarella, viande hachee, oignon", prices: [{ label: "Junior", price: "7,00 EUR" }, { label: "Senior", price: "9,00 EUR" }, { label: "Mega", price: "13,00 EUR" }] },
    ],
  },
  {
    id: "burgers",
    title: "Burgers",
    subtitle: "Servis avec frites & boisson",
    items: [
      { name: "Double Cheese", description: "Double steak, cheddar, salade, tomate", prices: [{ label: "", price: "6,50 EUR" }] },
      { name: "Triple Cheese", description: "Triple steak, cheddar, salade, tomate", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Big Cheese", description: "Maxi steak, cheddar, salade, tomate", prices: [{ label: "", price: "8,00 EUR" }] },
      { name: "Cheese Burger", description: "Steak, cheddar, salade, tomate", prices: [{ label: "", price: "6,00 EUR" }] },
      { name: "Chicken Burger", description: "Poulet pane, salade, tomate, sauce", prices: [{ label: "", price: "6,50 EUR" }] },
      { name: "Country Burger", description: "Steak, galette de pomme de terre, cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
    ],
  },
  {
    id: "sandwichs",
    title: "Sandwichs",
    subtitle: "Servis avec frites - 7,50 EUR au choix",
    items: [
      { name: "Americain", description: "2 steaks + cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Kebab", description: "Viande kebab, salade, tomate, oignon", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Cordon Bleu", description: "Cordon bleu, salade, tomate", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Chicken", description: "Poulet marine + cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Mixte", description: "Viande de kebab + steaks + cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Rustique", description: "2 steaks + galette de pomme de terre + cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Triple", description: "3 steaks + cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Normand", description: "2 steaks + bacon + boursin + cheddar", prices: [{ label: "", price: "7,50 EUR" }] },
    ],
  },
  {
    id: "tacos",
    title: "Tacos",
    subtitle: "Viandes au choix : steak hache, emince de kebab, nuggets, merguez, chicken tikka, cordon bleu",
    items: [
      { name: "Simple", description: "1 viande au choix", prices: [{ label: "", price: "7,50 EUR" }] },
      { name: "Double", description: "2 viandes au choix", prices: [{ label: "", price: "8,50 EUR" }] },
      { name: "Triple", description: "3 viandes au choix", prices: [{ label: "", price: "9,50 EUR" }] },
    ],
  },
  {
    id: "croques",
    title: "Croques",
    items: [
      { name: "Croq' Madame", description: "Jambon + cheddar + oeuf", prices: [{ label: "", price: "6,00 EUR" }] },
      { name: "Croq' Monsieur", description: "Jambon + cheddar", prices: [{ label: "", price: "5,50 EUR" }] },
    ],
  },
  {
    id: "assiettes",
    title: "Assiettes",
    subtitle: "Servies avec viande, salade, tomate, oignon et frites - 10,00 EUR",
    items: [
      { name: "Viande Hachee", description: "Steak hache, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00 EUR" }] },
      { name: "Cordon Bleu", description: "Cordon bleu, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00 EUR" }] },
      { name: "Kebab", description: "Viande kebab, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00 EUR" }] },
      { name: "Chicken", description: "Poulet, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00 EUR" }] },
    ],
  },
  {
    id: "salades",
    title: "Salades",
    subtitle: "8,50 EUR",
    items: [
      { name: "Chevre Chaud", description: "Salade, tomate, lardon, chevre, crouton", prices: [{ label: "", price: "8,50 EUR" }] },
      { name: "Vegetarienne", description: "Radis, chou rouge, oignon rouge, avocat, tomate, mais", prices: [{ label: "", price: "8,50 EUR" }] },
      { name: "Exotic", description: "Salade, tomate, avocat, ananas, poulet", prices: [{ label: "", price: "8,50 EUR" }] },
      { name: "Norvegienne", description: "Salade, tomate, saumon fume, oignon", prices: [{ label: "", price: "8,50 EUR" }] },
    ],
  },
  {
    id: "supplements",
    title: "Supplements",
    subtitle: "1,00 EUR chacun",
    items: [
      { name: "Bleu", description: "Fromage bleu", prices: [{ label: "", price: "1,00 EUR" }] },
      { name: "Chevre", description: "Fromage de chevre", prices: [{ label: "", price: "1,00 EUR" }] },
      { name: "Raclette", description: "Fromage raclette", prices: [{ label: "", price: "1,00 EUR" }] },
      { name: "Poivrons", description: "Poivrons frais", prices: [{ label: "", price: "1,00 EUR" }] },
      { name: "Champignons", description: "Champignons frais", prices: [{ label: "", price: "1,00 EUR" }] },
    ],
  },
];

export const openingHours = [
  { day: "Lundi", hours: "10:30-14:30 / 18:00-22:00" },
  { day: "Mardi", hours: "10:30-14:30 / 18:00-22:00" },
  { day: "Mercredi", hours: "10:30-14:30 / 18:00-22:00" },
  { day: "Jeudi", hours: "10:30-14:30 / 18:00-22:00" },
  { day: "Vendredi", hours: "10:30-14:30 / 18:00-22:00" },
  { day: "Samedi", hours: "10:30-14:30 / 18:00-22:00" },
  { day: "Dimanche", hours: "10:30-14:30 / 18:00-22:00" },
];

export const deliveryHours = "11:00-14:30 / 18:00-22:00";

export const deliveryZones = [
  { zone: "Sonchamp (0-5 km)", minOrder: "20,00 EUR", deliveryFee: "1,50 EUR" },
  { zone: "5-10 km", minOrder: "25,00 EUR", deliveryFee: "2,00 EUR" },
  { zone: "10-15 km", minOrder: "30,00 EUR", deliveryFee: "2,50 EUR" },
  { zone: "15-20 km", minOrder: "35,00 EUR", deliveryFee: "3,50 EUR" },
];

export const restaurantInfo = {
  name: "Pizz'Atiq",
  address: "58 Rue Andre Thome",
  city: "78120 Sonchamp",
  phone: "06.84.06.93.85",
  secondaryPhone: "01.34.84.93.46",
  website: "pizzatiq.fr",
};



