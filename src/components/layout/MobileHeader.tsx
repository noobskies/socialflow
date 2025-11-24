import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { BrandingConfig } from "@/types";

interface MobileHeaderProps {
  branding: BrandingConfig;
  onMenuOpen: () => void;
  onNotificationsOpen: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  branding,
  onMenuOpen,
  onNotificationsOpen,
}) => {
  return (
    <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0 transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuOpen}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-slate-800 dark:text-white truncate max-w-[200px]">
          {branding.logoUrl ? branding.companyName : "SocialFlow AI"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onNotificationsOpen} className="relative p-1">
          <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border border-white dark:border-slate-900"></div>
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop"
            alt="User"
            width={32}
            height={32}
            className="rounded-full border border-slate-200 dark:border-slate-700"
            unoptimized
          />
        </button>
      </div>
    </div>
  );
};
