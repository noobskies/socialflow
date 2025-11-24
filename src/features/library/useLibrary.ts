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
