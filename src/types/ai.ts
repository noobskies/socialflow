// AI Service Response Types
// Types for responses from Gemini AI service

export interface WorkflowSuggestion {
  name: string;
  description: string;
  trigger: string;
  action: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  volume: string;
  difficulty: string;
  context: string;
}

export interface DraftAnalysis {
  score: number;
  sentiment: string;
  engagementPrediction: string;
  suggestions: string[];
}

// Team Collaboration Types
export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

// Library Tab Types
export type LibraryTabType =
  | "library"
  | "rss"
  | "buckets"
  | "hashtags"
  | "stock";
