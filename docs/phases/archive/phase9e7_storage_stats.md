# Phase 9E7: Storage Statistics

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 20 minutes

---

## Objective

Create API endpoint to track storage usage, asset counts, and provide formatted statistics for dashboard widgets.

---

## Why Storage Stats?

### Use Cases

**1. Dashboard Widget**
- Show storage used: "2.3 GB of 5 GB"
- Display usage percentage with progress bar
- Track recent uploads

**2. User Awareness**
- Alert when approaching limit (80%+)
- Prevent surprise quota errors
- Encourage cleanup of unused files

**3. Admin Monitoring**
- Track per-user storage usage
- Identify heavy users
- Plan capacity upgrades

---

## Implementation

### Create Storage Stats Endpoint

**Create** `src/app/api/storage/stats/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/storage/stats
 * 
 * Get storage usage statistics for current user
 * 
 * Returns:
 * - stats: Asset counts and sizes by type
 * - storage: Usage vs limit with percentage
 * - formatted: Human-readable size strings
 */
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Fetch all user assets
    const assets = await prisma.mediaAsset.findMany({
      where: { userId: user!.id },
      select: {
        fileSize: true,
        type: true,
        createdAt: true,
      },
    });

    // Calculate statistics
    const stats = assets.reduce(
      (acc, asset) => {
        const size = asset.fileSize || 0;
        acc.totalSize += size;

        if (asset.type === 'IMAGE') {
          acc.images++;
          acc.imageSize += size;
        } else if (asset.type === 'VIDEO') {
          acc.videos++;
          acc.videoSize += size;
        }

        return acc;
      },
      {
        totalSize: 0,
        images: 0,
        videos: 0,
        imageSize: 0,
        videoSize: 0,
      }
    );

    // Storage limits
    const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB
    const storageUsedPercent = (stats.totalSize / STORAGE_LIMIT) * 100;

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = assets.filter(
      (asset) => asset.createdAt >= sevenDaysAgo
    ).length;

    return NextResponse.json({
      stats: {
        totalAssets: assets.length,
        images: stats.images,
        videos: stats.videos,
        totalSize: stats.totalSize,
        imageSize: stats.imageSize,
        videoSize: stats.videoSize,
        recentUploads,
      },
      storage: {
        used: stats.totalSize,
        limit: STORAGE_LIMIT,
        usedPercent: Math.round(storageUsedPercent * 100) / 100,
        available: STORAGE_LIMIT - stats.totalSize,
      },
      formatted: {
        totalSize: formatBytes(stats.totalSize),
        imageSize: formatBytes(stats.imageSize),
        videoSize: formatBytes(stats.videoSize),
        storageLimit: formatBytes(STORAGE_LIMIT),
        storageAvailable: formatBytes(STORAGE_LIMIT - stats.totalSize),
      },
    });
  } catch (error) {
    console.error('Storage stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage statistics' },
      { status: 500 }
    );
  }
}

/**
 * Format bytes to human-readable string
 * 
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 GB")
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
```

---

## API Reference

### Endpoint

```
GET /api/storage/stats
```

### Authentication

Required. Uses `requireAuth()` helper.

### Response

**Success (200 OK):**

```json
{
  "stats": {
    "totalAssets": 42,
    "images": 35,
    "videos": 7,
    "totalSize": 157286400,
    "imageSize": 125829120,
    "videoSize": 31457280,
    "recentUploads": 8
  },
  "storage": {
    "used": 157286400,
    "limit": 5368709120,
    "usedPercent": 2.93,
    "available": 5211422720
  },
  "formatted": {
    "totalSize": "150 MB",
    "imageSize": "120 MB",
    "videoSize": "30 MB",
    "storageLimit": "5 GB",
    "storageAvailable": "4.85 GB"
  }
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

**Error (500 Server Error):**

```json
{
  "error": "Failed to fetch storage statistics"
}
```

---

## Response Fields

### stats Object

| Field | Type | Description |
|-------|------|-------------|
| `totalAssets` | number | Total number of media assets |
| `images` | number | Number of image assets |
| `videos` | number | Number of video assets |
| `totalSize` | number | Total storage used (bytes) |
| `imageSize` | number | Storage used by images (bytes) |
| `videoSize` | number | Storage used by videos (bytes) |
| `recentUploads` | number | Uploads in last 7 days |

### storage Object

| Field | Type | Description |
|-------|------|-------------|
| `used` | number | Storage used (bytes) |
| `limit` | number | Storage limit (bytes) |
| `usedPercent` | number | Percentage used (0-100) |
| `available` | number | Available storage (bytes) |

### formatted Object

| Field | Type | Description |
|-------|------|-------------|
| `totalSize` | string | Human-readable total size |
| `imageSize` | string | Human-readable image size |
| `videoSize` | string | Human-readable video size |
| `storageLimit` | string | Human-readable limit |
| `storageAvailable` | string | Human-readable available |

---

## Usage Examples

### Fetch Storage Stats

```typescript
async function getStorageStats() {
  const response = await fetch('/api/storage/stats');
  
  if (!response.ok) {
    throw new Error('Failed to fetch storage stats');
  }
  
  return await response.json();
}

// Usage
const stats = await getStorageStats();
console.log('Used:', stats.formatted.totalSize);
console.log('Percentage:', stats.storage.usedPercent + '%');
```

### Dashboard Widget

```typescript
import { useState, useEffect } from 'react';

function StorageWidget() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/storage/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  const { storage, formatted } = stats;
  const isNearLimit = storage.usedPercent > 80;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
      
      {/* Usage Text */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        {formatted.totalSize} of {formatted.storageLimit} used
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isNearLimit ? 'bg-red-600' : 'bg-indigo-600'
          }`}
          style={{ width: `${storage.usedPercent}%` }}
        />
      </div>

      {/* Warning */}
      {isNearLimit && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
          Storage nearly full. Consider deleting unused files.
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-slate-500">Images</p>
          <p className="font-medium">{stats.stats.images}</p>
        </div>
        <div>
          <p className="text-slate-500">Videos</p>
          <p className="font-medium">{stats.stats.videos}</p>
        </div>
      </div>
    </div>
  );
}
```

### Settings Page

```typescript
function StorageSettings() {
  const [stats, setStats] = useState(null);

  // ... fetch stats

  return (
    <div>
      <h2>Storage Management</h2>
      
      <div className="space-y-4">
        {/* Total Usage */}
        <div className="flex justify-between">
          <span>Total Storage:</span>
          <span className="font-medium">{stats.formatted.totalSize}</span>
        </div>

        {/* By Type */}
        <div className="flex justify-between">
          <span>Images ({stats.stats.images}):</span>
          <span>{stats.formatted.imageSize}</span>
        </div>
        <div className="flex justify-between">
          <span>Videos ({stats.stats.videos}):</span>
          <span>{stats.formatted.videoSize}</span>
        </div>

        {/* Available */}
        <div className="flex justify-between text-slate-500">
          <span>Available:</span>
          <span>{stats.formatted.storageAvailable}</span>
        </div>

        {/* Recent Activity */}
        <div className="flex justify-between">
          <span>Uploaded this week:</span>
          <span>{stats.stats.recentUploads} files</span>
        </div>
      </div>
    </div>
  );
}
```

---

## Implementation Details

### Recent Uploads Calculation

```typescript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentUploads = assets.filter(
  (asset) => asset.createdAt >= sevenDaysAgo
).length;
```

**Why 7 days?**
- Relevant timeframe for user activity
- Not too short (1 day = too volatile)
- Not too long (30 days = less actionable)

### Storage Limit

```typescript
const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB
```

**Configuration Options:**

**Per-Plan Limits:**
```typescript
const STORAGE_LIMITS = {
  FREE: 5 * 1024 * 1024 * 1024,      // 5GB
  PRO: 100 * 1024 * 1024 * 1024,     // 100GB
  AGENCY: 500 * 1024 * 1024 * 1024,  // 500GB
};

const limit = STORAGE_LIMITS[user.plan];
```

**From Database:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: user!.id },
  select: { storageLimit: true },
});

const STORAGE_LIMIT = user.storageLimit;
```

### formatBytes() Function

```typescript
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
```

**Examples:**
- `formatBytes(0)` → `"0 B"`
- `formatBytes(1024)` → `"1 KB"`
- `formatBytes(1536)` → `"1.5 KB"`
- `formatBytes(1048576)` → `"1 MB"`
- `formatBytes(157286400)` → `"150 MB"`

---

## Performance Optimization

### Current Implementation

```typescript
// Fetches all assets
const assets = await prisma.mediaAsset.findMany({
  where: { userId: user!.id },
  select: {
    fileSize: true,
    type: true,
    createdAt: true,
  },
});
```

**Performance:** ~50-100ms for 100-1000 assets

### Optimized with Aggregation

```typescript
// Use Prisma aggregation (much faster)
const [stats, recentCount] = await Promise.all([
  prisma.mediaAsset.groupBy({
    by: ['type'],
    where: { userId: user!.id },
    _sum: { fileSize: true },
    _count: true,
  }),
  prisma.mediaAsset.count({
    where: {
      userId: user!.id,
      createdAt: { gte: sevenDaysAgo },
    },
  }),
]);

// Process aggregation results
const imageStats = stats.find(s => s.type === 'IMAGE');
const videoStats = stats.find(s => s.type === 'VIDEO');

const totalSize = (imageStats?._sum.fileSize || 0) + (videoStats?._sum.fileSize || 0);
```

**Performance:** ~10-20ms (5-10x faster)

### Caching Strategy

```typescript
// Cache for 5 minutes
import { unstable_cache } from 'next/cache';

const getCachedStats = unstable_cache(
  async (userId: string) => {
    // ... fetch stats
    return stats;
  },
  ['storage-stats'],
  { revalidate: 300 } // 5 minutes
);

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const stats = await getCachedStats(user!.id);
  return NextResponse.json(stats);
}
```

**Benefits:**
- Reduces database load
- Faster response time
- Stats don't need real-time accuracy

---

## Testing

### Using cURL

```bash
curl http://localhost:3000/api/storage/stats \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

### Using JavaScript

```typescript
async function testStorageStats() {
  const response = await fetch('/api/storage/stats');
  const data = await response.json();

  console.log('Total assets:', data.stats.totalAssets);
  console.log('Storage used:', data.formatted.totalSize);
  console.log('Percentage:', data.storage.usedPercent + '%');
  console.log('Images:', data.stats.images);
  console.log('Videos:', data.stats.videos);
}

testStorageStats();
```

### Expected Output

```
Total assets: 42
Storage used: 150 MB
Percentage: 2.93%
Images: 35
Videos: 7
```

---

## Edge Cases

### No Assets Yet

```json
{
  "stats": {
    "totalAssets": 0,
    "images": 0,
    "videos": 0,
    "totalSize": 0,
    "imageSize": 0,
    "videoSize": 0,
    "recentUploads": 0
  },
  "storage": {
    "used": 0,
    "limit": 5368709120,
    "usedPercent": 0,
    "available": 5368709120
  },
  "formatted": {
    "totalSize": "0 B",
    "imageSize": "0 B",
    "videoSize": "0 B",
    "storageLimit": "5 GB",
    "storageAvailable": "5 GB"
  }
}
```

### Near Limit

```json
{
  "storage": {
    "used": 5100000000,
    "limit": 5368709120,
    "usedPercent": 94.99,
    "available": 268709120
  },
  "formatted": {
    "totalSize": "4.75 GB",
    "storageAvailable": "256 MB"
  }
}
```

### Over Limit (Edge Case)

```typescript
// Shouldn't happen (upload validation prevents this)
// But handle gracefully if it does
const available = Math.max(0, STORAGE_LIMIT - stats.totalSize);
```

---

## Storage Alerts

### Client-Side Alert Logic

```typescript
function StorageAlert({ stats }) {
  const { storage } = stats;

  if (storage.usedPercent > 95) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded">
        <strong>Storage Critical!</strong> You've used {storage.usedPercent}% of your storage.
        Delete unused files or upgrade your plan.
      </div>
    );
  }

  if (storage.usedPercent > 80) {
    return (
      <div className="bg-amber-100 text-amber-800 p-4 rounded">
        <strong>Storage Warning:</strong> You've used {storage.usedPercent}% of your storage.
        Consider cleaning up old files.
      </div>
    );
  }

  return null;
}
```

### Server-Side Check (Upload Prevention)

```typescript
// In upload API route
const stats = await getStorageStats(user.id);

if (stats.storage.usedPercent > 95) {
  return NextResponse.json(
    {
      error: 'Storage limit exceeded. Delete files or upgrade your plan.',
      storageUsed: stats.formatted.totalSize,
      storageLimit: stats.formatted.storageLimit,
    },
    { status: 413 } // Payload Too Large
  );
}
```

---

## Troubleshooting

### Issue: Stats show 0 for all values

**Cause:** No assets in database or wrong user ID

**Solution:** Upload a file and try again

### Issue: fileSize is null

**Cause:** Old assets without fileSize field

**Solution:** Default to 0 in calculation:
```typescript
const size = asset.fileSize || 0;
```

### Issue: Slow response time

**Cause:** Too many assets

**Solution:** 
1. Use Prisma aggregation (see optimization section)
2. Add caching
3. Add pagination

---

## Verification Checklist

- [ ] File created: `src/app/api/storage/stats/route.ts`
- [ ] Authentication working
- [ ] Stats calculated correctly
- [ ] Storage limit accurate (5GB)
- [ ] Percentage calculation correct
- [ ] formatBytes() working
- [ ] Recent uploads counted
- [ ] Response format matches docs
- [ ] TypeScript compiles without errors

---

## Next Steps

Storage statistics complete! Continue to `phase9e8_testing.md` for the complete testing and verification guide.

---

**Time Spent:** _____ minutes

**Notes:**
