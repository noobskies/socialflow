import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/storage/stats
 * Get storage usage statistics for the authenticated user
 *
 * Returns:
 * - Total storage used (bytes)
 * - Storage by type (images, videos, templates)
 * - Number of files by type
 * - Recent uploads
 * - Formatted size strings
 */
export async function GET(_request: NextRequest) {
  try {
    // 1. Authenticate user
    const { user, error } = await requireAuth();
    if (error) return error;

    // 2. Get all media assets for the user
    const mediaAssets = await prisma.mediaAsset.findMany({
      where: {
        userId: user!.id,
      },
      select: {
        id: true,
        type: true,
        name: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
        url: true,
        thumbnailUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3. Calculate statistics
    let totalBytes = 0;
    let imageBytes = 0;
    let videoBytes = 0;
    let templateBytes = 0;
    let imageCount = 0;
    let videoCount = 0;
    let templateCount = 0;

    mediaAssets.forEach((asset) => {
      const size = asset.fileSize || 0;
      totalBytes += size;

      switch (asset.type) {
        case "IMAGE":
          imageBytes += size;
          imageCount++;
          break;
        case "VIDEO":
          videoBytes += size;
          videoCount++;
          break;
        case "TEMPLATE":
          templateBytes += size;
          templateCount++;
          break;
      }
    });

    // 4. Format sizes for display
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    // 5. Storage limits (Vercel Blob free tier: 5GB)
    const FREE_TIER_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB in bytes
    const usagePercent = (totalBytes / FREE_TIER_LIMIT) * 100;

    // 6. Get recent uploads (last 10)
    const recentUploads = mediaAssets.slice(0, 10).map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      size: formatBytes(asset.fileSize || 0),
      sizeBytes: asset.fileSize || 0,
      createdAt: asset.createdAt,
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
    }));

    // 7. Return statistics
    return NextResponse.json({
      stats: {
        total: {
          bytes: totalBytes,
          formatted: formatBytes(totalBytes),
          files: mediaAssets.length,
        },
        byType: {
          images: {
            bytes: imageBytes,
            formatted: formatBytes(imageBytes),
            count: imageCount,
          },
          videos: {
            bytes: videoBytes,
            formatted: formatBytes(videoBytes),
            count: videoCount,
          },
          templates: {
            bytes: templateBytes,
            formatted: formatBytes(templateBytes),
            count: templateCount,
          },
        },
        limits: {
          freeTier: {
            bytes: FREE_TIER_LIMIT,
            formatted: formatBytes(FREE_TIER_LIMIT),
          },
          used: {
            bytes: totalBytes,
            formatted: formatBytes(totalBytes),
          },
          remaining: {
            bytes: FREE_TIER_LIMIT - totalBytes,
            formatted: formatBytes(FREE_TIER_LIMIT - totalBytes),
          },
          usagePercent: Math.round(usagePercent * 100) / 100, // Round to 2 decimals
        },
        recentUploads,
      },
    });
  } catch (error) {
    console.error("Storage stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage statistics" },
      { status: 500 }
    );
  }
}
