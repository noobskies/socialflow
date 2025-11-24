# Phase 9E: File Storage & Media Upload

**Objective**: Implement file upload, storage, and media processing using Vercel Blob Storage for images and videos.

**Estimated Time**: 2-3 hours

**Prerequisites**:
- Phase 9A complete (MediaAsset model)
- Phase 9B complete (Authentication)
- Phase 9C complete (Media API endpoints)
- Vercel account (for Blob Storage)

---

## Overview

This phase adds file upload capabilities to SocialFlow AI, enabling users to upload images and videos for their social media posts. We'll use Vercel Blob Storage for reliable, scalable file hosting.

**Features**:
- Direct file upload from browser
- Image optimization and resizing
- Video upload support
- Progress tracking
- File type validation
- Storage management

**Tech Stack**:
- **@vercel/blob** - Vercel Blob Storage SDK
- **sharp** (optional) - Image processing
- **Next.js API routes** - Upload handlers

---

## Step 1: Install Dependencies

```bash
npm install @vercel/blob
npm install -D @types/node
```

**Optional (for image processing)**:
```bash
npm install sharp
```

---

## Step 2: Configure Vercel Blob Storage

### Development Setup

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Create Blob Store**:
```bash
vercel blob create socialflow-media
```

4. **Add to `.env.local`**:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Production Setup

1. Go to Vercel Dashboard → Your Project → Storage
2. Create new Blob Store
3. Copy `BLOB_READ_WRITE_TOKEN` to environment variables

---

## Step 3: Upload API Route

Create `src/app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string | null;
    const tags = formData.get('tags') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and videos are allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${user!.id}/${timestamp}-${sanitizedName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Create media asset record
    const asset = await prisma.mediaAsset.create({
      data: {
        userId: user!.id,
        type: isImage ? 'IMAGE' : 'VIDEO',
        name: file.name,
        url: blob.url,
        folderId: folderId || null,
        tags: tags ? JSON.parse(tags) : [],
        fileSize: file.size,
        mimeType: file.type,
      },
      include: {
        folder: true,
      },
    });

    return NextResponse.json({
      asset,
      url: blob.url,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
```

---

## Step 4: Client-Side Upload Component

Create `src/components/media/FileUpload.tsx`:

```typescript
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  onUploadComplete?: (asset: any) => void;
  folderId?: string;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({
  onUploadComplete,
  folderId,
  accept = 'image/*,video/*',
  maxSize = 50 * 1024 * 1024,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folderId', folderId);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      };

      // Handle completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete?.(response.asset);
          setPreview(null);
        } else {
          const error = JSON.parse(xhr.responseText);
          setError(error.error || 'Upload failed');
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        setError('Upload failed. Please try again.');
        setUploading(false);
      };

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          cursor-pointer transition-colors
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            {file?.type.startsWith('image/') ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded"
              />
            ) : (
              <video
                src={preview}
                controls
                className="max-h-48 mx-auto rounded"
              />
            )}
            
            {uploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading... {progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="text-red-600 hover:text-red-700"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              Images and videos up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2">
          <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
```

---

## Step 5: Delete File Endpoint

Create `src/app/api/upload/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Get asset
    const asset = await prisma.mediaAsset.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    if (asset.url) {
      await del(asset.url);
    }

    // Delete from database
    await prisma.mediaAsset.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Asset deleted successfully' });
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

## Step 6: Image Optimization (Optional)

Create `src/lib/image-processing.ts`:

```typescript
import sharp from 'sharp';

export async function optimizeImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Buffer> {
  const {
    width = 1920,
    height = 1080,
    quality = 80,
    format = 'jpeg',
  } = options;

  return sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFormat(format, { quality })
    .toBuffer();
}

export async function createThumbnail(
  buffer: Buffer,
  size: number = 300
): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
    })
    .toFormat('jpeg', { quality: 70 })
    .toBuffer();
}
```

**Update upload route to use optimization**:

```typescript
// In src/app/api/upload/route.ts
import { optimizeImage } from '@/lib/image-processing';

// After file validation
if (isImage) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeImage(buffer);
  file = new File([optimized], file.name, { type: 'image/jpeg' });
}
```

---

## Step 7: Storage Management

Create `src/app/api/storage/stats/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const assets = await prisma.mediaAsset.findMany({
      where: { userId: user!.id },
      select: {
        fileSize: true,
        type: true,
      },
    });

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

    return NextResponse.json({
      stats,
      totalAssets: assets.length,
      storageUsed: stats.totalSize,
      storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
    });
  } catch (error) {
    console.error('Storage stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage stats' },
      { status: 500 }
    );
  }
}
```

---

## Step 8: Direct Upload (Client-Side)

For faster uploads, use Vercel Blob's client-side upload:

Create `src/components/media/DirectUpload.tsx`:

```typescript
'use client';

import { upload } from '@vercel/blob/client';
import { useState } from 'react';

export function DirectUpload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/url', // Token generation endpoint
      });

      // Save to database
      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          url: blob.url,
          type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
          fileSize: file.size,
          mimeType: file.type,
        }),
      });

      console.log('Upload complete:', blob.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      disabled={uploading}
    />
  );
}
```

**Create token endpoint** `src/app/api/upload/url/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { pathname } = body;

  // Return token for client-side upload
  return NextResponse.json({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
```

---

## Vercel Blob Limits

**Free Tier**:
- 5GB storage
- 100GB bandwidth/month
- Unlimited requests

**Pro Tier** ($20/month):
- 100GB storage
- 1TB bandwidth/month
- Unlimited requests

---

## Testing

### 1. Test Image Upload

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -F "file=@image.jpg"
```

### 2. Test File Deletion

```bash
curl -X DELETE http://localhost:3000/api/upload/ASSET_ID \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### 3. Check Storage Stats

```bash
curl http://localhost:3000/api/storage/stats \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

## Next Steps

**Phase 9F**: Mock Data Migration
- Replace all INITIAL_* constants
- Update frontend to use real APIs
- Remove mock data logic

---

## Verification Checklist

- [ ] Vercel Blob Storage configured
- [ ] Upload API route working
- [ ] File type validation implemented
- [ ] Progress tracking functional
- [ ] Delete endpoint working
- [ ] Storage stats endpoint created
- [ ] Client upload component created
- [ ] Image optimization (optional) working
- [ ] Error handling implemented
- [ ] File size limits enforced

**Time Spent**: ___ hours

**Notes**:
