import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/analytics - Get analytics snapshots with filters
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  try {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: {
        userId: user!.id,
        ...(platform && {
          platform: platform.toUpperCase() as
            | "TWITTER"
            | "LINKEDIN"
            | "INSTAGRAM"
            | "FACEBOOK"
            | "TIKTOK"
            | "YOUTUBE"
            | "PINTEREST",
        }),
        ...(startDate &&
          endDate && {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      },
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json({
      snapshots,
      total: snapshots.length,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Create analytics snapshot
const createAnalyticsSchema = z.object({
  date: z.string().datetime("Invalid date format"),
  platform: z.enum([
    "TWITTER",
    "LINKEDIN",
    "INSTAGRAM",
    "FACEBOOK",
    "TIKTOK",
    "YOUTUBE",
    "PINTEREST",
  ]),
  impressions: z.number().min(0, "Impressions must be non-negative").default(0),
  engagement: z.number().min(0, "Engagement must be non-negative").default(0),
  clicks: z.number().min(0, "Clicks must be non-negative").default(0),
  followers: z.number().min(0, "Followers must be non-negative").default(0),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createAnalyticsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;
    const snapshotDate = new Date(data.date);

    // Check if snapshot already exists for this user, date, and platform
    const existingSnapshot = await prisma.analyticsSnapshot.findUnique({
      where: {
        userId_date_platform: {
          userId: user!.id,
          date: snapshotDate,
          platform: data.platform,
        },
      },
    });

    if (existingSnapshot) {
      // Update existing snapshot
      const updatedSnapshot = await prisma.analyticsSnapshot.update({
        where: {
          userId_date_platform: {
            userId: user!.id,
            date: snapshotDate,
            platform: data.platform,
          },
        },
        data: {
          impressions: data.impressions,
          engagement: data.engagement,
          clicks: data.clicks,
          followers: data.followers,
        },
      });

      return NextResponse.json({ snapshot: updatedSnapshot });
    }

    // Create new snapshot
    const snapshot = await prisma.analyticsSnapshot.create({
      data: {
        date: snapshotDate,
        platform: data.platform,
        impressions: data.impressions,
        engagement: data.engagement,
        clicks: data.clicks,
        followers: data.followers,
        userId: user!.id,
      },
    });

    return NextResponse.json({ snapshot }, { status: 201 });
  } catch (error) {
    console.error("Error creating analytics snapshot:", error);
    return NextResponse.json(
      { error: "Failed to create analytics snapshot" },
      { status: 500 }
    );
  }
}
