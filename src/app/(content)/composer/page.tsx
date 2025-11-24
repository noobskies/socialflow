"use client";

import Composer from "@/features/composer/Composer";
import { useAppContext } from "../../AppContext";

export default function ComposerPage() {
  const { showToast, onPostCreated, userPlan, initialDraft } = useAppContext();

  return (
    <Composer
      showToast={showToast}
      onPostCreated={onPostCreated}
      userPlan={userPlan}
      initialDraft={initialDraft}
    />
  );
}
