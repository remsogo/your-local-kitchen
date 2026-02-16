import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem, menuData } from "@/data/menuData";

type DbCategory = {
  id: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
};

type DbPrice = {
  label: string;
  price: string;
  sort_order: number;
};

type DbItem = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  menu_item_prices?: DbPrice[];
};

export const useMenu = () => {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: categories, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order");

      if (catError) throw catError;

      // Fetch items with prices
      const { data: items, error: itemError } = await supabase
        .from("menu_items")
        .select("*, menu_item_prices(*)")
        .order("sort_order");

      if (itemError) throw itemError;

      // Transform to MenuCategory format
      const typedCategories = (categories || []) as DbCategory[];
      const typedItems = (items || []) as DbItem[];

      const result: MenuCategory[] = typedCategories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        subtitle: cat.subtitle || undefined,
        items: typedItems
          .filter((item) => item.category_id === cat.id)
          .map((item) => ({
            name: item.name,
            description: item.description,
            imageUrl: item.image_url || undefined,
            dbId: item.id,
            prices: (item.menu_item_prices || [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((p) => ({ label: p.label, price: p.price })),
          })),
      }));

      setMenu(result);
    } catch (err) {
      console.error("Error fetching menu:", err);
      // Fallback to static data
      setMenu(menuData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return { menu, loading, refetch: fetchMenu };
};
