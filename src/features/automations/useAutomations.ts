import { useState } from "react";
import { Workflow, Integration } from "@/types";
import { MOCK_WORKFLOWS, MOCK_INTEGRATIONS } from "@/utils/constants";

export function useAutomations() {
  const [activeTab, setActiveTab] = useState<"workflows" | "integrations">("workflows");
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  const addWorkflow = (workflow: Workflow) => {
    setWorkflows([...workflows, workflow]);
  };

  return {
    activeTab,
    setActiveTab,
    workflows,
    toggleWorkflow,
    addWorkflow,
    integrations,
    toggleIntegration,
    isCreateModalOpen,
    setIsCreateModalOpen,
  };
}
