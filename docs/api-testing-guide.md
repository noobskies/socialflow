# SocialFlow AI - Complete API Testing Guide

## Overview

This guide covers all Phase 9C API endpoints. Each endpoint follows the established patterns:
- ✅ Authentication with `requireAuth()`
- ✅ Input validation with Zod
- ✅ Prisma relationships loaded efficiently
- ✅ User ownership verification
- ✅ Proper error handling (200, 201, 400, 401, 404, 500)
- ✅ RESTful conventions

## Authentication

All endpoints require a valid session. Get a session by:
1. Register at `/register` or login at `/login`
2. Session cookie is automatically set
3. Include cookie in requests

Without authentication, all endpoints return:
```json
{"error": "Unauthorized"} // 401
```

---

## 1. Posts API

Template endpoint demonstrating all patterns.

### GET /api/posts - List Posts

**Query Parameters**:
- `status` - Filter by status (DRAFT, SCHEDULED, PUBLISHED, FAILED, PENDING_REVIEW)
- `platform` - Filter by platform (TWITTER, LINKEDIN, INSTAGRAM, etc.)
- `limit` - Number of posts (default: 50)

**Example**:
```bash
curl "http://localhost:3000/api/posts?status=SCHEDULED&limit=10" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Response**:
```json
{
  "posts": [
    {
      "id": "cm42...",
      "content": "Hello world!",
      "status": "SCHEDULED",
      "scheduledDate": "2024-12-01",
      "platforms": [
        {
          "platform": "TWITTER",
          "account": {
            "username": "@example"
          }
        }
      ],
      "mediaAsset": null,
      "comments": []
    }
  ],
  "total": 1
}
```

### POST /api/posts - Create Post

**Request Body**:
```json
{
  "content": "Hello world!",
  "platforms": ["TWITTER", "LINKEDIN"],
  "accountIds": ["account-id-1", "account-id-2"],
  "scheduledDate": "2024-12-01",
  "scheduledTime": "14:00",
  "timezone": "America/New_York",
  "status": "SCHEDULED"
}
```

**Response** (201):
```json
{
  "post": { /* created post with relationships */ }
}
```

### GET /api/posts/[id] - Get Single Post

### PATCH /api/posts/[id] - Update Post

### DELETE /api/posts/[id] - Delete Post

---

## 2. Profile API

Manage user profile and settings.

### GET /api/profile - Get Current User Profile

**Example**:
```bash
curl http://localhost:3000/api/profile \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Response**:
```json
{
  "profile": {
    "id": "cm41...",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "image": "https://example.com/avatar.jpg",
    "planTier": "FREE",
    "createdAt": "2024-11-24T...",
    "updatedAt": "2024-11-24T...",
    "workspace": null,
    "stats": {
      "accounts": 3,
      "posts": 15,
      "mediaAssets": 8,
      "workflows": 2,
      "shortLinks": 5
    }
  }
}
```

### PATCH /api/profile - Update Profile

**Request Body** (all fields optional):
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "image": "https://example.com/new-avatar.jpg"
}
```

**Validation**:
- `name` - Min 1 character
- `email` - Valid email format, must be unique
- `image` - Valid URL format

**Response**:
```json
{
  "profile": { /* updated profile with stats */ }
}
```

**Errors**:
```json
// Email already in use
{"error": "Email already in use"} // 400

// Invalid email
{"error": "Invalid email address"} // 400
```

---

## 3. Media API

Manage media library assets (images, videos, templates).

### GET /api/media - List Media Assets

**Query Parameters**:
- `type` - Filter by type (IMAGE, VIDEO, TEMPLATE)
- `folderId` - Filter by folder
- `limit` - Number of assets (default: 50)

**Example**:
```bash
curl "http://localhost:3000/api/media?type=IMAGE&limit=20" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Response**:
```json
{
  "media": [
    {
      "id": "cm45...",
      "type": "IMAGE",
      "url": "https://storage.example.com/image.jpg",
      "name": "Product Photo",
      "folderId": "folder-id",
      "tags": ["product", "marketing"],
      "fileSize": 1024000,
      "mimeType": "image/jpeg",
      "folder": {
        "id": "folder-id",
        "name": "Marketing Assets",
        "type": "USER"
      },
      "createdAt": "2024-11-24T..."
    }
  ],
  "total": 1
}
```

### POST /api/media - Upload Media Asset

**Request Body**:
```json
{
  "type": "IMAGE",
  "url": "https://storage.example.com/image.jpg",
  "name": "Product Photo",
  "folderId": "folder-id-optional",
  "tags": ["product", "marketing"],
  "fileSize": 1024000,
  "mimeType": "image/jpeg"
}
```

**For TEMPLATE type**:
```json
{
  "type": "TEMPLATE",
  "content": "Post template content here...",
  "name": "Welcome Post Template",
  "tags": ["template", "onboarding"]
}
```

**Validation Rules**:
- IMAGE/VIDEO requires `url`
- TEMPLATE requires `content`
- `folderId` must exist and belong to user (or be SYSTEM folder)

**Response** (201):
```json
{
  "media": { /* created media asset */ }
}
```

**Errors**:
```json
// Missing required field
{"error": "URL is required for IMAGE and VIDEO types"} // 400
{"error": "Content is required for TEMPLATE type"} // 400

// Invalid folder
{"error": "Invalid folder ID"} // 400
```

### GET /api/media/[id] - Get Single Media Asset

**Response**:
```json
{
  "media": {
    "id": "cm45...",
    "type": "IMAGE",
    "url": "...",
    "folder": { /* folder info */ },
    "posts": [
      {
        "id": "post-id",
        "content": "...",
        "status": "PUBLISHED",
        "scheduledDate": "..."
      }
    ]
  }
}
```

### PATCH /api/media/[id] - Update Media Asset

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "folderId": "new-folder-id",
  "tags": ["updated", "tags"]
}
```

### DELETE /api/media/[id] - Delete Media Asset

**Protection**: Cannot delete if used in posts.

**Response**:
```json
{"message": "Media asset deleted successfully"}
```

**Error**:
```json
{
  "error": "Cannot delete media asset that is being used in posts",
  "usedInPosts": 3
} // 400
```

---

## 4. Accounts API

Manage social media account connections.

### GET /api/accounts - List Social Accounts

**Query Parameters**:
- `platform` - Filter by platform (TWITTER, LINKEDIN, etc.)
- `status` - Filter by status (ACTIVE, DISCONNECTED, TOKEN_EXPIRED, ERROR)

**Example**:
```bash
curl "http://localhost:3000/api/accounts?platform=TWITTER&status=ACTIVE" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Response**:
```json
{
  "accounts": [
    {
      "id": "cm40...",
      "platform": "TWITTER",
      "username": "@example",
      "displayName": "Example User",
      "avatar": "https://...",
      "connected": true,
      "status": "ACTIVE",
      "platformUserId": "twitter-user-id",
      "lastChecked": "2024-11-24T...",
      "tokenExpiry": "2025-01-24T...",
      "createdAt": "2024-11-01T..."
    }
  ],
  "total": 1
}
```

**Note**: Tokens are sanitized (not exposed) in responses for security.

### POST /api/accounts - Connect Social Account

**Request Body**:
```json
{
  "platform": "TWITTER",
  "username": "@example",
  "displayName": "Example User",
  "avatar": "https://pbs.twimg.com/profile.jpg",
  "accessToken": "oauth-access-token",
  "refreshToken": "oauth-refresh-token",
  "tokenExpiry": "2025-01-24T12:00:00Z",
  "platformUserId": "twitter-user-id",
  "connected": true
}
```

**Validation**:
- Cannot connect same account twice (platform + username must be unique)
- Account belongs to authenticated user

**Response** (201):
```json
{
  "account": { /* created account (tokens sanitized) */ }
}
```

**Error**:
```json
{"error": "Account already connected"} // 400
```

### GET /api/accounts/[id] - Get Single Account

**Response**:
```json
{
  "account": {
    "id": "cm40...",
    "platform": "TWITTER",
    "username": "@example",
    "posts": [
      {
        "id": "post-platform-id",
        "postId": "post-id",
        "published": true,
        "platformPostId": "twitter-post-id"
      }
    ]
  }
}
```

### PATCH /api/accounts/[id] - Update Account

**Request Body** (all fields optional):
```json
{
  "displayName": "Updated Name",
  "avatar": "https://new-avatar.jpg",
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token",
  "tokenExpiry": "2025-02-24T12:00:00Z",
  "connected": true,
  "status": "ACTIVE"
}
```

**Use Cases**:
- Refresh expired tokens
- Update connection status
- Update display info

**Response**:
```json
{
  "account": { /* updated account (tokens sanitized) */ }
}
```

### DELETE /api/accounts/[id] - Disconnect Account

**Protection**: Cannot disconnect if account has scheduled posts.

**Response**:
```json
{"message": "Account disconnected successfully"}
```

**Error**:
```json
{
  "error": "Cannot disconnect account with scheduled posts. Please delete or reschedule them first.",
  "scheduledPosts": 5
} // 400
```

---

## 5. Analytics API

Store and retrieve analytics snapshots.

### GET /api/analytics - Get Analytics Snapshots

**Query Parameters**:
- `platform` - Filter by platform
- `startDate` - Filter by date range (ISO format)
- `endDate` - Filter by date range (ISO format)
- `limit` - Number of snapshots (default: 100)

**Example**:
```bash
curl "http://localhost:3000/api/analytics?platform=TWITTER&startDate=2024-11-01&endDate=2024-11-30" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Response**:
```json
{
  "snapshots": [
    {
      "id": "cm46...",
      "userId": "user-id",
      "date": "2024-11-24T00:00:00Z",
      "platform": "TWITTER",
      "impressions": 5000,
      "engagement": 250,
      "clicks": 50,
      "followers": 1500,
      "createdAt": "2024-11-24T..."
    }
  ],
  "total": 1
}
```

### POST /api/analytics - Create Analytics Snapshot

**Request Body**:
```json
{
  "date": "2024-11-24T00:00:00Z",
  "platform": "TWITTER",
  "impressions": 5000,
  "engagement": 250,
  "clicks": 50,
  "followers": 1500
}
```

**Validation**:
- All numeric fields must be non-negative
- Date must be valid ISO format

**Behavior**:
- If snapshot exists for same user/date/platform → Updates it
- Otherwise → Creates new snapshot

**Response** (201 or 200):
```json
{
  "snapshot": { /* created or updated snapshot */ }
}
```

### GET /api/analytics/summary - Get Aggregated Summary

**Query Parameters** (all optional):
- `platform` - Filter by platform
- `startDate` - Date range start (ISO format)
- `endDate` - Date range end (ISO format)

**Example**:
```bash
curl "http://localhost:3000/api/analytics/summary?startDate=2024-11-01&endDate=2024-11-30" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Response**:
```json
{
  "summary": {
    "totalImpressions": 50000,
    "totalEngagement": 2500,
    "totalClicks": 500,
    "engagementRate": 5.0,
    "averageImpressions": 5000,
    "averageEngagement": 250,
    "averageClicks": 50,
    "snapshotCount": 10
  },
  "latestFollowers": [
    {
      "platform": "TWITTER",
      "followers": 1500,
      "date": "2024-11-24T..."
    },
    {
      "platform": "LINKEDIN",
      "followers": 2000,
      "date": "2024-11-24T..."
    }
  ],
  "platformBreakdown": [
    {
      "platform": "TWITTER",
      "totalImpressions": 25000,
      "totalEngagement": 1250,
      "totalClicks": 250,
      "averageFollowers": 1500
    },
    {
      "platform": "LINKEDIN",
      "totalImpressions": 25000,
      "totalEngagement": 1250,
      "totalClicks": 250,
      "averageFollowers": 2000
    }
  ]
}
```

---

## HTTP Status Codes

All endpoints follow these conventions:

- **200 OK** - Successful GET/PATCH/DELETE
- **201 Created** - Successful POST
- **400 Bad Request** - Validation error, business logic error
- **401 Unauthorized** - Missing or invalid authentication
- **404 Not Found** - Resource doesn't exist or doesn't belong to user
- **500 Internal Server Error** - Server error (logged)

---

## Common Patterns

### 1. Authentication

```typescript
const { user, error } = await requireAuth();
if (error) return error;
// user.id available here
```

### 2. Validation with Zod

```typescript
const schema = z.object({
  field: z.string().min(1, "Error message"),
});

const result = schema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { error: result.error.issues[0].message },
    { status: 400 }
  );
}
```

### 3. Ownership Verification

```typescript
const resource = await prisma.model.findFirst({
  where: {
    id: params.id,
    userId: user!.id, // Critical: ensures user owns resource
  },
});

if (!resource) {
  return NextResponse.json(
    { error: "Resource not found" },
    { status: 404 }
  );
}
```

### 4. Error Handling

```typescript
try {
  // ... operation
  return NextResponse.json({ data }, { status: 200 });
} catch (error) {
  console.error("Detailed error for logs:", error);
  return NextResponse.json(
    { error: "User-friendly message" },
    { status: 500 }
  );
}
```

---

## Testing Checklist

### Profile API
- [ ] GET returns profile with stats
- [ ] PATCH updates name successfully
- [ ] PATCH validates email uniqueness
- [ ] PATCH rejects invalid image URL

### Media API
- [ ] GET lists media with filters
- [ ] POST creates IMAGE with url
- [ ] POST creates TEMPLATE with content
- [ ] POST validates folder ownership
- [ ] GET /:id shows posts using media
- [ ] PATCH updates media metadata
- [ ] DELETE prevents deletion if used in posts

### Accounts API
- [ ] GET lists accounts with filters
- [ ] POST connects new account
- [ ] POST prevents duplicate accounts
- [ ] GET /:id shows connected posts
- [ ] PATCH updates account status
- [ ] PATCH refreshes tokens
- [ ] DELETE prevents disconnection with scheduled posts

### Analytics API
- [ ] GET returns snapshots with filters
- [ ] POST creates new snapshot
- [ ] POST updates existing snapshot (same date/platform)
- [ ] GET /summary returns aggregated data
- [ ] GET /summary calculates engagement rate
- [ ] GET /summary shows platform breakdown

---

## Phase 9C Summary

**Endpoints Created**: 4 APIs, 14 total endpoints

1. **Profile API** (2 endpoints) - User profile management
2. **Media API** (5 endpoints) - Media library CRUD
3. **Accounts API** (5 endpoints) - Social account connections
4. **Analytics API** (3 endpoints) - Analytics data + aggregations

**Files Created**:
- `src/app/api/profile/route.ts` (143 lines)
- `src/app/api/media/route.ts` (120 lines)
- `src/app/api/media/[id]/route.ts` (177 lines)
- `src/app/api/accounts/route.ts` (133 lines)
- `src/app/api/accounts/[id]/route.ts` (201 lines)
- `src/app/api/analytics/route.ts` (146 lines)
- `src/app/api/analytics/summary/route.ts` (129 lines)

**Total**: 1,049 lines of production-ready API code

**Combined with Posts API**: 1,358 lines total

**Status**: ✅ All Phase 9C endpoints complete

**Next Phase**: Phase 9D - OAuth Integration (6-8 hours)
