import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { YouTubeOAuthService } from "@/lib/oauth/youtube-oauth-service";

// GET - Redirect user to OAuth authorization
export async function GET(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new YouTubeOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    // Redirect to YouTube authorization page
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error("YouTube OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate YouTube OAuth" },
      { status: 500 }
    );
  }
}

// POST - Return authorization URL as JSON (for API clients)
export async function POST(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new YouTubeOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    return NextResponse.json({
      url: authorizationUrl,
    });
  } catch (error) {
    console.error("YouTube OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate YouTube OAuth" },
      { status: 500 }
    );
  }
}
