import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    // Prisma Client uses singular model accessors (prisma.user, prisma.session)
    // The @@map directives in schema.prisma handle table name mapping internally
  }),
  account: {
    fields: {
      accountId: "providerAccountId", // Better Auth's accountId → our providerAccountId
      providerId: "provider", // Better Auth's providerId → our provider
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // Enable later in Phase 9C
    autoSignIn: true, // Auto sign-in after registration
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: ["http://localhost:3000"],
});
