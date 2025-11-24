import React from "react";
import { Zap, Globe } from "lucide-react";
import { ToastType } from "@/types";
import { useAutomations } from "./useAutomations";
import { WorkflowsTab } from "./tabs/WorkflowsTab";
import { IntegrationsTab } from "./tabs/IntegrationsTab";
import { CreateWorkflowModal } from "./components/CreateWorkflowModal";

interface AutomationsProps {
  showToast: (message: string, type: ToastType) => void;
}

const Automations: React.FC<AutomationsProps> = ({ showToast }) => {
  const automations = useAutomations();

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200 relative">
      <CreateWorkflowModal
        isOpen={automations.isCreateModalOpen}
        onClose={() => automations.setIsCreateModalOpen(false)}
        onSubmit={(workflow) => {
          automations.addWorkflow(workflow);
          showToast("Workflow created successfully!", "success");
        }}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Automations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Supercharge your workflow with integrations and rules
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          <button
            onClick={() => automations.setActiveTab("workflows")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              automations.activeTab === "workflows"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Workflows
          </button>
          <button
            onClick={() => automations.setActiveTab("integrations")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              automations.activeTab === "integrations"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Integrations
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {automations.activeTab === "workflows" ? (
          <WorkflowsTab
            workflows={automations.workflows}
            onToggle={automations.toggleWorkflow}
            onAdd={automations.addWorkflow}
            onOpenCreateModal={() => automations.setIsCreateModalOpen(true)}
            showToast={showToast}
          />
        ) : (
          <IntegrationsTab
            integrations={automations.integrations}
            onToggle={automations.toggleIntegration}
          />
        )}
      </div>
    </div>
  );
};

export default Automations;
