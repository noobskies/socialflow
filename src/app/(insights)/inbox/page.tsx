"use client";

import Inbox from "@/features/inbox/Inbox";
import { useAppContext } from "../../AppContext";

export default function InboxPage() {
  const { showToast } = useAppContext();

  return <Inbox showToast={showToast} />;
}
