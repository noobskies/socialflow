export type Platform =
  | "twitter"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "pinterest";

export type PlanTier = "free" | "pro" | "agency";

export interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName?: string;
  avatar?: string;
  connected: boolean;
  lastChecked?: string | Date;
  status?: "active" | "disconnected" | "token_expired" | "error";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledDate: string;
  status:
    | "scheduled"
    | "published"
    | "draft"
    | "pending_review"
    | "approved"
    | "rejected";
  mediaUrl?: string;
  mediaType?: "image" | "video";
  time?: string;
  timezone?: string;
  comments?: PostComment[];
  platformOptions?: PlatformOptions;
  poll?: PollConfig;
}

export interface Draft {
  content?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  scheduledDate?: string;
  platforms?: Platform[];
  status?: "scheduled" | "draft" | "pending_review" | "approved" | "rejected";
  comments?: PostComment[];
  platformOptions?: PlatformOptions;
  poll?: PollConfig;
}

export interface User {
  name: string;
  email: string;
  plan: PlanTier;
}

export interface MediaAsset {
  id: string;
  type: "image" | "video" | "template";
  url?: string;
  content?: string;
  name: string;
  createdAt: string;
  tags: string[];
  folderId?: string;
}

export interface Trend {
  id: string;
  topic: string;
  volume: string;
  difficulty: "Easy" | "Medium" | "Hard";
  context: string;
}

// Forward declarations for types defined in features.ts
export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface PlatformOptions {
  instagram?: {
    firstComment?: string;
    location?: string;
    collabUser?: string;
  };
  twitter?: {
    isThread?: boolean;
    replySettings?: "everyone" | "mentioned" | "followers";
  };
  pinterest?: {
    destinationLink?: string;
    boardId?: string;
  };
  youtube?: {
    visibility?: "public" | "private" | "unlisted";
    tags?: string[];
  };
}

export interface PollConfig {
  question?: string;
  options: string[];
  duration: number;
}
