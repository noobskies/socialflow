# Phase 9E1: Setup & Configuration

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 15 minutes

---

## Objective

Install dependencies and configure Vercel Blob Storage for file uploads.

---

## Step 1: Install Dependencies (5 min)

### Install Required Packages

```bash
npm install @vercel/blob sharp
```

**What Each Package Does:**

- **@vercel/blob** (v1.x)
  - Vercel's official Blob Storage SDK
  - Provides `put()` for uploads, `del()` for deletions
  - Handles authentication via token
  - Returns CDN-backed URLs automatically

- **sharp** (v0.33.x)
  - High-performance image processing
  - Resize, compress, format conversion
  - Thumbnail generation
  - Memory-efficient (handles large images)

### Verify Installation

```bash
npm list @vercel/blob sharp
```

**Expected Output:**
```
socialflow@0.1.0 /home/noobskie/workspace/socialflow
├── @vercel/blob@1.0.0
└── sharp@0.33.5
```

---

## Step 2: Configure Vercel Blob Storage (10 min)

### Option A: Using Vercel CLI (Recommended)

**1. Install Vercel CLI (if not already installed):**

```bash
npm install -g vercel
```

**2. Login to Vercel:**

```bash
vercel login
```

This opens your browser to authenticate with Vercel.

**3. Create Blob Storage:**

```bash
vercel blob create socialflow-media
```

**Interactive Prompts:**
```
? What would you like to name your Blob store? 
› socialflow-media

✓ Created Blob store: socialflow-media
✓ Environment variable created: BLOB_READ_WRITE_TOKEN
```

**4. Copy Token to `.env`:**

The CLI will output your token. Copy it:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

**5. Add to `.env` File:**

```bash
# In your project root
echo "BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx" >> .env
```

**Important:** Never commit `.env` to Git. It's already in `.gitignore`.

### Option B: Using Vercel Dashboard (Alternative)

If you prefer the dashboard:

**1. Go to Vercel Dashboard:**
- Open https://vercel.com/dashboard
- Select your project (socialflow)

**2. Navigate to Storage:**
- Click "Storage" tab
- Click "Create Database"
- Select "Blob"

**3. Configure:**
- **Name:** `socialflow-media`
- **Region:** Select closest to your users (auto-selected)
- Click "Create"

**4. Get Token:**
- After creation, go to "Settings" tab
- Find `BLOB_READ_WRITE_TOKEN`
- Click "Copy" to get the token value

**5. Add to `.env`:**

Create or update `.env` in your project root:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

---

## Step 3: Verify `.env` Configuration

### Check `.env` File

Your `.env` should now include:

```bash
# Database (from Phase 9A)
DATABASE_URL=postgresql://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Authentication (from Phase 9B)
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000

# OAuth (from Phase 9D)
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
# ... other OAuth credentials

# File Storage (NEW - Phase 9E)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx

# AI Service
NEXT_PUBLIC_GEMINI_API_KEY=...
```

### Security Check

✅ **Verify `.gitignore` includes `.env`:**

```bash
grep "^\.env$" .gitignore
```

Should return:
```
.env
```

If not, add it:

```bash
echo ".env" >> .gitignore
```

---

## Step 4: Test Vercel Blob Connection (Optional)

Create a quick test to verify Blob Storage is working.

**Create** `test-blob.ts` (temporary file):

```typescript
import { put, list } from '@vercel/blob';

async function testBlob() {
  try {
    // Test upload
    const blob = await put('test.txt', 'Hello from SocialFlow!', {
      access: 'public',
    });
    
    console.log('✅ Upload successful!');
    console.log('URL:', blob.url);
    
    // Test list
    const { blobs } = await list();
    console.log('✅ List successful!');
    console.log('Total blobs:', blobs.length);
    
  } catch (error) {
    console.error('❌ Blob Storage Error:', error);
    console.error('Check your BLOB_READ_WRITE_TOKEN in .env');
  }
}

testBlob();
```

**Run Test:**

```bash
npx tsx test-blob.ts
```

**Expected Output:**
```
✅ Upload successful!
URL: https://xxxxx.public.blob.vercel-storage.com/test-abc123.txt
✅ List successful!
Total blobs: 1
```

**Clean Up:**

```bash
rm test-blob.ts
```

---

## Step 5: Configure Environment for Next.js

Next.js automatically loads `.env` files. No additional configuration needed!

**Environment Variable Hierarchy:**
1. `.env.local` (highest priority, never committed)
2. `.env.production` (production builds)
3. `.env.development` (dev builds)
4. `.env` (base, committed to Git)

**Best Practice:** Use `.env` for Blob token (local development).

---

## Troubleshooting

### Issue: "Module not found: @vercel/blob"

**Solution:**
```bash
npm install @vercel/blob
npm run dev  # Restart dev server
```

### Issue: "Error: Missing BLOB_READ_WRITE_TOKEN"

**Solution:**
1. Check `.env` file exists in project root
2. Verify token starts with `vercel_blob_rw_`
3. Restart dev server: `npm run dev`
4. Check for typos in variable name

### Issue: "sharp installation failed"

**Solution (Linux/Mac):**
```bash
npm install --force sharp
```

**Solution (Windows):**
```bash
npm install --platform=win32 --arch=x64 sharp
```

### Issue: "403 Forbidden" when uploading

**Solution:**
- Token may be invalid or expired
- Regenerate token in Vercel Dashboard:
  - Go to Storage → socialflow-media → Settings
  - Click "Regenerate Token"
  - Update `.env` with new token

---

## Production Setup

### Vercel Environment Variables

When deploying to Vercel:

**1. Go to Vercel Dashboard:**
- Select your project
- Go to "Settings" → "Environment Variables"

**2. Add `BLOB_READ_WRITE_TOKEN`:**
- **Key:** `BLOB_READ_WRITE_TOKEN`
- **Value:** (your token)
- **Environment:** Production, Preview, Development (select all)

**3. Redeploy:**
```bash
vercel --prod
```

### Important: Use Same Blob Store

Your local development and production should use the **same Blob store**. This means:
- Same `BLOB_READ_WRITE_TOKEN` everywhere
- Files uploaded locally are accessible in production
- One centralized storage location

**Why?** Vercel Blob is production-ready for development use. No need for separate dev/prod stores until you have significant traffic.

---

## Storage Limits & Monitoring

### Free Tier Limits
- **Storage:** 5GB
- **Bandwidth:** 100GB/month
- **Requests:** Unlimited

### Monitor Usage

**View in Vercel Dashboard:**
- Storage → socialflow-media → Usage tab
- Shows: Storage used, bandwidth consumed, request count

**Set Up Alerts:**
- Storage → Settings → Alerts
- Get email when reaching 80% of limits

### Upgrade Path

If you exceed free tier:
- **Pro:** $20/month (100GB storage, 1TB bandwidth)
- Automatic upgrade prompt in dashboard

---

## Verification Checklist

- [ ] `@vercel/blob` installed
- [ ] `sharp` installed
- [ ] Vercel Blob store created (`socialflow-media`)
- [ ] `BLOB_READ_WRITE_TOKEN` in `.env`
- [ ] `.env` in `.gitignore`
- [ ] Test upload successful (optional)
- [ ] Dev server restarted

---

## Next Steps

Setup complete! Continue to `phase9e2_schema_update.md` to add the `thumbnailUrl` field to your database schema.

---

## Quick Reference

### Blob Storage Operations

```typescript
import { put, del, list } from '@vercel/blob';

// Upload
const blob = await put(filename, file, {
  access: 'public',
  addRandomSuffix: true,
});

// Delete
await del(url);

// List
const { blobs } = await list();
```

### Environment Variable

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

---

**Time Spent:** _____ minutes

**Notes:**
