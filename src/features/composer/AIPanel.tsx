import React, { useState } from "react";
import { Sparkles, Users } from "lucide-react";
import { AIWriter } from "./AIWriter";
import { AIDesigner } from "./AIDesigner";
import { TeamCollaboration } from "./TeamCollaboration";
import { Platform, ToastType, PlanTier } from "@/types";

interface AIPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: Platform[];
  showToast: (message: string, type: ToastType) => void;
  userPlan: PlanTier;
  isAgency?: boolean;
  comments?: any[];
  onAddComment?: (comment: string) => void;
  workflowStatus?: string;
  onChangeStatus?: (status: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  content,
  onContentChange,
  selectedPlatforms,
  showToast,
  userPlan,
  isAgency = false,
  comments = [],
  onAddComment,
  workflowStatus = "draft",
  onChangeStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"write" | "design" | "team">(
    "write"
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden ring-1 ring-indigo-50 dark:ring-indigo-900/30">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 border-b border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-200">
          {activeTab === "team" ? (
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          )}
          <span className="font-semibold text-sm">
            {activeTab === "team"
              ? "Team Collaboration"
              : "Gemini 3 Pro Assistant"}
          </span>
        </div>
        <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "write" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            Writer
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "design" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            Designer
          </button>
          {isAgency && (
            <button
              onClick={() => setActiveTab("team")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${activeTab === "team" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              Team
              {comments.length > 0 && (
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-5 bg-indigo-50/30 dark:bg-indigo-900/10">
        {activeTab === "write" && (
          <AIWriter
            content={content}
            onContentChange={onContentChange}
            selectedPlatforms={selectedPlatforms}
            showToast={showToast}
          />
        )}
        {activeTab === "design" && (
          <AIDesigner
            onImageGenerated={(url) => {
              showToast("Image generated successfully!", "success");
            }}
            showToast={showToast}
          />
        )}
        {activeTab === "team" && isAgency && (
          <TeamCollaboration
            comments={comments}
            onAddComment={onAddComment}
            workflowStatus={workflowStatus}
            onChangeStatus={onChangeStatus}
          />
        )}
      </div>
    </div>
  );
};

export default AIPanel;
