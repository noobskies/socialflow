"use client";

import Dashboard from "@/features/dashboard/Dashboard";
import { useAppContext } from "./AppContext";

export default function DashboardPage() {
  const { posts, accounts, showToast, onPostCreated, onCompose } =
    useAppContext();

  return (
    <Dashboard
      posts={posts}
      accounts={accounts}
      showToast={showToast}
      onPostCreated={onPostCreated}
      onCompose={onCompose}
    />
  );
}
