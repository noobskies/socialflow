# Phase 9F10: Inbox Messages & Listening APIs

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Create APIs for inbox messages and social listening, migrating from `MOCK_MESSAGES` and `MOCK_LISTENING` to real backend. This enables the Inbox feature with message management and brand monitoring across social platforms.

### What This Enables

- View messages from all platforms
- Social listening for keywords/mentions
- Sentiment analysis
- Filter by platform/type
- Mark messages as read
- Search and organize inbox

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const MOCK_MESSAGES: Message[] = [/* hardcoded */];
export const MOCK_LISTENING: ListeningItem[] = [/* hardcoded */];

// Inbox.tsx
const [messages, setMessages] = useState(MOCK_MESSAGES);
const [listening, setListening] = useState(MOCK_LISTENING);
```

### Target (Real API)
```typescript
// AppContext.tsx
const [messages, setMessages] = useState<Message[]>([]);
const [listening, setListening] = useState<ListeningItem[]>([]);

useEffect(() => {
  fetch('/api/inbox/messages').then(...);
  fetch('/api/inbox/listening').then(...);
}, []);
```

---

## Database Schema

**Note**: These models may not exist in initial Prisma schema. You'll need to add them:

```prisma
model Message {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  platform       Platform
  type           MessageType // "mention", "comment", "dm"
  
  author         String
  authorHandle   String
  authorAvatar   String?
  content        String   @db.Text
  
  unread         Boolean  @default(true)
  sentiment      String?  // "positive", "neutral", "negative"
  
  externalId     String?  // ID from social platform
  metadata       Json?    // Additional platform-specific data
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([userId])
  @@index([platform])
  @@index([unread])
  @@index([createdAt])
  @@map("messages")
}

enum MessageType {
  mention
  comment
  dm
}

model ListeningItem {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  keyword     String   // Tracked keyword
  platform    Platform
  
  author      String
  content     String   @db.Text
  engagement  Int      @default(0) // Likes, shares, etc.
  sentiment   String   // "positive", "neutral", "negative"
  
  externalId  String?  // ID from social platform
  metadata    Json?
  
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([keyword])
  @@index([platform])
  @@index([createdAt])
  @@map("listening_items")
}
```

**Migration needed**: Run `npx prisma migrate dev` after adding models.

---

## API Implementation

### Step 1: Create Messages API (30 min)

**File**: `src/app/api/inbox/messages/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Platform, MessageType } from '@prisma/client';

/**
 * GET /api/inbox/messages
 * List all messages for authenticated user
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const platform = searchParams.get('platform') as Platform | null;
    const type = searchParams.get('type') as MessageType | null;
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: any = { userId: user!.id };

    if (platform) {
      where.platform = platform;
    }

    if (type) {
      where.type = type;
    }

    if (unreadOnly) {
      where.unread = true;
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.message.count({
      where: { userId: user!.id, unread: true },
    });

    return NextResponse.json({
      messages,
      count: messages.length,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inbox/messages
 * Manually create a message (for testing/admin)
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    const message = await prisma.message.create({
      data: {
        ...body,
        userId: user!.id,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
```

**File**: `src/app/api/inbox/messages/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/inbox/messages/[id]
 * Mark message as read/unread
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.message.findFirst({
      where: { id, userId: user!.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const message = await prisma.message.update({
      where: { id },
      data: {
        unread: body.unread ?? existing.unread,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inbox/messages/[id]
 * Delete a message
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    // Verify ownership
    const message = await prisma.message.findFirst({
      where: { id, userId: user!.id },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await prisma.message.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
```

---

### Step 2: Create Listening API (25 min)

**File**: `src/app/api/inbox/listening/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

/**
 * GET /api/inbox/listening
 * List social listening items
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const keyword = searchParams.get('keyword');
    const platform = searchParams.get('platform') as Platform | null;
    const sentiment = searchParams.get('sentiment');

    const where: any = { userId: user!.id };

    if (keyword) {
      where.keyword = keyword;
    }

    if (platform) {
      where.platform = platform;
    }

    if (sentiment) {
      where.sentiment = sentiment;
    }

    const items = await prisma.listeningItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error fetching listening items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listening items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inbox/listening
 * Create listening item (for webhook/sync)
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    const item = await prisma.listeningItem.create({
      data: {
        ...body,
        userId: user!.id,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating listening item:', error);
    return NextResponse.json(
      { error: 'Failed to create listening item' },
      { status: 500 }
    );
  }
}
```

---

### Step 3: Add to AppContext (15 min)

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Inbox
  messages: Message[];
  messagesLoading: boolean;
  messagesError: string | null;
  refetchMessages: () => Promise<void>;

  listening: ListeningItem[];
  listeningLoading: boolean;
  listeningError: string | null;
  refetchListening: () => Promise<void>;
}

export function AppContextProvider({ children, showToast, onOpenUpgrade }: AppProviderProps) {
  // ... existing state

  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Listening state
  const [listening, setListening] = useState<ListeningItem[]>([]);
  const [listeningLoading, setListeningLoading] = useState(true);
  const [listeningError, setListeningError] = useState<string | null>(null);

  // Fetch functions
  const fetchMessages = useCallback(async () => {
    await fetchAPI<Message[]>(
      '/api/inbox/messages',
      setMessages,
      setMessagesLoading,
      setMessagesError,
      'messages'
    );
  }, []);

  const fetchListening = useCallback(async () => {
    await fetchAPI<ListeningItem[]>(
      '/api/inbox/listening',
      setListening,
      setListeningLoading,
      setListeningError,
      'items'
    );
  }, []);

  // Fetch on mount (optional - can lazy load when Inbox opens)
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    fetchAssets();
    fetchFolders();
    fetchLinks();
    fetchBioConfig();
    fetchLeads();
    // fetchMessages(); // Optional: only fetch when needed
    // fetchListening(); // Optional: only fetch when needed
  }, [fetchPosts, fetchAccounts, fetchAssets, fetchFolders, fetchLinks, fetchBioConfig, fetchLeads]);

  const value: AppContextType = {
    // ... existing values

    // Inbox
    messages,
    messagesLoading,
    messagesError,
    refetchMessages: fetchMessages,

    listening,
    listeningLoading,
    listeningError,
    refetchListening: fetchListening,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

### Step 4: Update Inbox Component (10 min)

**File**: `src/features/inbox/Inbox.tsx`

Remove mock data and use AppContext:

```typescript
import { useAppContext } from '@/app/_components/AppContext';

export const Inbox: React.FC<InboxProps> = () => {
  const {
    messages,
    messagesLoading,
    refetchMessages,
    listening,
    listeningLoading,
    refetchListening,
  } = useAppContext();

  // Fetch data when component mounts (if not already fetched)
  useEffect(() => {
    if (messages.length === 0 && !messagesLoading) {
      refetchMessages();
    }
    if (listening.length === 0 && !listeningLoading) {
      refetchListening();
    }
  }, []);

  // Remove: const [messages, setMessages] = useState(MOCK_MESSAGES);
  // Use context data
};
```

**File**: `src/features/inbox/tabs/MessagesTab.tsx`

Add loading states:

```typescript
export const MessagesTab: React.FC<MessagesTabProps> = ({ messages }) => {
  const { messagesLoading, messagesError, refetchMessages } = useAppContext();

  if (messagesLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{messagesError}</p>
        <button
          onClick={refetchMessages}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          No messages yet. Connect your social accounts to start receiving messages!
        </p>
      </div>
    );
  }

  // Existing messages list
};
```

---

## Types Update

**File**: `src/types/domain.ts`

```typescript
export interface Message {
  id: string;
  platform: Platform;
  type: 'mention' | 'comment' | 'dm';
  author: string;
  authorHandle: string;
  authorAvatar?: string;
  content: string;
  timestamp: string | Date;
  unread: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ListeningItem {
  id: string;
  keyword: string;
  platform: Platform;
  author: string;
  content: string;
  engagement: number; // Likes, shares, etc.
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string | Date;
}
```

---

## Testing

### API Testing

```bash
# List messages
curl -X GET http://localhost:3000/api/inbox/messages \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Filter by platform
curl -X GET "http://localhost:3000/api/inbox/messages?platform=twitter" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Get unread only
curl -X GET "http://localhost:3000/api/inbox/messages?unread=true" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Mark as read
curl -X PATCH http://localhost:3000/api/inbox/messages/MSG_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"unread": false}'

# List listening items
curl -X GET http://localhost:3000/api/inbox/listening \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

### Manual Testing Checklist

**1. Messages**
- [ ] View all messages
- [ ] Filter by platform
- [ ] Filter by type
- [ ] Mark as read/unread
- [ ] Delete message

**2. Listening**
- [ ] View listening items
- [ ] Filter by keyword
- [ ] Filter by sentiment
- [ ] View engagement metrics

**3. Real-time Updates** (Phase 9G)
- [ ] New messages appear automatically
- [ ] Unread count updates
- [ ] Sentiment changes reflect

---

## Future Integration

### Webhook Setup

For real-time message ingestion:

```typescript
// POST /api/webhooks/twitter/mentions
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Verify webhook signature
  // Parse Twitter webhook payload
  // Create Message in database
  
  await prisma.message.create({
    data: {
      userId: user.id,
      platform: 'twitter',
      type: 'mention',
      author: tweet.user.name,
      authorHandle: tweet.user.screen_name,
      content: tweet.text,
      externalId: tweet.id_str,
    },
  });
  
  // Emit real-time update via WebSocket
}
```

---

## Cleanup

**Remove from constants.ts**:

```typescript
// DELETE these exports
export const MOCK_MESSAGES = [/* ... */];
export const MOCK_LISTENING = [/* ... */];
```

---

## Time Estimate

- **Step 1**: Messages API - 30 min
- **Step 2**: Listening API - 25 min
- **Step 3**: Update AppContext - 15 min
- **Step 4**: Update Inbox component - 10 min
- **Migration**: 5 min
- **Testing**: 15 min

**Total**: ~100 minutes (1.75 hours)

---

## Success Criteria

- [ ] GET /api/inbox/messages returns user's messages
- [ ] PATCH /api/inbox/messages/[id] marks read/unread
- [ ] GET /api/inbox/listening returns listening items
- [ ] Platform filtering works
- [ ] Sentiment filtering works
- [ ] Unread count accurate
- [ ] Loading/error states work
- [ ] Users only see their own messages
- [ ] No MOCK_MESSAGES or MOCK_LISTENING in codebase

---

## Next Steps

After completing this phase:
1. Continue to **phase9f11_team_api.md** (Team Management API)
2. Set up webhooks for real message ingestion
3. Integrate sentiment analysis service

---

**Status**: Ready for implementation (~1.75 hours)
