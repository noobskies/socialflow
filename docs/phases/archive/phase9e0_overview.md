# Phase 9E0: File Storage Overview

**Part of Phase 9E: File Storage & Media Upload**

---

## Objective

Implement production-ready file storage for SocialFlow AI with image optimization, thumbnail generation, and Vercel Blob Storage integration.

---

## Why This Matters

Social media management requires efficient media handling:
- **Images**: Need optimization for web delivery and fast loading
- **Thumbnails**: Essential for grid views and previews
- **Videos**: Need reliable storage without processing overhead
- **Storage Management**: Users need to track usage against limits

---

## Architecture Overview

### Server-Side Processing (Industry Best Practice)

We use **server-side upload with processing** instead of client-side direct upload:

**Why Server-Side?**
1. **Image Optimization Required** - Must resize and compress before storage
2. **Thumbnail Generation** - Create previews synchronously during upload
3. **Quality Control** - Server validates and processes all files
4. **Security** - Token never exposed to client browser
5. **Consistency** - Matches existing API route patterns

**Industry Standard**: Facebook, Instagram, Twitter all use server-side processing for user-uploaded media.

---

## Features

### Image Processing
- ✅ Automatic optimization (resize to 1920x1080 max)
- ✅ Quality compression (80% for main, 70% for thumbnail)
- ✅ Thumbnail generation (300x300 square previews)
- ✅ Format standardization (convert all to JPEG)
- ✅ Dual file storage (optimized + thumbnail)

### Video Handling
- ✅ Direct upload (no processing)
- ✅ File validation (type, size)
- ✅ Progress tracking
- ✅ Database integration

### User Experience
- ✅ Real-time upload progress (0-100%)
- ✅ Image/video preview before upload
- ✅ Drag-and-drop support
- ✅ Error handling and validation
- ✅ File size limits (50MB max)

### Storage Management
- ✅ Usage statistics (by type, total)
- ✅ Storage limits tracking (5GB free tier)
- ✅ Recent uploads monitoring
- ✅ Formatted size display (KB, MB, GB)

---

## Tech Stack

### Core Dependencies
- **@vercel/blob** (v1.x) - Vercel Blob Storage SDK
- **sharp** (v0.33.x) - High-performance image processing
- **Next.js API routes** - Server-side upload handlers

### Why These Technologies?

**Vercel Blob Storage**:
- Seamless Vercel integration (same platform)
- Generous free tier (5GB storage, 100GB bandwidth)
- CDN-backed (fast global delivery)
- Simple API (put, del operations)
- Automatic URL generation

**Sharp**:
- Fastest Node.js image processing library
- Production-proven (used by major platforms)
- Memory-efficient (handles large images)
- Format conversion support
- Thumbnail generation built-in

---

## Architecture Flow

### Image Upload Flow

```
1. User selects image
   ↓
2. Client validates (size, type)
   ↓
3. POST /api/upload with FormData
   ↓
4. Server receives file
   ↓
5. Sharp processes image
   - Optimize: Resize + compress
   - Thumbnail: 300x300 square
   ↓
6. Upload both to Vercel Blob
   - Main: optimized-{filename}.jpg
   - Thumb: thumb-{filename}.jpg
   ↓
7. Create MediaAsset in database
   - url: main file URL
   - thumbnailUrl: thumbnail URL
   ↓
8. Return asset object to client
   ↓
9. Client updates UI + notifies user
```

### Video Upload Flow

```
1. User selects video
   ↓
2. Client validates (size, type)
   ↓
3. POST /api/upload with FormData
   ↓
4. Server receives file
   ↓
5. Upload directly to Vercel Blob
   (No processing for videos)
   ↓
6. Create MediaAsset in database
   - url: video file URL
   - thumbnailUrl: null
   ↓
7. Return asset object to client
   ↓
8. Client updates UI + notifies user
```

---

## Database Schema

### MediaAsset Model Update

```prisma
model MediaAsset {
  id           String    @id @default(cuid())
  userId       String
  type         AssetType // IMAGE or VIDEO
  name         String
  url          String    // Main file URL
  thumbnailUrl String?   // NEW: Thumbnail URL (images only)
  folderId     String?
  tags         Json      @default("[]")
  fileSize     Int?      // Optimized file size
  mimeType     String?   // Always 'image/jpeg' for images
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  user         User              @relation(...)
  folder       Folder?           @relation(...)
  postMedia    PostPlatform[]

  @@index([userId])
  @@index([folderId])
  @@map("media_assets")
}
```

**Key Addition**: `thumbnailUrl` field stores thumbnail URL for fast preview loading.

---

## File Structure

### New Files (6 files)

```
src/
├── lib/
│   └── image-processing.ts          # Sharp utilities (4 functions)
├── app/api/
│   ├── upload/
│   │   └── route.ts                 # Upload handler (POST)
│   └── storage/
│       └── stats/route.ts           # Storage statistics (GET)
└── components/media/
    └── FileUpload.tsx               # Upload UI component
```

### Updated Files (2 files)

```
prisma/
└── schema.prisma                    # Add thumbnailUrl field

src/app/api/media/
└── [id]/route.ts                    # Add Blob deletion
```

---

## Implementation Timeline

**Total Estimated Time: 3 hours**

| Step | Document | Time | What You'll Build |
|------|----------|------|-------------------|
| 0 | Overview | - | (This document) |
| 1 | Setup | 15 min | Install deps, configure Vercel Blob |
| 2 | Schema | 10 min | Add thumbnailUrl, run migration |
| 3 | Processing | 25 min | Image optimization library |
| 4 | Upload API | 45 min | Server-side upload handler |
| 5 | Component | 45 min | Client upload UI with progress |
| 6 | Deletion | 15 min | Update delete to remove Blob files |
| 7 | Stats | 20 min | Storage usage endpoint |
| 8 | Testing | 20 min | Test all features, verify |

---

## Prerequisites

Before starting Phase 9E, ensure:

✅ **Phase 9A Complete** - MediaAsset model exists in database
✅ **Phase 9B Complete** - Authentication system working
✅ **Phase 9C Complete** - Media API CRUD endpoints operational
✅ **Vercel Account** - Access to Vercel dashboard for Blob Storage

---

## Success Criteria

Phase 9E is complete when:

- [ ] Images automatically optimized on upload
- [ ] Thumbnails generated for all images
- [ ] Videos upload successfully without processing
- [ ] Upload progress tracked in real-time (0-100%)
- [ ] Files stored in Vercel Blob Storage
- [ ] Database records created with both URLs
- [ ] Delete removes files from Blob + database
- [ ] Storage stats endpoint returns accurate data
- [ ] UI component handles drag-and-drop
- [ ] Error messages clear and helpful
- [ ] All validations working (size, type)

---

## Security Considerations

### Implemented
- ✅ File type validation (whitelist only)
- ✅ File size limits (50MB max)
- ✅ User ownership verification
- ✅ Authentication required
- ✅ Server-side processing (no client token exposure)

### Storage Limits
- **Free Tier**: 5GB storage, 100GB bandwidth/month
- **Pro Tier**: 100GB storage, 1TB bandwidth/month ($20/month)

---

## Next Steps

1. **Read** `phase9e1_setup.md` - Install dependencies and configure Vercel Blob
2. **Follow** each document sequentially (phase9e1 → phase9e8)
3. **Test** after each step to verify functionality
4. **Document** any issues or customizations

---

## Notes

- **Image Processing Time**: ~200-500ms per image (depends on size)
- **Thumbnail Size**: 300x300 recommended for grid layouts
- **Video Processing**: Not implemented (requires FFmpeg, complex setup)
- **CDN**: Vercel Blob automatically uses CDN for global delivery
- **Bandwidth**: Monitor usage in Vercel dashboard

---

**Ready to begin?** → Continue to `phase9e1_setup.md`
