# Phase 9F7: Short Links API

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Create a complete CRUD API for short link management, migrating from `MOCK_LINKS` to real backend. This enables the LinkManager feature's Shortener tab with link creation, analytics tracking, and QR code generation.

### What This Enables

- Create custom short URLs (socialflow.ai/launch2024)
- Track click analytics per link
- Edit link destinations without changing short code
- Organize links with tags
- Delete unused short links
- Real-time click tracking

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const MOCK_LINKS: ShortLink[] = [/* hardcoded */];

// ShortenerTab.tsx
const [links, setLinks] = useState(MOCK_LINKS);
```

### Target (Real API)
```typescript
// AppContext.tsx
const [links, setLinks] = useState<ShortLink[]>([]);
useEffect(() => {
  fetch('/api/links').then(res => res.json()).then(data => setLinks(data.links));
}, []);

// ShortenerTab.tsx
const { links, linksLoading } = useAppContext();
```

---

## Database Schema

The ShortLink model already exists in Prisma schema:

```prisma
model ShortLink {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title       String
  shortCode   String   @unique // The short part (e.g., "launch2024")
  originalUrl String   // Full destination URL
  
  clicks      Int      @default(0)
  tags        String[] // Array of tag strings
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([shortCode])
  @@map("short_links")
}
```

**No migration needed** - schema already exists from Phase 9A.

---

## API Implementation

### Step 1: Create Links API Routes (45 min)

**File**: `src/app/api/links/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/links
 * List all short links for authenticated user
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const tag = searchParams.get('tag'); // Filter by tag

    const where: any = { userId: user!.id };
    if (tag) {
      where.tags = { has: tag };
    }

    const links = await prisma.shortLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Calculate total clicks
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

    return NextResponse.json({
      links,
      count: links.length,
      totalClicks,
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/links
 * Create a new short link
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    // Validation schema
    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      shortCode: z
        .string()
        .min(3, 'Short code must be at least 3 characters')
        .max(50, 'Short code must be less than 50 characters')
        .regex(
          /^[a-zA-Z0-9-_]+$/,
          'Short code can only contain letters, numbers, hyphens, and underscores'
        ),
      originalUrl: z.string().url('Must be a valid URL'),
      tags: z.array(z.string()).optional(),
    });

    const validated = schema.parse(body);

    // Check if short code already exists (globally unique)
    const existing = await prisma.shortLink.findUnique({
      where: { shortCode: validated.shortCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This short code is already taken' },
        { status: 409 }
      );
    }

    // Create short link
    const link = await prisma.shortLink.create({
      data: {
        ...validated,
        userId: user!.id,
        clicks: 0,
        tags: validated.tags || [],
      },
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
```

**File**: `src/app/api/links/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/links/[id]
 * Get a specific short link
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const link = await prisma.shortLink.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/links/[id]
 * Update a short link
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

    // Validation schema (all fields optional for PATCH)
    const schema = z.object({
      title: z.string().min(1).optional(),
      originalUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
    });

    const validated = schema.parse(body);

    // Verify ownership
    const existing = await prisma.shortLink.findFirst({
      where: { id, userId: user!.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Update link
    const link = await prisma.shortLink.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ link });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/links/[id]
 * Delete a short link
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
    const link = await prisma.shortLink.findFirst({
      where: { id, userId: user!.id },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Delete link
    await prisma.shortLink.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
```

---

### Step 2: Public Redirect Endpoint (15 min)

Create a public endpoint to handle short link redirects and track clicks.

**File**: `src/app/[shortCode]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /[shortCode]
 * Public endpoint - Redirect to original URL and track click
 * Example: socialflow.ai/launch2024
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Find link by short code
    const link = await prisma.shortLink.findUnique({
      where: { shortCode },
    });

    if (!link) {
      // Return 404 page or redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Increment click count (async, don't wait)
    prisma.shortLink
      .update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      })
      .catch((error) => {
        console.error('Error incrementing click count:', error);
      });

    // Redirect to original URL
    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error processing short link:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

---

### Step 3: Add to AppContext (10 min)

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Links
  links: ShortLink[];
  linksLoading: boolean;
  linksError: string | null;
  refetchLinks: () => Promise<void>;
}

export function AppContextProvider({ children, showToast, onOpenUpgrade }: AppProviderProps) {
  // ... existing state

  // Links state
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState<string | null>(null);

  // Fetch function
  const fetchLinks = useCallback(async () => {
    await fetchAPI<ShortLink[]>(
      '/api/links',
      setLinks,
      setLinksLoading,
      setLinksError,
      'links'
    );
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    fetchAssets();
    fetchFolders();
    fetchLinks();
  }, [fetchPosts, fetchAccounts, fetchAssets, fetchFolders, fetchLinks]);

  const value: AppContextType = {
    // ... existing values

    // Links
    links,
    linksLoading,
    linksError,
    refetchLinks: fetchLinks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

### Step 4: Update LinkManager Component (10 min)

**File**: `src/features/linkmanager/LinkManager.tsx`

Remove mock data import and use AppContext:

```typescript
import { useAppContext } from '@/app/_components/AppContext';

export const LinkManager: React.FC<LinkManagerProps> = () => {
  const { links, linksLoading, refetchLinks } = useAppContext();

  // Remove: const [links, setLinks] = useState(MOCK_LINKS);
  // Use context data directly
};
```

**File**: `src/features/linkmanager/tabs/ShortenerTab.tsx`

Add loading/error states:

```typescript
export const ShortenerTab: React.FC<ShortenerTabProps> = ({ links }) => {
  const { linksLoading, linksError, refetchLinks } = useAppContext();

  if (linksLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (linksError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{linksError}</p>
        <button
          onClick={refetchLinks}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          No short links created yet. Create your first link!
        </p>
      </div>
    );
  }

  // Existing link list render...
};
```

---

## Testing

### API Testing

```bash
# Create short link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "title": "Product Launch",
    "shortCode": "launch2024",
    "originalUrl": "https://socialflow.ai/products/new",
    "tags": ["product", "launch"]
  }'

# List links
curl -X GET http://localhost:3000/api/links \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Get specific link
curl -X GET http://localhost:3000/api/links/LINK_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Update link
curl -X PATCH http://localhost:3000/api/links/LINK_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "originalUrl": "https://socialflow.ai/new-url"
  }'

# Delete link
curl -X DELETE http://localhost:3000/api/links/LINK_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Test redirect (public, no auth)
curl -I http://localhost:3000/launch2024
```

### Manual Testing Checklist

**1. Link Creation**
- [ ] Create link with custom short code
- [ ] Verify duplicate short codes are rejected
- [ ] Test invalid URLs
- [ ] Test short codes with special characters
- [ ] Verify tags save correctly

**2. Link Management**
- [ ] Edit link destination
- [ ] Update link title
- [ ] Add/remove tags
- [ ] Delete link

**3. Click Tracking**
- [ ] Click short link
- [ ] Verify redirect works
- [ ] Check click count increments
- [ ] Test analytics in UI

**4. Data Isolation**
- [ ] User A creates links
- [ ] User B can't see User A's links
- [ ] Short codes are globally unique

---

## Optional Enhancements

### QR Code Generation (Optional)

Add QR code generation to each link:

```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

**File**: `src/app/api/links/[id]/qr/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

/**
 * GET /api/links/[id]/qr
 * Generate QR code for short link
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const link = await prisma.shortLink.findFirst({
      where: { id, userId: user!.id },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Generate QR code as data URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${appUrl}/${link.shortCode}`;
    
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 400,
      margin: 2,
    });

    return NextResponse.json({ qrCode: qrDataUrl, shortUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
```

---

## Cleanup

**Remove from constants.ts**:

```typescript
// DELETE this export
export const MOCK_LINKS = [/* ... */];
```

**Remove unused imports**:

```typescript
// In LinkManager.tsx, remove:
import { MOCK_LINKS } from '@/utils/constants';
```

---

## Time Estimate

- **Step 1**: Create Links API - 45 min
- **Step 2**: Public redirect endpoint - 15 min
- **Step 3**: Update AppContext - 10 min
- **Step 4**: Update LinkManager component - 10 min
- **Testing**: 15 min

**Total**: ~95 minutes (1.5 hours)

**With QR Codes**: Add 20 minutes

---

## Success Criteria

- [ ] POST /api/links creates new short link
- [ ] GET /api/links returns user's links
- [ ] PATCH /api/links/[id] updates link
- [ ] DELETE /api/links/[id] removes link
- [ ] GET /[shortCode] redirects to original URL
- [ ] Click counts increment correctly
- [ ] Duplicate short codes rejected
- [ ] URL validation works
- [ ] LinkManager displays real links
- [ ] Loading/error states work
- [ ] Tags filter works
- [ ] Users only see their own links
- [ ] Short codes are globally unique
- [ ] No MOCK_LINKS in codebase

---

## Next Steps

After completing this phase:
1. Continue to **phase9f8_bio_api.md** (Bio Page API)
2. Update progress.md with completion
3. Test short link creation and redirects

---

**Status**: Ready for implementation (~1.5 hours)
