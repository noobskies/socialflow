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
