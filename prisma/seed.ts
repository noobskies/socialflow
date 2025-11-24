import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL as string,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // Create test user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@socialflow.ai" },
    update: {},
    create: {
      email: "test@socialflow.ai",
      name: "Test User",
      passwordHash: hashedPassword,
      planTier: "PRO",
    },
  });

  console.log("✅ Created user:", user.email);

  // Create system folders
  const folder1 = await prisma.folder.upsert({
    where: { id: "system-all-uploads" },
    update: {},
    create: {
      id: "system-all-uploads",
      name: "All Uploads",
      type: "SYSTEM",
      icon: "folder-open",
    },
  });

  const folder2 = await prisma.folder.upsert({
    where: { id: "system-evergreen" },
    update: {},
    create: {
      id: "system-evergreen",
      name: "Evergreen",
      type: "SYSTEM",
      icon: "star",
    },
  });

  console.log("✅ Created system folders:", folder1.name, folder2.name);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
