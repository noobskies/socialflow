import React, { useRef } from "react";
import {
  ImageIcon,
  Rss,
  Archive,
  Hash,
  Search as SearchIcon,
} from "lucide-react";
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

export default Library;
