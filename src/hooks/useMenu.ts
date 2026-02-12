import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem, menuData } from "@/data/menuData";

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
      const result: MenuCategory[] = (categories || []).map((cat) => ({
        id: cat.id,
        title: cat.title,
        subtitle: cat.subtitle || undefined,
        items: (items || [])
          .filter((item) => item.category_id === cat.id)
          .map((item) => ({
            name: item.name,
            description: item.description,
            imageUrl: item.image_url || undefined,
            dbId: item.id,
            prices: (item.menu_item_prices || [])
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((p: any) => ({ label: p.label, price: p.price })),
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
