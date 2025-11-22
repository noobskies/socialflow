
export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'pinterest';
export type PlanTier = 'free' | 'pro' | 'agency';

export interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  avatar: string;
  connected: boolean;
}

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
    replySettings?: 'everyone' | 'mentioned' | 'followers';
  };
  pinterest?: {
    destinationLink?: string;
    boardId?: string;
  };
  youtube?: {
    visibility?: 'public' | 'private' | 'unlisted';
    tags?: string[];
  };
}

export interface PollConfig {
  question?: string; // Optional, can use main content
  options: string[];
  duration: number; // days
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledDate: string; // ISO string
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

export interface VideoEditorConfig {
  duration: number;
  trimStart: number;
  trimEnd: number;
  thumbnailTime: number;
  captions: boolean;
  captionsText?: string;
}

export interface ListeningResult {
  id: string;
  keyword: string;
  platform: Platform;
  author: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

export interface AnalyticsData {
  date: string;
  impressions: number;
  engagement: number;
  clicks: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COMPOSER = 'COMPOSER',
  CALENDAR = 'CALENDAR',
  ANALYTICS = 'ANALYTICS',
  INBOX = 'INBOX',
  LIBRARY = 'LIBRARY',
  SETTINGS = 'SETTINGS',
  LINKS = 'LINKS',
  AUTOMATIONS = 'AUTOMATIONS'
}

export interface User {
  name: string;
  email: string;
  plan: PlanTier;
}

export interface SocialMessage {
  id: string;
  platform: Platform;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'dm' | 'mention';
  unread: boolean;
  replied?: boolean;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'template';
  url?: string; // for images/videos
  content?: string; // for text templates
  name: string;
  createdAt: string;
  tags: string[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  type: 'system' | 'user';
  icon?: string;
}

export interface Trend {
  id: string;
  topic: string;
  volume: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  context: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
  status: 'active' | 'invited';
}

export interface ShortLink {
  id: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  tags: string[];
}

export interface BioPageConfig {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: 'light' | 'dark' | 'colorful';
  links: { id: string; title: string; url: string; active: boolean }[];
  enableLeadCapture?: boolean;
  leadCaptureText?: string;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  source: string;
  capturedAt: string;
}

export interface RSSArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  snippet: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  active: boolean;
  stats: {
    runs: number;
    lastRun: string;
  };
  icon: string; // lucide icon name
}

export interface Integration {
  id: string;
  name: string;
  category: 'ecommerce' | 'communication' | 'content';
  icon: string;
  connected: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  inventory: number;
}

export interface BrandingConfig {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  removeWatermark: boolean;
  customDomain: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  role: 'owner' | 'member';
  logo?: string;
}

export interface Report {
  id: string;
  name: string;
  dateRange: string;
  createdAt: string;
  status: 'ready' | 'generating';
  format: 'pdf' | 'csv';
}

export interface Bucket {
  id: string;
  name: string;
  postCount: number;
  schedule: string; // e.g., "Every Mon, Wed"
  color: string;
}

export interface HashtagGroup {
  id: string;
  name: string;
  tags: string[];
}

export type ToastType = 'success' | 'error' | 'info';
