import { NextResponse } from "next/server";
import { LinkedInOAuthService } from "@/lib/oauth/linkedin-oauth-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle user denial
  if (error) {
    console.log("LinkedIn OAuth error:", error, errorDescription);
    return NextResponse.redirect(`${baseUrl}/settings/accounts?error=${error}`);
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=missing_params`
    );
  }

  try {
    const service = new LinkedInOAuthService();
    const account = await service.handleCallback(code, state);

    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=linkedin&account=${account.id}`
    );
  } catch (error) {
    console.error("LinkedIn OAuth callback failed:", error);

    let errorCode = "oauth_failed";
    if (error instanceof Error) {
      if (error.message.includes("Invalid or expired state")) {
        errorCode = "invalid_state";
      } else if (error.message.includes("token")) {
        errorCode = "token_exchange_failed";
      }
    }

    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=${errorCode}`
    );
  }
}
