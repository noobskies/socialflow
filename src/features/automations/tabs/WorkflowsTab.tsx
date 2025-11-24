import React from "react";
import { Plus } from "lucide-react";
import { Workflow, ToastType } from "@/types";
import { WorkflowCard } from "../components/WorkflowCard";
import { AIArchitectSidebar } from "../components/AIArchitectSidebar";
import { PopularTemplates } from "../components/PopularTemplates";

interface WorkflowsTabProps {
  workflows: Workflow[];
  onToggle: (id: string) => void;
  onAdd: (workflow: Workflow) => void;
  onOpenCreateModal: () => void;
  showToast: (message: string, type: ToastType) => void;
}

export const WorkflowsTab: React.FC<WorkflowsTabProps> = ({
  workflows,
  onToggle,
  onAdd,
  onOpenCreateModal,
  showToast,
}) => {
  const handleAddSuggestion = (suggestion: any) => {
    const workflow: Workflow = {
      id: Date.now().toString(),
      name: suggestion.name,
      description: suggestion.description,
      trigger: suggestion.trigger,
      action: suggestion.action,
      active: false,
      stats: { runs: 0, lastRun: "Never" },
      icon: "zap",
    };
    onAdd(workflow);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      {/* Main Workflow List */}
      <div className="lg:col-span-2 space-y-6">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onToggle={onToggle}
          />
        ))}

        <button
          onClick={onOpenCreateModal}
          className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Build Custom Workflow
        </button>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <AIArchitectSidebar
          onAddSuggestion={handleAddSuggestion}
          showToast={showToast}
        />
        <PopularTemplates
          onSelectTemplate={(template) =>
            showToast(`Template "${template}" coming soon!`, "info")
          }
        />
      </div>
    </div>
  );
};
