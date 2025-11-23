import { Platform } from './domain';

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
  question?: string;
  options: string[];
  duration: number;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface VideoEditorConfig {
  duration: number;
  trimStart: number;
  trimEnd: number;
  thumbnailTime: number;
  captions: boolean;
  captionsText?: string;
}

export interface BrandingConfig {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  removeWatermark: boolean;
  customDomain: string;
}

export interface AnalyticsData {
  date: string;
  impressions: number;
  engagement: number;
  clicks: number;
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
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  inventory: number;
}

export interface HashtagGroup {
  id: string;
  name: string;
  tags: string[];
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

export interface RSSArticle {
  id: string;
  title: string;
  snippet: string;
  source: string;
  imageUrl: string;
  url: string;
  publishedAt: string;
}

export interface Bucket {
  id: string;
  name: string;
  schedule: string;
  color: string;
}

export interface Folder {
  id: string;
  name: string;
  type: 'system' | 'user';
}

export interface Workspace {
  id: string;
  name: string;
  role: 'owner' | 'member';
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

export interface Lead {
  id: string;
  email: string;
  source: string;
  capturedAt: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: string;
}

export interface Report {
  id: string;
  name: string;
  dateRange: string;
  createdAt: string;
  status: 'ready' | 'generating';
  format: 'pdf' | 'csv';
}

export interface DraftAnalysis {
  score: number;
  sentiment: string;
  engagementPrediction: string;
  suggestions: string[];
}
