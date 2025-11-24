import React from "react";
import { Post, PlanTier } from "@/types";
import { KanbanColumn } from "../components/KanbanColumn";

interface KanbanViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  userPlan: PlanTier;
}

interface ColumnConfig {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  posts,
  onPostClick,
  userPlan,
}) => {
  const isAgency = userPlan === "agency";

  const allColumns: ColumnConfig[] = [
    {
      id: "draft",
      label: "Drafts",
      color: "bg-slate-100 dark:bg-slate-800",
      textColor: "text-slate-600 dark:text-slate-400",
    },
    {
      id: "pending_review",
      label: "In Review",
      color: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "scheduled",
      label: "Scheduled",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "published",
      label: "Published",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  const columns = isAgency
    ? allColumns
    : allColumns.filter((col) => col.id !== "pending_review");

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden animate-in fade-in duration-300">
      <div className="flex h-full gap-6 min-w-[1000px] pb-4">
        {columns.map((col) => {
          const colPosts = posts.filter((p) => p.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              posts={colPosts}
              onPostClick={onPostClick}
            />
          );
        })}
      </div>
    </div>
  );
};
