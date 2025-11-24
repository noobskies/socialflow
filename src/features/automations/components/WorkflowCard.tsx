import React from "react";
import {
  ShoppingBag,
  Globe,
  MessageSquare,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Workflow } from "@/types";

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: (id: string) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onToggle,
}) => {
  const getIcon = () => {
    switch (workflow.icon) {
      case "shopping-bag":
        return <ShoppingBag className="w-6 h-6" />;
      case "globe":
        return <Globe className="w-6 h-6" />;
      case "alert-triangle":
        return <MessageSquare className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 p-6 rounded-xl border transition-all duration-200 ${
        workflow.active
          ? "border-indigo-200 dark:border-indigo-900/50 shadow-sm"
          : "border-slate-200 dark:border-slate-800 opacity-75"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-lg ${
              workflow.active
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
          >
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {workflow.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {workflow.description}
            </p>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center">
                If: {workflow.trigger}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center">
                Then: {workflow.action}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => onToggle(workflow.id)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              workflow.active
                ? "bg-indigo-600"
                : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                workflow.active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          {workflow.active && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Active
            </span>
          )}
        </div>
      </div>
      {workflow.active && (
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-4 text-xs text-slate-400">
          <span>Runs: {workflow.stats.runs}</span>
          <span>Last Run: {workflow.stats.lastRun}</span>
        </div>
      )}
    </div>
  );
};
