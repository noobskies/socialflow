# Phase 6d: Inbox Refactoring

## Overview

Refactor the Inbox component (475 lines) into a clean orchestrator with focused sub-components following the proven pattern from Dashboard, Composer, Analytics, Settings, and Calendar.

**Current State**: Monolithic component with 2 tabs (messages, listening)
**Target State**: ~80-line orchestrator + 10-12 focused components
**Complexity**: Medium - message list, conversation view, AI reply generation

## Success Metrics

- **Line Reduction**: 475 → ~80 lines in main Inbox.tsx (-83%)
- **Component Count**: 10-12 new focused components
- **TypeScript**: 0 compilation errors
- **Functionality**: All features preserved (messages, listening, AI replies)
- **Dark Mode**: Fully supported
- **Mobile**: Responsive on all breakpoints

## Component Breakdown

### File Organization
```
/src/features/inbox/
├── Inbox.tsx (80-line orchestrator)
├── useInbox.ts (state management hook)
├── /tabs
│   ├── MessagesTab.tsx
│   └── ListeningTab.tsx
├── /components
│   ├── MessageList.tsx
│   ├── MessageCard.tsx
│   ├── ConversationView.tsx
│   ├── ConversationHeader.tsx
│   ├── ReplyBox.tsx
│   ├── AIReplyButtons.tsx
│   ├── ListeningCard.tsx
│   └── KeywordMonitor.tsx
└── /utils
    ├── platformIcons.tsx (REUSE from Calendar!)
    └── sentimentUtils.ts
```

## Current Component Analysis

**Inbox.tsx (475 lines)**:
- State management (activeTab, selectedMessageId, replyText, isGenerating)
- Mock data (MOCK_MESSAGES, MOCK_LISTENING)
- Platform icon/color helpers (duplicate of Calendar - can share!)
- Sentiment icon helper
- Message list rendering
- Conversation view rendering
- Listening tab rendering
- AI reply generation
- Tab switching logic

## Implementation Plan

### Sub-Phase 6d-A: Foundation & Utilities (15 min)

**Goal**: Create hook and shared utilities

**1. Create useInbox.ts hook**
```typescript
// /src/features/inbox/useInbox.ts
import { useState } from "react";
import { SocialMessage, ListeningResult } from "@/types";

export function useInbox() {
  const [activeTab, setActiveTab] = useState<"messages" | "listening">("messages");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const selectMessage = (id: string) => setSelectedMessageId(id);
  const clearReply = () => setReplyText("");
  
  return {
    activeTab,
    setActiveTab,
    selectedMessageId,
    selectMessage,
    replyText,
    setReplyText,
    isGenerating,
    setIsGenerating,
    clearReply,
  };
}
```

**2. Create sentimentUtils.ts**
```typescript
// /src/features/inbox/utils/sentimentUtils.ts
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function getSentimentIcon(sentiment: "positive" | "neutral" | "negative") {
  switch (sentiment) {
    case "positive":
      return TrendingUp;
    case "negative":
      return TrendingDown;
    case "neutral":
      return Minus;
  }
}

export function getSentimentColor(sentiment: "positive" | "neutral" | "negative") {
  switch (sentiment) {
    case "positive":
      return "text-emerald-500";
    case "negative":
      return "text-rose-500";
    case "neutral":
      return "text-slate-400";
  }
}
```

**3. Reuse platformIcons.tsx from Calendar**
```typescript
// Already exists at /src/features/calendar/utils/platformIcons.tsx
// Inbox will import from: @/features/calendar/utils/platformIcons
// (Could move to shared /src/utils if both use it extensively)
```

**Verification**:
- [ ] useInbox hook compiles
- [ ] sentimentUtils exports work
- [ ] Can import platformIcons from Calendar

---

### Sub-Phase 6d-B: Message Components (20 min)

**Goal**: Extract message-related components

**1. Create MessageCard.tsx**
```typescript
// /src/features/inbox/components/MessageCard.tsx
import React from "react";
import { SocialMessage } from "@/types";
import { getPlatformIcon, getPlatformColor } from "@/features/calendar/utils/platformIcons";

interface MessageCardProps {
  message: SocialMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  isSelected,
  onSelect,
}) => {
  const PlatformIcon = getPlatformIcon(message.platform);
  const platformColor = getPlatformColor(message.platform);

  return (
    <div
      onClick={() => onSelect(message.id)}
      className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative ${
        isSelected
          ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500 dark:border-l-indigo-400"
          : "border-l-4 border-l-transparent"
      }`}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={message.authorAvatar}
            className="w-10 h-10 rounded-full object-cover"
            alt={message.author}
          />
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${platformColor}`}
          >
            <PlatformIcon className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span
              className={`font-semibold text-sm truncate ${
                message.unread
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {message.author}
            </span>
            <span className="text-xs text-slate-400 shrink-0">
              {message.timestamp}
            </span>
          </div>
          <p
            className={`text-sm line-clamp-2 ${
              message.unread
                ? "text-slate-800 dark:text-slate-200 font-medium"
                : "text-slate-500 dark:text-slate-500"
            }`}
          >
            {message.content}
          </p>
        </div>
        {message.unread && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};
```

**2. Create MessageList.tsx**
```typescript
// /src/features/inbox/components/MessageList.tsx
import React from "react";
import { Search, Filter } from "lucide-react";
import { SocialMessage } from "@/types";
import { MessageCard } from "./MessageCard";

interface MessageListProps {
  messages: SocialMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
}) => {
  return (
    <>
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            message={msg}
            isSelected={selectedMessageId === msg.id}
            onSelect={onSelectMessage}
          />
        ))}
      </div>
    </>
  );
};
```

**Verification**:
- [ ] MessageCard renders correctly
- [ ] MessageList displays all messages
- [ ] Selection state works
- [ ] Platform badges show correctly

---

### Sub-Phase 6d-C: Conversation Components (20 min)

**Goal**: Extract conversation view components

**1. Create ConversationHeader.tsx**
```typescript
// /src/features/inbox/components/ConversationHeader.tsx
import React from "react";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { SocialMessage } from "@/types";
import { getPlatformColor } from "@/features/calendar/utils/platformIcons";

interface ConversationHeaderProps {
  message: SocialMessage;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  message,
}) => {
  const platformColor = getPlatformColor(message.platform);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <img
          src={message.authorAvatar}
          className="w-10 h-10 rounded-full"
          alt={message.author}
        />
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {message.author}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {message.authorHandle}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${platformColor}`}
            >
              {message.platform}
            </div>
            <span className="text-xs text-slate-400">{message.type}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400"
          title="Mark as Resolved"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
```

**2. Create AIReplyButtons.tsx**
```typescript
// /src/features/inbox/components/AIReplyButtons.tsx
import React from "react";
import { Sparkles } from "lucide-react";

interface AIReplyButtonsProps {
  onGenerate: (tone: "supportive" | "witty" | "professional" | "gratitude") => void;
  isGenerating: boolean;
}

export const AIReplyButtons: React.FC<AIReplyButtonsProps> = ({
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2 shrink-0">
        <Sparkles className="w-3 h-3 mr-1" />
        AI Smart Reply
      </div>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("gratitude")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        🙏 Say Thanks
      </button>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("supportive")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        🤝 Helpfully Answer
      </button>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("witty")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        ⚡ Witty Comeback
      </button>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("professional")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        👔 Professional
      </button>
    </div>
  );
};
```

**3. Create ReplyBox.tsx**
```typescript
// /src/features/inbox/components/ReplyBox.tsx
import React from "react";
import { Send, Smile, Loader2 } from "lucide-react";

interface ReplyBoxProps {
  replyText: string;
  onReplyChange: (text: string) => void;
  onSend: () => void;
  isGenerating: boolean;
}

export const ReplyBox: React.FC<ReplyBoxProps> = ({
  replyText,
  onReplyChange,
  onSend,
  isGenerating,
}) => {
  return (
    <div className="relative">
      <textarea
        value={replyText}
        onChange={(e) => onReplyChange(e.target.value)}
        placeholder={isGenerating ? "Gemini is thinking..." : "Write a reply..."}
        className={`w-full border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[100px] text-slate-900 dark:text-white ${
          isGenerating
            ? "bg-slate-50 dark:bg-slate-800 text-slate-400"
            : "bg-white dark:bg-slate-800"
        }`}
      />
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
          <Smile className="w-5 h-5" />
        </button>
        <button
          onClick={onSend}
          disabled={!replyText.trim() || isGenerating}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
```

**4. Create ConversationView.tsx**
```typescript
// /src/features/inbox/components/ConversationView.tsx
import React from "react";
import { ThumbsUp } from "lucide-react";
import { SocialMessage, ToastType } from "@/types";
import { ConversationHeader } from "./ConversationHeader";
import { AIReplyButtons } from "./AIReplyButtons";
import { ReplyBox } from "./ReplyBox";
import { generateReply } from "@/services/geminiService";

interface ConversationViewProps {
  message: SocialMessage;
  replyText: string;
  onReplyChange: (text: string) => void;
  isGenerating: boolean;
  onGeneratingChange: (value: boolean) => void;
  onClearReply: () => void;
  showToast: (message: string, type: ToastType) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  message,
  replyText,
  onReplyChange,
  isGenerating,
  onGeneratingChange,
  onClearReply,
  showToast,
}) => {
  const handleAiReply = async (
    tone: "supportive" | "witty" | "professional" | "gratitude"
  ) => {
    onGeneratingChange(true);
    const reply = await generateReply(message.content, tone);
    onReplyChange(reply);
    onGeneratingChange(false);
    showToast("AI Reply generated!", "success");
  };

  const handleSend = () => {
    showToast(`Reply sent to ${message.author}`, "success");
    onClearReply();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-hidden relative transition-colors duration-200">
      <ConversationHeader message={message} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Original Post Context */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 max-w-md w-full shadow-sm opacity-75">
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">
              In reply to your post
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-md shrink-0"></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  We are excited to announce our Series B funding round led
                  by...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Message */}
        <div className="flex gap-4">
          <img
            src={message.authorAvatar}
            className="w-10 h-10 rounded-full shrink-0"
            alt="Author"
          />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-lg">
            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              {message.content}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">{message.timestamp}</span>
              <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ThumbsUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
        <AIReplyButtons onGenerate={handleAiReply} isGenerating={isGenerating} />
        <ReplyBox
          replyText={replyText}
          onReplyChange={onReplyChange}
          onSend={handleSend}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};
```

**Verification**:
- [ ] ConversationHeader displays correctly
- [ ] AIReplyButtons trigger AI generation
- [ ] ReplyBox allows typing and sending
- [ ] Full conversation view renders properly

---

### Sub-Phase 6d-D: Listening Tab Components (15 min)

**Goal**: Extract listening-related components

**1. Create ListeningCard.tsx**
```typescript
// /src/features/inbox/components/ListeningCard.tsx
import React from "react";
import { ListeningResult } from "@/types";
import { getPlatformIcon, getPlatformColor } from "@/features/calendar/utils/platformIcons";
import { getSentimentIcon, getSentimentColor } from "../utils/sentimentUtils";

interface ListeningCardProps {
  item: ListeningResult;
}

export const ListeningCard: React.FC<ListeningCardProps> = ({ item }) => {
  const PlatformIcon = getPlatformIcon(item.platform);
  const platformColor = getPlatformColor(item.platform);
  const SentimentIcon = getSentimentIcon(item.sentiment);
  const sentimentColor = getSentimentColor(item.sentiment);

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${platformColor}`}>
            <PlatformIcon className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {item.author}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
          <SentimentIcon className={`w-4 h-4 ${sentimentColor}`} />
          <span className="capitalize text-slate-600 dark:text-slate-400">
            {item.sentiment}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-3">
        {item.content.split(" ").map((word, i) =>
          word.toLowerCase().includes(item.keyword.toLowerCase()) ||
          word.includes(item.keyword) ? (
            <span
              key={i}
              className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-medium px-0.5 rounded"
            >
              {word}{" "}
            </span>
          ) : (
            word + " "
          )
        )}
      </p>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{item.timestamp}</span>
        <span className="font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Keyword: {item.keyword}
        </span>
      </div>
    </div>
  );
};
```

**2. Create ListeningTab.tsx**
```typescript
// /src/features/inbox/tabs/ListeningTab.tsx
import React from "react";
import { Activity } from "lucide-react";
import { ListeningResult } from "@/types";
import { ListeningCard } from "../components/ListeningCard";

interface ListeningTabProps {
  items: ListeningResult[];
}

export const ListeningTab: React.FC<ListeningTabProps> = ({ items }) => {
  return (
    <div className="p-2 space-y-2">
      <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Monitored Keywords
      </div>
      {items.map((item) => (
        <ListeningCard key={item.id} item={item} />
      ))}
      <button className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center justify-center">
        <Activity className="w-4 h-4 mr-2" />
        Monitor New Keyword
      </button>
    </div>
  );
};
```

**3. Create MessagesTab.tsx** (wrapper for MessageList + ConversationView)
```typescript
// /src/features/inbox/tabs/MessagesTab.tsx
import React from "react";
import { MessageSquare } from "lucide-react";
import { SocialMessage, ToastType } from "@/types";
import { MessageList } from "../components/MessageList";
import { ConversationView } from "../components/ConversationView";

interface MessagesTabProps {
  messages: SocialMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
  replyText: string;
  onReplyChange: (text: string) => void;
  isGenerating: boolean;
  onGeneratingChange: (value: boolean) => void;
  onClearReply: () => void;
  showToast: (message: string, type: ToastType) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
  replyText,
  onReplyChange,
  isGenerating,
  onGeneratingChange,
  onClearReply,
  showToast,
}) => {
  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  return (
    <>
      {/* Left Sidebar: Message List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <MessageList
          messages={messages}
          selectedMessageId={selectedMessageId}
          onSelectMessage={onSelectMessage}
        />
      </div>

      {/* Right Content: Conversation */}
      {selectedMessage ? (
        <ConversationView
          message={selectedMessage}
          replyText={replyText}
          onReplyChange={onReplyChange}
          isGenerating={isGenerating}
          onGeneratingChange={onGeneratingChange}
          onClearReply={onClearReply}
          showToast={showToast}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
          <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
          <p className="font-medium">Select a conversation to start replying</p>
        </div>
      )}
    </>
  );
};
```

**Verification**:
- [ ] ListeningCard highlights keywords
- [ ] ListeningTab displays all items
- [ ] MessagesTab orchestrates message/conversation views
- [ ] Tab switching works correctly

---

### Sub-Phase 6d-E: Final Integration (15 min)

**Goal**: Create main orchestrator and integrate with App.tsx

**1. Create Inbox.tsx orchestrator**
```typescript
// /src/features/inbox/Inbox.tsx
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { SocialMessage, ListeningResult, ToastType } from "@/types";
import { useInbox } from "./useInbox";
import { MessagesTab } from "./tabs/MessagesTab";
import { ListeningTab } from "./tabs/ListeningTab";
import { MOCK_MESSAGES, MOCK_LISTENING } from "@/utils/constants";

interface InboxProps {
  showToast: (message: string, type: ToastType) => void;
}

export const Inbox: React.FC<InboxProps> = ({ showToast }) => {
  const inbox = useInbox();

  return (
    <div className="h-full flex flex-col md:flex-row bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Left Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => inbox.setActiveTab("messages")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inbox.activeTab === "messages"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => inbox.setActiveTab("listening")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inbox.activeTab === "listening"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Listening
              </button>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={
                inbox.activeTab === "messages"
                  ? "Search messages..."
                  : "Search keywords..."
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {inbox.activeTab === "messages" ? (
            <MessagesTab
              messages={MOCK_MESSAGES}
              selectedMessageId={inbox.selectedMessageId}
              onSelectMessage={inbox.selectMessage}
              replyText={inbox.replyText}
              onReplyChange={inbox.setReplyText}
              isGenerating={inbox.isGenerating}
              onGeneratingChange={inbox.setIsGenerating}
              onClearReply={inbox.clearReply}
              showToast={showToast}
            />
          ) : (
            <ListeningTab items={MOCK_LISTENING} />
          )}
        </div>
      </div>
    </div>
  );
};
```

**2. Move mock data to constants.ts**
```typescript
// Add to /src/utils/constants.ts
export const MOCK_MESSAGES: SocialMessage[] = [
  // ... existing mock messages
];

export const MOCK_LISTENING: ListeningResult[] = [
  // ... existing mock listening data
];
```

**3. Update App.tsx import**
```typescript
// App.tsx - Update import
import Inbox from "@/features/inbox/Inbox";
```

**Verification**:
- [ ] TypeScript compiles with 0 errors
- [ ] Dev server starts successfully
- [ ] Both tabs (messages, listening) render correctly
- [ ] Tab switching works smoothly
- [ ] Message selection works
- [ ] Conversation view displays
- [ ] AI reply generation works
- [ ] Listening tab shows keyword highlights
- [ ] Dark mode works correctly
- [ ] Mobile responsive layout works

---

## Key Achievements

1. **Massive Simplification**: 475 → ~80 lines in main orchestrator (-83%)
2. **Reusability**: Platform icons shared with Calendar feature
3. **Clean Separation**: Messages and Listening tabs fully isolated
4. **Orchestrator Pattern**: Successfully applied proven pattern
5. **AI Integration**: Reply generation cleanly isolated in components
6. **Type Safety**: All components properly typed

## Next Steps

After completing Phase 6d:
- [ ] Commit changes
- [ ] Move to Phase 6e: Library Refactoring (713 lines - LARGEST!)
- [ ] Continue with remaining components
