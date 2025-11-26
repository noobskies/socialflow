# Phase 9E4: Upload API Route

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 45 minutes

---

## Objective

Create server-side upload API route that processes images, uploads to Vercel Blob, and stores metadata in database.

---

## What This API Does

### Request Flow

```
1. Client uploads file via FormData
   ↓
2. Server validates (type, size, auth)
   ↓
3. For images: Process with Sharp
   - Optimize (resize, compress)
   - Generate thumbnail
   ↓
4. Upload to Vercel Blob
   - Main file (optimized or original)
   - Thumbnail (images only)
   ↓
5. Create MediaAsset in database
   - Store both URLs
   - Store file metadata
   ↓
6. Return asset object to client
```

### Key Features

- ✅ Authentication required
- ✅ File validation (type, size)
- ✅ Image optimization with Sharp
- ✅ Thumbnail generation
- ✅ Dual file upload (main + thumbnail)
- ✅ Video passthrough (no processing)
- ✅ Folder organization support
- ✅ Comprehensive error handling

---

## Implementation

### Create Upload API Route

**Create** `src/app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { processImage } from '@/lib/image-processing';

/**
 * File Validation Constants
 */
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',   // .mov
  'video/webm',
  'video/x-msvideo',   // .avi
];

/**
 * POST /api/upload
 * 
 * Upload and process media files
 * 
 * Request (FormData):
 * - file: File (required) - Image or video file
 * - folderId: string (optional) - Folder to organize file
 * - tags: string (optional) - JSON array of tag strings
 * 
 * Response:
 * - asset: MediaAsset - Database record with URLs
 * - url: string - Main file URL
 * - thumbnailUrl: string | null - Thumbnail URL (images only)
 * - message: string - Success message
 * 
 * Errors:
 * - 400: Invalid file, file too large, invalid type
 * - 401: Not authenticated
 * - 500: Server error during processing/upload
 */
export async function POST(request: NextRequest) {
  // Step 1: Authentication
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Step 2: Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string | null;
    const tags = formData.get('tags') as string | null;

    // Step 3: Validation - File exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Step 4: Validation - File size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Step 5: Validation - File type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, QuickTime, WebM, AVI) are allowed',
        },
        { status: 400 }
      );
    }

    // Step 6: Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const baseFilename = `${user!.id}/${timestamp}-${sanitizedName}`;

    // Step 7: Process and upload
    let mainUrl: string;
    let thumbnailUrl: string | null = null;
    let finalFileSize = file.size;
    let finalMimeType = file.type;

    if (isImage) {
      // IMAGE PROCESSING BRANCH
      console.log('Processing image:', file.name);

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Process image: optimize + create thumbnail (parallel)
      const { optimized, thumbnail } = await processImage(buffer);

      console.log(
        `Image processed: ${buffer.length} bytes → ${optimized.length} bytes (${Math.round((1 - optimized.length / buffer.length) * 100)}% reduction)`
      );

      // Upload optimized image to Vercel Blob
      const mainBlob = await put(`${baseFilename}-optimized.jpg`, optimized, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/jpeg',
      });

      // Upload thumbnail to Vercel Blob
      const thumbnailBlob = await put(`${baseFilename}-thumb.jpg`, thumbnail, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/jpeg',
      });

      mainUrl = mainBlob.url;
      thumbnailUrl = thumbnailBlob.url;
      finalFileSize = optimized.length;
      finalMimeType = 'image/jpeg';

      console.log('Image uploaded:', mainUrl);
      console.log('Thumbnail uploaded:', thumbnailUrl);
    } else {
      // VIDEO BRANCH (no processing)
      console.log('Uploading video:', file.name);

      // Upload video directly without processing
      const blob = await put(baseFilename, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
      });

      mainUrl = blob.url;

      console.log('Video uploaded:', mainUrl);
    }

    // Step 8: Create MediaAsset record in database
    const asset = await prisma.mediaAsset.create({
      data: {
        userId: user!.id,
        type: isImage ? 'IMAGE' : 'VIDEO',
        name: file.name,
        url: mainUrl,
        thumbnailUrl,
        folderId: folderId || null,
        tags: tags ? JSON.parse(tags) : [],
        fileSize: finalFileSize,
        mimeType: finalMimeType,
      },
      include: {
        folder: true,
      },
    });

    // Step 9: Return success response
    return NextResponse.json({
      asset,
      url: mainUrl,
      thumbnailUrl,
      message: isImage
        ? 'Image uploaded and optimized successfully'
        : 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}
```

---

## API Reference

### Endpoint

```
POST /api/upload
```

### Authentication

Required. Uses `requireAuth()` helper from Phase 9B.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

### Request

**Content-Type:** `multipart/form-data`

**Body (FormData):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Image or video file to upload |
| `folderId` | string | No | Folder ID for organization |
| `tags` | string | No | JSON array of tags (e.g., `["product", "promo"]`) |

**Example Request:**

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folderId', 'cm3xyz...');
formData.append('tags', JSON.stringify(['product', 'social']));

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

### Response

**Success (200 OK):**

```json
{
  "asset": {
    "id": "cm3xyz123...",
    "userId": "user123...",
    "type": "IMAGE",
    "name": "photo.jpg",
    "url": "https://xxxxx.public.blob.vercel-storage.com/user123/1732583422-photo-optimized-abc123.jpg",
    "thumbnailUrl": "https://xxxxx.public.blob.vercel-storage.com/user123/1732583422-photo-thumb-def456.jpg",
    "folderId": null,
    "tags": [],
    "fileSize": 287452,
    "mimeType": "image/jpeg",
    "createdAt": "2025-11-25T20:00:00.000Z",
    "updatedAt": "2025-11-25T20:00:00.000Z",
    "folder": null
  },
  "url": "https://xxxxx.public.blob.vercel-storage.com/user123/1732583422-photo-optimized-abc123.jpg",
  "thumbnailUrl": "https://xxxxx.public.blob.vercel-storage.com/user123/1732583422-photo-thumb-def456.jpg",
  "message": "Image uploaded and optimized successfully"
}
```

**Errors:**

```json
// 400 Bad Request - No file
{
  "error": "No file provided"
}

// 400 Bad Request - File too large
{
  "error": "File too large. Maximum size is 50MB"
}

// 400 Bad Request - Invalid type
{
  "error": "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, QuickTime, WebM, AVI) are allowed"
}

// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 500 Server Error
{
  "error": "Failed to upload file"
}
```

---

## Validation Rules

### File Type Validation

**Allowed Image Types:**
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/gif` (.gif)
- `image/webp` (.webp)

**Allowed Video Types:**
- `video/mp4` (.mp4)
- `video/quicktime` (.mov)
- `video/webm` (.webm)
- `video/x-msvideo` (.avi)

**Not Allowed:**
- SVG files (security risk - can contain scripts)
- BMP files (inefficient format)
- TIFF files (too large)
- Executable files (.exe, .sh, etc.)
- Archives (.zip, .tar, etc.)

### File Size Limits

**Maximum:** 50MB per file

**Why 50MB?**
- Large enough for high-quality images (typically 5-10MB)
- Large enough for short videos (30-60 seconds)
- Small enough to prevent abuse
- Reasonable upload time on most connections

**Typical File Sizes:**
- JPEG photo from phone: 2-5MB
- High-res image: 5-10MB
- Short video (30 sec): 10-20MB
- Long video (2 min): 30-50MB

### Filename Sanitization

Original filename is sanitized to prevent:
- Path traversal attacks
- Special characters that break URLs
- Unicode characters that cause issues

**Sanitization:**
```typescript
const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
// "My Photo! (2024).jpg" → "My_Photo___2024_.jpg"
```

---

## Processing Logic

### Image Processing Pipeline

```typescript
// 1. Convert to Buffer
const buffer = Buffer.from(await file.arrayBuffer());

// 2. Process (optimize + thumbnail in parallel)
const { optimized, thumbnail } = await processImage(buffer);
// ~100ms processing time

// 3. Upload both files
const mainBlob = await put('optimized.jpg', optimized, {...});
const thumbBlob = await put('thumb.jpg', thumbnail, {...});
// ~200-500ms upload time

// 4. Store both URLs in database
const asset = await prisma.mediaAsset.create({
  data: {
    url: mainBlob.url,
    thumbnailUrl: thumbBlob.url,
    ...
  }
});
```

**Total Time:** ~300-600ms per image

### Video Processing Pipeline

```typescript
// 1. Upload directly (no processing)
const blob = await put('video.mp4', file, {...});
// ~500-2000ms depending on size

// 2. Store URL in database
const asset = await prisma.mediaAsset.create({
  data: {
    url: blob.url,
    thumbnailUrl: null, // Videos don't have thumbnails
    ...
  }
});
```

**Total Time:** ~500-2000ms per video

---

## Database Integration

### MediaAsset Creation

```typescript
const asset = await prisma.mediaAsset.create({
  data: {
    userId: user!.id,           // From authentication
    type: 'IMAGE',              // 'IMAGE' or 'VIDEO'
    name: file.name,            // Original filename
    url: mainUrl,               // Blob Storage URL
    thumbnailUrl,               // Thumbnail URL (or null)
    folderId: folderId || null, // Optional folder
    tags: [],                   // Optional tags array
    fileSize: optimized.length, // Size in bytes
    mimeType: 'image/jpeg',     // MIME type
  },
  include: {
    folder: true,               // Include folder data
  },
});
```

### Why Include Folder?

Frontend needs folder name for display:
```typescript
asset.folder?.name // "Product Photos"
```

---

## Error Handling

### Image Processing Errors

```typescript
try {
  const { optimized, thumbnail } = await processImage(buffer);
} catch (error) {
  console.error('Image processing failed:', error);
  return NextResponse.json(
    { error: 'Failed to process image. File may be corrupted.' },
    { status: 500 }
  );
}
```

**Common Causes:**
- Corrupted image file
- Unsupported image format (e.g., SVG)
- Image too large for memory
- Invalid image data

### Blob Upload Errors

```typescript
try {
  const blob = await put(filename, file, {...});
} catch (error) {
  console.error('Blob upload failed:', error);
  return NextResponse.json(
    { error: 'Failed to upload file to storage' },
    { status: 500 }
  );
}
```

**Common Causes:**
- Invalid BLOB_READ_WRITE_TOKEN
- Network timeout
- Vercel Blob service outage
- Storage quota exceeded

### Database Errors

```typescript
try {
  const asset = await prisma.mediaAsset.create({...});
} catch (error) {
  console.error('Database error:', error);
  
  // Clean up uploaded files if database fails
  await del(mainUrl);
  if (thumbnailUrl) await del(thumbnailUrl);
  
  return NextResponse.json(
    { error: 'Failed to save file metadata' },
    { status: 500 }
  );
}
```

**Common Causes:**
- Database connection lost
- Invalid folderId (doesn't exist)
- Constraint violations

---

## Security Considerations

### Authentication

```typescript
const { user, error } = await requireAuth();
if (error) return error; // Returns 401 if not authenticated
```

**Why Required:**
- Prevents anonymous uploads
- Associates files with user account
- Enables quota tracking per user
- Required for file ownership

### File Validation

```typescript
// 1. Type check (whitelist only)
const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

// 2. Size check
if (file.size > MAX_FILE_SIZE) {
  return { error: 'File too large' };
}

// 3. Filename sanitization
const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
```

**Prevents:**
- Malicious file uploads
- Path traversal attacks
- Storage abuse
- Server resource exhaustion

### User Isolation

```typescript
// Files stored in user-specific paths
const baseFilename = `${user!.id}/${timestamp}-${sanitizedName}`;
// Result: "user123/1732583422-photo.jpg"
```

**Benefits:**
- Users can't access each other's files
- Easy to delete all user files
- Clean organization
- Quota tracking per user

---

## Performance Optimization

### Parallel Processing

```typescript
// ✅ Good: Parallel (fast)
const [optimized, thumbnail] = await Promise.all([
  optimizeImage(buffer),
  createThumbnail(buffer),
]);

// ❌ Bad: Sequential (slow)
const optimized = await optimizeImage(buffer);
const thumbnail = await createThumbnail(buffer);
```

**Impact:** 2x faster for images

### Efficient Buffer Conversion

```typescript
// ✅ Good: Single conversion
const buffer = Buffer.from(await file.arrayBuffer());
const { optimized, thumbnail } = await processImage(buffer);

// ❌ Bad: Multiple conversions
const buffer1 = await file.arrayBuffer();
const buffer2 = await file.arrayBuffer(); // Duplicate work
```

### Early Validation

```typescript
// ✅ Good: Validate before processing
if (file.size > MAX_FILE_SIZE) return error;
if (!isValidType) return error;

// Then process (only if valid)
const buffer = Buffer.from(await file.arrayBuffer());

// ❌ Bad: Process then validate
const buffer = Buffer.from(await file.arrayBuffer());
if (file.size > MAX_FILE_SIZE) return error; // Wasted work
```

---

## Testing the API

### Using cURL

**Upload Image:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -F "file=@photo.jpg"
```

**Upload with Folder:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -F "file=@photo.jpg" \
  -F "folderId=cm3xyz..."
```

**Upload with Tags:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -F "file=@photo.jpg" \
  -F 'tags=["product","social"]'
```

### Using JavaScript

```typescript
async function uploadFile(file: File, folderId?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId) formData.append('folderId', folderId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Usage
const result = await uploadFile(file);
console.log('Uploaded:', result.asset.url);
```

---

## Verification Checklist

- [ ] File created: `src/app/api/upload/route.ts`
- [ ] Imports correct (put, requireAuth, prisma, processImage)
- [ ] Validation constants defined
- [ ] Authentication check working
- [ ] File type validation working
- [ ] File size validation working
- [ ] Image processing working
- [ ] Video passthrough working
- [ ] Blob upload working (main + thumbnail)
- [ ] Database creation working
- [ ] Error handling comprehensive
- [ ] TypeScript compiles without errors
- [ ] Response format matches docs

---

## Next Steps

Upload API complete! Continue to `phase9e5_upload_component.md` to create the client-side upload UI component.

---

**Time Spent:** _____ minutes

**Notes:**
