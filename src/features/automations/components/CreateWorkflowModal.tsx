import React, { useState } from "react";
import { X, Zap, Bot } from "lucide-react";
import { Workflow } from "@/types";

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: Workflow) => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    trigger: "",
    action: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name || !formData.trigger || !formData.action) return;

    const workflow: Workflow = {
      id: Date.now().toString(),
      name: formData.name,
      description: `Custom workflow triggered by ${formData.trigger}`,
      trigger: formData.trigger,
      action: formData.action,
      active: true,
      stats: { runs: 0, lastRun: "Never" },
      icon: "zap",
    };

    onSubmit(workflow);
    onClose();
    setFormData({ name: "", trigger: "", action: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            Build Workflow
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Workflow Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Auto-Welcome New Followers"
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Trigger (When)
              </label>
              <select
                value={formData.trigger}
                onChange={(e) =>
                  setFormData({ ...formData, trigger: e.target.value })
                }
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Trigger</option>
                <option value="New Follower">New Follower</option>
                <option value="New Comment">New Comment</option>
                <option value="New Shopify Product">New Shopify Product</option>
                <option value="New WordPress Post">New WordPress Post</option>
                <option value="Mentioned in Post">Mentioned in Post</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Action (Then)
              </label>
              <select
                value={formData.action}
                onChange={(e) =>
                  setFormData({ ...formData, action: e.target.value })
                }
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Action</option>
                <option value="Send DM">Send DM</option>
                <option value="Auto-Reply">Auto-Reply</option>
                <option value="Draft Post">Draft Post</option>
                <option value="Notify Slack">Notify Slack</option>
                <option value="Add to List">Add to List</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-center text-sm text-indigo-800 dark:text-indigo-200">
            <Bot className="w-5 h-5 mr-3 shrink-0" />
            This workflow will run automatically based on your settings.
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.trigger || !formData.action}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm disabled:opacity-50"
          >
            Create Workflow
          </button>
        </div>
      </div>
    </div>
  );
};
