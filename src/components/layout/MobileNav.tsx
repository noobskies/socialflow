import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  MessageSquare,
  Calendar as CalendarIcon,
  MoreHorizontal,
} from "lucide-react";

interface MobileNavProps {
  onCompose: () => void;
  onMoreClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onCompose,
  onMoreClick,
}) => {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-40 safe-area-pb transition-colors duration-200">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 ${
          pathname === "/"
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        <LayoutDashboard className="w-6 h-6" />
      </Link>
      <Link
        href="/calendar"
        className={`flex flex-col items-center gap-1 ${
          pathname === "/calendar"
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        <CalendarIcon className="w-6 h-6" />
      </Link>
      <div className="relative -top-6">
        <button
          onClick={onCompose}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 hover:bg-indigo-700 transition-transform active:scale-95 dark:shadow-indigo-900/40"
        >
          <PenSquare className="w-6 h-6" />
        </button>
      </div>
      <Link
        href="/inbox"
        className={`flex flex-col items-center gap-1 ${
          pathname === "/inbox"
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </Link>
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
      >
        <MoreHorizontal className="w-6 h-6" />
      </button>
    </nav>
  );
};
