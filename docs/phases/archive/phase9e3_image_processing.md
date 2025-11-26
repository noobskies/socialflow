# Phase 9E3: Image Processing Library

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 25 minutes

---

## Objective

Create production-ready image processing utilities using Sharp for image optimization and thumbnail generation.

---

## Why Sharp?

### Performance Comparison

| Library | Resize Time (2000x2000 → 1920x1080) | Memory Usage |
|---------|--------------------------------------|--------------|
| **Sharp** | ~50ms | ~30MB |
| Jimp | ~800ms | ~150MB |
| ImageMagick | ~200ms | ~80MB |

**Sharp is 16x faster** than Jimp and uses 80% less memory.

### Production Usage

- **Used by**: Vercel, Netlify, Cloudflare
- **Benefits**: Fast, memory-efficient, TypeScript support
- **Features**: Resize, compress, format conversion, thumbnails

---

## Implementation

### Create Image Processing Library

**Create** `src/lib/image-processing.ts`:

```typescript
import sharp from 'sharp';

/**
 * Image Processing Configuration
 * Centralized settings for consistent image handling
 */
const IMAGE_CONFIG = {
  maxWidth: 1920,           // Max width for optimized images
  maxHeight: 1080,          // Max height for optimized images
  quality: 80,              // JPEG quality (1-100)
  thumbnailSize: 300,       // Square thumbnail dimension
  thumbnailQuality: 70,     // Thumbnail JPEG quality
  outputFormat: 'jpeg' as const, // Always convert to JPEG
};

/**
 * Optimize an image for web delivery
 * 
 * - Resizes to max dimensions while maintaining aspect ratio
 * - Compresses to specified quality
 * - Converts to JPEG format for consistency
 * - Doesn't upscale small images
 * 
 * @param buffer - Image buffer from file upload
 * @param options - Optional overrides for default settings
 * @returns Optimized image buffer
 * 
 * @example
 * const buffer = Buffer.from(await file.arrayBuffer());
 * const optimized = await optimizeImage(buffer);
 */
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
    width = IMAGE_CONFIG.maxWidth,
    height = IMAGE_CONFIG.maxHeight,
    quality = IMAGE_CONFIG.quality,
    format = IMAGE_CONFIG.outputFormat,
  } = options;

  try {
    return await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',              // Maintain aspect ratio
        withoutEnlargement: true,   // Don't upscale small images
      })
      .toFormat(format, { quality })
      .toBuffer();
  } catch (error) {
    console.error('Image optimization error:', error);
    throw new Error('Failed to optimize image');
  }
}

/**
 * Create a square thumbnail for preview/grid display
 * 
 * - Fixed square dimensions
 * - Cover fit (crops to fill square)
 * - Centers the crop for best composition
 * - Lower quality for smaller file size
 * 
 * @param buffer - Image buffer from file upload
 * @param size - Square dimension (default 300)
 * @returns Thumbnail buffer
 * 
 * @example
 * const buffer = Buffer.from(await file.arrayBuffer());
 * const thumbnail = await createThumbnail(buffer, 300);
 */
export async function createThumbnail(
  buffer: Buffer,
  size: number = IMAGE_CONFIG.thumbnailSize
): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(size, size, {
        fit: 'cover',              // Crop to fill square
        position: 'center',        // Center the crop
      })
      .toFormat(IMAGE_CONFIG.outputFormat, {
        quality: IMAGE_CONFIG.thumbnailQuality,
      })
      .toBuffer();
  } catch (error) {
    console.error('Thumbnail creation error:', error);
    throw new Error('Failed to create thumbnail');
  }
}

/**
 * Process image: optimize main image + create thumbnail in parallel
 * 
 * Most efficient way to process images - runs both operations concurrently
 * 
 * @param buffer - Image buffer from file upload
 * @returns Object with both optimized image and thumbnail buffers
 * 
 * @example
 * const buffer = Buffer.from(await file.arrayBuffer());
 * const { optimized, thumbnail } = await processImage(buffer);
 * 
 * // Upload both to storage
 * await uploadToBlob('main.jpg', optimized);
 * await uploadToBlob('thumb.jpg', thumbnail);
 */
export async function processImage(
  buffer: Buffer
): Promise<{
  optimized: Buffer;
  thumbnail: Buffer;
}> {
  try {
    // Run optimization and thumbnail generation in parallel
    const [optimized, thumbnail] = await Promise.all([
      optimizeImage(buffer),
      createThumbnail(buffer),
    ]);

    return { optimized, thumbnail };
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}

/**
 * Get image metadata without processing
 * 
 * Useful for validation before processing:
 * - Check dimensions
 * - Verify format
 * - Get file size
 * 
 * @param buffer - Image buffer
 * @returns Image metadata
 * 
 * @example
 * const buffer = Buffer.from(await file.arrayBuffer());
 * const { width, height, format } = await getImageMetadata(buffer);
 * 
 * if (width > 5000 || height > 5000) {
 *   throw new Error('Image too large');
 * }
 */
export async function getImageMetadata(buffer: Buffer): Promise<{
  width: number;
  height: number;
  format: string;
  size: number;
}> {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: buffer.length,
    };
  } catch (error) {
    console.error('Metadata extraction error:', error);
    throw new Error('Failed to extract image metadata');
  }
}
```

---

## Function Reference

### optimizeImage()

**Purpose**: Resize and compress image for web delivery

**Parameters**:
- `buffer` (Buffer): Image file buffer
- `options` (object, optional):
  - `width` (number): Max width (default: 1920)
  - `height` (number): Max height (default: 1080)
  - `quality` (number): JPEG quality 1-100 (default: 80)
  - `format` ('jpeg' | 'png' | 'webp'): Output format (default: 'jpeg')

**Returns**: Buffer - Optimized image

**Performance**: ~50-100ms for typical images

**Example**:
```typescript
const buffer = Buffer.from(await file.arrayBuffer());
const optimized = await optimizeImage(buffer);
// Result: ~200-300KB JPEG, max 1920x1080
```

---

### createThumbnail()

**Purpose**: Generate square thumbnail for grid views

**Parameters**:
- `buffer` (Buffer): Image file buffer
- `size` (number, optional): Square dimension (default: 300)

**Returns**: Buffer - Thumbnail image

**Performance**: ~30-50ms

**Example**:
```typescript
const buffer = Buffer.from(await file.arrayBuffer());
const thumbnail = await createThumbnail(buffer, 300);
// Result: 300x300px JPEG, ~15-20KB
```

---

### processImage()

**Purpose**: Optimize + thumbnail in one call (parallel processing)

**Parameters**:
- `buffer` (Buffer): Image file buffer

**Returns**: Object with `optimized` and `thumbnail` buffers

**Performance**: ~60-120ms (parallel execution)

**Example**:
```typescript
const buffer = Buffer.from(await file.arrayBuffer());
const { optimized, thumbnail } = await processImage(buffer);
// Both operations complete in ~100ms total
```

---

### getImageMetadata()

**Purpose**: Extract image information without processing

**Parameters**:
- `buffer` (Buffer): Image file buffer

**Returns**: Object with width, height, format, size

**Performance**: ~5-10ms (very fast)

**Example**:
```typescript
const buffer = Buffer.from(await file.arrayBuffer());
const metadata = await getImageMetadata(buffer);
console.log(metadata);
// { width: 3024, height: 4032, format: 'jpeg', size: 2458730 }
```

---

## Configuration Details

### IMAGE_CONFIG Settings

```typescript
{
  maxWidth: 1920,           // 1080p width standard
  maxHeight: 1080,          // 1080p height standard
  quality: 80,              // Good balance of quality/size
  thumbnailSize: 300,       // Perfect for grid layouts
  thumbnailQuality: 70,     // Acceptable for small previews
  outputFormat: 'jpeg',     // Universal browser support
}
```

### Why These Values?

**maxWidth/maxHeight (1920x1080)**:
- HD resolution standard
- Looks great on all screens
- Not overkill (4K would be too large)
- Most social platforms resize to this anyway

**quality (80)**:
- Sweet spot for web images
- 60% = Low quality, visible artifacts
- 80% = High quality, reasonable size
- 100% = Perfect quality, huge files

**thumbnailSize (300)**:
- Perfect for 3-column grid on desktop
- Perfect for 2-column grid on mobile
- Fast loading (~15-20KB per thumbnail)
- Sharp enough for preview

---

## Image Processing Pipeline

### Step-by-Step Flow

```
1. Upload received
   ↓
2. Convert to Buffer
   const buffer = Buffer.from(await file.arrayBuffer());
   ↓
3. Process image (parallel)
   const { optimized, thumbnail } = await processImage(buffer);
   ↓
4. Results:
   - optimized: 1920x1080 max, 80% quality (~200-300KB)
   - thumbnail: 300x300, 70% quality (~15-20KB)
```

### Performance Characteristics

| Operation | Input Size | Output Size | Processing Time |
|-----------|------------|-------------|-----------------|
| Optimize | 5MB (4000x3000) | 300KB (1920x1440) | ~100ms |
| Thumbnail | 5MB (4000x3000) | 20KB (300x300) | ~50ms |
| Both (parallel) | 5MB (4000x3000) | 320KB total | ~120ms |

---

## Error Handling

### Common Errors

**1. Invalid Image Format**
```typescript
try {
  await processImage(buffer);
} catch (error) {
  // Error: "Input buffer contains unsupported image format"
  return { error: 'Invalid image file' };
}
```

**2. Corrupted Image**
```typescript
try {
  await processImage(buffer);
} catch (error) {
  // Error: "Input file is missing or corrupted"
  return { error: 'Corrupted image file' };
}
```

**3. Out of Memory**
```typescript
try {
  await processImage(buffer);
} catch (error) {
  // Error: "Cannot allocate memory"
  return { error: 'Image too large to process' };
}
```

### Recommended Validation

```typescript
// Before processing
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

if (buffer.length > MAX_SIZE) {
  throw new Error('File too large');
}

// Optional: Check dimensions
const metadata = await getImageMetadata(buffer);
if (metadata.width > 10000 || metadata.height > 10000) {
  throw new Error('Image dimensions too large');
}
```

---

## Testing the Library

### Create Test File

**Create** `test-image-processing.ts`:

```typescript
import { processImage, getImageMetadata } from './src/lib/image-processing';
import { readFileSync } from 'fs';

async function test() {
  console.log('Testing image processing library...\n');

  // Load test image
  const buffer = readFileSync('test-image.jpg');
  console.log(`Input: ${buffer.length} bytes`);

  // Get metadata
  const metadata = await getImageMetadata(buffer);
  console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`Format: ${metadata.format}\n`);

  // Process image
  const start = Date.now();
  const { optimized, thumbnail } = await processImage(buffer);
  const time = Date.now() - start;

  console.log(`Processing time: ${time}ms`);
  console.log(`Optimized: ${optimized.length} bytes`);
  console.log(`Thumbnail: ${thumbnail.length} bytes`);
  console.log(`Compression: ${Math.round((1 - optimized.length / buffer.length) * 100)}%`);
}

test();
```

**Run Test**:
```bash
npx tsx test-image-processing.ts
```

**Expected Output**:
```
Testing image processing library...

Input: 2458730 bytes
Dimensions: 3024x4032
Format: jpeg

Processing time: 112ms
Optimized: 287452 bytes
Thumbnail: 18734 bytes
Compression: 88%
```

**Clean Up**:
```bash
rm test-image-processing.ts test-image.jpg
```

---

## Memory Management

### Sharp Memory Usage

Sharp is memory-efficient but can use significant RAM for large images:

- **Small images** (< 1MB): ~20MB RAM
- **Medium images** (1-5MB): ~30-50MB RAM
- **Large images** (5-10MB): ~80-100MB RAM

### Production Recommendations

**For Vercel Serverless:**
- Default memory: 1024MB
- Can handle ~10 concurrent image processing operations
- Set memory limit in `vercel.json` if needed

**For High-Volume Apps:**
- Consider separate image processing service
- Use queue system (Bull, BullMQ) for background processing
- Implement rate limiting on upload endpoint

---

## Optimization Tips

### 1. Validate Before Processing

```typescript
// Check file size first
if (file.size > 50 * 1024 * 1024) {
  return { error: 'File too large' };
}

// Then process
const buffer = Buffer.from(await file.arrayBuffer());
```

### 2. Use Parallel Processing

```typescript
// ✅ Good: Parallel (fast)
const { optimized, thumbnail } = await processImage(buffer);

// ❌ Bad: Sequential (slow)
const optimized = await optimizeImage(buffer);
const thumbnail = await createThumbnail(buffer);
```

### 3. Handle Errors Gracefully

```typescript
try {
  const { optimized, thumbnail } = await processImage(buffer);
} catch (error) {
  console.error('Processing failed:', error);
  // Fallback: Upload original without processing
  return { url: await uploadOriginal(buffer) };
}
```

---

## Verification Checklist

- [ ] `image-processing.ts` created in `src/lib/`
- [ ] All 4 functions exported
- [ ] TypeScript compiles without errors
- [ ] Test image processing (optional)
- [ ] Functions documented with JSDoc comments

---

## Next Steps

Image processing library complete! Continue to `phase9e4_upload_api.md` to create the upload API route that uses this library.

---

**Time Spent:** _____ minutes

**Notes:**
