import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET /api/posts/[id] - Get single post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const post = await prisma.post.findFirst({
      where: {
        id,
        userId: user!.id,
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    // Verify ownership
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        content: body.content,
        scheduledDate: body.scheduledDate,
        scheduledTime: body.scheduledTime,
        timezone: body.timezone,
        status: body.status,
        mediaAssetId: body.mediaAssetId,
        platformOptions: body.platformOptions
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (body.platformOptions as any)
          : undefined,
        pollConfig: body.pollConfig
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (body.pollConfig as any)
          : undefined,
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Verify ownership
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
