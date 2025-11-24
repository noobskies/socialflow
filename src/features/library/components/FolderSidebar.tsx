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
