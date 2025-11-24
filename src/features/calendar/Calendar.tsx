import React from "react";
import { Plus } from "lucide-react";
import { Draft, Post, PlanTier } from "@/types";
import { useCalendar } from "./useCalendar";
import { ViewModeToggle } from "./ViewModeToggle";
import { CalendarView } from "./views/CalendarView";
import { KanbanView } from "./views/KanbanView";
import { GridView } from "./views/GridView";
import { PostDetailModal } from "./components/PostDetailModal";
import { ExportMenu } from "./components/ExportMenu";
import { handleExportPDF, handleExportCSV } from "./utils/exportUtils";
import { handleBulkImport } from "./utils/importUtils";

interface CalendarProps {
  onCompose: (draft?: Draft) => void;
  posts?: Post[];
  onUpdatePost?: (post: Post) => void;
  onPostCreated?: (post: Post) => void;
  userPlan?: PlanTier;
}

export const Calendar: React.FC<CalendarProps> = ({
  onCompose,
  posts = [],
  onUpdatePost,
  onPostCreated,
  userPlan = "free",
}) => {
  const {
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
  } = useCalendar();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleBulkImport(e, onPostCreated);
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".csv"
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={closeModal}
          onEdit={(draft) => {
            closeModal();
            onCompose(draft);
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Content Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Plan, visualize, and manage your workflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportMenu
            isOpen={isExportMenuOpen}
            onToggle={() => setIsExportMenuOpen(!isExportMenuOpen)}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            onImport={() => fileInputRef.current?.click()}
          />

          <ViewModeToggle viewMode={viewMode} onViewChange={setViewMode} />

          <button
            onClick={() => onCompose()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === "calendar" && (
        <CalendarView
          posts={posts}
          onDateClick={(date) => onCompose({ scheduledDate: date })}
          onPostClick={openModal}
          draggedPost={draggedPost}
          onDragStart={setDraggedPost}
          onDragEnd={() => setDraggedPost(null)}
          onUpdatePost={onUpdatePost}
        />
      )}

      {viewMode === "kanban" && (
        <KanbanView posts={posts} onPostClick={openModal} userPlan={userPlan} />
      )}

      {viewMode === "grid" && (
        <GridView posts={posts} onPostClick={openModal} onCompose={onCompose} />
      )}
    </div>
  );
};

export default Calendar;
