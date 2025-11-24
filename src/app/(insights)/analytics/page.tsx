"use client";

import Analytics from "@/features/analytics/Analytics";
import { useAppContext } from "../../AppContext";

export default function AnalyticsPage() {
  const { showToast, userPlan, onOpenUpgrade, onCompose } = useAppContext();

  return (
    <Analytics
      showToast={showToast}
      userPlan={userPlan}
      onOpenUpgrade={onOpenUpgrade}
      onCompose={onCompose}
    />
  );
}
