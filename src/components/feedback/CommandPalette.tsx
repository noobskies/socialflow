import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  LayoutDashboard,
  PenSquare,
  MessageSquare,
  Calendar,
  FolderOpen,
  Link,
  Workflow,
  BarChart3,
  Settings,
  User,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { ViewState } from "@/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewState) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setView,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = [
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      icon: LayoutDashboard,
      action: () => setView(ViewState.DASHBOARD),
      category: "Navigation",
    },
    {
      id: "nav-compose",
      label: "Create New Post",
      icon: PenSquare,
      action: () => setView(ViewState.COMPOSER),
      category: "Actions",
    },
    {
      id: "nav-inbox",
      label: "Check Inbox",
      icon: MessageSquare,
      action: () => setView(ViewState.INBOX),
      category: "Navigation",
    },
    {
      id: "nav-calendar",
      label: "View Calendar",
      icon: Calendar,
      action: () => setView(ViewState.CALENDAR),
      category: "Navigation",
    },
    {
      id: "nav-library",
      label: "Open Content Library",
      icon: FolderOpen,
      action: () => setView(ViewState.LIBRARY),
      category: "Navigation",
    },
    {
      id: "nav-links",
      label: "Manage Links",
      icon: Link,
      action: () => setView(ViewState.LINKS),
      category: "Navigation",
    },
    {
      id: "nav-automations",
      label: "Configure Automations",
      icon: Workflow,
      action: () => setView(ViewState.AUTOMATIONS),
      category: "Navigation",
    },
    {
      id: "nav-analytics",
      label: "View Analytics",
      icon: BarChart3,
      action: () => setView(ViewState.ANALYTICS),
      category: "Navigation",
    },
    {
      id: "nav-settings",
      label: "Settings",
      icon: Settings,
      action: () => setView(ViewState.SETTINGS),
      category: "Navigation",
    },
    {
      id: "action-profile",
      label: "Edit Profile",
      icon: User,
      action: () => setView(ViewState.SETTINGS),
      category: "Settings",
    },
    {
      id: "action-billing",
      label: "Manage Subscription",
      icon: CreditCard,
      action: () => setView(ViewState.SETTINGS),
      category: "Settings",
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (item: (typeof items)[0]) => {
      item.action();
      onClose();
    },
    [onClose]
  );

  // Reset when opening (effect only runs when isOpen becomes true)
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
      }, 0);
    }
  }, [isOpen]);

  // Keyboard navigation within the palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) {
          handleSelect(item);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 text-lg outline-none placeholder:text-slate-400 text-slate-800 dark:text-slate-200 bg-transparent"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <>
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
                      />
                      <span className={isSelected ? "font-medium" : ""}>
                        {item.label}
                      </span>
                    </div>
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex justify-between">
          <span>Pro Tip: You can type "Create" to jump to composer</span>
          <div className="flex gap-3">
            <span>
              Use{" "}
              <kbd className="font-sans bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1">
                ↑
              </kbd>{" "}
              <kbd className="font-sans bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1">
                ↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="font-sans bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-1">
                ↵
              </kbd>{" "}
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
