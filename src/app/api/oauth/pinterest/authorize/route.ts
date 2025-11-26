import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { PinterestOAuthService } from "@/lib/oauth/pinterest-oauth-service";

export async function POST(_request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new PinterestOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);

    return NextResponse.json({
      url: authorizationUrl,
    });
  } catch (error) {
    console.error("Pinterest OAuth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate Pinterest OAuth" },
      { status: 500 }
    );
  }
}
