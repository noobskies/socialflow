import { NextResponse } from "next/server";
import { FacebookOAuthService } from "@/lib/oauth/facebook-oauth-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle user denial or errors
  if (error) {
    console.log("Facebook OAuth error:", error, errorDescription);
    return NextResponse.redirect(`${baseUrl}/settings/accounts?error=${error}`);
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=missing_params`
    );
  }

  try {
    const service = new FacebookOAuthService();
    const account = await service.handleCallback(code, state);

    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=facebook&account=${account.id}`
    );
  } catch (error) {
    console.error("Facebook OAuth callback failed:", error);

    let errorCode = "oauth_failed";
    let errorMessage = "Failed to connect Facebook account";

    if (error instanceof Error) {
      if (error.message.includes("No Facebook Pages found")) {
        errorCode = "no_pages";
        errorMessage = "Please create or get access to a Facebook Page first";
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
