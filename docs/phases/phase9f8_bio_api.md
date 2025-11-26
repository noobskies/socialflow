# Phase 9F8: Bio Page API

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Create API for link-in-bio page configuration, migrating from `INITIAL_BIO_CONFIG` to real backend. This enables the LinkManager feature's Bio tab with customizable profile pages, theme selection, and link management.

### What This Enables

- Customizable bio page (link-in-bio style)
- Multiple theme options
- Add/remove/reorder links
- Profile information management
- Lead capture integration
- Public-facing bio page at `/bio/[username]`

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const INITIAL_BIO_CONFIG: BioPageConfig = {/* hardcoded */};

// BioTab.tsx
const [config, setConfig] = useState(INITIAL_BIO_CONFIG);
```

### Target (Real API)
```typescript
// AppContext.tsx
const [bioConfig, setBioConfig] = useState<BioPageConfig | null>(null);
useEffect(() => {
  fetch('/api/links/bio').then(res => res.json()).then(data => setBioConfig(data.config));
}, []);

// BioTab.tsx
const { bioConfig, bioConfigLoading } = useAppContext();
```

---

## Database Schema

The BioPage model already exists in Prisma schema:

```prisma
model BioPage {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  username          String   @unique // URL slug (e.g., @alexcreator)
  displayName       String
  bio               String   @db.Text
  avatar            String?  // Profile image URL
  
  theme             String   @default("colorful") // Theme name
  links             Json     @default("[]") // Array of link objects
  
  enableLeadCapture Boolean  @default(false)
  leadCaptureText   String?  // Optional CTA text
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([username])
  @@map("bio_pages")
}
```

**Links JSON Structure**:
```typescript
[
  {
    id: string,
    title: string,
    url: string,
    active: boolean
  }
]
```

**No migration needed** - schema already exists from Phase 9A.

---

## API Implementation

### Step 1: Create Bio API Routes (30 min)

**File**: `src/app/api/links/bio/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/links/bio
 * Get bio page configuration for authenticated user
 */
export async function GET(_request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const bioPage = await prisma.bioPage.findUnique({
      where: { userId: user!.id },
    });

    if (!bioPage) {
      // Return default empty config
      return NextResponse.json({
        config: null,
        message: 'No bio page configured yet',
      });
    }

    return NextResponse.json({ config: bioPage });
  } catch (error) {
    console.error('Error fetching bio page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bio page' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/links/bio
 * Create or update bio page configuration
 */
export async function PUT(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    // Validation schema
    const linkSchema = z.object({
      id: z.string(),
      title: z.string().min(1),
      url: z.string().url(),
      active: z.boolean(),
    });

    const schema = z.object({
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          'Username can only contain letters, numbers, hyphens, and underscores'
        ),
      displayName: z.string().min(1, 'Display name is required'),
      bio: z.string().max(500, 'Bio must be less than 500 characters'),
      avatar: z.string().url().optional().nullable(),
      theme: z.enum(['colorful', 'minimal', 'dark', 'gradient']),
      links: z.array(linkSchema),
      enableLeadCapture: z.boolean(),
      leadCaptureText: z.string().optional().nullable(),
    });

    const validated = schema.parse(body);

    // Check if username is taken by another user
    const existing = await prisma.bioPage.findUnique({
      where: { username: validated.username },
    });

    if (existing && existing.userId !== user!.id) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 409 }
      );
    }

    // Upsert bio page
    const bioPage = await prisma.bioPage.upsert({
      where: { userId: user!.id },
      update: {
        ...validated,
        links: validated.links as any, // Prisma Json type
      },
      create: {
        ...validated,
        userId: user!.id,
        links: validated.links as any,
      },
    });

    return NextResponse.json({ config: bioPage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating bio page:', error);
    return NextResponse.json(
      { error: 'Failed to update bio page' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/links/bio
 * Delete bio page
 */
export async function DELETE(_request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const bioPage = await prisma.bioPage.findUnique({
      where: { userId: user!.id },
    });

    if (!bioPage) {
      return NextResponse.json(
        { error: 'Bio page not found' },
        { status: 404 }
      );
    }

    await prisma.bioPage.delete({
      where: { userId: user!.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bio page:', error);
    return NextResponse.json(
      { error: 'Failed to delete bio page' },
      { status: 500 }
    );
  }
}
```

---

### Step 2: Create Public Bio Page (25 min)

Create a public-facing bio page that anyone can view.

**File**: `src/app/bio/[username]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface BioPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicBioPage({ params }: BioPageProps) {
  const { username } = await params;

  // Fetch bio page from database
  const bioPage = await prisma.bioPage.findUnique({
    where: { username },
  });

  if (!bioPage) {
    notFound();
  }

  // Parse links JSON
  const links = Array.isArray(bioPage.links) ? bioPage.links : [];
  const activeLinks = links.filter((link: any) => link.active);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${getThemeClasses(
        bioPage.theme
      )}`}
    >
      <div className="w-full max-w-md">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {bioPage.avatar && (
            <img
              src={bioPage.avatar}
              alt={bioPage.displayName}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{bioPage.displayName}</h1>
          <p className="text-sm opacity-75">{bioPage.bio}</p>
        </div>

        {/* Links Section */}
        <div className="space-y-3 mb-8">
          {activeLinks.map((link: any) => (
            <Link
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-4 rounded-lg text-center font-medium transition-all hover:scale-105 hover:shadow-lg bg-white/10 backdrop-blur-sm border border-white/20"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Lead Capture Section */}
        {bioPage.enableLeadCapture && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="font-semibold mb-2">
              {bioPage.leadCaptureText || 'Stay Updated'}
            </h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder:text-white/60"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        )}

        {/* Powered by Footer */}
        <div className="text-center mt-8 text-sm opacity-50">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            Powered by SocialFlow
          </Link>
        </div>
      </div>
    </div>
  );
}

function getThemeClasses(theme: string): string {
  const themes = {
    colorful:
      'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white',
    minimal: 'bg-slate-50 text-slate-900',
    dark: 'bg-slate-900 text-white',
    gradient:
      'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white',
  };
  return themes[theme as keyof typeof themes] || themes.colorful;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BioPageProps) {
  const { username } = await params;

  const bioPage = await prisma.bioPage.findUnique({
    where: { username },
  });

  if (!bioPage) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${bioPage.displayName} | SocialFlow`,
    description: bioPage.bio,
    openGraph: {
      title: bioPage.displayName,
      description: bioPage.bio,
      images: bioPage.avatar ? [bioPage.avatar] : [],
    },
  };
}
```

**File**: `src/app/bio/[username]/not-found.tsx`

```typescript
import Link from 'next/link';

export default function BioPageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bio Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          This username doesn't exist or the bio page hasn't been set up yet.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
```

---

### Step 3: Add to AppContext (10 min)

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Bio Page
  bioConfig: BioPageConfig | null;
  bioConfigLoading: boolean;
  bioConfigError: string | null;
  refetchBioConfig: () => Promise<void>;
}

export function AppContextProvider({ children, showToast, onOpenUpgrade }: AppProviderProps) {
  // ... existing state

  // Bio config state
  const [bioConfig, setBioConfig] = useState<BioPageConfig | null>(null);
  const [bioConfigLoading, setBioConfigLoading] = useState(true);
  const [bioConfigError, setBioConfigError] = useState<string | null>(null);

  // Fetch function
  const fetchBioConfig = useCallback(async () => {
    try {
      setBioConfigLoading(true);
      setBioConfigError(null);

      const response = await fetch('/api/links/bio', {
        credentials: 'include',
      });

      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setBioConfig(result.config); // May be null if not configured
    } catch (error) {
      console.error('Error fetching bio config:', error);
      setBioConfigError('Failed to load bio page configuration');
    } finally {
      setBioConfigLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    fetchAssets();
    fetchFolders();
    fetchLinks();
    fetchBioConfig();
  }, [fetchPosts, fetchAccounts, fetchAssets, fetchFolders, fetchLinks, fetchBioConfig]);

  const value: AppContextType = {
    // ... existing values

    // Bio Page
    bioConfig,
    bioConfigLoading,
    bioConfigError,
    refetchBioConfig: fetchBioConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

### Step 4: Update LinkManager Component (10 min)

**File**: `src/features/linkmanager/LinkManager.tsx`

Remove mock data and use AppContext:

```typescript
import { useAppContext } from '@/app/_components/AppContext';

export const LinkManager: React.FC<LinkManagerProps> = () => {
  const { links, bioConfig, bioConfigLoading } = useAppContext();

  // Remove: const [config, setConfig] = useState(INITIAL_BIO_CONFIG);
  // Use context data
};
```

**File**: `src/features/linkmanager/tabs/BioTab.tsx`

Add loading/error states:

```typescript
export const BioTab: React.FC<BioTabProps> = () => {
  const { bioConfig, bioConfigLoading, bioConfigError, refetchBioConfig } = useAppContext();

  if (bioConfigLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (bioConfigError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{bioConfigError}</p>
        <button
          onClick={refetchBioConfig}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!bioConfig) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          No bio page configured yet. Set up your link-in-bio page!
        </p>
        {/* Show setup form */}
      </div>
    );
  }

  // Existing bio editor render...
};
```

---

## Types Update

**File**: `src/types/domain.ts`

```typescript
export interface BioPageConfig {
  id?: string;
  userId?: string;
  username: string; // URL slug
  displayName: string;
  bio: string;
  avatar?: string | null;
  theme: 'colorful' | 'minimal' | 'dark' | 'gradient';
  links: BioLink[];
  enableLeadCapture: boolean;
  leadCaptureText?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BioLink {
  id: string;
  title: string;
  url: string;
  active: boolean;
}
```

---

## Testing

### API Testing

```bash
# Get bio config
curl -X GET http://localhost:3000/api/links/bio \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Create/update bio page
curl -X PUT http://localhost:3000/api/links/bio \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "username": "alexcreator",
    "displayName": "Alex Creator",
    "bio": "Digital creator passionate about tech & design",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "colorful",
    "links": [
      {
        "id": "1",
        "title": "YouTube Channel",
        "url": "https://youtube.com/@alex",
        "active": true
      }
    ],
    "enableLeadCapture": true,
    "leadCaptureText": "Join my newsletter!"
  }'

# Delete bio page
curl -X DELETE http://localhost:3000/api/links/bio \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# View public bio page (no auth)
curl http://localhost:3000/bio/alexcreator
```

### Manual Testing Checklist

**1. Bio Page Setup**
- [ ] Create bio page with username
- [ ] Verify duplicate usernames rejected
- [ ] Test all theme options
- [ ] Add multiple links
- [ ] Upload avatar

**2. Link Management**
- [ ] Add new link
- [ ] Reorder links
- [ ] Toggle link active/inactive
- [ ] Edit link URL
- [ ] Delete link

**3. Lead Capture**
- [ ] Enable lead capture
- [ ] Test form submission
- [ ] Customize CTA text

**4. Public Page**
- [ ] Visit /bio/[username]
- [ ] Verify theme applies correctly
- [ ] Test link clicks
- [ ] Check mobile responsiveness
- [ ] Verify SEO metadata

**5. Data Isolation**
- [ ] User A creates bio page
- [ ] User B can't edit User A's page
- [ ] Usernames are globally unique

---

## Cleanup

**Remove from constants.ts**:

```typescript
// DELETE this export
export const INITIAL_BIO_CONFIG = {/* ... */};
```

**Remove unused imports**:

```typescript
// In LinkManager.tsx, remove:
import { INITIAL_BIO_CONFIG } from '@/utils/constants';
```

---

## Time Estimate

- **Step 1**: Create Bio API - 30 min
- **Step 2**: Public bio page - 25 min
- **Step 3**: Update AppContext - 10 min
- **Step 4**: Update LinkManager component - 10 min
- **Testing**: 15 min

**Total**: ~90 minutes (1.5 hours)

---

## Success Criteria

- [ ] GET /api/links/bio returns user's bio config
- [ ] PUT /api/links/bio creates/updates bio page
- [ ] DELETE /api/links/bio removes bio page
- [ ] Public page at /bio/[username] works
- [ ] Duplicate usernames rejected
- [ ] Theme selection works
- [ ] Link management functional
- [ ] Lead capture form displays
- [ ] SEO metadata correct
- [ ] Mobile responsive
- [ ] Loading/error states work
- [ ] Users can't edit others' pages
- [ ] No INITIAL_BIO_CONFIG in codebase

---

## Next Steps

After completing this phase:
1. Continue to **phase9f9_leads_api.md** (Lead Capture API)
2. Update progress.md with completion
3. Test public bio page rendering

---

**Status**: Ready for implementation (~1.5 hours)
