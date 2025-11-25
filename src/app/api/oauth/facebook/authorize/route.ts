import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { FacebookOAuthService } from "@/lib/oauth/facebook-oauth-service";

export async function POST(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new FacebookOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    return NextResponse.json({
      url: authorizationUrl,
    });
  } catch (error) {
    console.error("Facebook OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate Facebook OAuth" },
      { status: 500 }
    );
  }
}
