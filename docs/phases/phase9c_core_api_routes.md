# Phase 9C: Core API Routes

**Objective**: Build the core RESTful API endpoints for posts, social accounts, media assets, and user data management.

**Estimated Time**: 4-5 hours

**Prerequisites**:
- Phase 9A complete (Database + Prisma)
- Phase 9B complete (Authentication)
- `requireAuth()` helper available

---

## Overview

This phase creates the backbone API routes that power the SocialFlow AI application. We'll build CRUD endpoints for all major features, following REST conventions and best practices.

**API Architecture**:
- `/api/posts` - Post management (CRUD)
- `/api/accounts` - Social account connections
- `/api/media` - Media library assets
- `/api/user` - User profile and settings
- `/api/analytics` - Analytics data snapshots

**Design Principles**:
- RESTful conventions (GET, POST, PATCH, DELETE)
- Proper HTTP status codes
- Input validation with Zod
- Error handling
- Type-safe responses

---

## Step 1: Posts API

### GET `/api/posts` - List all posts

Create `src/app/api/posts/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/posts - List posts with filters
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const platform = searchParams.get('platform');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: user!.id,
        ...(status && { status: status.toUpperCase() as any }),
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
        comments: true,
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    // Filter by platform if specified
    let filteredPosts = posts;
    if (platform) {
      filteredPosts = posts.filter((post) =>
        post.platforms.some((p) => p.platform.toLowerCase() === platform.toLowerCase())
      );
    }

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  platforms: z.array(z.string()).min(1, 'At least one platform required'),
  accountIds: z.array(z.string()).min(1, 'At least one account required'),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  timezone: z.string().default('UTC'),
  mediaAssetId: z.string().optional(),
  platformOptions: z.record(z.any()).optional(),
  pollConfig: z.object({
    question: z.string().optional(),
    options: z.array(z.string()),
    duration: z.number(),
  }).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PENDING_REVIEW']).default('DRAFT'),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { accountIds, platforms, ...postData } = result.data;

    // Verify accounts belong to user
    const accounts = await prisma.socialAccount.findMany({
      where: {
        id: { in: accountIds },
        userId: user!.id,
      },
    });

    if (accounts.length !== accountIds.length) {
      return NextResponse.json(
        { error: 'Invalid account IDs' },
        { status: 400 }
      );
    }

    // Create post with platform associations
    const post = await prisma.post.create({
      data: {
        ...postData,
        userId: user!.id,
        platforms: {
          create: accountIds.map((accountId, index) => ({
            accountId,
            platform: platforms[index] as any,
          })),
        },
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
```

### GET `/api/posts/[id]` - Get single post

Create `src/app/api/posts/[id]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    // Verify ownership
    const existingPost = await prisma.post.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        content: body.content,
        scheduledDate: body.scheduledDate,
        scheduledTime: body.scheduledTime,
        timezone: body.timezone,
        status: body.status,
        mediaAssetId: body.mediaAssetId,
        platformOptions: body.platformOptions,
        pollConfig: body.pollConfig,
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Verify ownership
    const existingPost = await prisma.post.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
```

---

## Step 2: Social Accounts API

Create `src/app/api/accounts/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/accounts - List connected accounts
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const accounts = await prisma.socialAccount.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create/connect new account
const createAccountSchema = z.object({
  platform: z.enum(['TWITTER', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'YOUTUBE', 'PINTEREST']),
  username: z.string().min(1),
  displayName: z.string().optional(),
  avatar: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  platformUserId: z.string().optional(),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createAccountSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existing = await prisma.socialAccount.findFirst({
      where: {
        userId: user!.id,
        platform: result.data.platform,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Account already connected for this platform' },
        { status: 409 }
      );
    }

    const account = await prisma.socialAccount.create({
      data: {
        userId: user!.id,
        ...result.data,
        connected: true,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
```

### Individual Account Operations

Create `src/app/api/accounts/[id]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// PATCH /api/accounts/[id] - Update account
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    const account = await prisma.socialAccount.updateMany({
      where: {
        id: params.id,
        userId: user!.id,
      },
      data: {
        connected: body.connected,
        status: body.status,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        tokenExpiry: body.tokenExpiry,
      },
    });

    if (account.count === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.socialAccount.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json({ account: updated });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE /api/accounts/[id] - Disconnect account
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const result = await prisma.socialAccount.deleteMany({
      where: {
        id: params.id,
        userId: user!.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Account disconnected' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
```

---

## Step 3: Media Assets API

Create `src/app/api/media/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/media - List media assets
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const folderId = searchParams.get('folderId');

  try {
    const assets = await prisma.mediaAsset.findMany({
      where: {
        userId: user!.id,
        ...(type && { type: type.toUpperCase() as any }),
        ...(folderId && { folderId }),
      },
      include: {
        folder: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST /api/media - Create media asset
const createMediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'TEMPLATE']),
  name: z.string().min(1),
  url: z.string().optional(),
  content: z.string().optional(),
  folderId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createMediaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        userId: user!.id,
        ...result.data,
      },
      include: {
        folder: true,
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    );
  }
}
```

---

## Step 4: User Profile API

Create `src/app/api/user/profile/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/user/profile - Get user profile
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        planTier: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            accounts: true,
            mediaAssets: true,
          },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile - Update profile
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().optional(),
});

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user!.id },
      data: result.data,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        planTier: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
```

---

## Step 5: Analytics API

Create `src/app/api/analytics/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// GET /api/analytics - Get analytics snapshots
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: {
        userId: user!.id,
        ...(platform && { platform: platform.toUpperCase() as any }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      orderBy: { date: 'desc' },
      take: 100,
    });

    // Calculate aggregates
    const totals = snapshots.reduce(
      (acc, snap) => ({
        impressions: acc.impressions + snap.impressions,
        engagement: acc.engagement + snap.engagement,
        clicks: acc.clicks + snap.clicks,
        followers: Math.max(acc.followers, snap.followers),
      }),
      { impressions: 0, engagement: 0, clicks: 0, followers: 0 }
    );

    return NextResponse.json({
      snapshots,
      totals,
      count: snapshots.length,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Create snapshot
export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    const snapshot = await prisma.analyticsSnapshot.create({
      data: {
        userId: user!.id,
        date: new Date(body.date),
        platform: body.platform,
        impressions: body.impressions || 0,
        engagement: body.engagement || 0,
        clicks: body.clicks || 0,
        followers: body.followers || 0,
      },
    });

    return NextResponse.json({ snapshot }, { status: 201 });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to create snapshot' },
      { status: 500 }
    );
  }
}
```

---

## Step 6: Error Handling Middleware

Create `src/lib/api-error.ts`:

```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this value already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
  }

  // Generic error
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

**Usage in routes**:
```typescript
import { handleApiError } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    // ... your code
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## Step 7: API Response Types

Create `src/types/api.ts`:

```typescript
// Common API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PostResponse {
  post: any; // Use Prisma types
}

export interface PostsResponse {
  posts: any[];
  total: number;
}

export interface AccountResponse {
  account: any;
}

export interface AccountsResponse {
  accounts: any[];
}
```

---

## Testing the APIs

### 1. Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "content": "Hello, world!",
    "platforms": ["TWITTER"],
    "accountIds": ["account-id-here"],
    "status": "DRAFT"
  }'
```

### 2. Get All Posts

```bash
curl http://localhost:3000/api/posts \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### 3. Get Accounts

```bash
curl http://localhost:3000/api/accounts \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

## Next Steps

**Phase 9D**: OAuth Integrations
- Twitter/X OAuth flow
- LinkedIn OAuth
- Instagram OAuth
- Token refresh logic

---

## Verification Checklist

- [ ] Posts API (CRUD) implemented
- [ ] Social Accounts API implemented
- [ ] Media Assets API implemented
- [ ] User Profile API implemented
- [ ] Analytics API implemented
- [ ] Error handling middleware created
- [ ] API response types defined
- [ ] All endpoints tested with auth
- [ ] Input validation working (Zod)
- [ ] Proper HTTP status codes

**Time Spent**: ___ hours

**Notes**:
