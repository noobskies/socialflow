import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Composer from "./components/Composer";
import Calendar from "./components/Calendar";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Inbox from "./components/Inbox";
import Library from "./components/Library";
import LinkManager from "./components/LinkManager";
import Automations from "./components/Automations";
import CommandPalette from "./components/CommandPalette";
import Toast from "./components/Toast";
import Notifications from "./components/Notifications";
import HelpModal from "./components/HelpModal";
import UpgradeModal from "./components/UpgradeModal";
import {
  ViewState,
  Draft,
  ToastType,
  BrandingConfig,
  PlanTier,
  Post,
  SocialAccount,
} from "@/types";
import { INITIAL_POSTS, INITIAL_ACCOUNTS } from "@/utils/constants";
import {
  Menu,
  LayoutDashboard,
  PenSquare,
  MessageSquare,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Keyboard,
  X,
} from "lucide-react";

// Keyboard Shortcuts Modal Component
const ShortcutsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Cmd+K", desc: "Open Command Palette" },
    { key: "?", desc: "Show this help dialog" },
    { key: "g then d", desc: "Go to Dashboard" },
    { key: "g then c", desc: "Go to Calendar" },
    { key: "c", desc: "Compose new post" },
    { key: "ESC", desc: "Close modals" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
            <Keyboard className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {s.desc}
              </span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(
    ViewState.DASHBOARD
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>(
    undefined
  );
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Global State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [userPlan, setUserPlan] = useState<PlanTier>("free");

  // Branding State (Agency)
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "SocialFlow Agency",
    primaryColor: "#4f46e5",
    logoUrl: "",
    removeWatermark: false,
    customDomain: "social.myagency.com",
  });

  // Theme State
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, visible: true });
  };

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("system");
    }
  }, []);

  // Apply Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = () => {
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };
    applyTheme();
    localStorage.setItem("theme", theme);
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdPaletteOpen(true);
      }
      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
      if (e.key === "c") {
        e.preventDefault();
        setCurrentView(ViewState.COMPOSER);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCompose = (draft?: Draft) => {
    setInitialDraft(draft);
    setCurrentView(ViewState.COMPOSER);
    setMobileMenuOpen(false);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [...prev, newPost]);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleToggleAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    );
  };

  const handleUpgrade = (plan: PlanTier) => {
    setUserPlan(plan);
    setIsUpgradeModalOpen(false);
    showToast(
      `Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan!`,
      "success"
    );
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard
            posts={posts}
            accounts={accounts}
            onPostCreated={handlePostCreated}
            showToast={showToast}
            onCompose={handleCompose}
          />
        );
      case ViewState.COMPOSER:
        return (
          <Composer
            initialDraft={initialDraft}
            showToast={showToast}
            onPostCreated={handlePostCreated}
            userPlan={userPlan}
          />
        );
      case ViewState.INBOX:
        return <Inbox showToast={showToast} />;
      case ViewState.CALENDAR:
        return (
          <Calendar
            onCompose={handleCompose}
            posts={posts}
            onUpdatePost={handleUpdatePost}
            onPostCreated={handlePostCreated}
            userPlan={userPlan}
          />
        );
      case ViewState.LIBRARY:
        return (
          <Library
            onCompose={handleCompose}
            userPlan={userPlan}
            onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
            onPostCreated={handlePostCreated}
          />
        );
      case ViewState.LINKS:
        return <LinkManager showToast={showToast} />;
      case ViewState.AUTOMATIONS:
        return <Automations />;
      case ViewState.ANALYTICS:
        return (
          <Analytics
            showToast={showToast}
            userPlan={userPlan}
            onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
            onCompose={handleCompose}
          />
        );
      case ViewState.SETTINGS:
        return (
          <Settings
            showToast={showToast}
            branding={branding}
            setBranding={setBranding}
            userPlan={userPlan}
            onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
            accounts={accounts}
            onToggleConnection={handleToggleAccount}
          />
        );
      default:
        return (
          <Dashboard
            posts={posts}
            accounts={accounts}
            onPostCreated={handlePostCreated}
            showToast={showToast}
            onCompose={handleCompose}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={userPlan}
        onUpgrade={handleUpgrade}
      />
      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        setView={(view) => {
          setCurrentView(view);
          setIsCmdPaletteOpen(false);
        }}
      />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar
          currentView={currentView}
          setView={(view) => {
            setCurrentView(view);
            setMobileMenuOpen(false);
          }}
          currentTheme={theme}
          setTheme={setTheme}
          branding={branding}
          userPlan={userPlan}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        />
      </div>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-slate-800 dark:text-white truncate max-w-[200px]">
              {branding.logoUrl ? branding.companyName : "SocialFlow AI"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border border-white dark:border-slate-900"></div>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop"
                alt="User"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
              />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-0">
          {renderView()}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-40 safe-area-pb transition-colors duration-200">
          <button
            onClick={() => setCurrentView(ViewState.DASHBOARD)}
            className={`flex flex-col items-center gap-1 ${currentView === ViewState.DASHBOARD ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView(ViewState.CALENDAR)}
            className={`flex flex-col items-center gap-1 ${currentView === ViewState.CALENDAR ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
          >
            <CalendarIcon className="w-6 h-6" />
          </button>
          <div className="relative -top-6">
            <button
              onClick={() => handleCompose()}
              className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 hover:bg-indigo-700 transition-transform active:scale-95 dark:shadow-indigo-900/40"
            >
              <PenSquare className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setCurrentView(ViewState.INBOX)}
            className={`flex flex-col items-center gap-1 ${currentView === ViewState.INBOX ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
          >
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
