import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { processImage, getImageMetadata } from "@/lib/image-processing";

// File validation constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/mpeg",
];

/**
 * POST /api/upload
 * Upload and process media files (images and videos)
 *
 * For images:
 * - Optimizes to 1920x1080 max, 80% quality
 * - Creates 300x300 thumbnail
 * - Uploads both to Vercel Blob
 *
 * For videos:
 * - Uploads directly without processing
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    // 4. Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: "Invalid file type. Supported: JPEG, PNG, WebP, GIF, MP4, MOV",
        },
        { status: 400 }
      );
    }

    // 5. Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    let mainUrl: string;
    let thumbnailUrl: string | null = null;
    let fileSize = file.size;
    let mimeType = file.type;

    // 6. Process based on file type
    if (isImage) {
      // Get original image metadata
      const metadata = await getImageMetadata(buffer);
      console.log(
        `Processing image: ${metadata.width}x${metadata.height}, ${metadata.format}`
      );

      // Process image (optimize + thumbnail in parallel)
      const { optimized, thumbnail } = await processImage(buffer);

      // Generate unique filenames
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .substring(0, 50);
      const mainFilename = `optimized-${timestamp}-${sanitizedName}.jpg`;
      const thumbFilename = `thumb-${timestamp}-${sanitizedName}.jpg`;

      // Upload both to Vercel Blob in parallel
      const [mainBlob, thumbBlob] = await Promise.all([
        put(mainFilename, optimized, {
          access: "public",
          addRandomSuffix: true,
        }),
        put(thumbFilename, thumbnail, {
          access: "public",
          addRandomSuffix: true,
        }),
      ]);

      mainUrl = mainBlob.url;
      thumbnailUrl = thumbBlob.url;
      fileSize = optimized.length;
      mimeType = "image/jpeg"; // Always JPEG after processing

      console.log(
        `Image uploaded: ${mainUrl}, thumbnail: ${thumbnailUrl}, size: ${fileSize} bytes`
      );
    } else {
      // Video: upload directly without processing
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .substring(0, 50);
      const filename = `video-${timestamp}-${sanitizedName}`;

      const blob = await put(filename, buffer, {
        access: "public",
        addRandomSuffix: true,
      });

      mainUrl = blob.url;

      console.log(`Video uploaded: ${mainUrl}, size: ${fileSize} bytes`);
    }

    // 7. Save to database
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        userId: user!.id,
        type: isImage ? "IMAGE" : "VIDEO",
        name: file.name,
        url: mainUrl,
        thumbnailUrl: thumbnailUrl,
        fileSize: fileSize,
        mimeType: mimeType,
        tags: [],
      },
    });

    // 8. Return success response
    return NextResponse.json(
      {
        asset: {
          id: mediaAsset.id,
          type: mediaAsset.type,
          name: mediaAsset.name,
          url: mediaAsset.url,
          thumbnailUrl: mediaAsset.thumbnailUrl,
          fileSize: mediaAsset.fileSize,
          mimeType: mediaAsset.mimeType,
          createdAt: mediaAsset.createdAt,
        },
        message: `${isImage ? "Image" : "Video"} uploaded successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("Failed to optimize image")) {
        return NextResponse.json(
          { error: "Invalid or corrupted image file" },
          { status: 400 }
        );
      }
      if (error.message.includes("Failed to process image")) {
        return NextResponse.json(
          { error: "Image processing failed" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
