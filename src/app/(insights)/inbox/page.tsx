"use client";

import Inbox from "@/features/inbox/Inbox";
import { useAppContext } from "../../_components/AppContext";

export default function InboxPage() {
  const { showToast } = useAppContext();

  return <Inbox showToast={showToast} />;
}
