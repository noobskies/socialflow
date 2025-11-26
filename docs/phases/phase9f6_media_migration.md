# Phase 9F6: Media Assets & Folders Migration

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Migrate Library feature from mock data (`MOCK_ASSETS_INIT`, `MOCK_FOLDERS`) to real backend APIs. The Media API already exists from Phase 9C, so this is primarily a wiring task with one new endpoint for folders.

### What This Enables

- Users see their actual uploaded media
- Media persists across sessions
- Folder organization works properly
- File uploads integrate with Library
- Storage statistics are accurate

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const MOCK_ASSETS_INIT: MediaAsset[] = [/* hardcoded */];
export const MOCK_FOLDERS: Folder[] = [/* hardcoded */];

// Library.tsx
const [assets, setAssets] = useState(MOCK_ASSETS_INIT);
const [folders, setFolders] = useState(MOCK_FOLDERS);
```

### Target (Real APIs)
```typescript
// AppContext.tsx
const [assets, setAssets] = useState<MediaAsset[]>([]);
const [assetsLoading, setAssetsLoading] = useState(true);

useEffect(() => {
  fetch('/api/media').then(res => res.json()).then(data => setAssets(data.assets));
}, []);

// Library.tsx
const { assets, assetsLoading } = useAppContext();
```

---

## Prerequisites

✅ **Phase 9C Complete** - Media API exists (GET /api/media)
✅ **Phase 9E Complete** - File upload working
✅ **Database Schema** - MediaAsset and Folder models exist

---

## Implementation Steps

### Step 1: Create Folders Endpoint (20 min)

Create a simple endpoint to fetch user's folders.

**File**: `src/app/api/media/folders/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/media/folders
 * List all folders for authenticated user
 */
export async function GET(_request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // System folders + user folders
    const folders = await prisma.folder.findMany({
      where: {
        OR: [
          { userId: user!.id, type: 'user' },
          { type: 'system' }, // "All Uploads" folder
        ],
      },
      orderBy: [
        { type: 'asc' }, // System folders first
        { name: 'asc' },
      ],
    });

    return NextResponse.json({
      folders,
      count: folders.length,
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media/folders
 * Create a new folder
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate folder name
    const existing = await prisma.folder.findFirst({
      where: {
        userId: user!.id,
        name: name.trim(),
        type: 'user',
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Folder with this name already exists' },
        { status: 409 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        type: 'user',
        userId: user!.id,
      },
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}
```

**File**: `src/app/api/media/folders/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/media/folders/[id]
 * Rename a folder
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
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const folder = await prisma.folder.findFirst({
      where: { id, userId: user!.id },
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    if (folder.type === 'system') {
      return NextResponse.json(
        { error: 'Cannot rename system folders' },
        { status: 403 }
      );
    }

    const updated = await prisma.folder.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ folder: updated });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media/folders/[id]
 * Delete a folder (moves assets to "All Uploads")
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
    const folder = await prisma.folder.findFirst({
      where: { id, userId: user!.id },
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    if (folder.type === 'system') {
      return NextResponse.json(
        { error: 'Cannot delete system folders' },
        { status: 403 }
      );
    }

    // Move all assets to "All Uploads" folder
    const allUploadsFolder = await prisma.folder.findFirst({
      where: {
        userId: user!.id,
        type: 'system',
        name: 'All Uploads',
      },
    });

    if (allUploadsFolder) {
      await prisma.mediaAsset.updateMany({
        where: { folderId: id },
        data: { folderId: allUploadsFolder.id },
      });
    }

    // Delete the folder
    await prisma.folder.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}
```

---

### Step 2: Add to AppContext (15 min)

Update AppContext to fetch media assets and folders.

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Media
  assets: MediaAsset[];
  assetsLoading: boolean;
  assetsError: string | null;
  refetchAssets: () => Promise<void>;

  folders: Folder[];
  foldersLoading: boolean;
  foldersError: string | null;
  refetchFolders: () => Promise<void>;
}

export function AppContextProvider({ children, showToast, onOpenUpgrade }: AppProviderProps) {
  // ... existing state

  // Media assets state
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<string | null>(null);

  // Folders state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [foldersError, setFoldersError] = useState<string | null>(null);

  // Fetch functions
  const fetchAssets = useCallback(async () => {
    await fetchAPI<MediaAsset[]>(
      '/api/media',
      setAssets,
      setAssetsLoading,
      setAssetsError,
      'assets'
    );
  }, []);

  const fetchFolders = useCallback(async () => {
    await fetchAPI<Folder[]>(
      '/api/media/folders',
      setFolders,
      setFoldersLoading,
      setFoldersError,
      'folders'
    );
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    fetchAssets();
    fetchFolders();
  }, [fetchPosts, fetchAccounts, fetchAssets, fetchFolders]);

  const value: AppContextType = {
    // ... existing values

    // Media
    assets,
    assetsLoading,
    assetsError,
    refetchAssets: fetchAssets,

    folders,
    foldersLoading,
    foldersError,
    refetchFolders: fetchFolders,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

### Step 3: Update Library Component (10 min)

Remove mock data and use AppContext.

**File**: `src/features/library/Library.tsx`

**Before**:
```typescript
import { MOCK_ASSETS_INIT, MOCK_FOLDERS } from '@/utils/constants';

export const Library: React.FC<LibraryProps> = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(MOCK_ASSETS_INIT);
  const [folders] = useState<Folder[]>(MOCK_FOLDERS);
  // ...
};
```

**After**:
```typescript
import { useAppContext } from '@/app/_components/AppContext';

export const Library: React.FC<LibraryProps> = () => {
  const {
    assets,
    assetsLoading,
    assetsError,
    refetchAssets,
    folders,
    foldersLoading,
  } = useAppContext();

  // Remove local state, use context data directly
  // ...
};
```

**Update AssetsTab** to show loading/error states:

```typescript
// src/features/library/tabs/AssetsTab.tsx
export const AssetsTab: React.FC<AssetsTabProps> = ({ assets, folders, onDelete }) => {
  const { assetsLoading, assetsError } = useAppContext();

  if (assetsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (assetsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{assetsError}</p>
        <button
          onClick={() => refetchAssets()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          No media uploaded yet. Upload your first file!
        </p>
      </div>
    );
  }

  // Existing grid render...
};
```

---

### Step 4: Update Types (5 min)

Ensure MediaAsset and Folder types match database schema.

**File**: `src/types/domain.ts`

```typescript
export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'template';
  url?: string; // For images/videos (Blob URL)
  thumbnailUrl?: string; // Thumbnail (Phase 9E)
  content?: string; // For templates (text content)
  name: string;
  size?: number; // File size in bytes
  createdAt: string | Date;
  tags?: string[];
  folderId?: string; // Foreign key
}

export interface Folder {
  id: string;
  name: string;
  type: 'system' | 'user';
  icon?: string; // Optional icon name
  userId?: string; // For user folders
  createdAt?: string | Date;
}
```

---

## Testing

### Manual Testing Checklist

**1. Upload Flow**
- [ ] Upload image via Composer
- [ ] Navigate to Library
- [ ] Verify uploaded image appears
- [ ] Check thumbnail displays correctly

**2. Folder Management**
- [ ] Create new folder
- [ ] Rename folder
- [ ] Delete folder (assets move to "All Uploads")
- [ ] Verify system folders can't be deleted

**3. Asset Organization**
- [ ] Move asset to custom folder
- [ ] Filter by folder
- [ ] Search assets by name
- [ ] Delete asset (triggers Blob deletion)

**4. Loading States**
- [ ] Refresh page, verify skeleton loaders
- [ ] Slow network simulation (Dev Tools)
- [ ] Error state displays on failure

**5. Data Isolation**
- [ ] Login as User A, upload files
- [ ] Login as User B, verify no User A files visible
- [ ] Each user has separate "All Uploads" folder

---

## API Testing

**Test Folders Endpoint**:

```bash
# List folders
curl -X GET http://localhost:3000/api/media/folders \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Create folder
curl -X POST http://localhost:3000/api/media/folders \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"name": "Campaign Assets"}'

# Rename folder
curl -X PATCH http://localhost:3000/api/media/folders/FOLDER_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"name": "Updated Name"}'

# Delete folder
curl -X DELETE http://localhost:3000/api/media/folders/FOLDER_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

---

## Database Considerations

### Seed Data

Ensure each user has system folders:

```typescript
// prisma/seed.ts (add to user creation)
const allUploadsFolder = await prisma.folder.create({
  data: {
    name: 'All Uploads',
    type: 'system',
    userId: user.id,
  },
});

const favoritesFolder = await prisma.folder.create({
  data: {
    name: 'Favorites',
    type: 'system',
    userId: user.id,
  },
});
```

### Migration (If Needed)

If system folders don't exist for existing users:

```typescript
// One-time migration script
const users = await prisma.user.findMany();

for (const user of users) {
  const hasSystemFolders = await prisma.folder.findFirst({
    where: { userId: user.id, type: 'system' },
  });

  if (!hasSystemFolders) {
    await prisma.folder.createMany({
      data: [
        { name: 'All Uploads', type: 'system', userId: user.id },
        { name: 'Favorites', type: 'system', userId: user.id },
      ],
    });
  }
}
```

---

## Cleanup

**Remove from constants.ts**:

```typescript
// DELETE these exports
export const MOCK_ASSETS_INIT = [/* ... */];
export const MOCK_FOLDERS = [/* ... */];
```

**Remove unused imports**:

```typescript
// In Library.tsx, remove:
import { MOCK_ASSETS_INIT, MOCK_FOLDERS } from '@/utils/constants';
```

---

## Time Estimate

- **Step 1**: Create folders endpoint - 20 min
- **Step 2**: Update AppContext - 15 min
- **Step 3**: Update Library component - 10 min
- **Step 4**: Update types - 5 min
- **Testing**: 15 min

**Total**: ~65 minutes (1 hour)

---

## Success Criteria

- [ ] GET /api/media returns user's uploaded files
- [ ] GET /api/media/folders returns user's folders
- [ ] POST /api/media/folders creates new folder
- [ ] Library displays real uploaded media
- [ ] Folder management works (create, rename, delete)
- [ ] Loading states display during fetch
- [ ] Error messages shown on failure
- [ ] Assets organized by folder correctly
- [ ] File upload → Library integration works
- [ ] No MOCK_ASSETS_INIT or MOCK_FOLDERS in codebase
- [ ] Users only see their own media
- [ ] System folders can't be deleted/renamed

---

## Next Steps

After completing this phase:
1. Continue to **phase9f7_links_api.md** (Short Links API)
2. Update progress.md with completion
3. Test integration with file upload flow (Phase 9E)

---

**Status**: Ready for implementation (~1 hour)
