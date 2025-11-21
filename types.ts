
export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'pinterest';

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
  scheduledDate: string; // ISO string
  status: 'scheduled' | 'published' | 'draft';
  mediaUrl?: string;
  time?: string;
}

export interface Draft {
  content?: string;
  mediaUrl?: string;
  scheduledDate?: string;
  platforms?: Platform[];
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
  plan: 'free' | 'pro' | 'agency';
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
