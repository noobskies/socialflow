import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/media - List media assets with filters
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const folderId = searchParams.get("folderId");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const mediaAssets = await prisma.mediaAsset.findMany({
      where: {
        userId: user!.id,
        ...(type && {
          type: type.toUpperCase() as "IMAGE" | "VIDEO" | "TEMPLATE",
        }),
        ...(folderId && { folderId }),
      },
      include: {
        folder: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      media: mediaAssets,
      total: mediaAssets.length,
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST /api/media - Create new media asset
const createMediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO", "TEMPLATE"]),
  url: z.string().url("Invalid URL").optional(),
  content: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  folderId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  fileSize: z.number().positive("File size must be positive").optional(),
  mimeType: z.string().optional(),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createMediaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Validate that either url or content is provided based on type
    if (data.type !== "TEMPLATE" && !data.url) {
      return NextResponse.json(
        { error: "URL is required for IMAGE and VIDEO types" },
        { status: 400 }
      );
    }

    if (data.type === "TEMPLATE" && !data.content) {
      return NextResponse.json(
        { error: "Content is required for TEMPLATE type" },
        { status: 400 }
      );
    }

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

    // Create media asset
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        type: data.type,
        url: data.url,
        content: data.content,
        name: data.name,
        folderId: data.folderId,
        tags: data.tags,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        userId: user!.id,
      },
      include: {
        folder: true,
      },
    });

    return NextResponse.json({ media: mediaAsset }, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}
