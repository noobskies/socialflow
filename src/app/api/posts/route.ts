import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const posts = await prisma.post.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      userId: user!.id,
      content: body.content,
      status: "DRAFT",
      scheduledDate: body.scheduledDate,
      scheduledTime: body.scheduledTime,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
