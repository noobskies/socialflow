import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Get current session in Server Components/API Routes
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Require authentication for API routes
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user: session.user, error: null };
}

/**
 * Require specific plan tier
 */
export async function requirePlan(minimumTier: "FREE" | "PRO" | "AGENCY") {
  const { user, error } = await requireAuth();

  if (error) return { user: null, error };

  // Fetch full user from database to get planTier
  const { prisma } = await import("@/lib/prisma");
  const fullUser = await prisma.user.findUnique({
    where: { id: user!.id },
    select: { id: true, email: true, name: true, planTier: true },
  });

  if (!fullUser) {
    return {
      user: null,
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  const tierOrder = { FREE: 0, PRO: 1, AGENCY: 2 };

  if (tierOrder[fullUser.planTier] < tierOrder[minimumTier]) {
    return {
      user: null,
      error: NextResponse.json({ error: "Upgrade required" }, { status: 403 }),
    };
  }

  return { user: fullUser, error: null };
}
