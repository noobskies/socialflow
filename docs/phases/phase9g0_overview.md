# Phase 9G0: Real-time Features Overview

**Part of Phase 9G: WebSocket Integration for Live Updates**

---

## Objective

Implement real-time features using WebSockets (Socket.io) to provide live updates for post status changes, notifications, and user presence without requiring page refreshes.

---

## Why This Matters

**Current State**: Users must manually refresh to see updates

**Target State**: Real-time updates for:
- Post status changes (scheduled → publishing → published)
- New notifications (mentions, comments, engagement)
- Live collaboration (multiple users editing)
- System alerts (errors, warnings, success messages)

**Benefits**:
- Improved user experience (no manual refresh)
- Instant feedback on actions
- Better collaboration for teams
- Professional real-time dashboard feel

---

## Architecture Overview

### WebSocket vs Polling

**Why WebSockets (Socket.io)**:
- Bi-directional communication
- Lower latency (<100ms)
- Reduced server load
- Industry standard for real-time apps
- Automatic reconnection
- Fallback to polling if needed

**Polling (Not Chosen)**:
- Higher latency (5+ seconds)
- Wasteful HTTP requests
- Higher server costs
- Poor user experience

---

## Real-time Features Roadmap

### Phase 1: Core Infrastructure (This Phase)

**WebSocket Server** (~60 min):
- Socket.io server setup
- Authentication middleware
- Room management (user-specific channels)
- Event handlers

**Client Integration** (~45 min):
- React hooks for WebSocket connection
- Auto-reconnection logic
- Error handling
- Connection status indicator

### Phase 2: Post Status Updates (~45 min)

**Real-time Post Events**:
- `post:created` - New post added
- `post:updated` - Post modified
- `post:deleted` - Post removed
- `post:publishing` - Post being published
- `post:published` - Post successfully published
- `post:failed` - Publication failed

### Phase 3: Notifications (~60 min)

**Live Notifications**:
- New mentions detected
- Comments on user's posts
- Engagement milestones (100 likes, etc.)
- System notifications (errors, warnings)
- Unread count badge updates

### Phase 4: Presence (Optional, ~45 min)

**User Presence**:
- Online/offline status
- Active page tracking
- Typing indicators (for team features)
- Concurrent users viewing same post

---

## Tech Stack

### Socket.io (Server & Client)

**Why Socket.io**:
- Battle-tested (used by Microsoft, Trello, etc.)
- Automatic reconnection
- Room/namespace support
- TypeScript support
- Fallback mechanisms
- 60K+ GitHub stars

**Installation**:
```bash
npm install socket.io socket.io-client
npm install -D @types/node
```

### Next.js Custom Server (Required)

Socket.io requires a custom Next.js server:

```javascript
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, parsedUrl).then(() => {});
  });

  const io = new Server(server);
  
  // Socket.io logic here
  
  server.listen(3000);
});
```

---

## Architecture Diagram

### Real-time Flow

```
User Action (e.g., create post)
    ↓
POST /api/posts
    ↓
Database updated
    ↓
Server emits WebSocket event
    ↓
io.to(userId).emit('post:created', post)
    ↓
All connected clients for that user receive event
    ↓
React component updates UI
    ↓
User sees change instantly (no refresh)
```

### Authentication Flow

```
Client connects to Socket.io server
    ↓
Server middleware checks session cookie
    ↓
Extract userId from session
    ↓
Join user-specific room: socket.join(`user:${userId}`)
    ↓
Only send events to authenticated users in their own room
```

---

## File Structure

### New Files (8 files)

```
src/
├── server.js                        # Custom Next.js server with Socket.io
├── lib/
│   └── socket-server.ts             # Socket.io server logic
├── hooks/
│   ├── useSocket.ts                 # WebSocket connection hook
│   └── useRealtimeNotifications.ts  # Notifications hook
└── components/
    └── ConnectionStatus.tsx         # WebSocket status indicator
```

### Updated Files (5 files)

```
package.json                         # Add Socket.io dependencies
next.config.ts                       # Configure for custom server
src/app/_components/AppShell.tsx     # Add connection status
src/app/api/posts/route.ts          # Emit events after mutations
src/app/api/posts/[id]/route.ts     # Emit events after updates
```

---

## Implementation Timeline

**Total Estimated Time: 4-5 hours**

| Step | Document | Time | What You'll Build |
|------|----------|------|-------------------|
| 0 | Overview | - | (This document) |
| 1 | Socket.io Setup | 60 min | Custom server, authentication, rooms |
| 2 | Client Integration | 45 min | React hooks, auto-reconnect |
| 3 | Post Updates | 45 min | Real-time post events |
| 4 | Notifications | 60 min | Live notification system |
| 5 | Presence (Optional) | 45 min | User presence tracking |
| 6 | Testing | 30 min | Comprehensive testing |

---

## Prerequisites

Before starting Phase 9G, ensure:

✅ **Phase 9F Complete** - Frontend connected to backend APIs
✅ **Phase 9B Complete** - Authentication system working
✅ **Node.js 18+** - Required for Socket.io compatibility
✅ **Test Environment** - Ability to run custom server locally

---

## Success Criteria

Phase 9G is complete when:

- [ ] Socket.io server running alongside Next.js
- [ ] Client connects and authenticates automatically
- [ ] Post creation/update triggers real-time events
- [ ] Notifications appear instantly without refresh
- [ ] Connection status indicator shows online/offline
- [ ] Auto-reconnection works after disconnect
- [ ] Multiple browser tabs stay in sync
- [ ] Performance acceptable (<100ms latency)
- [ ] Error handling prevents crashes
- [ ] Works in production (Vercel or custom hosting)

---

## Deployment Considerations

### Vercel Limitations

**Important**: Vercel's serverless functions don't support WebSockets natively.

**Options**:
1. **Use Vercel + Pusher** (Recommended for production)
   - Pusher provides managed WebSocket service
   - Vercel for Next.js hosting
   - ~$49/month for 100 connections

2. **Deploy to Railway/Render** (Custom server)
   - Supports long-running processes
   - Can run Socket.io server
   - $5-10/month

3. **Hybrid Approach**
   - Vercel for frontend
   - Separate Socket.io server on Railway
   - Cross-origin setup required

### Development vs Production

**Development**:
- Run custom server locally: `node server.js`
- Socket.io on same host: `http://localhost:3000`

**Production** (if using custom server):
- Deploy custom server
- Configure CORS for Socket.io
- Use HTTPS for secure WebSockets (wss://)
- Set up health checks

---

## Alternative: Pusher Integration

If Vercel deployment is priority, consider Pusher:

```typescript
// Instead of Socket.io
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: 'us2',
});

const channel = pusher.subscribe(`user-${userId}`);
channel.bind('post:created', (data) => {
  // Handle event
});
```

**Pros**:
- Works on Vercel serverless
- Managed service (no server to maintain)
- Scalable automatically

**Cons**:
- Monthly cost ($49+)
- Vendor lock-in
- Less flexibility than Socket.io

---

## Security Considerations

### Authentication
- ✅ Verify session on Socket.io connection
- ✅ Join only user-specific rooms
- ✅ Never emit to `io.emit()` (broadcasts to everyone)
- ✅ Always use `io.to(userId).emit()` (user-specific)

### Authorization
- ✅ Validate user can access requested data
- ✅ Don't trust client-provided userId
- ✅ Extract userId from authenticated session

### Rate Limiting
- ✅ Limit events per second per user
- ✅ Disconnect abusive clients
- ✅ Log suspicious activity

---

## Performance Targets

**Connection**:
- Connection time: < 500ms
- Reconnection time: < 2 seconds

**Events**:
- Event delivery latency: < 100ms
- UI update after event: < 50ms

**Resource Usage**:
- Memory per connection: < 1MB
- CPU usage: < 5% per 100 connections

---

## Event Naming Convention

Follow consistent naming:

**Format**: `resource:action`

**Examples**:
- `post:created`
- `post:updated`
- `post:deleted`
- `notification:new`
- `user:online`
- `user:offline`

---

## Next Steps

1. **Read** `phase9g1_socketio_setup.md` - Set up Socket.io server
2. **Read** `phase9g2_client_integration.md` - React hooks for connection
3. **Read** `phase9g3_post_updates.md` - Real-time post events
4. **Read** `phase9g4_notifications.md` - Live notifications
5. **Optional**: `phase9g5_presence.md` - User presence tracking
6. **Read** `phase9g6_testing.md` - Comprehensive testing

---

**Ready to begin?** → Continue to `phase9g1_socketio_setup.md`
