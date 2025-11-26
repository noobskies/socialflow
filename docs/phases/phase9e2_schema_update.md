# Phase 9E2: Database Schema Update

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 10 minutes

---

## Objective

Add `thumbnailUrl` field to MediaAsset model to store thumbnail URLs for images.

---

## Why This Change?

### Problem
Currently, MediaAsset only has a single `url` field for the main file. For images, we need to store two URLs:
1. **Main URL**: Optimized full-size image
2. **Thumbnail URL**: 300x300 preview for grid views

### Solution
Add `thumbnailUrl` field (nullable, since videos won't have thumbnails).

### Benefits
- **Faster Loading**: Grid views load small thumbnails instead of full images
- **Better UX**: Instant preview in Library and Composer
- **Bandwidth Savings**: Thumbnails are ~10-20KB vs 200-500KB for full images
- **Performance**: Reduces page load time by 60-80%

---

## Step 1: Update Prisma Schema (2 min)

**Edit** `prisma/schema.prisma`:

Find the `MediaAsset` model and add `thumbnailUrl` field:

```prisma
model MediaAsset {
  id           String    @id @default(cuid())
  userId       String
  type         AssetType
  name         String
  url          String
  thumbnailUrl String?   // NEW: Add this line
  folderId     String?
  tags         Json      @default("[]")
  fileSize     Int?
  mimeType     String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder       Folder?           @relation(fields: [folderId], references: [id], onDelete: SetNull)
  postMedia    PostPlatform[]

  @@index([userId])
  @@index([folderId])
  @@map("media_assets")
}
```

**Field Details:**
- **Type**: `String?` (nullable string)
- **Purpose**: Store thumbnail URL for images
- **Nullable**: Yes (videos won't have thumbnails)
- **Example value**: `https://xxxxx.public.blob.vercel-storage.com/thumb-image.jpg`

---

## Step 2: Create Migration (3 min)

### Generate Migration

```bash
npx prisma migrate dev --name add_thumbnail_url
```

**What This Does:**
1. Analyzes schema changes
2. Creates SQL migration file
3. Applies migration to database
4. Generates updated Prisma Client

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "socialflow_db"

PostgreSQL database socialflow_db created at ...

Applying migration `20251125_add_thumbnail_url`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20251125_add_thumbnail_url/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v7.0.0) to ./src/generated/prisma
```

### View Generated Migration

**File:** `prisma/migrations/[timestamp]_add_thumbnail_url/migration.sql`

```sql
-- AlterTable
ALTER TABLE "media_assets" ADD COLUMN "thumbnailUrl" TEXT;
```

**Migration Details:**
- **Action**: Add column to existing table
- **Type**: `TEXT` (PostgreSQL string)
- **Nullable**: Yes (NULL allowed)
- **Safe**: Existing rows will have `thumbnailUrl = NULL`

---

## Step 3: Generate Prisma Client (1 min)

### Regenerate Client

```bash
npx prisma generate
```

**What This Does:**
- Updates TypeScript types
- Adds `thumbnailUrl` to MediaAsset type
- Updates to `src/generated/prisma/`

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v7.0.0) to ./src/generated/prisma

You can now start using Prisma Client in your code. Reference:
import { PrismaClient } from './src/generated/prisma/client'
```

---

## Step 4: Restart Dev Server (1 min)

### Why Restart?

Next.js caches Prisma Client in memory. After regenerating, you must restart the dev server to load the fresh client.

### Restart Command

```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

**Signs You Forgot to Restart:**
- TypeScript errors about `thumbnailUrl` not existing
- Runtime errors: "Unknown argument 'thumbnailUrl'"
- Old type definitions in autocomplete

---

## Step 5: Verify Schema Change (3 min)

### Check Database

**Using Prisma Studio:**

```bash
npx prisma studio
```

Opens browser at http://localhost:5555

1. Click "MediaAsset" model
2. Look for `thumbnailUrl` column
3. Verify it exists and is nullable

### Check TypeScript Types

**Create test file** `test-types.ts`:

```typescript
import { PrismaClient } from '@/lib/prisma';

const prisma = new PrismaClient();

// This should compile without errors
async function testTypes() {
  const asset = await prisma.mediaAsset.create({
    data: {
      userId: 'test',
      type: 'IMAGE',
      name: 'test.jpg',
      url: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg', // NEW field
    },
  });

  // TypeScript should recognize thumbnailUrl
  console.log(asset.thumbnailUrl); // string | null
}
```

**Run TypeScript check:**

```bash
npx tsc --noEmit
```

**Expected:** No errors

**Clean up:**

```bash
rm test-types.ts
```

---

## Troubleshooting

### Issue: "Unknown argument 'thumbnailUrl'"

**Cause:** Next.js using cached Prisma Client

**Solution:**
1. Stop dev server (Ctrl+C)
2. Run `npx prisma generate`
3. Restart dev server: `npm run dev`

### Issue: Migration fails with "column already exists"

**Cause:** Migration was partially applied

**Solution:**
```bash
# Reset database to clean state
npx prisma migrate reset

# Reapply all migrations
npx prisma migrate dev

# Reseed if needed
npm run db:seed
```

### Issue: TypeScript shows thumbnailUrl as type 'any'

**Cause:** IDE hasn't reloaded types

**Solution:**
1. Close and reopen VS Code
2. Or run: Command Palette → "TypeScript: Restart TS Server"

### Issue: "Error: P2002: Unique constraint failed"

**Cause:** Unrelated to this migration

**Solution:** Check your data insertion code for duplicate values

---

## Database State Check

### Before Migration

```sql
Table: media_assets
Columns:
- id
- userId
- type
- name
- url
- folderId
- tags
- fileSize
- mimeType
- createdAt
- updatedAt
```

### After Migration

```sql
Table: media_assets
Columns:
- id
- userId
- type
- name
- url
- thumbnailUrl      ← NEW
- folderId
- tags
- fileSize
- mimeType
- createdAt
- updatedAt
```

---

## Usage Examples

### Creating Asset with Thumbnail

```typescript
const asset = await prisma.mediaAsset.create({
  data: {
    userId: user.id,
    type: 'IMAGE',
    name: 'photo.jpg',
    url: 'https://blob.vercel.com/photo-optimized.jpg',
    thumbnailUrl: 'https://blob.vercel.com/photo-thumb.jpg',
  },
});
```

### Creating Video (No Thumbnail)

```typescript
const video = await prisma.mediaAsset.create({
  data: {
    userId: user.id,
    type: 'VIDEO',
    name: 'video.mp4',
    url: 'https://blob.vercel.com/video.mp4',
    thumbnailUrl: null, // or omit entirely
  },
});
```

### Querying with Thumbnail

```typescript
const assets = await prisma.mediaAsset.findMany({
  where: { userId: user.id },
  select: {
    id: true,
    name: true,
    url: true,
    thumbnailUrl: true, // Available now
    type: true,
  },
});
```

---

## TypeScript Type Definition

After migration, Prisma Client generates:

```typescript
type MediaAsset = {
  id: string;
  userId: string;
  type: AssetType;
  name: string;
  url: string;
  thumbnailUrl: string | null; // NEW
  folderId: string | null;
  tags: any;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: Date;
  updatedAt: Date;
};
```

---

## Verification Checklist

- [ ] `thumbnailUrl` field added to schema
- [ ] Migration created successfully
- [ ] Migration applied to database
- [ ] Prisma Client regenerated
- [ ] Dev server restarted
- [ ] TypeScript recognizes new field
- [ ] Prisma Studio shows new column

---

## Rollback (If Needed)

If you need to undo this migration:

```bash
# Revert last migration
npx prisma migrate resolve --rolled-back [migration-name]

# Or reset and reapply all except last
npx prisma migrate reset
# Then remove add_thumbnail_url from schema
# Then run: npx prisma migrate dev
```

---

## Next Steps

Schema update complete! Continue to `phase9e3_image_processing.md` to create the image processing library.

---

**Time Spent:** _____ minutes

**Notes:**
