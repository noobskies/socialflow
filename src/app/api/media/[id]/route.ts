import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/media/[id] - Get single media asset
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const mediaAsset = await prisma.mediaAsset.findFirst({
      where: {
        id,
        userId: user!.id,
      },
      include: {
        folder: true,
        posts: {
          select: {
            id: true,
            content: true,
            status: true,
            scheduledDate: true,
          },
        },
      },
    });

    if (!mediaAsset) {
      return NextResponse.json(
        { error: "Media asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ media: mediaAsset });
  } catch (error) {
    console.error("Error fetching media asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch media asset" },
      { status: 500 }
    );
  }
}

// PATCH /api/media/[id] - Update media asset
const updateMediaSchema = z.object({
  name: z.string().min(1, "Name must not be empty").optional(),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  url: z.string().url("Invalid URL").optional(),
  content: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Verify media asset belongs to user
    const existingMedia = await prisma.mediaAsset.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: "Media asset not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateMediaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify folder belongs to user if folderId provided
    if (data.folderId) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: data.folderId,
          OR: [{ userId: user!.id }, { type: "SYSTEM" }],
        },
      });

      if (!folder) {
        return NextResponse.json(
          { error: "Invalid folder ID" },
          { status: 400 }
        );
      }
    }

    // Update media asset
    const updatedMedia = await prisma.mediaAsset.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.folderId !== undefined && { folderId: data.folderId }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.content !== undefined && { content: data.content }),
      },
      include: {
        folder: true,
      },
    });

    return NextResponse.json({ media: updatedMedia });
  } catch (error) {
    console.error("Error updating media asset:", error);
    return NextResponse.json(
      { error: "Failed to update media asset" },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete media asset
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Verify media asset belongs to user
    const mediaAsset = await prisma.mediaAsset.findFirst({
      where: {
        id,
        userId: user!.id,
      },
      include: {
        posts: true,
      },
    });

    if (!mediaAsset) {
      return NextResponse.json(
        { error: "Media asset not found" },
        { status: 404 }
      );
    }

    // Check if media is being used in any posts
    if (mediaAsset.posts.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete media asset that is being used in posts",
          usedInPosts: mediaAsset.posts.length,
        },
        { status: 400 }
      );
    }

    // Delete files from Vercel Blob Storage (for images and videos)
    if (mediaAsset.url && mediaAsset.type !== "TEMPLATE") {
      try {
        // Delete main file
        await del(mediaAsset.url);
        console.log(`Deleted main file: ${mediaAsset.url}`);

        // Delete thumbnail if it exists (images only)
        if (mediaAsset.thumbnailUrl) {
          await del(mediaAsset.thumbnailUrl);
          console.log(`Deleted thumbnail: ${mediaAsset.thumbnailUrl}`);
        }
      } catch (blobError) {
        console.error("Error deleting from Blob Storage:", blobError);
        // Continue with database deletion even if Blob deletion fails
        // This prevents orphaned database records
      }
    }

    // Delete media asset from database
    await prisma.mediaAsset.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Media asset deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting media asset:", error);
    return NextResponse.json(
      { error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
