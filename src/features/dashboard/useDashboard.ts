import { useState, useEffect } from "react";
import { Trend } from "@/types";
import { getTrendingTopics } from "@/services/geminiService";

export function useDashboard(niche: string = "Tech & Marketing") {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const loadTrends = async () => {
    setLoadingTrends(true);
    try {
      const newTrends = await getTrendingTopics(niche);
      setTrends(newTrends);
    } catch (error) {
      console.error("Failed to load trends:", error);
    } finally {
      setLoadingTrends(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return {
    trends,
    loadingTrends,
    refreshTrends: loadTrends,
  };
}
