import { NextResponse } from "next/server";
import { PinterestOAuthService } from "@/lib/oauth/pinterest-oauth-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle user denial or errors
  if (error) {
    console.log("Pinterest OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/settings/accounts?error=${error}`);
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=missing_params`
    );
  }

  try {
    const service = new PinterestOAuthService();
    const account = await service.handleCallback(code, state);

    return NextResponse.redirect(
      `${baseUrl}/oauth/result?success=true&platform=pinterest&account=${account.id}`
    );
  } catch (error) {
    console.error("Pinterest OAuth callback failed:", error);

    let errorCode = "oauth_failed";
    if (error instanceof Error) {
      if (error.message.includes("Invalid or expired state")) {
        errorCode = "invalid_state";
      } else if (error.message.includes("token")) {
        errorCode = "token_exchange_failed";
      }
    }

    return NextResponse.redirect(
      `${baseUrl}/oauth/result?success=false&platform=pinterest&error=${errorCode}`
    );
  }
}
