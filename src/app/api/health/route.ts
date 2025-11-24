import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      userCount,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
