import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { accountId } = params;

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID required" },
        { status: 400 }
      );
    }

    // Find account and verify ownership
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user!.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or access denied" },
        { status: 404 }
      );
    }

    // Update account to disconnected state instead of deleting
    // This preserves historical data and analytics
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        connected: false,
        status: "DISCONNECTED",
        accessToken: null, // Clear tokens for security
        refreshToken: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${account.platform} account disconnected successfully`,
      platform: account.platform,
    });
  } catch (error) {
    console.error("Account disconnect failed:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
