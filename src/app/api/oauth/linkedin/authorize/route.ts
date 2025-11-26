import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { LinkedInOAuthService } from "@/lib/oauth/linkedin-oauth-service";

export async function POST(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new LinkedInOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    return NextResponse.json({
      url: authorizationUrl,
    });
  } catch (error) {
    console.error("LinkedIn OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate LinkedIn OAuth" },
      { status: 500 }
    );
  }
}
