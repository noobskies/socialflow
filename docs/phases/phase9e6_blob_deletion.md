# Phase 9E6: Blob Deletion Update

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 15 minutes

---

## Objective

Update the existing Media API delete endpoint to remove files from Vercel Blob Storage in addition to database deletion.

---

## Why This Update?

### Current Behavior (Phase 9C)

```typescript
// DELETE /api/media/[id]
// Only deletes database record
await prisma.mediaAsset.delete({ where: { id } });
```

**Problem:**
- Files remain in Blob Storage
- Wastes storage space
- Counts toward 5GB limit
- Orphaned files (no database reference)

### New Behavior (Phase 9E)

```typescript
// DELETE /api/media/[id]
// 1. Delete from Blob Storage
await del(asset.url);
await del(asset.thumbnailUrl);

// 2. Delete from database
await prisma.mediaAsset.delete({ where: { id } });
```

**Benefits:**
- Clean storage (no orphaned files)
- Accurate storage usage tracking
- Prevents quota issues
- Complete deletion

---

## Implementation

### Update Delete Endpoint

**Update** `src/app/api/media/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob'; // NEW IMPORT
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Step 1: Get asset with ownership verification
    const asset = await prisma.mediaAsset.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        postMedia: {
          include: {
            post: true,
          },
        },
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Step 2: Check if asset is used in any posts
    const usedInPosts = asset.postMedia.filter(
      (pm) => pm.post.status === 'SCHEDULED' || pm.post.status === 'PUBLISHED'
    );

    if (usedInPosts.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete asset. It is used in ${usedInPosts.length} active post(s)`,
        },
        { status: 400 }
      );
    }

    // Step 3: Delete from Vercel Blob (main file) - NEW
    if (asset.url) {
      try {
        await del(asset.url);
        console.log('Deleted main file from Blob:', asset.url);
      } catch (error) {
        console.error('Failed to delete main file from Blob:', error);
        // Continue with deletion even if Blob deletion fails
        // (file might already be deleted or URL might be invalid)
      }
    }

    // Step 4: Delete thumbnail from Vercel Blob - NEW
    if (asset.thumbnailUrl) {
      try {
        await del(asset.thumbnailUrl);
        console.log('Deleted thumbnail from Blob:', asset.thumbnailUrl);
      } catch (error) {
        console.error('Failed to delete thumbnail from Blob:', error);
        // Continue with deletion even if Blob deletion fails
      }
    }

    // Step 5: Delete from database
    await prisma.mediaAsset.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
```

---

## Changes Made

### 1. Import Addition

```typescript
import { del } from '@vercel/blob'; // NEW
```

### 2. Delete Main File

```typescript
if (asset.url) {
  try {
    await del(asset.url);
  } catch (error) {
    console.error('Failed to delete main file:', error);
    // Continue anyway
  }
}
```

### 3. Delete Thumbnail

```typescript
if (asset.thumbnailUrl) {
  try {
    await del(asset.thumbnailUrl);
  } catch (error) {
    console.error('Failed to delete thumbnail:', error);
    // Continue anyway
  }
}
```

---

## Error Handling Strategy

### Graceful Degradation

```typescript
try {
  await del(asset.url);
} catch (error) {
  console.error('Blob deletion failed:', error);
  // Continue with database deletion
}
```

**Why Continue on Blob Deletion Failure?**

1. **File might be already deleted** - Manual deletion via Vercel dashboard
2. **URL might be invalid** - Data corruption or migration
3. **Vercel Blob might be down** - Temporary service outage
4. **Token might be expired** - Configuration issue

**Better to:**
- Delete database record (clean up metadata)
- Log error for investigation
- Than fail entire operation

### Alternative: Fail on Blob Error

If you prefer strict deletion:

```typescript
try {
  await del(asset.url);
  if (asset.thumbnailUrl) await del(asset.thumbnailUrl);
} catch (error) {
  console.error('Blob deletion failed:', error);
  return NextResponse.json(
    { error: 'Failed to delete files from storage' },
    { status: 500 }
  );
}

// Only delete from database if Blob deletion succeeded
await prisma.mediaAsset.delete({ where: { id } });
```

**Trade-off:** More consistent but can leave orphaned database records

---

## Usage Protection

### Check Active Post Usage

```typescript
const usedInPosts = asset.postMedia.filter(
  (pm) => pm.post.status === 'SCHEDULED' || pm.post.status === 'PUBLISHED'
);

if (usedInPosts.length > 0) {
  return NextResponse.json(
    {
      error: `Cannot delete asset. It is used in ${usedInPosts.length} active post(s)`,
    },
    { status: 400 }
  );
}
```

**Why This Check?**
- Prevents deleting media used in scheduled posts
- Prevents breaking published content
- User must remove media from posts first

**Draft Posts:** OK to delete (they can be edited)

---

## Testing

### Test Successful Deletion

```bash
# 1. Upload a file first
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -F "file=@test.jpg"

# Response: { "asset": { "id": "cm3xyz..." } }

# 2. Delete the file
curl -X DELETE http://localhost:3000/api/media/cm3xyz... \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 200 OK
# { "message": "Asset deleted successfully" }
```

### Verify Blob Deletion

**Check Vercel Dashboard:**
1. Go to Storage → socialflow-media → Files
2. Search for the filename
3. Should not appear in list

**Or use Vercel Blob CLI:**
```bash
vercel blob list
# File should not be in the list
```

### Test Protected Deletion (Used in Post)

```bash
# Try to delete asset used in scheduled post
curl -X DELETE http://localhost:3000/api/media/ASSET_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 400 Bad Request
# { "error": "Cannot delete asset. It is used in 1 active post(s)" }
```

### Test Invalid Asset

```bash
# Try to delete non-existent asset
curl -X DELETE http://localhost:3000/api/media/invalid-id \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 404 Not Found
# { "error": "Asset not found" }
```

---

## Vercel Blob del() API

### Function Signature

```typescript
async function del(
  urls: string | string[],
  options?: {
    token?: string;
  }
): Promise<void>
```

### Single File Deletion

```typescript
await del('https://xxxxx.public.blob.vercel-storage.com/file.jpg');
```

### Multiple Files Deletion

```typescript
// Delete both main and thumbnail at once
await del([asset.url, asset.thumbnailUrl]);
```

**Benefits:**
- Single API call
- Faster execution
- Atomic operation

**Updated Implementation (Optional):**

```typescript
// Delete both files at once
const urlsToDelete = [asset.url];
if (asset.thumbnailUrl) {
  urlsToDelete.push(asset.thumbnailUrl);
}

try {
  await del(urlsToDelete);
} catch (error) {
  console.error('Blob deletion failed:', error);
}
```

---

## Edge Cases

### 1. Thumbnail-less Assets

```typescript
// Videos don't have thumbnails
if (asset.thumbnailUrl) {
  await del(asset.thumbnailUrl); // Only delete if exists
}
```

### 2. Invalid URLs

```typescript
try {
  await del(asset.url);
} catch (error) {
  // URL might be invalid or already deleted
  console.error('Blob deletion failed:', error);
}
```

### 3. Concurrent Deletions

```typescript
// User clicks delete twice quickly
// Second delete will fail with 404 (asset not found)
// This is correct behavior - no special handling needed
```

### 4. Partial Failures

```typescript
// Main file deleted, thumbnail deletion fails
// Database record will still be deleted
// Thumbnail becomes orphaned (acceptable with graceful degradation)
```

---

## Performance Considerations

### Parallel Deletion

```typescript
// Delete both files in parallel (faster)
await Promise.all([
  del(asset.url),
  asset.thumbnailUrl ? del(asset.thumbnailUrl) : Promise.resolve(),
]);
```

**vs Sequential:**
```typescript
// Sequential (slower)
await del(asset.url);
if (asset.thumbnailUrl) {
  await del(asset.thumbnailUrl);
}
```

**Impact:** ~100-200ms faster with parallel deletion

### Database Transaction

For strict consistency:

```typescript
// Use Prisma transaction
await prisma.$transaction(async (tx) => {
  // Delete from Blob first
  await del([asset.url, asset.thumbnailUrl].filter(Boolean));
  
  // Then delete from database
  await tx.mediaAsset.delete({ where: { id } });
});
```

**Trade-off:** Slower but more consistent

---

## Troubleshooting

### Issue: "Failed to delete from Blob"

**Possible Causes:**
1. Invalid BLOB_READ_WRITE_TOKEN
2. File already deleted
3. Network timeout
4. Vercel Blob service outage

**Solution:**
- Check token in `.env`
- Verify file exists in Vercel dashboard
- Check Vercel status page
- Graceful degradation handles this

### Issue: "Asset not found"

**Cause:** Asset already deleted or user doesn't own it

**Solution:** This is correct behavior

### Issue: Orphaned files in Blob Storage

**Cause:** Database deletion succeeded but Blob deletion failed

**Solution:**
- Run cleanup script periodically
- Compare database URLs vs Blob files
- Delete files not in database

**Cleanup Script Example:**
```typescript
// scripts/cleanup-orphaned-files.ts
const allAssets = await prisma.mediaAsset.findMany();
const assetUrls = allAssets.map(a => a.url);

const { blobs } = await list();
const orphaned = blobs.filter(b => !assetUrls.includes(b.url));

for (const orphan of orphaned) {
  await del(orphan.url);
  console.log('Deleted orphaned file:', orphan.url);
}
```

---

## Security Considerations

### User Ownership Verification

```typescript
const asset = await prisma.mediaAsset.findFirst({
  where: {
    id: params.id,
    userId: user!.id, // Critical: Only user's own assets
  },
});
```

**Prevents:**
- Users deleting other users' files
- Unauthorized storage access
- Data breaches

### Authentication Required

```typescript
const { user, error } = await requireAuth();
if (error) return error; // 401 if not authenticated
```

---

## Verification Checklist

- [ ] Import `del` from @vercel/blob
- [ ] Delete main file from Blob
- [ ] Delete thumbnail from Blob (if exists)
- [ ] Error handling with graceful degradation
- [ ] Delete from database
- [ ] Test successful deletion
- [ ] Test protected deletion (used in posts)
- [ ] Verify files removed from Blob Storage
- [ ] TypeScript compiles without errors

---

## Rollback

If you need to revert this change:

```typescript
// Remove Blob deletion code
// Keep only database deletion
await prisma.mediaAsset.delete({ where: { id } });
```

**Note:** Orphaned files will remain in Blob Storage

---

## Next Steps

Blob deletion complete! Continue to `phase9e7_storage_stats.md` to create the storage usage statistics endpoint.

---

**Time Spent:** _____ minutes

**Notes:**
