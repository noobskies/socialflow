import { useState, useRef } from "react";
import { Post } from "@/types";

type ViewMode = "calendar" | "kanban" | "grid";

/**
 * Custom hook for Calendar state management
 */
export function useCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [draggedPost, setDraggedPost] = useState<Post | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (post: Post) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  return {
    viewMode,
    setViewMode,
    selectedPost,
    openModal,
    closeModal,
    draggedPost,
    setDraggedPost,
    isExportMenuOpen,
    setIsExportMenuOpen,
    fileInputRef,
  };
}
