import { PostComment, PlatformOptions, PollConfig } from './features';

export type Platform =
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'pinterest';

export type PlanTier = 'free' | 'pro' | 'agency';

export interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  avatar: string;
  connected: boolean;
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'draft' | 'pending_review' | 'approved' | 'rejected';
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  time?: string;
  timezone?: string;
  comments?: PostComment[];
  platformOptions?: PlatformOptions;
  poll?: PollConfig;
}

export interface Draft {
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  scheduledDate?: string;
  platforms?: Platform[];
  status?: 'draft' | 'pending_review' | 'approved' | 'rejected';
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
  type: 'image' | 'video' | 'template';
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
  difficulty: 'Easy' | 'Medium' | 'Hard';
  context: string;
}
