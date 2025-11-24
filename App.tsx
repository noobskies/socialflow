import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/features/dashboard/Dashboard";
import Composer from "@/features/composer/Composer";
import Calendar from "@/features/calendar/Calendar";
import Analytics from "@/features/analytics/Analytics";
import Settings from "@/features/settings/Settings";
import Inbox from "@/features/inbox/Inbox";
import Library from "@/features/library/Library";
import LinkManager from "@/features/linkmanager/LinkManager";
import Automations from "@/features/automations/Automations";
import CommandPalette from "@/components/feedback/CommandPalette";
import Toast from "@/components/feedback/Toast";
import Notifications from "@/components/feedback/Notifications";
import HelpModal from "@/components/feedback/HelpModal";
import UpgradeModal from "@/components/feedback/UpgradeModal";
import ShortcutsModal from "@/components/feedback/ShortcutsModal";
import {
  ViewState,
  Draft,
  BrandingConfig,
  PlanTier,
  Post,
  SocialAccount,
} from "@/types";
import { INITIAL_POSTS, INITIAL_ACCOUNTS } from "@/utils/constants";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboard } from "@/hooks/useKeyboard";
import {
  Menu,
  LayoutDashboard,
  PenSquare,
  MessageSquare,
  Calendar as CalendarIcon,
  MoreHorizontal,
} from "lucide-react";

const App: React.FC = () => {
  // Custom Hooks
  const { toast, showToast, hideToast } = useToast();
  const cmdPalette = useModal();
  const notifications = useModal();
  const help = useModal();
  const shortcuts = useModal();
  const upgradeModal = useModal();
  const { theme, setTheme } = useTheme();

  // View State
  const [currentView, setCurrentView] = useState<ViewState>(
    ViewState.DASHBOARD
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>(
    undefined
  );

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

  // Global Keyboard Shortcuts
  useKeyboard({
    "cmd+k": cmdPalette.openModal,
    "ctrl+k": cmdPalette.openModal,
    "?": shortcuts.toggleModal,
    c: () => setCurrentView(ViewState.COMPOSER),
  });

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
    upgradeModal.closeModal();
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
            onOpenUpgrade={upgradeModal.openModal}
            onPostCreated={handlePostCreated}
            showToast={showToast}
          />
        );
      case ViewState.LINKS:
        return <LinkManager showToast={showToast} />;
      case ViewState.AUTOMATIONS:
        return <Automations showToast={showToast} />;
      case ViewState.ANALYTICS:
        return (
          <Analytics
            showToast={showToast}
            userPlan={userPlan}
            onOpenUpgrade={upgradeModal.openModal}
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
            onOpenUpgrade={upgradeModal.openModal}
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
        onClose={hideToast}
      />
      <Notifications
        isOpen={notifications.isOpen}
        onClose={notifications.closeModal}
      />
      <HelpModal isOpen={help.isOpen} onClose={help.closeModal} />
      <ShortcutsModal
        isOpen={shortcuts.isOpen}
        onClose={shortcuts.closeModal}
      />
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={upgradeModal.closeModal}
        currentPlan={userPlan}
        onUpgrade={handleUpgrade}
      />
      <CommandPalette
        isOpen={cmdPalette.isOpen}
        onClose={cmdPalette.closeModal}
        setView={(view) => {
          setCurrentView(view);
          cmdPalette.closeModal();
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
          onOpenNotifications={notifications.openModal}
          onOpenHelp={help.openModal}
          onOpenUpgrade={upgradeModal.openModal}
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
            <button onClick={notifications.openModal} className="relative p-1">
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
