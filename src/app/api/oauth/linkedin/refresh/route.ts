import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";

export async function POST(_request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  // LinkedIn doesn't support refresh tokens
  return NextResponse.json(
    {
      error: "LinkedIn does not support token refresh",
      message:
        "Please disconnect and reconnect your LinkedIn account to refresh authentication.",
      requiresReauth: true,
    },
    { status: 400 }
  );
}
