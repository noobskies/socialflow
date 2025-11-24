"use client";

import LinkManager from "@/features/linkmanager/LinkManager";
import { useAppContext } from "../../AppContext";

export default function LinksPage() {
  const { showToast } = useAppContext();

  return <LinkManager showToast={showToast} />;
}
