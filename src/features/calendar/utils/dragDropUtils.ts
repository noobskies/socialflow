import React from "react";
import { Post } from "@/types";

/**
 * Drag-and-drop handler utilities for calendar
 */

export interface DragHandlers {
  handleDragStart: (e: React.DragEvent, post: Post) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (
    e: React.DragEvent,
    day: number,
    month: number,
    year: number
  ) => void;
}

/**
 * Create drag-and-drop handlers for calendar
 */
export const createDragHandlers = (
  draggedPost: Post | null,
  setDraggedPost: (post: Post | null) => void,
  onUpdatePost?: (post: Post) => void
): DragHandlers => {
  const handleDragStart = (e: React.DragEvent, post: Post) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    day: number,
    month: number,
    year: number
  ) => {
    e.preventDefault();
    if (draggedPost && onUpdatePost) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onUpdatePost({
        ...draggedPost,
        scheduledDate: formattedDate,
        status: "scheduled",
      });
      setDraggedPost(null);
    }
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};
