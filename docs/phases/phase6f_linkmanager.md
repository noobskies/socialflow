# Phase 6f: LinkManager Refactoring

## Overview

Refactor the LinkManager component (454 lines) into a clean orchestrator with focused sub-components following the proven pattern.

**Current State**: Monolithic component with 3 tabs (shortener, bio, leads)
**Target State**: ~80-line orchestrator + 12-14 focused components
**Complexity**: Medium-High - bio builder with live phone preview, link management, lead capture

## Success Metrics

- **Line Reduction**: 454 → ~80 lines in main LinkManager.tsx (-82%)
- **Component Count**: 12-14 new focused components
- **TypeScript**: 0 compilation errors
- **Functionality**: All 3 tabs preserved with full features
- **Dark Mode**: Fully supported
- **Mobile**: Phone preview works perfectly

## Component Breakdown

### File Organization
```
/src/features/linkmanager/
├── LinkManager.tsx (80-line orchestrator)
├── useLinkManager.ts (state management hook)
├── /tabs
│   ├── ShortenerTab.tsx
│   ├── BioTab.tsx
│   └── LeadsTab.tsx
├── /components
│   ├── LinkStatsCards.tsx
│   ├── LinksTable.tsx
│   ├── LinkRow.tsx
│   ├── BioEditor.tsx
│   ├── BioProfileSection.tsx
│   ├── BioLinksEditor.tsx
│   ├── LeadCaptureToggle.tsx
│   ├── PhonePreview.tsx
│   └── LeadsTable.tsx
└── /utils
    └── bioUtils.ts
```

## Current Component Analysis

**LinkManager.tsx (454 lines)**:
- **3 Tabs**: shortener (link management), bio (page builder), leads (email capture)
- **Shortener Tab**: Stats cards + links table with copy functionality
- **Bio Tab**: Split view with editor panel + live phone preview
- **Leads Tab**: Captured emails table with CSV export
- State management for all tabs
- Bio page configuration (profile, links, lead capture)
- AI bio generation
- Link copying to clipboard

## Implementation Strategy

**Sub-Phase Breakdown**:
- 6f-A: Foundation & Shortener Tab [20 min]
- 6f-B: Bio Editor Components [25 min]
- 6f-C: Phone Preview Component [15 min]
- 6f-D: Leads Tab [15 min]
- 6f-E: Final Integration [15 min]

---

## Sub-Phase 6f-A: Foundation & Shortener Tab (20 min)

**Goal**: Create hook and short links components

### 1. Create useLinkManager.ts hook

```typescript
// /src/features/linkmanager/useLinkManager.ts
import { useState } from "react";
import { ShortLink, BioPageConfig } from "@/types";
import { MOCK_LINKS, INITIAL_BIO_CONFIG } from "@/utils/constants";

export function useLinkManager() {
  const [activeTab, setActiveTab] = useState<"shortener" | "bio" | "leads">("shortener");
  const [links, setLinks] = useState<ShortLink[]>(MOCK_LINKS);
  const [bioConfig, setBioConfig] = useState<BioPageConfig>(INITIAL_BIO_CONFIG);

  return {
    activeTab,
    setActiveTab,
    links,
    setLinks,
    bioConfig,
    setBioConfig,
  };
}
```

### 2. Create LinkStatsCards.tsx

```typescript
// /src/features/linkmanager/components/LinkStatsCards.tsx
import React from "react";
import { ArrowRight } from "lucide-react";

interface LinkStatsCardsProps {
  totalClicks: number;
  activeLinks: number;
  onCreateNew: () => void;
}

export const LinkStatsCards: React.FC<LinkStatsCardsProps> = ({
  totalClicks,
  activeLinks,
  onCreateNew,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
          Total Clicks
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {totalClicks.toLocaleString()}
        </h3>
        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
          <ArrowRight className="w-3 h-3 mr-1 rotate-[-45deg]" /> +12% this week
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
          Active Links
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {activeLinks}
        </h3>
        <div className="mt-2 text-xs text-slate-400">3 expiring soon</div>
      </div>

      <div
        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
        onClick={onCreateNew}
      >
        <div>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
            Create New Link
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shorten, brand, and track
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
          <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
        </div>
      </div>
    </div>
  );
};
```

### 3. Create LinkRow.tsx

```typescript
// /src/features/linkmanager/components/LinkRow.tsx
import React from "react";
import { Copy, MoreHorizontal } from "lucide-react";
import { ShortLink } from "@/types";

interface LinkRowProps {
  link: ShortLink;
  onCopy: (shortCode: string) => void;
}

export const LinkRow: React.FC<LinkRowProps> = ({ link, onCopy }) => {
  return (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-4 pl-6">
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            {link.title}
          </p>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">
            {link.originalUrl}
          </p>
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
            sfl.ai/{link.shortCode}
          </span>
          <button
            onClick={() => onCopy(`sfl.ai/${link.shortCode}`)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </td>
      <td className="py-4">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {link.clicks.toLocaleString()}
        </span>
      </td>
      <td className="py-4">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {link.createdAt}
        </span>
      </td>
      <td className="py-4 pr-6 text-right">
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
```

### 4. Create LinksTable.tsx

```typescript
// /src/features/linkmanager/components/LinksTable.tsx
import React from "react";
import { ShortLink } from "@/types";
import { LinkRow } from "./LinkRow";

interface LinksTableProps {
  links: ShortLink[];
  onCopy: (shortCode: string) => void;
}

export const LinksTable: React.FC<LinksTableProps> = ({ links, onCopy }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50">
              <th className="py-4 pl-6">Link Details</th>
              <th className="py-4">Short URL</th>
              <th className="py-4">Clicks</th>
              <th className="py-4">Date</th>
              <th className="py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {links.map((link) => (
              <LinkRow key={link.id} link={link} onCopy={onCopy} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 5. Create ShortenerTab.tsx

```typescript
// /src/features/linkmanager/tabs/ShortenerTab.tsx
import React from "react";
import { ShortLink, ToastType } from "@/types";
import { LinkStatsCards } from "../components/LinkStatsCards";
import { LinksTable } from "../components/LinksTable";

interface ShortenerTabProps {
  links: ShortLink[];
  showToast: (message: string, type: ToastType) => void;
}

export const ShortenerTab: React.FC<ShortenerTabProps> = ({
  links,
  showToast,
}) => {
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const handleCreateNew = () => {
    showToast("Create link feature coming soon!", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <LinkStatsCards
        totalClicks={totalClicks}
        activeLinks={links.length}
        onCreateNew={handleCreateNew}
      />
      <LinksTable links={links} onCopy={handleCopy} />
    </div>
  );
};
```

**Verification**:
- [ ] Stats cards display correctly
- [ ] Links table renders all links
- [ ] Copy to clipboard works
- [ ] Click counts display properly

---

## Sub-Phase 6f-B: Bio Editor Components (25 min)

**Goal**: Extract bio page editor components

### 1. Create BioProfileSection.tsx

```typescript
// /src/features/linkmanager/components/BioProfileSection.tsx
import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { BioPageConfig } from "@/types";

interface BioProfileSectionProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
  onGenerateBio: () => void;
  bioNiche: string;
  onBioNicheChange: (value: string) => void;
  isGenerating: boolean;
}

export const BioProfileSection: React.FC<BioProfileSectionProps> = ({
  config,
  onConfigChange,
  onGenerateBio,
  bioNiche,
  onBioNicheChange,
  isGenerating,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={config.avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover"
        />
        <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          Change Image
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={config.displayName}
          onChange={(e) =>
            onConfigChange({ displayName: e.target.value })
          }
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Bio
          </label>
          <button
            onClick={onGenerateBio}
            disabled={isGenerating}
            className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            AI Reword
          </button>
        </div>
        <textarea
          value={config.bio}
          onChange={(e) => onConfigChange({ bio: e.target.value })}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none h-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Describe your niche for AI (e.g., Tech Reviewer)"
            value={bioNiche}
            onChange={(e) => onBioNicheChange(e.target.value)}
            className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
```

### 2. Create LeadCaptureToggle.tsx

```typescript
// /src/features/linkmanager/components/LeadCaptureToggle.tsx
import React from "react";
import { Mail } from "lucide-react";
import { BioPageConfig } from "@/types";

interface LeadCaptureToggleProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
}

export const LeadCaptureToggle: React.FC<LeadCaptureToggleProps> = ({
  config,
  onConfigChange,
}) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
            Lead Capture Form
          </h3>
        </div>
        <button
          onClick={() =>
            onConfigChange({ enableLeadCapture: !config.enableLeadCapture })
          }
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            config.enableLeadCapture ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              config.enableLeadCapture ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {config.enableLeadCapture && (
        <div>
          <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">
            Call to Action Text
          </label>
          <input
            type="text"
            value={config.leadCaptureText}
            onChange={(e) =>
              onConfigChange({ leadCaptureText: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
};
```

### 3. Create BioLinksEditor.tsx

```typescript
// /src/features/linkmanager/components/BioLinksEditor.tsx
import React from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { BioPageConfig, BioLink } from "@/types";

interface BioLinksEditorProps {
  links: BioLink[];
  onLinksChange: (links: BioLink[]) => void;
}

export const BioLinksEditor: React.FC<BioLinksEditorProps> = ({
  links,
  onLinksChange,
}) => {
  const updateLink = (index: number, updates: Partial<BioLink>) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onLinksChange(newLinks);
  };

  const deleteLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index));
  };

  const addLink = () => {
    const newLink: BioLink = {
      id: Date.now().toString(),
      title: "New Link",
      url: "https://example.com",
      active: true,
    };
    onLinksChange([...links, newLink]);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
          Links
        </label>
        <button
          onClick={addLink}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Link
        </button>
      </div>

      {links.map((link, index) => (
        <div
          key={link.id}
          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group"
        >
          <div className="cursor-move text-slate-400 hover:text-slate-600">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={link.title}
              onChange={(e) => updateLink(index, { title: e.target.value })}
              className="block w-full text-sm font-bold bg-transparent outline-none text-slate-900 dark:text-white mb-1"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, { url: e.target.value })}
              className="block w-full text-xs text-slate-500 bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => deleteLink(index)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
```

### 4. Create BioEditor.tsx

```typescript
// /src/features/linkmanager/components/BioEditor.tsx
import React, { useState } from "react";
import { BioPageConfig, ToastType } from "@/types";
import { BioProfileSection } from "./BioProfileSection";
import { LeadCaptureToggle } from "./LeadCaptureToggle";
import { BioLinksEditor } from "./BioLinksEditor";
import { generateBio } from "@/services/geminiService";

interface BioEditorProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const BioEditor: React.FC<BioEditorProps> = ({
  config,
  onConfigChange,
  showToast,
}) => {
  const [bioNiche, setBioNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!bioNiche) return;
    setIsGenerating(true);
    const newBio = await generateBio(
      config.username,
      bioNiche,
      "professional yet fun"
    );
    onConfigChange({ bio: newBio });
    setIsGenerating(false);
    showToast("Bio generated successfully!", "success");
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Profile & Links
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <BioProfileSection
          config={config}
          onConfigChange={onConfigChange}
          onGenerateBio={handleGenerateBio}
          bioNiche={bioNiche}
          onBioNicheChange={setBioNiche}
          isGenerating={isGenerating}
        />

        <hr className="border-slate-100 dark:border-slate-800" />

        <LeadCaptureToggle
          config={config}
          onConfigChange={onConfigChange}
        />

        <hr className="border-slate-100 dark:border-slate-800" />

        <BioLinksEditor
          links={config.links}
          onLinksChange={(links) => onConfigChange({ links })}
        />
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] Profile section renders
- [ ] Bio generation works
- [ ] Lead capture toggle works
- [ ] Links editor allows adding/editing/deleting

---

## Sub-Phase 6f-C: Phone Preview Component (15 min)

**Goal**: Create live phone preview

### 1. Create PhonePreview.tsx

```typescript
// /src/features/linkmanager/components/PhonePreview.tsx
import React from "react";
import { BioPageConfig } from "@/types";

interface PhonePreviewProps {
  config: BioPageConfig;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ config }) => {
  const themeClasses = {
    light: "bg-slate-50 text-slate-900",
    dark: "bg-slate-900 text-white",
    colorful: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  };

  const themeClass = themeClasses[config.theme] || themeClasses.light;

  return (
    <div className="w-full lg:w-[380px] shrink-0 flex justify-center items-start pt-8">
      <div className="w-[320px] h-[650px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>

        {/* Bio Page Content */}
        <div
          className={`w-full h-full overflow-y-auto ${themeClass} pt-12 pb-8 px-6`}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={config.avatar}
              className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 object-cover"
              alt="Profile"
            />
            <h2 className="font-bold text-xl mb-1">{config.displayName}</h2>
            <p className="text-sm opacity-90">{config.username}</p>
            <p className="text-sm mt-3 opacity-80 leading-relaxed">
              {config.bio}
            </p>
          </div>

          {config.enableLeadCapture && (
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-sm font-bold mb-3 text-center">
                  {config.leadCaptureText}
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-sm placeholder:text-white/60 outline-none"
                  disabled
                />
                <button
                  className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold"
                  disabled
                >
                  Subscribe
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {config.links
              .filter((l) => l.active)
              .map((link) => (
                <div
                  key={link.id}
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center font-bold text-sm hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {link.title}
                </div>
              ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              Powered by SocialFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] Phone preview renders correctly
- [ ] Profile information displays
- [ ] Lead capture form shows when enabled
- [ ] Links render properly
- [ ] Theme changes apply correctly

---

## Sub-Phase 6f-D: Leads Tab (15 min)

**Goal**: Extract leads management components

### 1. Create LeadsTable.tsx

```typescript
// /src/features/linkmanager/components/LeadsTable.tsx
import React from "react";
import { Mail, Download, Users } from "lucide-react";
import { Lead } from "@/types";
import { MOCK_LEADS } from "@/utils/constants";

export const LeadsTable: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-6">Email Address</th>
                <th className="py-4">Source</th>
                <th className="py-4">Captured</th>
                <th className="py-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {MOCK_LEADS.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 pl-6 font-medium text-slate-900 dark:text-white text-sm">
                    {lead.email}
                  </td>
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    {lead.source}
                  </td>
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    {lead.capturedAt}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {MOCK_LEADS.length === 0 && (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No leads captured yet.</p>
          </div>
        )}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 2. Create LeadsTab.tsx

```typescript
// /src/features/linkmanager/tabs/LeadsTab.tsx
import React from "react";
import { LeadsTable } from "../components/LeadsTable";

export const LeadsTab: React.FC = () => {
  return <LeadsTable />;
};
```

**Verification**:
- [ ] Leads table displays all captured emails
- [ ] Export CSV button shows
- [ ] Empty state displays when no leads

---

## Sub-Phase 6f-E: Final Integration (15 min)

**Goal**: Create main orchestrator and integrate with App.tsx

### 1. Create BioTab.tsx

```typescript
// /src/features/linkmanager/tabs/BioTab.tsx
import React from "react";
import { BioPageConfig, ToastType } from "@/types";
import { BioEditor } from "../components/BioEditor";
import { PhonePreview } from "../components/PhonePreview";

interface BioTabProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const BioTab: React.FC<BioTabProps> = ({
  config,
  onConfigChange,
  showToast,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)] animate-in fade-in duration-300">
      <BioEditor
        config={config}
        onConfigChange={onConfigChange}
        showToast={showToast}
      />
      <PhonePreview config={config} />
    </div>
  );
};
```

### 2. Create LinkManager.tsx orchestrator

```typescript
// /src/features/linkmanager/LinkManager.tsx
import React from "react";
import { Link as LinkIcon, Layout, Users } from "lucide-react";
import { ToastType } from "@/types";
import { useLinkManager } from "./useLinkManager";
import { ShortenerTab } from "./tabs/ShortenerTab";
import { BioTab } from "./tabs/BioTab";
import { LeadsTab } from "./tabs/LeadsTab";

interface LinkManagerProps {
  showToast: (message: string, type: ToastType) => void;
}

export const LinkManager: React.FC<LinkManagerProps> = ({ showToast }) => {
  const manager = useLinkManager();

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Link Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Trackable short links & Bio pages
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          <button
            onClick={() => manager.setActiveTab("shortener")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              manager.activeTab === "shortener"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Short Links
          </button>
          <button
            onClick={() => manager.setActiveTab("bio")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              manager.activeTab === "bio"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Layout className="w-4 h-4 mr-2" />
            Link in Bio
          </button>
          <button
            onClick={() => manager.setActiveTab("leads")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              manager.activeTab === "leads"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Leads
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {manager.activeTab === "shortener" && (
          <ShortenerTab links={manager.links} showToast={showToast} />
        )}
        {manager.activeTab === "bio" && (
          <BioTab
            config={manager.bioConfig}
            onConfigChange={(updates) =>
              manager.setBioConfig({ ...manager.bioConfig, ...updates })
            }
            showToast={showToast}
          />
        )}
        {manager.activeTab === "leads" && <LeadsTab />}
      </div>
    </div>
  );
};
```

### 3. Move mock data to constants.ts

```typescript
// Add to /src/utils/constants.ts
export const MOCK_LINKS: ShortLink[] = [
  // ... existing links
];

export const INITIAL_BIO_CONFIG: BioPageConfig = {
  username: "@alexcreator",
  displayName: "Alex Creator",
  bio: "Digital creator passionate about tech & design. 🎨✨",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop",
  theme: "colorful",
  links: [
    // ... existing links
  ],
  enableLeadCapture: true,
  leadCaptureText: "Join my weekly newsletter for tips!",
};

export const MOCK_LEADS: Lead[] = [
  // ... existing leads
];
```

### 4. Update App.tsx import

```typescript
// App.tsx - Update import
import LinkManager from "@/features/linkmanager/LinkManager";
```

**Verification**:
- [ ] TypeScript compiles with 0 errors
- [ ] Dev server starts successfully
- [ ] All 3 tabs render correctly
- [ ] Tab switching works smoothly
- [ ] Shortener tab (stats + table) works
- [ ] Bio tab (editor + preview) works
- [ ] Phone preview updates live
- [ ] Leads tab displays correctly
- [ ] Dark mode works correctly
- [ ] Mobile responsive layout works

---

## Key Achievements

1. **Significant Simplification**: 454 → ~80 lines (-82%)
2. **3 Complete Tabs**: All functionality preserved
3. **14 New Components**: Focused, testable, reusable
4. **Live Phone Preview**: Real-time bio page updates
5. **Bio Builder**: Complete editor with AI generation
6. **Link Management**: Stats and tracking preserved
7. **Lead Capture**: Email collection with CSV export

## Next Steps

After completing Phase 6f:
- [ ] Commit changes
- [ ] Move to Phase 6g: Automations Refactoring (381 lines - final component!)
- [ ] Complete all component refactorings
