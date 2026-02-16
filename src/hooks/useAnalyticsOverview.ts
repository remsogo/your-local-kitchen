import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RawEvent = {
  event_type: string;
  page_path: string | null;
  target: string | null;
  search_query: string | null;
  created_at: string;
};

export type AnalyticsPageRow = {
  page: string;
  impressions: number;
  clicks: number;
  topSearch: string;
};

export type AnalyticsOverview = {
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
  pages: AnalyticsPageRow[];
  topTargets: Array<{ target: string; clicks: number }>;
};

export const buildAnalyticsOverview = (rows: RawEvent[]): AnalyticsOverview => {
  // Keep dashboard focused on customer behavior; back-office page is intentionally excluded.
  const customerRows = rows.filter((row) => (row.page_path || "/") !== "/admin");
  const viewsByPage = new Map<string, number>();
  const clicksByPage = new Map<string, number>();
  const searchByPage = new Map<string, Map<string, number>>();
  const clicksByTarget = new Map<string, number>();

  // Build aggregated counters client-side so this works without custom SQL views/RPC.
  for (const row of customerRows) {
    const page = row.page_path || "/";
    if (row.event_type === "page_view") {
      viewsByPage.set(page, (viewsByPage.get(page) || 0) + 1);
      if (row.search_query) {
        const queryMap = searchByPage.get(page) || new Map<string, number>();
        queryMap.set(row.search_query, (queryMap.get(row.search_query) || 0) + 1);
        searchByPage.set(page, queryMap);
      }
    }
    if (row.event_type === "click") {
      clicksByPage.set(page, (clicksByPage.get(page) || 0) + 1);
      if (row.target) {
        clicksByTarget.set(row.target, (clicksByTarget.get(row.target) || 0) + 1);
      }
    }
  }

  const pages = Array.from(new Set([...viewsByPage.keys(), ...clicksByPage.keys()]))
    .map((page) => {
      const topSearchMap = searchByPage.get(page) || new Map<string, number>();
      const topSearchEntry = Array.from(topSearchMap.entries()).sort((a, b) => b[1] - a[1])[0];
      return {
        page,
        impressions: viewsByPage.get(page) || 0,
        clicks: clicksByPage.get(page) || 0,
        topSearch: topSearchEntry ? topSearchEntry[0] : "-",
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const totalImpressions = pages.reduce((sum, p) => sum + p.impressions, 0);
  const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const topTargets = Array.from(clicksByTarget.entries())
    .map(([target, clicks]) => ({ target, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return { totalImpressions, totalClicks, ctr, pages, topTargets };
};

export const useAnalyticsOverview = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: events, error: queryError } = await supabase
        .from("analytics_events")
        .select("event_type,page_path,target,search_query,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(10000);

      if (queryError) throw queryError;

      const rows = (events || []) as RawEvent[];
      setData(buildAnalyticsOverview(rows));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur stats";
      console.error("[Analytics] overview failed", err);
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { data, loading, error, refetch: fetchOverview };
};
