# Phase 9G: Real-time Features & WebSockets

**Objective**: Implement real-time notifications, live post updates, and WebSocket communication for instant user feedback.

**Estimated Time**: 4-5 hours

**Prerequisites**:
- Phases 9A-9F complete (Backend fully functional)
- Understanding of WebSocket protocol
- Pusher or Socket.io account (optional for managed solution)

---

## Overview

This phase adds real-time capabilities to SocialFlow AI, enabling instant notifications, live post status updates, and collaborative features without page refreshes.

**Features**:
- Real-time notifications (post published, account connected, etc.)
- Live post status updates (scheduled → publishing → published)
- WebSocket connection management
- Presence indicators (who's online)
- Real-time analytics updates

**Implementation Options**:
1. **Native WebSocket** - Direct implementation (no dependencies)
2. **Socket.io** - Full-featured library with fallbacks
3. **Pusher** - Managed service (simplest, paid)
4. **Ably** - Alternative managed service

**Recommended**: Socket.io for development, Pusher for production

---

## Option 1: Socket.io Implementation

### Step 1: Install Dependencies

```bash
npm install socket.io socket.io-client
npm install -D @types/socket.io @types/socket.io-client
```

---

### Step 2: Create WebSocket Server

Create `src/lib/socket-server.ts`:

```typescript
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Verify JWT token
      const decoded = verify(token, process.env.NEXTAUTH_SECRET!);
      socket.data.userId = (decoded as any).id;
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}`);

    // Join user's private room
    socket.join(`user:${userId}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });

    // Handle custom events
    socket.on('subscribe:post', (postId: string) => {
      socket.join(`post:${postId}`);
    });

    socket.on('unsubscribe:post', (postId: string) => {
      socket.leave(`post:${postId}`);
    });
  });

  return io;
}

export function getSocketServer(): SocketIOServer {
  if (!io) {
    throw new Error('Socket server not initialized');
  }
  return io;
}

// Helper functions to emit events
export function emitToUser(userId: string, event: string, data: any) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
}

export function emitToPost(postId: string, event: string, data: any) {
  if (!io) return;
  io.to(`post:${postId}`).emit(event, data);
}

export function emitToAll(event: string, data: any) {
  if (!io) return;
  io.emit(event, data);
}
```

---

### Step 3: Initialize Socket Server in Next.js

Create `src/app/api/socket/route.ts`:

```typescript
import { NextRequest } from 'next/server';
import { initSocketServer } from '@/lib/socket-server';

// This route handler keeps the WebSocket server alive
export async function GET(request: NextRequest) {
  // Socket.io is initialized in the custom server
  return new Response('Socket.io is running', { status: 200 });
}
```

**Create custom server** `server.ts`:

```typescript
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocketServer } from './src/lib/socket-server';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Initialize Socket.io
  initSocketServer(server);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

**Update `package.json`**:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts"
  }
}
```

**Install tsx**:
```bash
npm install -D tsx
```

---

### Step 4: Create Client Socket Hook

Create `src/hooks/useSocket.ts`:

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from './useSession';

let socket: Socket | null = null;

export function useSocket() {
  const { user } = useSession();
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    socket = io(process.env.NEXT_PUBLIC_APP_URL!, {
      auth: {
        token: user.id, // In production, use actual JWT token
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(err.message);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [user]);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socket?.on(event, handler);
    return () => socket?.off(event, handler);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socket?.emit(event, data);
  }, []);

  return {
    socket,
    connected,
    error,
    on,
    emit,
  };
}
```

---

### Step 5: Real-time Notifications Component

Create `src/components/realtime/RealtimeNotifications.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAppContext } from '@/app/_components/AppContext';

export function RealtimeNotifications() {
  const { on } = useSocket();
  const { showToast, refetchPosts, refetchAccounts } = useAppContext();

  useEffect(() => {
    // Post published notification
    const unsubPublished = on('post:published', (data) => {
      showToast(`Post published successfully to ${data.platform}!`, 'success');
      refetchPosts();
    });

    // Post failed notification
    const unsubFailed = on('post:failed', (data) => {
      showToast(`Failed to publish post: ${data.error}`, 'error');
      refetchPosts();
    });

    // Account connected
    const unsubConnected = on('account:connected', (data) => {
      showToast(`${data.platform} account connected!`, 'success');
      refetchAccounts();
    });

    // Account disconnected
    const unsubDisconnected = on('account:disconnected', (data) => {
      showToast(`${data.platform} account disconnected`, 'info');
      refetchAccounts();
    });

    // Analytics updated
    const unsubAnalytics = on('analytics:updated', (data) => {
      showToast('Analytics data refreshed', 'info');
    });

    return () => {
      unsubPublished();
      unsubFailed();
      unsubConnected();
      unsubDisconnected();
      unsubAnalytics();
    };
  }, [on, showToast, refetchPosts, refetchAccounts]);

  return null; // This is a passive component
}
```

**Add to AppShell**:

```typescript
import { RealtimeNotifications } from '@/components/realtime/RealtimeNotifications';

export default function AppShell({ children }) {
  return (
    <div>
      <RealtimeNotifications />
      {/* rest of layout */}
    </div>
  );
}
```

---

### Step 6: Emit Events from Backend

Update `src/app/api/posts/route.ts`:

```typescript
import { emitToUser } from '@/lib/socket-server';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // ... create post logic

    // Emit real-time event
    emitToUser(user!.id, 'post:created', {
      postId: post.id,
      content: post.content,
    });

    return NextResponse.json({ post });
  } catch (error) {
    // ...
  }
}
```

---

## Option 2: Pusher (Managed Solution)

### Step 1: Setup Pusher Account

1. Sign up at https://pusher.com
2. Create a new app
3. Get credentials:
   - App ID
   - Key
   - Secret
   - Cluster

### Step 2: Install Pusher SDK

```bash
npm install pusher pusher-js
```

**Add to `.env.local`**:
```bash
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

---

### Step 3: Create Pusher Server Instance

Create `src/lib/pusher-server.ts`:

```typescript
import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export function triggerUserEvent(userId: string, event: string, data: any) {
  return pusher.trigger(`private-user-${userId}`, event, data);
}

export function triggerPostEvent(postId: string, event: string, data: any) {
  return pusher.trigger(`private-post-${postId}`, event, data);
}
```

---

### Step 4: Create Pusher Client Hook

Create `src/hooks/usePusher.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import PusherClient from 'pusher-js';
import { useSession } from './useSession';

let pusherClient: PusherClient | null = null;

export function usePusher() {
  const { user } = useSession();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });

    pusherClient.connection.bind('connected', () => {
      setConnected(true);
    });

    pusherClient.connection.bind('disconnected', () => {
      setConnected(false);
    });

    // Subscribe to user's private channel
    const channel = pusherClient.subscribe(`private-user-${user.id}`);

    return () => {
      pusherClient?.unsubscribe(`private-user-${user.id}`);
      pusherClient?.disconnect();
    };
  }, [user]);

  return { pusher: pusherClient, connected };
}
```

---

### Step 5: Pusher Auth Endpoint

Create `src/app/api/pusher/auth/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { pusher } from '@/lib/pusher-server';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    // Verify user has access to this channel
    if (!channelName.includes(user!.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const auth = pusher.authorizeChannel(socketId, channelName);
    return NextResponse.json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
```

---

## Live Post Status Updates

Create `src/components/posts/LivePostStatus.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface Props {
  postId: string;
  initialStatus: string;
}

export function LivePostStatus({ postId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const { on, emit } = useSocket();

  useEffect(() => {
    // Subscribe to post updates
    emit('subscribe:post', postId);

    // Listen for status changes
    const unsub = on(`post:${postId}:status`, (data) => {
      setStatus(data.status);
    });

    return () => {
      unsub();
      emit('unsubscribe:post', postId);
    };
  }, [postId, on, emit]);

  const statusColors = {
    draft: 'bg-gray-200 text-gray-700',
    scheduled: 'bg-blue-200 text-blue-700',
    publishing: 'bg-yellow-200 text-yellow-700',
    published: 'bg-green-200 text-green-700',
    failed: 'bg-red-200 text-red-700',
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${statusColors[status]}`}>
      {status === 'publishing' && (
        <span className="animate-pulse mr-1">●</span>
      )}
      {status}
    </span>
  );
}
```

---

## Background Job Processing

For scheduled post publishing, use a cron job:

Create `src/app/api/cron/publish-posts/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitToUser } from '@/lib/socket-server';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // Find posts scheduled for now
    const postsToPublish = await prisma.post.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledDate: {
          lte: now,
        },
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        user: true,
      },
    });

    console.log(`Found ${postsToPublish.length} posts to publish`);

    for (const post of postsToPublish) {
      // Update status to publishing
      await prisma.post.update({
        where: { id: post.id },
        data: { status: 'PUBLISHING' },
      });

      // Emit real-time update
      emitToUser(post.userId, 'post:publishing', {
        postId: post.id,
      });

      // Publish to each platform
      for (const platform of post.platforms) {
        try {
          // Call platform API to publish
          // await publishToP platform(post, platform.account);
          
          await prisma.postPlatform.update({
            where: { id: platform.id },
            data: { published: true },
          });
        } catch (error) {
          console.error(`Failed to publish to ${platform.platform}:`, error);
        }
      }

      // Update final status
      await prisma.post.update({
        where: { id: post.id },
        data: { 
          status: 'PUBLISHED',
          publishedAt: now,
        },
      });

      // Emit success notification
      emitToUser(post.userId, 'post:published', {
        postId: post.id,
        platforms: post.platforms.map((p) => p.platform),
      });
    }

    return NextResponse.json({
      processed: postsToPublish.length,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Job failed' },
      { status: 500 }
    );
  }
}
```

**Configure Vercel Cron**:

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/publish-posts",
    "schedule": "* * * * *"
  }]
}
```

---

## Connection Status Indicator

Create `src/components/realtime/ConnectionStatus.tsx`:

```typescript
'use client';

import { useSocket } from '@/hooks/useSocket';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const { connected } = useSocket();

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2">
      {connected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600">Disconnected</span>
        </>
      )}
    </div>
  );
}
```

---

## Testing Real-time Features

### 1. Test Socket Connection

```javascript
// In browser console
const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected!');
});
```

### 2. Test Event Emission

```typescript
// In API route
emitToUser(userId, 'test:event', { message: 'Hello!' });
```

### 3. Test Scheduled Publishing

```bash
# Trigger cron manually
curl http://localhost:3000/api/cron/publish-posts \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

---

## Production Considerations

1. **Rate Limiting**: Limit WebSocket connections per user
2. **Scaling**: Use Redis adapter for Socket.io clustering
3. **Monitoring**: Track connection health and events
4. **Fallbacks**: Implement polling fallback if WebSocket fails
5. **Security**: Validate all incoming messages

---

## Next Steps

Backend implementation complete! Ready for:
- Integration testing
- Performance optimization
- Security audit
- Deployment to production

---

## Verification Checklist

- [ ] WebSocket server initialized
- [ ] Client socket hook created
- [ ] Real-time notifications working
- [ ] Live post status updates functional
- [ ] Background job processor running
- [ ] Connection status indicator added
- [ ] Cron jobs configured
- [ ] Authentication working
- [ ] Error handling implemented
- [ ] Production ready

**Time Spent**: ___ hours

**Notes**:
