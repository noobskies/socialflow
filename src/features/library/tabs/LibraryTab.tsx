import React from "react";
import { MediaAsset, Folder } from "@/types";
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
