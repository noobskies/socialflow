import { NextResponse } from "next/server";
import { YouTubeOAuthService } from "@/lib/oauth/youtube-oauth-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle user denial or errors
  if (error) {
    console.log("YouTube OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/settings/accounts?error=${error}`);
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=missing_params`
    );
  }

  try {
    const service = new YouTubeOAuthService();
    const account = await service.handleCallback(code, state);

    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=youtube&account=${account.id}`
    );
  } catch (error) {
    console.error("YouTube OAuth callback failed:", error);

    let errorCode = "oauth_failed";
    let errorMessage = "Failed to connect YouTube account";

    if (error instanceof Error) {
      if (error.message.includes("No YouTube channel found")) {
        errorCode = "no_channel";
        errorMessage = "Please create a YouTube channel first";
      } else if (error.message.includes("Invalid or expired state")) {
        errorCode = "invalid_state";
      } else if (error.message.includes("token")) {
        errorCode = "token_exchange_failed";
      }
    }

    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=${errorCode}&message=${encodeURIComponent(errorMessage)}`
    );
  }
}
