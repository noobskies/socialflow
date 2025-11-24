"use client";

import Library from "@/features/library/Library";
import { useAppContext } from "../../_components/AppContext";

export default function LibraryPage() {
  const { onCompose, userPlan, onOpenUpgrade, onPostCreated, showToast } =
    useAppContext();

  return (
    <Library
      onCompose={onCompose}
      userPlan={userPlan}
      onOpenUpgrade={onOpenUpgrade}
      onPostCreated={onPostCreated}
      showToast={showToast}
    />
  );
}
