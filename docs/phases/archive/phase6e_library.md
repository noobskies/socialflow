# Phase 6e: Library Refactoring

## Overview

Refactor the Library component (713 lines - **LARGEST**) into a clean orchestrator with focused sub-components. Most complex component with 5 distinct tabs, each with significant functionality.

**Current State**: Massive monolithic component with 5 tabs (library, rss, buckets, hashtags, stock)
**Target State**: ~100-line orchestrator + 15-18 focused components
**Complexity**: **VERY HIGH** - folder management, multiple sub-features, modal systems

## Success Metrics

- **Line Reduction**: 713 → ~100 lines in main Library.tsx (-86%)
- **Component Count**: 15-18 new focused components
- **TypeScript**: 0 compilation errors
- **Functionality**: All 5 tabs preserved with full features
- **Dark Mode**: Fully supported
- **Mobile**: Responsive on all breakpoints

## Component Breakdown

### File Organization
```
/src/features/library/
├── Library.tsx (100-line orchestrator)
├── useLibrary.ts (state management hook)
├── /tabs
│   ├── LibraryTab.tsx (media assets)
│   ├── RSSTab.tsx (feed management)
│   ├── BucketsTab.tsx (content queues)
│   ├── HashtagsTab.tsx (hashtag groups)
│   └── StockTab.tsx (Unsplash integration)
├── /components
│   ├── FolderSidebar.tsx
│   ├── AssetGrid.tsx
│   ├── AssetCard.tsx
│   ├── AssetFilters.tsx
│   ├── RSSFeedInput.tsx
│   ├── ArticleCard.tsx
│   ├── BucketCard.tsx
│   ├── BucketModal.tsx
│   ├── HashtagGroupCard.tsx
│   ├── HashtagCreateForm.tsx
│   └── StockPhotoGrid.tsx
└── /utils
    └── assetUtils.ts
```

## Current Component Analysis

**Library.tsx (713 lines - LARGEST!)**:
- **5 Tabs**: library, rss, buckets, hashtags, stock
- **Library Tab**: Folder sidebar + asset grid + filters + file upload
- **RSS Tab**: Feed input + article cards + AI post generation
- **Buckets Tab**: Queue cards + modal configuration
- **Hashtags Tab**: Create form + group cards + management
- **Stock Tab**: Unsplash search + photo grid
- State management for all 5 tabs
- Modal system (bucket config)
- File upload handling
- Mock data for multiple entities

## Implementation Strategy

**Sub-Phase Breakdown**:
- 6e-A: Foundation & Library Tab (folder + assets) [30 min]
- 6e-B: RSS Tab Components [20 min]
- 6e-C: Buckets Tab & Modal [20 min]
- 6e-D: Hashtags Tab [15 min]
- 6e-E: Stock Tab [15 min]
- 6e-F: Final Integration [20 min]

---

## Sub-Phase 6e-A: Foundation & Library Tab (30 min)

**Goal**: Create hook, folder sidebar, and asset components

### 1. Create useLibrary.ts hook

```typescript
// /src/features/library/useLibrary.ts
import { useState } from "react";
import { MediaAsset, Folder } from "@/types";
import { MOCK_FOLDERS, MOCK_ASSETS_INIT } from "@/utils/constants";

export function useLibrary() {
  const [activeTab, setActiveTab] = useState<
    "library" | "rss" | "buckets" | "hashtags" | "stock"
  >("library");
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  const [assets, setAssets] = useState<MediaAsset[]>(MOCK_ASSETS_INIT);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "image" | "video" | "template"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      type: "user",
    };
    setFolders([...folders, newFolder]);
  };

  const addAsset = (asset: MediaAsset) => {
    setAssets([asset, ...assets]);
  };

  return {
    activeTab,
    setActiveTab,
    activeFolder,
    setActiveFolder,
    folders,
    createFolder,
    assets,
    addAsset,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  };
}
```

### 2. Create FolderSidebar.tsx

```typescript
// /src/features/library/components/FolderSidebar.tsx
import React from "react";
import { Plus, FolderIcon, FolderOpen } from "lucide-react";
import { Folder, MediaAsset } from "@/types";

interface FolderSidebarProps {
  folders: Folder[];
  activeFolder: string;
  onSelectFolder: (id: string) => void;
  onCreateFolder: () => void;
  assets: MediaAsset[];
}

export const FolderSidebar: React.FC<FolderSidebarProps> = ({
  folders,
  activeFolder,
  onSelectFolder,
  onCreateFolder,
  assets,
}) => {
  const getFolderCount = (folderId: string) => {
    if (folderId === "all") return assets.length;
    return assets.filter((a) => a.folderId === folderId).length;
  };

  return (
    <div className="w-full lg:w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col shadow-sm h-fit lg:h-auto overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">
          Folders
        </h3>
        <button
          onClick={onCreateFolder}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFolder === folder.id
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {folder.id === "all" ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <FolderIcon className="w-4 h-4" />
              )}
              <span className="truncate max-w-[120px]">{folder.name}</span>
            </div>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 rounded-full text-slate-500 dark:text-slate-400">
              {getFolderCount(folder.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 3. Create AssetFilters.tsx

```typescript
// /src/features/library/components/AssetFilters.tsx
import React from "react";
import { Search, Upload, Plus } from "lucide-react";

interface AssetFiltersProps {
  activeFilter: "all" | "image" | "video" | "template";
  onFilterChange: (filter: "all" | "image" | "video" | "template") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onUploadClick,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {["all", "image", "video", "template"].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeFilter === type
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onUploadClick}
          className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </button>
        <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </button>
      </div>
    </div>
  );
};
```

### 4. Create AssetCard.tsx

```typescript
// /src/features/library/components/AssetCard.tsx
import React from "react";
import { MoreHorizontal, PenSquare, Download, ImageIcon, Video, FileText } from "lucide-react";
import { MediaAsset } from "@/types";

interface AssetCardProps {
  asset: MediaAsset;
  onUse: (asset: MediaAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onUse }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Preview Area */}
      <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {asset.type === "image" || asset.type === "video" ? (
          <>
            <img
              src={asset.url}
              alt={asset.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            {asset.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Video className="w-5 h-5 text-slate-900 ml-1" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col">
            <FileText className="w-8 h-8 text-indigo-400 mb-3" />
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium">
              {asset.content}
            </p>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onUse(asset)}
            className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
            title="Use in Composer"
          >
            <PenSquare className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {asset.type === "image" && <ImageIcon className="w-4 h-4 text-slate-400" />}
              {asset.type === "video" && <Video className="w-4 h-4 text-slate-400" />}
              {asset.type === "template" && <FileText className="w-4 h-4 text-slate-400" />}
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                {asset.type}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <h3
            className="font-semibold text-slate-900 dark:text-white truncate mb-1 text-sm"
            title={asset.name}
          >
            {asset.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
          Added {asset.createdAt}
        </p>
      </div>
    </div>
  );
};
```

### 5. Create AssetGrid.tsx

```typescript
// /src/features/library/components/AssetGrid.tsx
import React from "react";
import { MediaAsset } from "@/types";
import { AssetCard } from "./AssetCard";

interface AssetGridProps {
  assets: MediaAsset[];
  onUseAsset: (asset: MediaAsset) => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, onUseAsset }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-10 pr-2">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onUse={onUseAsset} />
      ))}
    </div>
  );
};
```

### 6. Create LibraryTab.tsx

```typescript
// /src/features/library/tabs/LibraryTab.tsx
import React from "react";
import { MediaAsset, Folder, Draft } from "@/types";
import { FolderSidebar } from "../components/FolderSidebar";
import { AssetFilters } from "../components/AssetFilters";
import { AssetGrid } from "../components/AssetGrid";

interface LibraryTabProps {
  folders: Folder[];
  activeFolder: string;
  onSelectFolder: (id: string) => void;
  onCreateFolder: () => void;
  assets: MediaAsset[];
  filteredAssets: MediaAsset[];
  activeFilter: "all" | "image" | "video" | "template";
  onFilterChange: (filter: "all" | "image" | "video" | "template") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
  onUseAsset: (asset: MediaAsset) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  folders,
  activeFolder,
  onSelectFolder,
  onCreateFolder,
  assets,
  filteredAssets,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onUploadClick,
  onUseAsset,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      <FolderSidebar
        folders={folders}
        activeFolder={activeFolder}
        onSelectFolder={onSelectFolder}
        onCreateFolder={onCreateFolder}
        assets={assets}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AssetFilters
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onUploadClick={onUploadClick}
        />
        <AssetGrid assets={filteredAssets} onUseAsset={onUseAsset} />
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] Folder sidebar renders with counts
- [ ] Asset filters work correctly
- [ ] Asset grid displays all assets
- [ ] Asset cards show previews properly
- [ ] File upload trigger works
- [ ] Use in Composer action works

---

## Sub-Phase 6e-B: RSS Tab Components (20 min)

**Goal**: Extract RSS feed management components

### 1. Create RSSFeedInput.tsx

```typescript
// /src/features/library/components/RSSFeedInput.tsx
import React from "react";
import { Plus } from "lucide-react";

interface RSSFeedInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export const RSSFeedInput: React.FC<RSSFeedInputProps> = ({
  value,
  onChange,
  onAdd,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Add Content Source
      </h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter RSS Feed URL (e.g. https://techcrunch.com/feed)"
          className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feed
        </button>
      </div>
    </div>
  );
};
```

### 2. Create ArticleCard.tsx

```typescript
// /src/features/library/components/ArticleCard.tsx
import React from "react";
import { Zap, ExternalLink, Loader2 } from "lucide-react";
import { RSSArticle } from "@/types";

interface ArticleCardProps {
  article: RSSArticle;
  onUse: (article: RSSArticle) => void;
  isGenerating: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onUse,
  isGenerating,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
      <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
            {article.source}
          </span>
          <span className="text-xs text-slate-400">{article.publishedAt}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
          {article.snippet}
        </p>
        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onUse(article)}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-75"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Create AI Post"}
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 3. Create RSSTab.tsx

```typescript
// /src/features/library/tabs/RSSTab.tsx
import React, { useState } from "react";
import { RSSArticle, Draft, ToastType } from "@/types";
import { RSSFeedInput } from "../components/RSSFeedInput";
import { ArticleCard } from "../components/ArticleCard";
import { MOCK_RSS } from "@/utils/constants";
import { generatePostFromRSS } from "@/services/geminiService";

interface RSSTabProps {
  onCompose: (draft: Draft) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const RSSTab: React.FC<RSSTabProps> = ({ onCompose, showToast }) => {
  const [rssUrl, setRssUrl] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAddFeed = () => {
    if (!rssUrl) return;
    showToast("Feed added successfully!", "success");
    setRssUrl("");
  };

  const handleUseArticle = async (article: RSSArticle) => {
    setGeneratingId(article.id);
    const postContent = await generatePostFromRSS(
      article.title,
      article.snippet,
      article.source
    );
    setGeneratingId(null);

    onCompose({
      content: `${postContent}\n\n${article.url}`,
      mediaUrl: article.imageUrl,
      mediaType: "image",
      platforms: ["twitter", "linkedin"],
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <RSSFeedInput value={rssUrl} onChange={setRssUrl} onAdd={handleAddFeed} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_RSS.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onUse={handleUseArticle}
            isGenerating={generatingId === article.id}
          />
        ))}
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] RSS feed input works
- [ ] Article cards display correctly
- [ ] AI post generation triggers
- [ ] Loading states show properly

---

## Sub-Phase 6e-C: Buckets Tab & Modal (20 min)

**Goal**: Extract content queue components

### 1. Create BucketCard.tsx

```typescript
// /src/features/library/components/BucketCard.tsx
import React from "react";
import { Archive, MoreHorizontal, Repeat, CalendarCheck } from "lucide-react";
import { Bucket } from "@/types";

interface BucketCardProps {
  bucket: Bucket;
  onAutoSchedule: (bucket: Bucket) => void;
  onConfigure: (bucket: Bucket) => void;
}

export const BucketCard: React.FC<BucketCardProps> = ({
  bucket,
  onAutoSchedule,
  onConfigure,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-12 h-12 rounded-xl ${bucket.color} flex items-center justify-center text-white shadow-lg`}
        >
          <Archive className="w-6 h-6" />
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {bucket.name}
      </h3>
      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Repeat className="w-4 h-4 mr-2" />
        {bucket.schedule}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onAutoSchedule(bucket)}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-800"
        >
          <CalendarCheck className="w-4 h-4 mr-2" />
          Auto-Fill Calendar
        </button>
        <button
          onClick={() => onConfigure(bucket)}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          Configure Rules
        </button>
      </div>
    </div>
  );
};
```

### 2. Create BucketModal.tsx

```typescript
// /src/features/library/components/BucketModal.tsx
import React from "react";
import { X, Archive, Clock, Repeat } from "lucide-react";
import { Bucket } from "@/types";

interface BucketModalProps {
  bucket: Bucket | null;
  onClose: () => void;
  onSave: () => void;
}

export const BucketModal: React.FC<BucketModalProps> = ({
  bucket,
  onClose,
  onSave,
}) => {
  if (!bucket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Archive className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Configure Queue
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
              Bucket Name
            </label>
            <input
              type="text"
              value={bucket.name}
              readOnly
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            />
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Posting Schedule
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
                <span>Mondays</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  09:00 AM
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
                <span>Wednesdays</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  02:30 PM
                </span>
              </div>
            </div>
            <button className="mt-3 w-full py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              + Add Time Slot
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Repeat className="w-4 h-4" />
            <span>Recycle posts after publishing?</span>
            <input
              type="checkbox"
              checked
              className="ml-auto w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
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
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 3. Create BucketsTab.tsx

```typescript
// /src/features/library/tabs/BucketsTab.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Bucket, Post } from "@/types";
import { BucketCard } from "../components/BucketCard";
import { BucketModal } from "../components/BucketModal";
import { MOCK_BUCKETS } from "@/utils/constants";

interface BucketsTabProps {
  onPostCreated?: (post: Post) => void;
}

export const BucketsTab: React.FC<BucketsTabProps> = ({ onPostCreated }) => {
  const [editingBucket, setEditingBucket] = useState<Bucket | null>(null);

  const handleAutoSchedule = (bucket: Bucket) => {
    if (!onPostCreated) return;

    // Simulate creating posts
    const mockPosts: Post[] = [
      {
        id: Date.now().toString(),
        content: `${bucket.name} Post 1`,
        scheduledDate: "2023-11-06",
        time: "09:00",
        platforms: ["twitter"],
        status: "scheduled",
      },
      {
        id: (Date.now() + 1).toString(),
        content: `${bucket.name} Post 2`,
        scheduledDate: "2023-11-08",
        time: "09:00",
        platforms: ["linkedin"],
        status: "scheduled",
      },
    ];

    mockPosts.forEach((p) => onPostCreated(p));
    alert(`Scheduled ${mockPosts.length} posts from ${bucket.name} bucket!`);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {editingBucket && (
        <BucketModal
          bucket={editingBucket}
          onClose={() => setEditingBucket(null)}
          onSave={() => setEditingBucket(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full flex justify-end mb-4">
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Bucket
          </button>
        </div>

        {MOCK_BUCKETS.map((bucket) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            onAutoSchedule={handleAutoSchedule}
            onConfigure={setEditingBucket}
          />
        ))}

        {/* Create New Placeholder */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer min-h-[240px]">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">
            Create New Bucket
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Organize evergreen content for auto-posting
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] Bucket cards display correctly
- [ ] Auto-schedule action works
- [ ] Configuration modal opens/closes
- [ ] Modal displays bucket details

---

## Sub-Phase 6e-D: Hashtags Tab (15 min)

**Goal**: Extract hashtag management components

### 1. Create HashtagCreateForm.tsx

```typescript
// /src/features/library/components/HashtagCreateForm.tsx
import React from "react";

interface HashtagCreateFormProps {
  name: string;
  onNameChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

export const HashtagCreateForm: React.FC<HashtagCreateFormProps> = ({
  name,
  onNameChange,
  content,
  onContentChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">
        Create New Group
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Group Name
          </label>
          <input
            type="text"
            placeholder="e.g. Summer Campaign"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Hashtags
          </label>
          <textarea
            placeholder="#summer #sun #fun"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!name || !content}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Group
        </button>
      </div>
    </div>
  );
};
```

### 2. Create HashtagGroupCard.tsx

```typescript
// /src/features/library/components/HashtagGroupCard.tsx
import React from "react";
import { Hash, Trash2 } from "lucide-react";
import { HashtagGroup, Draft } from "@/types";

interface HashtagGroupCardProps {
  group: HashtagGroup;
  onUse: (group: HashtagGroup) => void;
  onDelete: (id: string) => void;
}

export const HashtagGroupCard: React.FC<HashtagGroupCardProps> = ({
  group,
  onUse,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            {group.name}
          </h3>
        </div>
        <button
          onClick={() => onDelete(group.id)}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {group.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onUse(group)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded transition-colors"
        >
          Use in Composer
        </button>
      </div>
    </div>
  );
};
```

### 3. Create HashtagsTab.tsx

```typescript
// /src/features/library/tabs/HashtagsTab.tsx
import React, { useState } from "react";
import { HashtagGroup, Draft } from "@/types";
import { HashtagCreateForm } from "../components/HashtagCreateForm";
import { HashtagGroupCard } from "../components/HashtagGroupCard";
import { MOCK_HASHTAGS } from "@/utils/constants";

interface HashtagsTabProps {
  onCompose: (draft: Draft) => void;
}

export const HashtagsTab: React.FC<HashtagsTabProps> = ({ onCompose }) => {
  const [hashtags, setHashtags] = useState<HashtagGroup[]>(MOCK_HASHTAGS);
  const [newTagName, setNewTagName] = useState("");
  const [newTagContent, setNewTagContent] = useState("");

  const handleCreate = () => {
    if (!newTagName || !newTagContent) return;
    const tags = newTagContent.split(" ").filter((t) => t.startsWith("#"));
    if (tags.length === 0) return;

    const newGroup: HashtagGroup = {
      id: Date.now().toString(),
      name: newTagName,
      tags,
    };
    setHashtags([newGroup, ...hashtags]);
    setNewTagName("");
    setNewTagContent("");
  };

  const handleUse = (group: HashtagGroup) => {
    onCompose({ content: `\n\n${group.tags.join(" ")}` });
  };

  const handleDelete = (id: string) => {
    setHashtags(hashtags.filter((h) => h.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HashtagCreateForm
          name={newTagName}
          onNameChange={setNewTagName}
          content={newTagContent}
          onContentChange={setNewTagContent}
          onSubmit={handleCreate}
        />

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hashtags.map((group) => (
            <HashtagGroupCard
              key={group.id}
              group={group}
              onUse={handleUse}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] Create form works
- [ ] Hashtag groups display
- [ ] Use in Composer works
- [ ] Delete action works

---

## Sub-Phase 6e-E: Stock Tab (15 min)

**Goal**: Extract Unsplash stock photo components

### 1. Create StockTab.tsx

```typescript
// /src/features/library/tabs/StockTab.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Draft } from "@/types";
import { MOCK_STOCK_PHOTOS } from "@/utils/constants";

interface StockTabProps {
  onCompose: (draft: Draft) => void;
}

export const StockTab: React.FC<StockTabProps> = ({ onCompose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="animate-in fade-in duration-300 relative h-full flex flex-col">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Unsplash Stock Photos
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search free high-resolution photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Stock Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-10">
        {MOCK_STOCK_PHOTOS.map((url, i) => (
          <div
            key={i}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
          >
            <img
              src={url}
              alt="Stock"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() =>
                  onCompose({ mediaUrl: url, mediaType: "image" })
                }
                className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
              >
                Use Image
              </button>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-white/80 opacity-0 group-hover:opacity-100 font-medium drop-shadow-md">
              Photo by Unsplash
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] Search input works
- [ ] Photo grid displays
- [ ] Use Image action works
- [ ] Hover effects work

---

## Sub-Phase 6e-F: Final Integration (20 min)

**Goal**: Create main orchestrator and integrate with App.tsx

### 1. Create Library.tsx orchestrator

```typescript
// /src/features/library/Library.tsx
import React, { useRef } from "react";
import { ImageIcon, Rss, Archive, Hash, Search as SearchIcon } from "lucide-react";
import { Draft, PlanTier, Post, ToastType } from "@/types";
import { useLibrary } from "./useLibrary";
import { LibraryTab } from "./tabs/LibraryTab";
import { RSSTab } from "./tabs/RSSTab";
import { BucketsTab } from "./tabs/BucketsTab";
import { HashtagsTab } from "./tabs/HashtagsTab";
import { StockTab } from "./tabs/StockTab";

interface LibraryProps {
  onCompose: (draft: Draft) => void;
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  onPostCreated?: (post: Post) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const Library: React.FC<LibraryProps> = ({
  onCompose,
  userPlan,
  onOpenUpgrade,
  onPostCreated,
  showToast,
}) => {
  const library = useLibrary();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) library.createFolder(name);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const type = file.type.startsWith("video") ? "video" : "image";
      const url = URL.createObjectURL(file);

      library.addAsset({
        id: Date.now().toString(),
        type,
        url,
        name: file.name,
        createdAt: "Just now",
        tags: ["uploaded"],
        folderId:
          library.activeFolder !== "all" ? library.activeFolder : undefined,
      });
    }
  };

  const handleUseAsset = (asset: any) => {
    onCompose({
      mediaUrl: asset.type !== "template" ? asset.url : undefined,
      content: asset.type === "template" ? asset.content : undefined,
      mediaType: asset.type as "image" | "video" | undefined,
    });
  };

  const filteredAssets = library.assets.filter((asset) => {
    const matchesFolder =
      library.activeFolder === "all" || asset.folderId === library.activeFolder;
    const matchesFilter =
      library.activeFilter === "all" || asset.type === library.activeFilter;
    const matchesSearch =
      asset.name.toLowerCase().includes(library.searchQuery.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(library.searchQuery.toLowerCase())
      );
    return matchesFolder && matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Content Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage assets and curate content
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm overflow-x-auto">
          {[
            { id: "library", label: "Media", icon: ImageIcon },
            { id: "rss", label: "Feeds", icon: Rss },
            { id: "buckets", label: "Buckets", icon: Archive },
            { id: "hashtags", label: "Hashtags", icon: Hash },
            { id: "stock", label: "Stock", icon: SearchIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => library.setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                library.activeTab === tab.id
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {library.activeTab === "library" && (
          <LibraryTab
            folders={library.folders}
            activeFolder={library.activeFolder}
            onSelectFolder={library.setActiveFolder}
            onCreateFolder={handleCreateFolder}
            assets={library.assets}
            filteredAssets={filteredAssets}
            activeFilter={library.activeFilter}
            onFilterChange={library.setActiveFilter}
            searchQuery={library.searchQuery}
            onSearchChange={library.setSearchQuery}
            onUploadClick={() => fileInputRef.current?.click()}
            onUseAsset={handleUseAsset}
          />
        )}
        {library.activeTab === "rss" && (
          <RSSTab onCompose={onCompose} showToast={showToast} />
        )}
        {library.activeTab === "buckets" && (
          <BucketsTab onPostCreated={onPostCreated} />
        )}
        {library.activeTab === "hashtags" && (
          <HashtagsTab onCompose={onCompose} />
        )}
        {library.activeTab === "stock" && <StockTab onCompose={onCompose} />}
      </div>
    </div>
  );
};
```

### 2. Move mock data to constants.ts

```typescript
// Add to /src/utils/constants.ts
export const MOCK_FOLDERS: Folder[] = [
  { id: "all", name: "All Uploads", type: "system", icon: "folder-open" },
  { id: "campaign-a", name: "Summer Campaign", type: "user" },
  { id: "evergreen", name: "Evergreen", type: "user" },
  { id: "videos", name: "Video Assets", type: "user" },
];

export const MOCK_ASSETS_INIT: MediaAsset[] = [
  // ... existing assets
];

export const MOCK_RSS: RSSArticle[] = [
  // ... existing RSS items
];

export const MOCK_BUCKETS: Bucket[] = [
  // ... existing buckets
];

export const MOCK_HASHTAGS: HashtagGroup[] = [
  // ... existing hashtags
];

export const MOCK_STOCK_PHOTOS: string[] = [
  // ... existing stock photos
];
```

### 3. Update App.tsx import

```typescript
// App.tsx - Update import
import Library from "@/features/library/Library";
```

**Verification**:
- [ ] TypeScript compiles with 0 errors
- [ ] Dev server starts successfully
- [ ] All 5 tabs render correctly
- [ ] Tab switching works smoothly
- [ ] Library tab (folders + assets) works
- [ ] RSS tab (feeds + AI generation) works
- [ ] Buckets tab (queues + modal) works
- [ ] Hashtags tab (create + use) works
- [ ] Stock tab (Unsplash photos) works
- [ ] Dark mode works correctly
- [ ] Mobile responsive layout works

---

## Key Achievements

1. **Largest Refactoring**: 713 → ~100 lines (-86%)
2. **5 Complete Tabs**: All functionality preserved
3. **18 New Components**: Focused, testable, reusable
4. **Modal System**: Clean bucket configuration
5. **File Upload**: Properly handled with ref
6. **AI Integration**: RSS-to-post generation
7. **Complex State**: Managed cleanly with custom hook

## Next Steps

After completing Phase 6e:
- [ ] Commit changes
- [ ] Move to Phase 6f: LinkManager Refactoring (454 lines)
- [ ] Continue with remaining components
