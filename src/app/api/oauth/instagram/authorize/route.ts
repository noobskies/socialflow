import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { InstagramOAuthService } from "@/lib/oauth/instagram-oauth-service";

export async function POST(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new InstagramOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    return NextResponse.json({
      url: authorizationUrl,
    });
  } catch (error) {
    console.error("Instagram OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate Instagram OAuth" },
      { status: 500 }
    );
  }
}
