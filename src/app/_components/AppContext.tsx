"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Post,
  SocialAccount,
  Draft,
  ToastType,
  PlanTier,
  BrandingConfig,
} from "@/types";

interface AppContextType {
  // Posts
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  refetchPosts: () => Promise<void>;

  // Accounts
  accounts: SocialAccount[];
  accountsLoading: boolean;
  accountsError: string | null;
  setAccounts: React.Dispatch<React.SetStateAction<SocialAccount[]>>;
  refetchAccounts: () => Promise<void>;

  // User
  userPlan: PlanTier;
  setUserPlan: React.Dispatch<React.SetStateAction<PlanTier>>;

  // Branding
  branding: BrandingConfig;
  setBranding: React.Dispatch<React.SetStateAction<BrandingConfig>>;

  // Composer
  initialDraft?: Draft;

  // Handlers
  showToast: (message: string, type: ToastType) => void;
  onPostCreated: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
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

// Helper function for API calls with error handling
const fetchAPI = async <T,>(
  url: string,
  setData: (data: T) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  dataKey: string
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(url, {
      credentials: "include", // Include cookies for auth
    });

    // Handle authentication errors
    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    setData(result[dataKey]);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    setError(error instanceof Error ? error.message : "Failed to load data");
  } finally {
    setLoading(false);
  }
};

export function AppContextProvider({
  children,
  showToast,
  onOpenUpgrade,
}: AppProviderProps) {
  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Accounts state
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // User plan (can be fetched from API later)
  const [userPlan, setUserPlan] = useState<PlanTier>("free");

  // Composer draft
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>();

  // Branding (can be fetched from API later)
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "SocialFlow Agency",
    primaryColor: "#4f46e5",
    logoUrl: "",
    removeWatermark: false,
    customDomain: "social.myagency.com",
  });

  // Fetch functions
  const fetchPosts = useCallback(async () => {
    await fetchAPI<Post[]>(
      "/api/posts?limit=100",
      setPosts,
      setPostsLoading,
      setPostsError,
      "posts"
    );
  }, []);

  const fetchAccounts = useCallback(async () => {
    await fetchAPI<SocialAccount[]>(
      "/api/accounts",
      setAccounts,
      setAccountsLoading,
      setAccountsError,
      "accounts"
    );
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
  }, [fetchPosts, fetchAccounts]);

  // Post mutation handlers
  const handlePostCreated = useCallback(
    (newPost: Post) => {
      setPosts((prev) => [newPost, ...prev]);
      showToast("Post created successfully", "success");
    },
    [showToast]
  );

  const handleUpdatePost = useCallback(
    (updatedPost: Post) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      showToast("Post updated successfully", "success");
    },
    [showToast]
  );

  const handleDeletePost = useCallback(
    (postId: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast("Post deleted successfully", "success");
    },
    [showToast]
  );

  // Account mutation handler
  const handleToggleAccount = useCallback((accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, connected: !acc.connected } : acc
      )
    );
  }, []);

  // Composer handler
  const handleCompose = useCallback((draft?: Draft) => {
    setInitialDraft(draft);
    // Navigation is handled by Next.js Link in calling component
  }, []);

  const value: AppContextType = {
    // Posts
    posts,
    postsLoading,
    postsError,
    setPosts,
    refetchPosts: fetchPosts,

    // Accounts
    accounts,
    accountsLoading,
    accountsError,
    setAccounts,
    refetchAccounts: fetchAccounts,

    // User
    userPlan,
    setUserPlan,

    // Branding
    branding,
    setBranding,

    // Composer
    initialDraft,

    // Handlers
    showToast,
    onPostCreated: handlePostCreated,
    onUpdatePost: handleUpdatePost,
    onDeletePost: handleDeletePost,
    onCompose: handleCompose,
    onToggleAccount: handleToggleAccount,
    onOpenUpgrade,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
