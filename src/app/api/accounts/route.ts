import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/accounts - List all social accounts with filters
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const status = searchParams.get("status");

  try {
    const accounts = await prisma.socialAccount.findMany({
      where: {
        userId: user!.id,
        ...(platform && {
          platform: platform.toUpperCase() as
            | "TWITTER"
            | "LINKEDIN"
            | "INSTAGRAM"
            | "FACEBOOK"
            | "TIKTOK"
            | "YOUTUBE"
            | "PINTEREST",
        }),
        ...(status && {
          status: status.toUpperCase() as
            | "ACTIVE"
            | "DISCONNECTED"
            | "TOKEN_EXPIRED"
            | "ERROR",
        }),
      },
      orderBy: [{ connected: "desc" }, { createdAt: "desc" }],
    });

    // Don't expose sensitive tokens in list view
    const sanitizedAccounts = accounts.map((account) => ({
      ...account,
      accessToken: undefined,
      refreshToken: undefined,
    }));

    return NextResponse.json({
      accounts: sanitizedAccounts,
      total: sanitizedAccounts.length,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Connect new social account
const createAccountSchema = z.object({
  platform: z.enum([
    "TWITTER",
    "LINKEDIN",
    "INSTAGRAM",
    "FACEBOOK",
    "TIKTOK",
    "YOUTUBE",
    "PINTEREST",
  ]),
  username: z.string().min(1, "Username is required"),
  displayName: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().datetime().optional(),
  platformUserId: z.string().optional(),
  connected: z.boolean().default(true),
});

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createAccountSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if account already exists for this user and platform
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: user!.id,
        platform: data.platform,
        username: data.username,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "Account already connected" },
        { status: 400 }
      );
    }

    // Create social account
    const account = await prisma.socialAccount.create({
      data: {
        platform: data.platform,
        username: data.username,
        displayName: data.displayName,
        avatar: data.avatar,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiry: data.tokenExpiry ? new Date(data.tokenExpiry) : null,
        platformUserId: data.platformUserId,
        connected: data.connected,
        status: data.connected ? "ACTIVE" : "DISCONNECTED",
        lastChecked: new Date(),
        userId: user!.id,
      },
    });

    // Don't expose tokens in response
    const sanitizedAccount = {
      ...account,
      accessToken: undefined,
      refreshToken: undefined,
    };

    return NextResponse.json({ account: sanitizedAccount }, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
