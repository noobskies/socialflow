import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/posts - List all posts with filters
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: user!.id,
        ...(status && {
          status: status.toUpperCase() as
            | "DRAFT"
            | "SCHEDULED"
            | "PUBLISHED"
            | "FAILED"
            | "PENDING_REVIEW",
        }),
      },
      include: {
        platforms: {
          include: {
            account: true,
          },
        },
        mediaAsset: true,
        comments: true,
      },
      orderBy: [{ scheduledDate: "asc" }, { createdAt: "desc" }],
      take: limit,
    });

    // Filter by platform if specified
    let filteredPosts = posts;
    if (platform) {
      filteredPosts = posts.filter((post) =>
        post.platforms.some(
          (p) => p.platform.toLowerCase() === platform.toLowerCase()
        )
      );
    }

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  platforms: z.array(z.string()).min(1, "At least one platform required"),
  accountIds: z.array(z.string()).min(1, "At least one account required"),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  timezone: z.string().default("UTC"),
  mediaAssetId: z.string().optional(),
  platformOptions: z.record(z.string(), z.unknown()).optional(),
  pollConfig: z
    .object({
      question: z.string().optional(),
      options: z.array(z.string()),
      duration: z.number(),
    })
    .optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PENDING_REVIEW"]).default("DRAFT"),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { accountIds, platforms, ...postData } = result.data;

    // Verify accounts belong to user
    const accounts = await prisma.socialAccount.findMany({
      where: {
        id: { in: accountIds },
        userId: user!.id,
      },
    });

    if (accounts.length !== accountIds.length) {
      return NextResponse.json(
        { error: "Invalid account IDs" },
        { status: 400 }
      );
    }

    // Create post with platform associations
    const post = await prisma.post.create({
      data: {
        content: postData.content,
        userId: user!.id,
        scheduledDate: postData.scheduledDate,
        scheduledTime: postData.scheduledTime,
        timezone: postData.timezone,
        mediaAssetId: postData.mediaAssetId,
        platformOptions: postData.platformOptions
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (postData.platformOptions as any)
          : undefined,
        pollConfig: postData.pollConfig
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (postData.pollConfig as any)
          : undefined,
        status: postData.status,
        platforms: {
          create: accountIds.map((accountId, index) => ({
            accountId,
            platform: platforms[index] as
              | "TWITTER"
              | "LINKEDIN"
              | "INSTAGRAM"
              | "FACEBOOK"
              | "TIKTOK"
              | "YOUTUBE"
              | "PINTEREST",
          })),
        },
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

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
