import React, { useState } from "react";
import { PenSquare, Save } from "lucide-react";
import { Post, ToastType } from "@/types";

interface QuickDraftProps {
  onSave: (post: Post) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const QuickDraft: React.FC<QuickDraftProps> = ({
  onSave,
  showToast,
}) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content,
      platforms: [],
      scheduledDate: new Date().toISOString().split("T")[0],
      status: "draft",
      time: "12:00",
    };

    onSave(newPost);
    setContent("");
    showToast("Quick draft saved to content calendar", "success");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <PenSquare className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Quick Draft
        </h3>
      </div>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 mb-3 transition-all"
      />
      <div className="flex justify-end relative z-10">
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </button>
      </div>
    </div>
  );
};
