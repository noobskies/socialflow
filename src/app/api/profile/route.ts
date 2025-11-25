import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/profile - Get current user profile with stats
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user!.id },
      include: {
        workspace: true,
        _count: {
          select: {
            accounts: true,
            posts: true,
            mediaAssets: true,
            workflows: true,
            shortLinks: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Return profile with stats
    return NextResponse.json({
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        emailVerified: profile.emailVerified,
        image: profile.image,
        planTier: profile.planTier,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        workspace: profile.workspace,
        stats: {
          accounts: profile._count.accounts,
          posts: profile._count.posts,
          mediaAssets: profile._count.mediaAssets,
          workflows: profile._count.workflows,
          shortLinks: profile._count.shortLinks,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update user profile
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name must not be empty").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export async function PATCH(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, image } = result.data;

    // Check if email is already taken by another user
    if (email && email !== user!.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== user!.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Update profile
    const updatedProfile = await prisma.user.update({
      where: { id: user!.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(image !== undefined && { image }),
      },
      include: {
        workspace: true,
        _count: {
          select: {
            accounts: true,
            posts: true,
            mediaAssets: true,
            workflows: true,
            shortLinks: true,
          },
        },
      },
    });

    return NextResponse.json({
      profile: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        name: updatedProfile.name,
        emailVerified: updatedProfile.emailVerified,
        image: updatedProfile.image,
        planTier: updatedProfile.planTier,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
        workspace: updatedProfile.workspace,
        stats: {
          accounts: updatedProfile._count.accounts,
          posts: updatedProfile._count.posts,
          mediaAssets: updatedProfile._count.mediaAssets,
          workflows: updatedProfile._count.workflows,
          shortLinks: updatedProfile._count.shortLinks,
        },
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
