import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileNav } from "@/components/layout/MobileNav";
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
        <MobileHeader
          branding={branding}
          onMenuOpen={() => setMobileMenuOpen(true)}
          onNotificationsOpen={notifications.openModal}
        />

        <div className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-0">
          {renderView()}
        </div>

        <MobileNav
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setMobileMenuOpen(false);
          }}
          onCompose={() => handleCompose()}
          onMoreClick={() => setMobileMenuOpen(true)}
        />
      </main>
    </div>
  );
};

export default App;
