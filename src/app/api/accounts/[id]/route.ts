import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/accounts/[id] - Get single account details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const account = await prisma.socialAccount.findFirst({
      where: {
        id,
        userId: user!.id,
      },
      include: {
        posts: {
          select: {
            id: true,
            postId: true,
            published: true,
            platformPostId: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Don't expose sensitive tokens
    const sanitizedAccount = {
      ...account,
      accessToken: undefined,
      refreshToken: undefined,
    };

    return NextResponse.json({ account: sanitizedAccount });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

// PATCH /api/accounts/[id] - Update account (refresh token, status, etc.)
const updateAccountSchema = z.object({
  displayName: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().datetime().optional(),
  connected: z.boolean().optional(),
  status: z
    .enum(["ACTIVE", "DISCONNECTED", "TOKEN_EXPIRED", "ERROR"])
    .optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Verify account belongs to user
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        id,
        userId: user!.id,
      },
    });

    if (!existingAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = updateAccountSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Update account
    const updatedAccount = await prisma.socialAccount.update({
      where: { id },
      data: {
        ...(data.displayName !== undefined && {
          displayName: data.displayName,
        }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.accessToken !== undefined && {
          accessToken: data.accessToken,
        }),
        ...(data.refreshToken !== undefined && {
          refreshToken: data.refreshToken,
        }),
        ...(data.tokenExpiry !== undefined && {
          tokenExpiry: new Date(data.tokenExpiry),
        }),
        ...(data.connected !== undefined && { connected: data.connected }),
        ...(data.status !== undefined && { status: data.status }),
        lastChecked: new Date(),
      },
    });

    // Don't expose sensitive tokens
    const sanitizedAccount = {
      ...updatedAccount,
      accessToken: undefined,
      refreshToken: undefined,
    };

    return NextResponse.json({ account: sanitizedAccount });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

// DELETE /api/accounts/[id] - Disconnect account
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Verify account belongs to user
    const account = await prisma.socialAccount.findFirst({
      where: {
        id,
        userId: user!.id,
      },
      include: {
        posts: {
          where: {
            post: {
              status: {
                in: ["SCHEDULED", "PENDING_REVIEW"],
              },
            },
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Check if account has scheduled posts
    if (account.posts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot disconnect account with scheduled posts. Please delete or reschedule them first.",
          scheduledPosts: account.posts.length,
        },
        { status: 400 }
      );
    }

    // Delete account (cascade will handle related records)
    await prisma.socialAccount.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Account disconnected successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
