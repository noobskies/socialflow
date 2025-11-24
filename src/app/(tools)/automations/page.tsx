"use client";

import Automations from "@/features/automations/Automations";
import { useAppContext } from "../../AppContext";

export default function AutomationsPage() {
  const { showToast } = useAppContext();

  return <Automations showToast={showToast} />;
}
