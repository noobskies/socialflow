import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { TikTokOAuthService } from "@/lib/oauth/tiktok-oauth-service";
import { Platform } from "../../../../../generated/prisma/client";
import { encrypt } from "@/lib/oauth/token-encryption";

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID required" },
        { status: 400 }
      );
    }

    // Verify user owns account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user!.id,
        platform: Platform.TIKTOK,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.refreshToken) {
      return NextResponse.json(
        { error: "No refresh token available" },
        { status: 400 }
      );
    }

    const service = new TikTokOAuthService();
    const decryptedRefreshToken = service.decryptToken(account.refreshToken);
    const tokens = await service.refreshAccessToken(decryptedRefreshToken);

    // Update tokens in database
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? encrypt(tokens.refresh_token)
          : account.refreshToken,
        tokenExpiry: service.getTokenExpiry(tokens),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("TikTok token refresh failed:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
