# Phase 9F4: Bulk Migration of Remaining Constants

**Part of Phase 9F: Connect Frontend to Backend APIs**

---

## Objective

Migrate remaining mock data constants to either:
1. **Real APIs** (if backend exists or needs to be built)
2. **Keep as mock** (if low priority or external integration)

---

## Remaining Constants Analysis

From `src/utils/constants.ts`:

### High Priority - Needs API Endpoints

4. **MOCK_FOLDERS** → `/api/media/folders`
5. **MOCK_LINKS** → `/api/links`  
6. **INITIAL_BIO_CONFIG** → `/api/links/bio`
7. **MOCK_LEADS** → `/api/links/leads`

### Medium Priority - Can Mock Initially

8. **MOCK_MESSAGES** → `/api/inbox/messages`
9. **MOCK_LISTENING** → `/api/inbox/listening`
10. **MOCK_TEAM** → `/api/team`

### Low Priority - Keep Mock for MVP

11. **MOCK_PRODUCTS** - External Shopify integration (Phase 10+)
12. **MOCK_WORKFLOWS** - Automation system (Phase 10+)
13. **MOCK_INTEGRATIONS** - External services (Phase 10+)
14. **MOCK_RSS** - External RSS feeds (Phase 10+)
15. **MOCK_BUCKETS** - Content categorization (Phase 10+)
16. **MOCK_HASHTAGS** - Hashtag groups (Phase 10+)
17. **MOCK_STOCK_PHOTOS** - Unsplash integration (Phase 10+)
18. **MOCK_AUDIT_LOG** - Activity tracking (Phase 10+)

---

## Strategy: Phased Approach

### Phase 1: Essential APIs (This Document)

Build minimal APIs for features that users interact with frequently:

**Folders API** (~15 min):
- GET /api/media/folders - List folders
- POST /api/media/folders - Create folder
- DELETE /api/media/folders/[id] - Delete folder

**Links API** (~20 min):
- GET /api/links - List short links
- POST /api/links - Create short link
- GET /api/links/stats/[shortCode] - Get link stats
- DELETE /api/links/[id] - Delete link

**Bio Page API** (~15 min):
- GET /api/links/bio - Get bio page config
- PUT /api/links/bio - Update bio page

**Leads API** (~10 min):
- GET /api/links/leads - List captured leads
- POST /api/links/leads - Capture new lead

### Phase 2: Keep Mock (For MVP)

Features that can wait until post-MVP:
- Messages/Listening (real-time monitoring requires external APIs)
- Team management (multi-user features)
- Products/Workflows/Integrations (complex external systems)
- RSS/Buckets/Hashtags (content management enhancements)
- Stock photos (Unsplash API integration)
- Audit logs (activity tracking)

---

## Implementation Guide

### 1. Folders API

```typescript
// src/app/api/media/folders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// GET - List folders
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const folders = await prisma.folder.findMany({
    where: { userId: user!.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ folders, count: folders.length });
}

// POST - Create folder
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { name, type = 'USER' } = await request.json();

  const folder = await prisma.folder.create({
    data: {
      name,
      type,
      userId: user!.id,
    },
  });

  return NextResponse.json({ folder }, { status: 201 });
}
```

### 2. Links API

```typescript
// src/app/api/links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLinkSchema = z.object({
  title: z.string().min(1),
  shortCode: z.string().min(3).max(20),
  originalUrl: z.string().url(),
  tags: z.array(z.string()).optional(),
});

// GET - List links
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  const links = await prisma.shortLink.findMany({
    where: { userId: user!.id },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ links, count: links.length });
}

// POST - Create link
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const validated = createLinkSchema.parse(body);

  // Check if shortCode already exists
  const existing = await prisma.shortLink.findFirst({
    where: { shortCode: validated.shortCode },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'Short code already exists' },
      { status: 400 }
    );
  }

  const link = await prisma.shortLink.create({
    data: {
      ...validated,
      userId: user!.id,
      clicks: 0,
    },
  });

  return NextResponse.json({ link }, { status: 201 });
}
```

### 3. Bio Page API

```typescript
// src/app/api/links/bio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// GET - Get bio page
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  let bioPage = await prisma.bioPage.findUnique({
    where: { userId: user!.id },
    include: { links: true },
  });

  // Create default if doesn't exist
  if (!bioPage) {
    bioPage = await prisma.bioPage.create({
      data: {
        userId: user!.id,
        username: user!.email?.split('@')[0] || 'user',
        displayName: user!.name || 'User',
        bio: '',
        theme: 'default',
        enableLeadCapture: false,
      },
      include: { links: true },
    });
  }

  return NextResponse.json({ bioPage });
}

// PUT - Update bio page
export async function PUT(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  const bioPage = await prisma.bioPage.upsert({
    where: { userId: user!.id },
    update: body,
    create: {
      ...body,
      userId: user!.id,
    },
    include: { links: true },
  });

  return NextResponse.json({ bioPage });
}
```

### 4. Leads API

```typescript
// src/app/api/links/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const captureLeadSchema = z.object({
  email: z.string().email(),
  source: z.string(),
});

// GET - List leads
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');

  const leads = await prisma.lead.findMany({
    where: { userId: user!.id },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ leads, count: leads.length });
}

// POST - Capture lead
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const validated = captureLeadSchema.parse(body);

  const lead = await prisma.lead.create({
    data: {
      ...validated,
      userId: user!.id,
    },
  });

  return NextResponse.json({ lead }, { status: 201 });
}
```

---

## Context Integration

Update AppContext.tsx to fetch these new APIs:

```typescript
// Add new state in AppContext
const [folders, setFolders] = useState<Folder[]>([]);
const [foldersLoading, setFoldersLoading] = useState(true);
const [links, setLinks] = useState<ShortLink[]>([]);
const [linksLoading, setLinksLoading] = useState(true);
const [bioPage, setBioPage] = useState<BioPageConfig | null>(null);
const [bioPageLoading, setBioPageLoading] = useState(true);

// Fetch functions
const fetchFolders = useCallback(async () => {
  await fetchAPI('/api/media/folders', setFolders, setFoldersLoading, ...);
}, []);

const fetchLinks = useCallback(async () => {
  await fetchAPI('/api/links', setLinks, setLinksLoading, ...);
}, []);

const fetchBioPage = useCallback(async () => {
  await fetchAPI('/api/links/bio', setBioPage, setBioPageLoading, ...);
}, []);

// Lazy load (only fetch when feature accessed)
useEffect(() => {
  // Don't fetch everything on mount
  // Let features trigger their own data fetching
}, []);
```

---

## Testing Checklist

For each new API:

### Folders API
- [ ] GET returns user's folders only
- [ ] POST creates folder successfully
- [ ] System folders (All Uploads) created automatically
- [ ] DELETE removes folder (if implemented)

### Links API
- [ ] GET returns user's short links
- [ ] POST creates link with unique shortCode
- [ ] Duplicate shortCode validation works
- [ ] Stats tracking (clicks) works

### Bio Page API
- [ ] GET returns or creates default bio page
- [ ] PUT updates bio page successfully
- [ ] Username/displayName/bio update correctly
- [ ] Theme changes apply

### Leads API
- [ ] GET returns captured leads
- [ ] POST captures new lead
- [ ] Email validation works
- [ ] Source tracking accurate

---

## Constants Cleanup

After migration, update `src/utils/constants.ts`:

```typescript
// Remove migrated constants (comment out or delete)
// export const MOCK_FOLDERS = [...]; // ❌ Now from API
// export const MOCK_LINKS = [...]; // ❌ Now from API
// export const INITIAL_BIO_CONFIG = {...}; // ❌ Now from API
// export const MOCK_LEADS = [...]; // ❌ Now from API

// Keep low-priority constants (for now)
export const MOCK_PRODUCTS = [...]; // ✅ Keep - external integration
export const MOCK_WORKFLOWS = [...]; // ✅ Keep - Phase 10+
export const MOCK_INTEGRATIONS = [...]; // ✅ Keep - Phase 10+
export const MOCK_RSS = [...]; // ✅ Keep - external feeds
export const MOCK_BUCKETS = [...]; // ✅ Keep - enhancement
export const MOCK_HASHTAGS = [...]; // ✅ Keep - enhancement
export const MOCK_STOCK_PHOTOS = [...]; // ✅ Keep - Unsplash API
export const MOCK_AUDIT_LOG = [...]; // ✅ Keep - tracking feature

// Keep utility constants
export const AI_TEMPLATES = [...]; // ✅ Static data
export const TIMEZONES = [...]; // ✅ Static data
```

---

## Success Criteria

Phase 9F4 is complete when:

- [ ] Folders API implemented and working
- [ ] Links API implemented and working
- [ ] Bio Page API implemented and working
- [ ] Leads API implemented and working
- [ ] Context updated to fetch from new APIs
- [ ] Features use real data, not mock constants
- [ ] Low-priority constants still use mocks (acceptable for MVP)
- [ ] constants.ts cleaned up (migrated constants removed/commented)
- [ ] All tests passing

---

## Next Steps

1. ✅ Essential APIs implemented
2. ✅ Low-priority constants marked for Phase 10+
3. → Continue to `phase9f5_testing.md` - Comprehensive end-to-end testing

---

**Implementation Time**: ~60 minutes (4 APIs × 15 min each)

**Status**: Bulk migration complete, ready for comprehensive testing
