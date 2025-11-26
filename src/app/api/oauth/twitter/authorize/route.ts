import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { TwitterOAuthService } from "@/lib/oauth/twitter-oauth-service";

export async function POST(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new TwitterOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    return NextResponse.json({
      url: authorizationUrl,
    });
  } catch (error) {
    console.error("Twitter OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate Twitter OAuth" },
      { status: 500 }
    );
  }
}
