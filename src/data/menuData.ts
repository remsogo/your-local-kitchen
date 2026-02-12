export interface MenuItem {
  name: string;
  description: string;
  prices: { label: string; price: string }[];
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
    subtitle: "Junior • Senior • Méga",
    items: [
      { name: "Marguerita", description: "Tomate, mozzarella, origan", prices: [{ label: "Junior", price: "7,00€" }, { label: "Senior", price: "10,00€" }, { label: "Méga", price: "14,00€" }] },
      { name: "4 Jambons", description: "Tomate, mozzarella, jambon, chorizo, bacon, lardons", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Kebab", description: "Tomate, mozzarella, v.kebab, oignon, tomate cerise, sauce blanche", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Napolitaine", description: "Tomate, mozzarella, anchois, câpre, olive", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Campione", description: "Tomate, mozzarella, viande hachée, champignon, œuf", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Calzone", description: "Tomate, mozzarella, jambon, œuf, champignon ou poulet ou 4 fromages ou v.hachée", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Reine", description: "Tomate, mozzarella, jambon, champignon", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Montagnarde", description: "Tomate, mozzarella, viande hachée, pomme de terre, raclette", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Mexicaine", description: "Tomate, mozzarella, v. hachée, olive, poivron, champignon", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "4 Fromages", description: "Tomate, mozzarella, brie, chèvre, parmesan", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Paysanne", description: "Tomate, mozzarella, lardon, œuf", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Hawaienne", description: "Tomate, mozzarella, jambon, ananas", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Orientale", description: "Tomate, mozzarella, merguez, poivron, olive, œuf", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Végétarienne", description: "Tomate, mozzarella, champignon, oignon, poivron", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Chicken", description: "Tomate, mozzarella, poulet, champignon, oignon", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Thon", description: "Tomate, mozzarella, thon, poivron, œuf", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Savoyarde", description: "Crème, mozzarella, lardon, pomme de terre, raclette", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Américaine", description: "Crème tomate, mozzarella, boursin, œuf, viande hachée", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Figue Miel", description: "Crème, mozzarella, chèvre, figue, miel", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Tartiflette", description: "Crème, mozzarella, lardon, pomme de terre, raclette", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Miami", description: "Crème, mozzarella, poulet ou v.hachée, pomme de terre, oignon", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Fermière", description: "Crème, mozzarella, lardon, oignon, œuf", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Chèvre Miel", description: "Crème, mozzarella, chèvre, miel", prices: [{ label: "Junior", price: "9,50€" }, { label: "Senior", price: "12,50€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Barbecue", description: "Sauce barbecue, mozzarella, viande hachée, oignon", prices: [{ label: "Junior", price: "7,00€" }, { label: "Senior", price: "9,00€" }, { label: "Méga", price: "13,00€" }] },
      { name: "Pizz'Atiq", description: "Tomate, mozzarella, kebab, oignon, ail, tomate fraîche, salade, piment jalapeno, sauce blanche", prices: [{ label: "Junior", price: "10,00€" }, { label: "Senior", price: "13,00€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Italienne", description: "Tomate, mozzarella, tomate cerise, roquette, burrata", prices: [{ label: "Junior", price: "10,00€" }, { label: "Senior", price: "13,00€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Venezia", description: "Crème, mozzarella, saumon fumé, rondelle citron", prices: [{ label: "Junior", price: "10,00€" }, { label: "Senior", price: "13,00€" }, { label: "Méga", price: "19,00€" }] },
      { name: "Pizz'Dessert", description: "Sauce barbecue, mozzarella, viande hachée, oignon", prices: [{ label: "Junior", price: "7,00€" }, { label: "Senior", price: "9,00€" }, { label: "Méga", price: "13,00€" }] },
    ],
  },
  {
    id: "burgers",
    title: "Burgers",
    subtitle: "Servis avec frites & boisson",
    items: [
      { name: "Double Cheese", description: "Double steak, cheddar, salade, tomate", prices: [{ label: "", price: "6,50€" }] },
      { name: "Triple Cheese", description: "Triple steak, cheddar, salade, tomate", prices: [{ label: "", price: "7,50€" }] },
      { name: "Big Cheese", description: "Maxi steak, cheddar, salade, tomate", prices: [{ label: "", price: "8,00€" }] },
      { name: "Cheese Burger", description: "Steak, cheddar, salade, tomate", prices: [{ label: "", price: "6,00€" }] },
      { name: "Chicken Burger", description: "Poulet pané, salade, tomate, sauce", prices: [{ label: "", price: "6,50€" }] },
      { name: "Country Burger", description: "Steak, galette de pomme de terre, cheddar", prices: [{ label: "", price: "7,50€" }] },
    ],
  },
  {
    id: "sandwichs",
    title: "Sandwichs",
    subtitle: "Servis avec frites — 7,50€ au choix",
    items: [
      { name: "Américain", description: "2 steaks + cheddar", prices: [{ label: "", price: "7,50€" }] },
      { name: "Kebab", description: "Viande kebab, salade, tomate, oignon", prices: [{ label: "", price: "7,50€" }] },
      { name: "Cordon Bleu", description: "Cordon bleu, salade, tomate", prices: [{ label: "", price: "7,50€" }] },
      { name: "Chicken", description: "Poulet mariné + cheddar", prices: [{ label: "", price: "7,50€" }] },
      { name: "Mixte", description: "Viande de kebab + steaks + cheddar", prices: [{ label: "", price: "7,50€" }] },
      { name: "Rustique", description: "2 steaks + galette de pomme de terre + cheddar", prices: [{ label: "", price: "7,50€" }] },
      { name: "Triple", description: "3 steaks + cheddar", prices: [{ label: "", price: "7,50€" }] },
      { name: "Normand", description: "2 steaks + bacon + boursin + cheddar", prices: [{ label: "", price: "7,50€" }] },
    ],
  },
  {
    id: "tacos",
    title: "Tacos",
    subtitle: "Viandes au choix : steak haché, émincé de kebab, nuggets, merguez, chicken tikka, cordon bleu",
    items: [
      { name: "Simple", description: "1 viande au choix", prices: [{ label: "", price: "7,50€" }] },
      { name: "Double", description: "2 viandes au choix", prices: [{ label: "", price: "8,50€" }] },
      { name: "Triple", description: "3 viandes au choix", prices: [{ label: "", price: "9,50€" }] },
    ],
  },
  {
    id: "croques",
    title: "Croques",
    items: [
      { name: "Croq' Madame", description: "Jambon + cheddar + œuf", prices: [{ label: "", price: "6,00€" }] },
      { name: "Croq' Monsieur", description: "Jambon + cheddar", prices: [{ label: "", price: "5,50€" }] },
    ],
  },
  {
    id: "assiettes",
    title: "Assiettes",
    subtitle: "Servies avec viande, salade, tomate, oignon et frites — 10,00€",
    items: [
      { name: "Viande Hachée", description: "Steak haché, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00€" }] },
      { name: "Cordon Bleu", description: "Cordon bleu, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00€" }] },
      { name: "Kebab", description: "Viande kebab, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00€" }] },
      { name: "Chicken", description: "Poulet, salade, tomate, oignon, frites", prices: [{ label: "", price: "10,00€" }] },
    ],
  },
  {
    id: "salades",
    title: "Salades",
    subtitle: "8,50€",
    items: [
      { name: "Chèvre Chaud", description: "Salade, tomate, lardon, chèvre, croûton", prices: [{ label: "", price: "8,50€" }] },
      { name: "Végétarienne", description: "Radis, chou rouge, oignon rouge, avocat, tomate, maïs", prices: [{ label: "", price: "8,50€" }] },
      { name: "Exotic", description: "Salade, tomate, avocat, ananas, poulet", prices: [{ label: "", price: "8,50€" }] },
      { name: "Norvégienne", description: "Salade, tomate, saumon fumé, oignon", prices: [{ label: "", price: "8,50€" }] },
    ],
  },
  {
    id: "supplements",
    title: "Suppléments",
    subtitle: "1,00€ chacun",
    items: [
      { name: "Bleu", description: "Fromage bleu", prices: [{ label: "", price: "1,00€" }] },
      { name: "Chèvre", description: "Fromage de chèvre", prices: [{ label: "", price: "1,00€" }] },
      { name: "Raclette", description: "Fromage raclette", prices: [{ label: "", price: "1,00€" }] },
      { name: "Poivrons", description: "Poivrons frais", prices: [{ label: "", price: "1,00€" }] },
      { name: "Champignons", description: "Champignons frais", prices: [{ label: "", price: "1,00€" }] },
    ],
  },
];

export const openingHours = [
  { day: "Lundi", hours: "10:30–14:30 / 18:00–22:00" },
  { day: "Mardi", hours: "10:30–14:30 / 18:00–22:00" },
  { day: "Mercredi", hours: "10:30–14:30 / 18:00–22:00" },
  { day: "Jeudi", hours: "10:30–14:30 / 18:00–22:00" },
  { day: "Vendredi", hours: "10:30–14:30 / 18:00–22:00" },
  { day: "Samedi", hours: "10:30–14:30 / 18:00–22:00" },
  { day: "Dimanche", hours: "10:30–14:30 / 18:00–22:00" },
];

export const deliveryHours = "11:00–14:30 / 18:00–22:00";

export const deliveryZones = [
  { zone: "Sonchamp (0-5 km)", minOrder: "20,00€", deliveryFee: "1,50€" },
  { zone: "5-10 km", minOrder: "25,00€", deliveryFee: "1,50€" },
  { zone: "10-15 km", minOrder: "30,00€", deliveryFee: "1,50€" },
  { zone: "15-20 km", minOrder: "35,00€", deliveryFee: "1,50€" },
];

export const restaurantInfo = {
  name: "Pizz'Atiq",
  address: "58 Rue André Thome",
  city: "78120 Sonchamp",
  phone: "",
  website: "pizz-atiq.fr",
};
