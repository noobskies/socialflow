import sharp from "sharp";

/**
 * Image Processing Configuration
 * Centralized settings for consistent image handling
 */
const IMAGE_CONFIG = {
  maxWidth: 1920, // Max width for optimized images
  maxHeight: 1080, // Max height for optimized images
  quality: 80, // JPEG quality (1-100)
  thumbnailSize: 300, // Square thumbnail dimension
  thumbnailQuality: 70, // Thumbnail JPEG quality
  outputFormat: "jpeg" as const, // Always convert to JPEG
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
    format?: "jpeg" | "png" | "webp";
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
        fit: "inside", // Maintain aspect ratio
        withoutEnlargement: true, // Don't upscale small images
      })
      .toFormat(format, { quality })
      .toBuffer();
  } catch (error) {
    console.error("Image optimization error:", error);
    throw new Error("Failed to optimize image");
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
        fit: "cover", // Crop to fill square
        position: "center", // Center the crop
      })
      .toFormat(IMAGE_CONFIG.outputFormat, {
        quality: IMAGE_CONFIG.thumbnailQuality,
      })
      .toBuffer();
  } catch (error) {
    console.error("Thumbnail creation error:", error);
    throw new Error("Failed to create thumbnail");
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
export async function processImage(buffer: Buffer): Promise<{
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
    console.error("Image processing error:", error);
    throw new Error("Failed to process image");
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
      format: metadata.format || "unknown",
      size: buffer.length,
    };
  } catch (error) {
    console.error("Metadata extraction error:", error);
    throw new Error("Failed to extract image metadata");
  }
}
