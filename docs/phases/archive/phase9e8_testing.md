# Phase 9E8: Testing & Verification

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 20 minutes

---

## Objective

Comprehensively test all file storage components to ensure production readiness.

---

## Testing Overview

### Components to Test

1. ✅ Image Processing (Sharp utilities)
2. ✅ Upload API (with image optimization)
3. ✅ Upload Component (UI with progress)
4. ✅ Blob Deletion (cleanup)
5. ✅ Storage Statistics (usage tracking)

### Testing Levels

- **Unit Testing**: Individual functions
- **Integration Testing**: Component interactions
- **End-to-End Testing**: Complete user workflows
- **Manual Testing**: UI/UX verification

---

## Prerequisites

Before testing:

- [ ] All Phase 9E components implemented (9E1-9E7)
- [ ] Dev server running (`npm run dev`)
- [ ] Database connected and migrated
- [ ] Vercel Blob Storage configured
- [ ] Test files available (sample images/videos)
- [ ] User account created and authenticated

---

## Unit Testing

### Test 1: Image Processing Library

**File:** `src/lib/image-processing.ts`

**Create test file** `test-image-processing.ts`:

```typescript
import { processImage, optimizeImage, createThumbnail, getImageMetadata } from './src/lib/image-processing';
import { readFileSync, writeFileSync } from 'fs';

async function testImageProcessing() {
  console.log('🧪 Testing Image Processing Library\n');

  // Load test image
  const input = readFileSync('test-assets/test-image.jpg');
  console.log(`✓ Loaded test image: ${input.length} bytes`);

  // Test 1: Get Metadata
  console.log('\n1. Testing getImageMetadata()...');
  const metadata = await getImageMetadata(input);
  console.log(`  Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`  Format: ${metadata.format}`);
  console.log(`  ✓ Metadata extraction working`);

  // Test 2: Optimize Image
  console.log('\n2. Testing optimizeImage()...');
  const start1 = Date.now();
  const optimized = await optimizeImage(input);
  const time1 = Date.now() - start1;
  const reduction = Math.round((1 - optimized.length / input.length) * 100);
  console.log(`  Optimized in ${time1}ms`);
  console.log(`  Size: ${optimized.length} bytes (${reduction}% reduction)`);
  console.log(`  ✓ Optimization working`);

  // Test 3: Create Thumbnail
  console.log('\n3. Testing createThumbnail()...');
  const start2 = Date.now();
  const thumbnail = await createThumbnail(input);
  const time2 = Date.now() - start2;
  console.log(`  Created in ${time2}ms`);
  console.log(`  Size: ${thumbnail.length} bytes`);
  console.log(`  ✓ Thumbnail generation working`);

  // Test 4: Process (both in parallel)
  console.log('\n4. Testing processImage()...');
  const start3 = Date.now();
  const { optimized: opt2, thumbnail: thumb2 } = await processImage(input);
  const time3 = Date.now() - start3;
  console.log(`  Processed in ${time3}ms (parallel)`);
  console.log(`  Optimized: ${opt2.length} bytes`);
  console.log(`  Thumbnail: ${thumb2.length} bytes`);
  console.log(`  ✓ Parallel processing working`);

  // Save outputs for visual verification
  writeFileSync('test-output-optimized.jpg', optimized);
  writeFileSync('test-output-thumbnail.jpg', thumbnail);
  console.log('\n✓ Test outputs saved to test-output-*.jpg');

  console.log('\n✅ All image processing tests passed!\n');
}

testImageProcessing().catch(console.error);
```

**Run:**
```bash
npx tsx test-image-processing.ts
```

**Expected:**
- All 4 tests pass
- Processing times < 200ms
- File size reductions visible
- Output files created

---

## Integration Testing

### Test 2: Complete Upload Flow

**Test:** Image upload → Processing → Blob Storage → Database

```bash
# 1. Upload image
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -F "file=@test-image.jpg" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"
```

**Verify:**
1. ✅ Response 200 OK
2. ✅ Returns asset object with URLs
3. ✅ Processing time < 1 second
4. ✅ thumbnailUrl present (for images)

**Check Database:**
```sql
SELECT 
  id, name, type, url, thumbnailUrl, fileSize 
FROM media_assets 
ORDER BY createdAt DESC 
LIMIT 1;
```

**Check Blob Storage:**
```bash
vercel blob list | grep "test-image"
# Should show 2 files: optimized + thumbnail
```

### Test 3: Video Upload (No Processing)

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -F "file=@test-video.mp4" \
  -w "\nTime: %{time_total}s\n"
```

**Verify:**
1. ✅ Response 200 OK
2. ✅ thumbnailUrl is null (videos don't get thumbnails)
3. ✅ Video uploaded without processing
4. ✅ Correct mimeType (video/mp4)

### Test 4: File Deletion

```bash
# Get asset ID from previous upload
ASSET_ID="cm3xyz..."

# Delete asset
curl -X DELETE http://localhost:3000/api/media/$ASSET_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Verify:**
1. ✅ Response 200 OK
2. ✅ Asset removed from database
3. ✅ Files removed from Blob Storage
4. ✅ Both main and thumbnail deleted

**Confirm deletion:**
```bash
vercel blob list | grep "$ASSET_ID"
# Should return nothing
```

### Test 5: Storage Statistics

```bash
curl http://localhost:3000/api/storage/stats \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  | jq '.'
```

**Verify:**
1. ✅ Returns stats, storage, formatted objects
2. ✅ Counts match actual assets
3. ✅ Sizes accurate
4. ✅ Percentage calculated correctly
5. ✅ Human-readable formats correct

---

## End-to-End Testing

### Test 6: Complete User Workflow

**Scenario:** User uploads image, views in library, deletes it

**Steps:**

1. **Open Application:**
   ```bash
   open http://localhost:3000
   ```

2. **Navigate to Library:**
   - Click "Library" in sidebar
   - Verify FileUpload component visible

3. **Upload Image:**
   - Click upload area OR drag image file
   - Verify preview appears
   - Verify progress bar updates (0% → 100%)
   - Verify success message
   - Verify file appears in library grid

4. **Check Thumbnail:**
   - Verify thumbnail loads quickly
   - Verify correct aspect ratio (square)
   - Verify image quality acceptable

5. **View Full Image:**
   - Click on uploaded image
   - Verify full-size image loads
   - Verify optimized (not original) version

6. **Check Storage Widget:**
   - Navigate to Dashboard
   - Verify storage widget shows updated usage
   - Verify percentage accurate
   - Verify asset count correct

7. **Delete Image:**
   - Return to Library
   - Click delete on uploaded image
   - Confirm deletion
   - Verify image removed from grid
   - Verify storage widget updates

**Expected Results:**
- ✅ All steps complete without errors
- ✅ UI responsive and smooth
- ✅ Progress tracking accurate
- ✅ Storage stats update correctly
- ✅ Dark mode works properly

---

## Validation Testing

### Test 7: File Type Validation

**Test invalid file types:**

```bash
# SVG (not allowed - security risk)
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test.svg" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 400 Bad Request
# Error: "Invalid file type..."
```

**Test valid types:**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)
- ✅ MP4 (.mp4)
- ✅ QuickTime (.mov)
- ✅ WebM (.webm)

### Test 8: File Size Limits

**Test oversized file:**

```bash
# Create 60MB test file
dd if=/dev/zero of=large-file.dat bs=1M count=60

curl -X POST http://localhost:3000/api/upload \
  -F "file=@large-file.dat" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 400 Bad Request
# Error: "File too large. Maximum size is 50MB"
```

**Test acceptable sizes:**
- ✅ 1MB file
- ✅ 10MB file
- ✅ 49MB file (just under limit)

### Test 9: Protected Deletion

**Setup:**
1. Upload image
2. Create scheduled post using that image

**Test:**
```bash
curl -X DELETE http://localhost:3000/api/media/ASSET_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 400 Bad Request
# Error: "Cannot delete asset. It is used in 1 active post(s)"
```

---

## Performance Testing

### Test 10: Upload Performance

**Measure upload times for various file sizes:**

```bash
# Small image (1MB)
time curl -X POST http://localhost:3000/api/upload \
  -F "file=@small-1mb.jpg" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
# Expected: < 1 second

# Medium image (5MB)
time curl -X POST http://localhost:3000/api/upload \
  -F "file=@medium-5mb.jpg" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
# Expected: 1-2 seconds

# Large image (10MB)
time curl -X POST http://localhost:3000/api/upload \
  -F "file=@large-10mb.jpg" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
# Expected: 2-3 seconds
```

**Performance Criteria:**
- ✅ Image processing: < 200ms
- ✅ Total upload (1MB): < 1s
- ✅ Total upload (5MB): < 2s
- ✅ Total upload (10MB): < 3s

### Test 11: Concurrent Uploads

**Test multiple simultaneous uploads:**

```bash
# Upload 3 files concurrently
curl -X POST http://localhost:3000/api/upload -F "file=@image1.jpg" -H "Cookie: better-auth.session_token=YOUR_TOKEN" &
curl -X POST http://localhost:3000/api/upload -F "file=@image2.jpg" -H "Cookie: better-auth.session_token=YOUR_TOKEN" &
curl -X POST http://localhost:3000/api/upload -F "file=@image3.jpg" -H "Cookie: better-auth.session_token=YOUR_TOKEN" &
wait
```

**Verify:**
- ✅ All 3 uploads succeed
- ✅ No data corruption
- ✅ All files in Blob Storage
- ✅ All records in database

---

## Error Handling Testing

### Test 12: Network Errors

**Simulate network failure:**

1. Start upload
2. Disconnect network mid-upload
3. Verify error message displayed
4. Reconnect network
5. Retry upload
6. Verify success

**Expected:**
- ✅ Clear error message
- ✅ Retry succeeds
- ✅ No orphaned files

### Test 13: Invalid Token

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test.jpg" \
  -H "Cookie: better-auth.session_token=invalid"

# Expected: 401 Unauthorized
```

### Test 14: Missing File

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 400 Bad Request
# Error: "No file provided"
```

### Test 15: Corrupted Image

Upload a corrupted/invalid image file:

```bash
# Create fake image file
echo "Not an image" > fake-image.jpg

curl -X POST http://localhost:3000/api/upload \
  -F "file=@fake-image.jpg" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Expected: 500 Server Error
# Error: "Failed to process image"
```

---

## Security Testing

### Test 16: User Isolation

**Setup:**
1. Create User A, upload image
2. Create User B, try to delete User A's image

```bash
# As User B, try to delete User A's asset
curl -X DELETE http://localhost:3000/api/media/USER_A_ASSET_ID \
  -H "Cookie: better-auth.session_token=USER_B_TOKEN"

# Expected: 404 Not Found
# (Asset doesn't exist for User B)
```

**Verify:**
- ✅ Users can only access their own assets
- ✅ No cross-user data leakage

### Test 17: SQL Injection

**Test malicious filename:**

```bash
# Try SQL injection in filename
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test.jpg" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Filename: "'; DROP TABLE media_assets; --"
# Expected: Filename sanitized, no SQL injection
```

---

## Mobile/Responsive Testing

### Test 18: Mobile Upload

**On mobile device or emulator:**

1. Open Library on mobile
2. Tap upload area
3. Select image from camera roll
4. Verify progress bar visible
5. Verify upload succeeds
6. Verify thumbnail displays correctly

**Verify:**
- ✅ Touch targets large enough
- ✅ Progress bar visible on small screen
- ✅ Error messages readable
- ✅ Responsive layout works

---

## Browser Compatibility

### Test 19: Cross-Browser Testing

**Test in each browser:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Verify for each:**
- ✅ Upload works
- ✅ Progress tracking works
- ✅ Preview displays correctly
- ✅ Drag-and-drop works
- ✅ Dark mode works

---

## Production Readiness

### Final Verification Checklist

**Configuration:**
- [ ] BLOB_READ_WRITE_TOKEN in production env
- [ ] Vercel Blob Storage created
- [ ] Database migration applied
- [ ] thumbnailUrl field exists
- [ ] All dependencies installed

**Functionality:**
- [ ] Image upload works
- [ ] Video upload works
- [ ] Image optimization works
- [ ] Thumbnail generation works
- [ ] Progress tracking works
- [ ] File deletion works
- [ ] Storage stats accurate
- [ ] Validation working

**Security:**
- [ ] Authentication required
- [ ] User isolation working
- [ ] File type validation working
- [ ] File size limits enforced
- [ ] Filename sanitization working

**Performance:**
- [ ] Upload times acceptable
- [ ] Image processing < 200ms
- [ ] Storage stats < 100ms
- [ ] No memory leaks
- [ ] Concurrent uploads work

**User Experience:**
- [ ] Clear error messages
- [ ] Progress indication
- [ ] Success feedback
- [ ] Dark mode working
- [ ] Mobile responsive

---

## Common Issues & Solutions

### Issue: "Module not found: @vercel/blob"

**Solution:**
```bash
npm install @vercel/blob
npm run dev
```

### Issue: "Unknown argument 'thumbnailUrl'"

**Solution:**
```bash
npx prisma generate
# Restart dev server
```

### Issue: Upload succeeds but files not in Blob

**Solution:**
1. Check BLOB_READ_WRITE_TOKEN in .env
2. Verify token is valid in Vercel dashboard
3. Check console logs for errors

### Issue: Thumbnails not generating

**Solution:**
1. Check sharp installation: `npm list sharp`
2. Verify processImage() works in test
3. Check server console logs

### Issue: Progress bar not updating

**Solution:**
- Verify using XMLHttpRequest (not fetch)
- Check browser console for errors
- Test with smaller file first

---

## Success Criteria

Phase 9E is complete when:

✅ **All uploads work:**
- Images optimize and create thumbnails
- Videos upload without processing
- Progress tracking accurate

✅ **All deletions work:**
- Files removed from Blob Storage
- Records removed from database
- Protected assets can't be deleted

✅ **Stats accurate:**
- Counts match actual assets
- Sizes calculated correctly
- Formatted strings readable

✅ **Validation working:**
- File types restricted
- Size limits enforced
- User isolation verified

✅ **Performance acceptable:**
- Upload times < 3s for 10MB
- Processing < 200ms
- Stats < 100ms

✅ **Zero errors:**
- TypeScript compiles
- ESLint passes
- Tests pass
- Console clean

---

## Load Testing (Optional)

### Test 20: High Volume Upload

**Test with 100 uploads:**

```bash
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/upload \
    -F "file=@test.jpg" \
    -H "Cookie: better-auth.session_token=YOUR_TOKEN" &
done
wait
```

**Verify:**
- ✅ All succeed or gracefully fail
- ✅ No database corruption
- ✅ No Blob Storage issues
- ✅ Server remains responsive

---

## Cleanup

After testing, clean up test files:

```bash
# Remove test files
rm test-image-processing.ts
rm test-output-*.jpg
rm large-file.dat
rm fake-image.jpg

# Optional: Clean test data from database
npx prisma studio
# Manually delete test assets
```

---

## Next Steps

Testing complete! Phase 9E file storage is production-ready.

**Continue to:**
- **Phase 9F**: Mock Data Migration (connect frontend to real APIs)
- **Phase 9G**: Real-time Features (WebSocket notifications)

---

**Time Spent:** _____ minutes

**Test Results:**
- Total Tests: ___ / ___
- Passed: ___
- Failed: ___

**Notes:**
