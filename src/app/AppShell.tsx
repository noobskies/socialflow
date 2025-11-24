"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import CommandPalette from "@/components/feedback/CommandPalette";
import Toast from "@/components/feedback/Toast";
import Notifications from "@/components/feedback/Notifications";
import HelpModal from "@/components/feedback/HelpModal";
import UpgradeModal from "@/components/feedback/UpgradeModal";
import ShortcutsModal from "@/components/feedback/ShortcutsModal";
import { AppContextProvider } from "./AppContext";
import { ViewState, BrandingConfig, PlanTier } from "@/types";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboard } from "@/hooks/useKeyboard";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  // Custom Hooks
  const { toast, showToast, hideToast } = useToast();
  const cmdPalette = useModal();
  const notifications = useModal();
  const help = useModal();
  const shortcuts = useModal();
  const upgradeModal = useModal();
  const { theme, setTheme } = useTheme();

  // View State (temporary - will be removed when navigation is updated)
  const [currentView, setCurrentView] = useState<ViewState>(
    ViewState.DASHBOARD
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Branding State (for layout components)
  const [branding] = useState<BrandingConfig>({
    companyName: "SocialFlow Agency",
    primaryColor: "#4f46e5",
    logoUrl: "",
    removeWatermark: false,
    customDomain: "social.myagency.com",
  });
  const [userPlan] = useState<PlanTier>("free");

  // Global Keyboard Shortcuts
  useKeyboard({
    "cmd+k": cmdPalette.openModal,
    "ctrl+k": cmdPalette.openModal,
    "?": shortcuts.toggleModal,
  });

  const handleUpgrade = (plan: PlanTier) => {
    upgradeModal.closeModal();
    showToast(
      `Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan!`,
      "success"
    );
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
          <AppContextProvider
            showToast={showToast}
            onOpenUpgrade={upgradeModal.openModal}
          >
            {children}
          </AppContextProvider>
        </div>

        <MobileNav
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setMobileMenuOpen(false);
          }}
          onCompose={() => {}}
          onMoreClick={() => setMobileMenuOpen(true)}
        />
      </main>
    </div>
  );
}
