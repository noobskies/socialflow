import type { Platform } from "./domain";

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
  role: "admin" | "editor" | "viewer";
  avatar: string;
  status: "active" | "invited";
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
  theme: "light" | "dark" | "colorful";
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
  type: "comment" | "dm" | "mention";
  unread: boolean;
  replied?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  features: string[];
}

export interface Workspace {
  id: string;
  name: string;
  type: "personal" | "team" | "agency";
  members: number;
}

export interface Report {
  id: string;
  name: string;
  period: string;
  generated: string;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  source: string;
  timestamp: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

export interface RSSArticle {
  id: string;
  title: string;
  snippet: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface Bucket {
  id: string;
  name: string;
  description: string;
  postCount: number;
  icon: string;
}

export interface Folder {
  id: string;
  name: string;
  assetCount: number;
}

export interface ListeningResult {
  id: string;
  platform: Platform;
  content: string;
  author: string;
  engagement: number;
  sentiment: "positive" | "negative" | "neutral";
  timestamp: string;
}
