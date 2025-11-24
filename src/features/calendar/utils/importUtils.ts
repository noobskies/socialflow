import React from "react";
import { Post, Platform } from "@/types";

/**
 * Bulk import posts from CSV file
 */
export const handleBulkImport = (
  e: React.ChangeEvent<HTMLInputElement>,
  onPostCreated?: (post: Post) => void
) => {
  if (!e.target.files || !e.target.files[0] || !onPostCreated) return;

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result as string;
    if (!text) return;

    // Simple CSV parser: date,time,content,platform
    const lines = text.split("\n").slice(1); // Skip header
    let count = 0;

    lines.forEach((line) => {
      if (!line.trim()) return;
      const [date, time, content, platform] = line
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""));

      if (date && content) {
        const newPost: Post = {
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content,
          scheduledDate: date,
          time: time || "12:00",
          platforms: [(platform as Platform) || "twitter"],
          status: "scheduled",
        };
        onPostCreated(newPost);
        count++;
      }
    });

    alert(`Successfully imported ${count} posts!`);
  };

  reader.readAsText(file);
};
