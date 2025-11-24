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
