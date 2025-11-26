import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { FacebookOAuthService } from "@/lib/oauth/facebook-oauth-service";
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
        platform: Platform.FACEBOOK,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.accessToken) {
      return NextResponse.json(
        { error: "No access token available" },
        { status: 400 }
      );
    }

    // Exchange current token for new long-lived token
    const service = new FacebookOAuthService();
    const decryptedToken = service.decryptToken(account.accessToken);
    const tokens = await service.refreshAccessToken(decryptedToken);

    // Update tokens in database
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: encrypt(tokens.access_token),
        tokenExpiry: service.getTokenExpiry(tokens),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Facebook token refreshed successfully",
    });
  } catch (error) {
    console.error("Facebook token refresh failed:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
