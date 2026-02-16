import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Sauce = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export const defaultSauces = [
  "Blanche",
  "Harissa",
  "Barbecue",
  "Algerienne",
  "Samourai",
  "Ketchup",
  "Mayonnaise",
  "Andalouse",
];

export const useSauces = () => {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSauces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from("sauces")
        .select("*")
        .order("sort_order");
      if (queryError) throw queryError;
      setSauces((data || []) as Sauce[]);
    } catch (err) {
      // Do not throw from hook: callers handle empty state with a safe fallback list.
      const message = err instanceof Error ? err.message : "Erreur chargement sauces";
      console.error("[Sauces] fetch failed", err);
      setError(message);
      setSauces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSauces();
  }, [fetchSauces]);

  return { sauces, loading, error, refetch: fetchSauces };
};
