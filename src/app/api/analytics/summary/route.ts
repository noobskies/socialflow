import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET /api/analytics/summary - Get aggregated analytics summary
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    // Build where clause
    const whereClause: {
      userId: string;
      platform?:
        | "TWITTER"
        | "LINKEDIN"
        | "INSTAGRAM"
        | "FACEBOOK"
        | "TIKTOK"
        | "YOUTUBE"
        | "PINTEREST";
      date?: { gte: Date; lte: Date };
    } = {
      userId: user!.id,
    };

    if (platform) {
      whereClause.platform = platform.toUpperCase() as
        | "TWITTER"
        | "LINKEDIN"
        | "INSTAGRAM"
        | "FACEBOOK"
        | "TIKTOK"
        | "YOUTUBE"
        | "PINTEREST";
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get aggregated data
    const aggregates = await prisma.analyticsSnapshot.aggregate({
      where: whereClause,
      _sum: {
        impressions: true,
        engagement: true,
        clicks: true,
      },
      _avg: {
        impressions: true,
        engagement: true,
        clicks: true,
        followers: true,
      },
      _count: {
        id: true,
      },
    });

    // Get latest follower count per platform
    const latestSnapshots = await prisma.analyticsSnapshot.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      distinct: ["platform"],
      select: {
        platform: true,
        followers: true,
        date: true,
      },
    });

    // Calculate engagement rate
    const totalImpressions = aggregates._sum?.impressions || 0;
    const totalEngagement = aggregates._sum?.engagement || 0;
    const engagementRate =
      totalImpressions > 0
        ? ((totalEngagement / totalImpressions) * 100).toFixed(2)
        : "0.00";

    // Build platform breakdown
    const platformBreakdown = await prisma.analyticsSnapshot.groupBy({
      by: ["platform"],
      where: whereClause,
      _sum: {
        impressions: true,
        engagement: true,
        clicks: true,
      },
      _avg: {
        followers: true,
      },
    });

    return NextResponse.json({
      summary: {
        totalImpressions: aggregates._sum?.impressions || 0,
        totalEngagement: aggregates._sum?.engagement || 0,
        totalClicks: aggregates._sum?.clicks || 0,
        engagementRate: parseFloat(engagementRate),
        averageImpressions: Math.round(aggregates._avg?.impressions || 0),
        averageEngagement: Math.round(aggregates._avg?.engagement || 0),
        averageClicks: Math.round(aggregates._avg?.clicks || 0),
        snapshotCount: aggregates._count?.id || 0,
      },
      latestFollowers: latestSnapshots.map((snapshot) => ({
        platform: snapshot.platform,
        followers: snapshot.followers,
        date: snapshot.date,
      })),
      platformBreakdown: platformBreakdown.map((item) => ({
        platform: item.platform,
        totalImpressions: item._sum?.impressions || 0,
        totalEngagement: item._sum?.engagement || 0,
        totalClicks: item._sum?.clicks || 0,
        averageFollowers: Math.round(item._avg?.followers || 0),
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics summary" },
      { status: 500 }
    );
  }
}
