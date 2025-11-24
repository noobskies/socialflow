# Phase 9A: Database Schema & Prisma Setup

**Objective**: Set up PostgreSQL database with Prisma ORM and define the complete schema for SocialFlow AI.

**Estimated Time**: 2-3 hours

**Prerequisites**:
- Next.js 16 application running
- Vercel account (for deployment)
- Basic understanding of SQL and database design

---

## Overview

This phase establishes the database foundation for SocialFlow AI. We'll use Prisma as our ORM (Object-Relational Mapping) tool with PostgreSQL as the database. Prisma provides type-safe database access, automatic migrations, and excellent TypeScript integration.

**Tech Stack**:
- **Prisma** v6.x - Type-safe ORM with auto-generated client
- **PostgreSQL** - Relational database (Vercel Postgres or Supabase)
- **@prisma/client** - Database client for queries
- **@prisma/accelerate** - Connection pooling and caching (optional, for scale)

---

## Step 1: Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
```

**Why these packages**:
- `prisma` - CLI tool for migrations and schema management
- `@prisma/client` - Auto-generated database client for type-safe queries

---

## Step 2: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables (DATABASE_URL)

**Update `.env`** (or `.env.local`):
```bash
# For local development (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/socialflow_dev?schema=public"

# For Vercel Postgres (production)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
```

**Add to `.gitignore`**:
```
.env
.env.local
```

---

## Step 3: Define Database Schema

Replace `prisma/schema.prisma` with the complete schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// USER & AUTHENTICATION
// ==========================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  emailVerified DateTime?
  image         String?
  planTier      PlanTier  @default(FREE)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      SocialAccount[]
  posts         Post[]
  mediaAssets   MediaAsset[]
  workflows     Workflow[]
  shortLinks    ShortLink[]
  bioPage       BioPage?
  apiKeys       ApiKey[]
  teamMembers   TeamMember[]
  workspace     Workspace?
  sessions      Session[]
  
  @@index([email])
  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  sessionToken String   @unique
  expires      DateTime
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@map("sessions")
}

enum PlanTier {
  FREE
  PRO
  AGENCY
}

// ==========================================
// SOCIAL ACCOUNTS
// ==========================================

model SocialAccount {
  id           String    @id @default(cuid())
  userId       String
  platform     Platform
  username     String
  displayName  String?
  avatar       String?
  
  // OAuth tokens
  accessToken  String?   @db.Text
  refreshToken String?   @db.Text
  tokenExpiry  DateTime?
  
  connected    Boolean   @default(false)
  
  // Platform-specific IDs
  platformUserId String?
  
  // Health status
  lastChecked  DateTime?
  status       AccountStatus @default(ACTIVE)
  
  // Timestamps
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  posts        Post[]
  
  @@unique([userId, platform])
  @@index([userId])
  @@index([platform])
  @@map("social_accounts")
}

enum Platform {
  TWITTER
  LINKEDIN
  INSTAGRAM
  FACEBOOK
  TIKTOK
  YOUTUBE
  PINTEREST
}

enum AccountStatus {
  ACTIVE
  DISCONNECTED
  TOKEN_EXPIRED
  ERROR
}

// ==========================================
// POSTS & SCHEDULING
// ==========================================

model Post {
  id            String      @id @default(cuid())
  userId        String
  content       String      @db.Text
  
  // Scheduling
  scheduledDate DateTime?
  scheduledTime String?     // HH:MM format
  timezone      String      @default("UTC")
  
  status        PostStatus  @default(DRAFT)
  
  // Media
  mediaUrl      String?
  mediaType     MediaType?
  mediaAssetId  String?
  
  // Platform-specific options (JSON)
  platformOptions Json?
  
  // Poll configuration (JSON)
  pollConfig    Json?
  
  // Analytics (after publishing)
  impressions   Int         @default(0)
  engagement    Int         @default(0)
  clicks        Int         @default(0)
  
  // Published info
  publishedAt   DateTime?
  publishedUrls Json?       // { twitter: "url", linkedin: "url" }
  
  // Timestamps
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  mediaAsset    MediaAsset? @relation(fields: [mediaAssetId], references: [id])
  platforms     PostPlatform[]
  comments      Comment[]
  
  @@index([userId])
  @@index([status])
  @@index([scheduledDate])
  @@map("posts")
}

model PostPlatform {
  id         String   @id @default(cuid())
  postId     String
  accountId  String
  platform   Platform
  
  // Publishing status per platform
  published  Boolean  @default(false)
  platformPostId String?
  publishedUrl   String?
  error      String?
  
  post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  account    SocialAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  @@unique([postId, accountId])
  @@index([postId])
  @@map("post_platforms")
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  author    String
  avatar    String
  content   String   @db.Text
  createdAt DateTime @default(now())
  
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@index([postId])
  @@map("comments")
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PENDING_REVIEW
  APPROVED
  REJECTED
  PUBLISHED
  FAILED
}

enum MediaType {
  IMAGE
  VIDEO
}

// ==========================================
// MEDIA LIBRARY
// ==========================================

model MediaAsset {
  id        String     @id @default(cuid())
  userId    String
  type      AssetType
  
  // Storage
  url       String?    // For images/videos
  content   String?    @db.Text // For templates
  
  name      String
  folderId  String?
  tags      String[]
  
  // File metadata
  fileSize  Int?
  mimeType  String?
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder    Folder?    @relation(fields: [folderId], references: [id])
  posts     Post[]
  
  @@index([userId])
  @@index([folderId])
  @@index([type])
  @@map("media_assets")
}

model Folder {
  id        String       @id @default(cuid())
  userId    String?
  name      String
  type      FolderType
  icon      String?
  
  assets    MediaAsset[]
  
  @@map("folders")
}

enum AssetType {
  IMAGE
  VIDEO
  TEMPLATE
}

enum FolderType {
  SYSTEM
  USER
}

// ==========================================
// LINK MANAGEMENT
// ==========================================

model ShortLink {
  id          String   @id @default(cuid())
  userId      String
  title       String
  shortCode   String   @unique
  originalUrl String   @db.Text
  clicks      Int      @default(0)
  tags        String[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([shortCode])
  @@map("short_links")
}

model BioPage {
  id              String   @id @default(cuid())
  userId          String   @unique
  username        String   @unique
  displayName     String
  bio             String   @db.Text
  avatar          String?
  theme           String   @default("colorful")
  
  enableLeadCapture Boolean @default(false)
  leadCaptureText   String?
  
  links           Json     // Array of link objects
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  leads           Lead[]
  
  @@index([username])
  @@map("bio_pages")
}

model Lead {
  id        String   @id @default(cuid())
  bioPageId String
  email     String
  name      String?
  source    String
  
  createdAt DateTime @default(now())
  
  bioPage   BioPage  @relation(fields: [bioPageId], references: [id], onDelete: Cascade)
  
  @@index([bioPageId])
  @@index([email])
  @@map("leads")
}

// ==========================================
// AUTOMATIONS & WORKFLOWS
// ==========================================

model Workflow {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String   @db.Text
  trigger     String
  action      String
  active      Boolean  @default(false)
  
  // Statistics
  runs        Int      @default(0)
  lastRun     DateTime?
  
  icon        String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([active])
  @@map("workflows")
}

// ==========================================
// TEAM & COLLABORATION
// ==========================================

model Workspace {
  id          String       @id @default(cuid())
  userId      String       @unique
  name        String
  type        WorkspaceType
  
  // Branding
  companyName String?
  primaryColor String?
  logoUrl     String?
  customDomain String?
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("workspaces")
}

model TeamMember {
  id        String     @id @default(cuid())
  userId    String
  email     String
  name      String
  role      MemberRole
  avatar    String?
  status    MemberStatus @default(INVITED)
  
  invitedAt DateTime   @default(now())
  joinedAt  DateTime?
  
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([email])
  @@map("team_members")
}

enum WorkspaceType {
  PERSONAL
  TEAM
  AGENCY
}

enum MemberRole {
  ADMIN
  EDITOR
  VIEWER
}

enum MemberStatus {
  INVITED
  ACTIVE
  SUSPENDED
}

// ==========================================
// API & INTEGRATIONS
// ==========================================

model ApiKey {
  id        String   @id @default(cuid())
  userId    String
  name      String
  key       String   @unique
  lastUsed  DateTime?
  
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([key])
  @@map("api_keys")
}

// ==========================================
// ANALYTICS & REPORTS
// ==========================================

model AnalyticsSnapshot {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime
  platform    Platform
  
  impressions Int      @default(0)
  engagement  Int      @default(0)
  clicks      Int      @default(0)
  followers   Int      @default(0)
  
  createdAt   DateTime @default(now())
  
  @@unique([userId, date, platform])
  @@index([userId])
  @@index([date])
  @@map("analytics_snapshots")
}
```

---

## Step 4: Create and Run Migration

```bash
# Generate migration
npx prisma migrate dev --name init

# This will:
# 1. Create SQL migration file in prisma/migrations/
# 2. Apply migration to database
# 3. Generate Prisma Client (@prisma/client)
```

**Expected Output**:
```
✔ Generated Prisma Client
✔ Applied migration 20231124_init
```

---

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

This generates the type-safe Prisma Client in `node_modules/@prisma/client`.

---

## Step 6: Create Prisma Client Instance

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Why this pattern**:
- Prevents multiple Prisma Client instances in development (hot reload)
- Logs queries in development for debugging
- Production-optimized (no query logging)

---

## Step 7: Seed Initial Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@socialflow.ai' },
    update: {},
    create: {
      email: 'test@socialflow.ai',
      name: 'Test User',
      passwordHash: hashedPassword,
      planTier: 'PRO',
    },
  });

  console.log('Created user:', user.email);

  // Create system folders
  await prisma.folder.createMany({
    data: [
      { name: 'All Uploads', type: 'SYSTEM', icon: 'folder-open' },
      { name: 'Evergreen', type: 'SYSTEM' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update `package.json`**:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Install dependencies**:
```bash
npm install -D tsx bcryptjs @types/bcryptjs
```

**Run seed**:
```bash
npx prisma db seed
```

---

## Step 8: Test Database Connection

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    );
  }
}
```

**Test**:
```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "ok",
  "database": "connected",
  "userCount": 1
}
```

---

## Database Hosting Options

### Option 1: Vercel Postgres (Recommended for Vercel)

1. Go to Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Copy connection strings to `.env.local`:
```bash
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
```

4. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

**Free Tier**: 256 MB storage, 60 hours compute/month

### Option 2: Supabase

1. Create project at supabase.com
2. Get connection string from Settings → Database
3. Add to `.env.local`:
```bash
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

**Free Tier**: 500 MB storage, unlimited API requests

### Option 3: Railway

1. Create project at railway.app
2. Add PostgreSQL service
3. Copy DATABASE_URL from service variables

**Free Tier**: $5 credit/month

---

## Useful Prisma Commands

```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy

# Format schema file
npx prisma format
```

---

## Troubleshooting

### Error: "Can't reach database server"

**Solution**: Check DATABASE_URL is correct and database is running.

### Error: "Migration failed"

**Solution**: 
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Error: "Prisma Client not found"

**Solution**:
```bash
npx prisma generate
```

---

## Next Steps

**Phase 9B**: Authentication System
- NextAuth.js setup
- Login/registration API routes
- JWT token management

---

## Verification Checklist

- [ ] Prisma installed and initialized
- [ ] `schema.prisma` defined with all models
- [ ] Database connection configured (`.env.local`)
- [ ] Initial migration created and applied
- [ ] Prisma Client generated
- [ ] `src/lib/prisma.ts` created
- [ ] Seed script created and run
- [ ] Health check API route working
- [ ] Can view data in Prisma Studio

**Time Spent**: ___ hours

**Notes**:
