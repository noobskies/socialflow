"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Post,
  SocialAccount,
  Draft,
  ToastType,
  PlanTier,
  BrandingConfig,
} from "@/types";
import { INITIAL_POSTS, INITIAL_ACCOUNTS } from "@/utils/constants";

interface AppContextType {
  // State
  posts: Post[];
  accounts: SocialAccount[];
  userPlan: PlanTier;
  branding: BrandingConfig;
  initialDraft?: Draft;

  // Setters
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setAccounts: React.Dispatch<React.SetStateAction<SocialAccount[]>>;
  setUserPlan: React.Dispatch<React.SetStateAction<PlanTier>>;
  setBranding: React.Dispatch<React.SetStateAction<BrandingConfig>>;

  // Handlers
  showToast: (message: string, type: ToastType) => void;
  onPostCreated: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onCompose: (draft?: Draft) => void;
  onToggleAccount: (id: string) => void;
  onOpenUpgrade: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
  showToast: (message: string, type: ToastType) => void;
  onOpenUpgrade: () => void;
}

export function AppContextProvider({
  children,
  showToast,
  onOpenUpgrade,
}: AppProviderProps) {
  // Global State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [userPlan, setUserPlan] = useState<PlanTier>("free");
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>();

  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "SocialFlow Agency",
    primaryColor: "#4f46e5",
    logoUrl: "",
    removeWatermark: false,
    customDomain: "social.myagency.com",
  });

  // Handlers
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [...prev, newPost]);
    showToast("Post created successfully", "success");
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleCompose = (draft?: Draft) => {
    setInitialDraft(draft);
    // Navigation is handled by Next.js Link in calling component
  };

  const handleToggleAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    );
  };

  const value: AppContextType = {
    posts,
    accounts,
    userPlan,
    branding,
    initialDraft,
    setPosts,
    setAccounts,
    setUserPlan,
    setBranding,
    showToast,
    onPostCreated: handlePostCreated,
    onUpdatePost: handleUpdatePost,
    onCompose: handleCompose,
    onToggleAccount: handleToggleAccount,
    onOpenUpgrade,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
