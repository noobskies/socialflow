# Phase 6g: Automations Refactoring

## Overview

Refactor the Automations component (381 lines) into a clean orchestrator with focused sub-components. Final component refactoring before App.tsx simplification.

**Current State**: Monolithic component with 2 tabs (workflows, integrations)
**Target State**: ~70-line orchestrator + 8-10 focused components
**Complexity**: Medium - workflow cards with toggles, AI suggestions, modal system

## Success Metrics

- **Line Reduction**: 381 → ~70 lines in main Automations.tsx (-82%)
- **Component Count**: 8-10 new focused components
- **TypeScript**: 0 compilation errors
- **Functionality**: All features preserved (workflows, integrations, AI architect)
- **Dark Mode**: Fully supported
- **Mobile**: Responsive on all breakpoints

## Component Breakdown

### File Organization
```
/src/features/automations/
├── Automations.tsx (70-line orchestrator)
├── useAutomations.ts (state management hook)
├── /tabs
│   ├── WorkflowsTab.tsx
│   └── IntegrationsTab.tsx
├── /components
│   ├── WorkflowCard.tsx
│   ├── CreateWorkflowModal.tsx
│   ├── AIArchitectSidebar.tsx
│   ├── PopularTemplates.tsx
│   ├── IntegrationCard.tsx
│   └── IntegrationPlaceholder.tsx
└── /utils
    └── workflowUtils.ts
```

## Current Component Analysis

**Automations.tsx (381 lines)**:
- **2 Tabs**: workflows (automation rules), integrations (app connections)
- **Workflows Tab**: Workflow cards + create modal + AI suggestion sidebar
- **Integrations Tab**: Integration connection cards + request placeholder
- State management for both tabs
- Create workflow modal
- AI workflow suggestions based on business type
- Toggle workflow active/inactive states
- Toggle integration connection states

## Implementation Plan

### Sub-Phase 6g-A: Foundation & Workflow Components (20 min)

**Goal**: Create hook and workflow card components

**1. Create useAutomations.ts hook**
```typescript
// /src/features/automations/useAutomations.ts
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
```

**2. Create WorkflowCard.tsx**
```typescript
// /src/features/automations/components/WorkflowCard.tsx
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
              workflow.active ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
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
```

**3. Create CreateWorkflowModal.tsx**
```typescript
// /src/features/automations/components/CreateWorkflowModal.tsx
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
```

**Verification**:
- [ ] useAutomations hook compiles
- [ ] WorkflowCard renders with icon
- [ ] Toggle switch works
- [ ] Modal opens/closes
- [ ] Form validation works

---

### Sub-Phase 6g-B: AI Architect & Templates (15 min)

**Goal**: Extract AI suggestion components

**1. Create AIArchitectSidebar.tsx**
```typescript
// /src/features/automations/components/AIArchitectSidebar.tsx
import React, { useState } from "react";
import { Bot, Zap, Loader2 } from "lucide-react";
import { ToastType } from "@/types";
import { suggestWorkflows } from "@/services/geminiService";

interface AIArchitectSidebarProps {
  onAddSuggestion: (suggestion: any) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const AIArchitectSidebar: React.FC<AIArchitectSidebarProps> = ({
  onAddSuggestion,
  showToast,
}) => {
  const [businessType, setBusinessType] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSuggest = async () => {
    if (!businessType) return;
    setIsSuggesting(true);
    const newSuggestions = await suggestWorkflows(businessType);
    setSuggestions(newSuggestions);
    setIsSuggesting(false);
  };

  const handleAddSuggestion = (suggestion: any) => {
    onAddSuggestion(suggestion);
    setSuggestions(suggestions.filter((s) => s !== suggestion));
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-indigo-200" />
        <h3 className="font-bold text-lg">AI Architect</h3>
      </div>
      <p className="text-indigo-100 text-sm mb-4">
        Tell me about your business, and I'll design the perfect automation
        strategy.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="e.g. Coffee Shop, SaaS, Gym"
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-indigo-200 outline-none focus:bg-white/20"
        />
        <button
          onClick={handleSuggest}
          disabled={!businessType || isSuggesting}
          className="bg-white text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {isSuggesting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/10 rounded-lg p-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
            >
              <h4 className="font-bold text-sm">{s.name}</h4>
              <p className="text-xs text-indigo-100 mb-2 opacity-80">
                {s.description}
              </p>
              <button
                onClick={() => handleAddSuggestion(s)}
                className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded text-xs font-bold transition-colors"
              >
                Add Workflow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**2. Create PopularTemplates.tsx**
```typescript
// /src/features/automations/components/PopularTemplates.tsx
import React from "react";
import { Plus } from "lucide-react";

const TEMPLATES = [
  "RSS to Twitter",
  "Instagram to Pinterest",
  "Welcome New Followers",
];

interface PopularTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

export const PopularTemplates: React.FC<PopularTemplatesProps> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">
        Popular Templates
      </h3>
      <div className="space-y-3">
        {TEMPLATES.map((template) => (
          <div
            key={template}
            onClick={() => onSelectTemplate(template)}
            className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer group"
          >
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {template}
            </span>
            <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] AI Architect sidebar displays
- [ ] Business type input works
- [ ] AI suggestions generate
- [ ] Add suggestion button works
- [ ] Popular templates display

---

### Sub-Phase 6g-C: Integration Components (15 min)

**Goal**: Extract integration management components

**1. Create IntegrationCard.tsx**
```typescript
// /src/features/automations/components/IntegrationCard.tsx
import React from "react";
import { ShoppingBag, Slack, Globe, Mail, CheckCircle2 } from "lucide-react";
import { Integration } from "@/types";

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (id: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onToggle,
}) => {
  const getIcon = () => {
    switch (integration.icon) {
      case "shopping-bag":
        return <ShoppingBag className="w-8 h-8" />;
      case "slack":
        return <Slack className="w-8 h-8" />;
      case "globe":
        return <Globe className="w-8 h-8" />;
      case "mail":
        return <Mail className="w-8 h-8" />;
      default:
        return <Globe className="w-8 h-8" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
          integration.connected
            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
        }`}
      >
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {integration.name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-6">
        {integration.category}
      </p>

      <button
        onClick={() => onToggle(integration.id)}
        className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
          integration.connected
            ? "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {integration.connected ? "Manage Connection" : "Connect App"}
      </button>

      {integration.connected && (
        <div className="absolute top-4 right-4 text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
```

**2. Create IntegrationPlaceholder.tsx**
```typescript
// /src/features/automations/components/IntegrationPlaceholder.tsx
import React from "react";
import { Plus } from "lucide-react";

export const IntegrationPlaceholder: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
      <Plus className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4 group-hover:text-indigo-500 transition-colors" />
      <h3 className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
        Request Integration
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
        Don't see your tool?
      </p>
    </div>
  );
};
```

**Verification**:
- [ ] Integration cards display correctly
- [ ] Toggle connection works
- [ ] Connected state shows checkmark
- [ ] Placeholder card displays

---

### Sub-Phase 6g-D: Tab Components (15 min)

**Goal**: Create tab containers

**1. Create WorkflowsTab.tsx**
```typescript
// /src/features/automations/tabs/WorkflowsTab.tsx
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
```

**2. Create IntegrationsTab.tsx**
```typescript
// /src/features/automations/tabs/IntegrationsTab.tsx
import React from "react";
import { Integration } from "@/types";
import { IntegrationCard } from "../components/IntegrationCard";
import { IntegrationPlaceholder } from "../components/IntegrationPlaceholder";

interface IntegrationsTabProps {
  integrations: Integration[];
  onToggle: (id: string) => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  integrations,
  onToggle,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onToggle={onToggle}
        />
      ))}
      <IntegrationPlaceholder />
    </div>
  );
};
```

**Verification**:
- [ ] WorkflowsTab displays all workflows
- [ ] AI sidebar and templates show
- [ ] IntegrationsTab displays all integrations
- [ ] Placeholder card appears

---

### Sub-Phase 6g-E: Final Integration (15 min)

**Goal**: Create main orchestrator and integrate with App.tsx

**1. Create Automations.tsx orchestrator**
```typescript
// /src/features/automations/Automations.tsx
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

export const Automations: React.FC<AutomationsProps> = ({ showToast }) => {
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
```

**2. Move mock data to constants.ts**
```typescript
// Add to /src/utils/constants.ts
export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "1",
    name: "Promote New Products",
    description: "When a new product is added to Shopify, generate and schedule a post.",
    trigger: "New Shopify Product",
    action: "Draft Social Post",
    active: true,
    stats: { runs: 12, lastRun: "2 hours ago" },
    icon: "shopping-bag",
  },
  {
    id: "2",
    name: "Blog Cross-Post",
    description: "Auto-share new WordPress posts to LinkedIn and Twitter.",
    trigger: "New WP Post",
    action: "Publish to Socials",
    active: true,
    stats: { runs: 45, lastRun: "1 day ago" },
    icon: "globe",
  },
  {
    id: "3",
    name: "Negative Sentiment Alert",
    description: "If a comment has negative sentiment, send a Slack notification.",
    trigger: "Negative Comment",
    action: "Notify Team",
    active: false,
    stats: { runs: 0, lastRun: "Never" },
    icon: "alert-triangle",
  },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "1",
    name: "Shopify",
    category: "ecommerce",
    icon: "shopping-bag",
    connected: true,
  },
  {
    id: "2",
    name: "Slack",
    category: "communication",
    icon: "slack",
    connected: false,
  },
  {
    id: "3",
    name: "WordPress",
    category: "content",
    icon: "globe",
    connected: true,
  },
  {
    id: "4",
    name: "Mailchimp",
    category: "communication",
    icon: "mail",
    connected: false,
  },
];
```

**3. Update App.tsx import**
```typescript
// App.tsx - Update import
import Automations from "@/features/automations/Automations";
```

**Verification**:
- [ ] TypeScript compiles with 0 errors
- [ ] Dev server starts successfully
- [ ] Both tabs render correctly
- [ ] Tab switching works smoothly
- [ ] Workflows tab (cards + AI + modal) works
- [ ] Integration tab (cards + placeholder) works
- [ ] Create workflow modal works
- [ ] Toggle switches work for workflows
- [ ] Toggle switches work for integrations
- [ ] AI suggestions generate
- [ ] Dark mode works correctly
- [ ] Mobile responsive layout works

---

## Key Achievements

1. **Final Component Refactored**: 381 → ~70 lines (-82%)
2. **2 Complete Tabs**: All functionality preserved
3. **10 New Components**: Focused, testable, reusable
4. **AI Integration**: Workflow suggestion system
5. **Modal System**: Clean workflow creation
6. **Toggle States**: Workflows and integrations
7. **Ready for App.tsx**: All major components refactored!

## Next Steps

After completing Phase 6g:
- [ ] Commit changes
- [ ] Move to Phase 6h: App.tsx Simplification
- [ ] Complete frontend refactoring project!

---

## Combined Phases 6d-6g Impact

**Total Refactoring**:
- Inbox: 475 → ~80 lines (-83%)
- Library: 713 → ~100 lines (-86%)
- LinkManager: 454 → ~80 lines (-82%)
- Automations: 381 → ~70 lines (-82%)

**Totals**:
- **Before**: 2,023 lines in 4 monolithic files
- **After**: ~330 lines in 4 orchestrators + ~50 new focused components
- **Reduction**: 84% line reduction in main files

Ready for final App.tsx simplification!
