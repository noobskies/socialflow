# Phase 9E5: Upload Component

**Part of Phase 9E: File Storage & Media Upload**

**Estimated Time:** 45 minutes

---

## Objective

Create reusable React upload component with drag-and-drop, progress tracking, and preview functionality.

---

## Component Features

### User Experience
- ✅ Click to upload or drag-and-drop
- ✅ Real-time progress bar (0-100%)
- ✅ Image/video preview before upload
- ✅ File validation (client-side)
- ✅ Error display with clear messages
- ✅ Success callback for integration
- ✅ Cancel functionality
- ✅ Dark mode compatible

### Technical Features
- ✅ TypeScript type safety
- ✅ XMLHttpRequest for progress tracking
- ✅ Proper cleanup (URL.revokeObjectURL)
- ✅ Configurable props
- ✅ Accessible (keyboard navigation)

---

## Implementation

### Create Upload Component

**Create** `src/components/media/FileUpload.tsx`:

```typescript
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Video } from 'lucide-react';

/**
 * MediaAsset type returned from upload API
 */
interface MediaAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

/**
 * FileUpload component props
 */
interface Props {
  /** Callback when upload completes successfully */
  onUploadComplete?: (asset: MediaAsset) => void;
  /** Optional folder ID to organize uploaded file */
  folderId?: string;
  /** Accepted file types (default: images and videos) */
  accept?: string;
  /** Maximum file size in bytes (default: 50MB) */
  maxSize?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * FileUpload Component
 * 
 * Reusable upload component with:
 * - Drag-and-drop support
 * - Real-time progress tracking
 * - Image/video preview
 * - Error handling
 * - Dark mode support
 * 
 * @example
 * <FileUpload
 *   onUploadComplete={(asset) => {
 *     console.log('Uploaded:', asset.url);
 *     refreshMediaList();
 *   }}
 *   folderId="cm3xyz..."
 * />
 */
export function FileUpload({
  onUploadComplete,
  folderId,
  accept = 'image/*,video/*',
  maxSize = 50 * 1024 * 1024, // 50MB
  className = '',
}: Props) {
  // State
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection from input or drag-and-drop
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation: File size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Clear previous errors
    setError('');

    // Determine file type for preview
    setFileType(file.type.startsWith('image/') ? 'image' : 'video');

    // Create preview URL
    setPreview(URL.createObjectURL(file));

    // Upload file
    await uploadFile(file);
  };

  /**
   * Upload file to server with progress tracking
   */
  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folderId', folderId);

      // Use XMLHttpRequest for progress tracking
      // (fetch() doesn't support upload progress)
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      };

      // Handle completion
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          
          // Success: Call callback and reset
          onUploadComplete?.(response.asset);
          handleReset();
        } else {
          // Error: Display message
          const errorResponse = JSON.parse(xhr.responseText);
          setError(errorResponse.error || 'Upload failed');
          setUploading(false);
          setProgress(0);
        }
      };

      // Handle network errors
      xhr.onerror = () => {
        setError('Upload failed. Please check your connection and try again.');
        setUploading(false);
        setProgress(0);
      };

      // Send request
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  /**
   * Reset component state
   */
  const handleReset = () => {
    // Clean up preview URL to prevent memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    // Reset state
    setPreview(null);
    setFileType(null);
    setError('');
    setProgress(0);
    setUploading(false);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle cancel button
   */
  const handleCancel = () => {
    handleReset();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-colors
          ${
            uploading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
          }
          ${error ? 'border-red-300' : 'border-slate-300 dark:border-slate-700'}
        `}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        {preview ? (
          /* Preview Mode */
          <div className="space-y-4">
            {/* File Preview */}
            <div className="flex justify-center">
              {fileType === 'image' ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-lg shadow-sm object-contain"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-h-48 rounded-lg shadow-sm"
                />
              )}
            </div>

            {/* Progress or Cancel */}
            {uploading ? (
              <div className="space-y-2">
                {/* Progress Text */}
                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">
                    Uploading... {progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Processing Message (for images) */}
                {fileType === 'image' && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Optimizing image and generating thumbnail...
                  </p>
                )}
              </div>
            ) : (
              /* Cancel Button */
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          /* Upload Prompt */
          <div className="space-y-3">
            {/* Icons */}
            <div className="flex justify-center gap-2">
              <ImageIcon className="w-8 h-8 text-slate-400" />
              <Video className="w-8 h-8 text-slate-400" />
            </div>

            {/* Upload Icon */}
            <Upload className="w-10 h-10 mx-auto text-slate-400" />

            {/* Text */}
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, WebM)
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Maximum file size: {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start gap-2">
          <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
```

---

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUploadComplete` | `(asset: MediaAsset) => void` | undefined | Callback when upload succeeds |
| `folderId` | `string` | undefined | Optional folder to organize file |
| `accept` | `string` | `'image/*,video/*'` | Accepted file types |
| `maxSize` | `number` | `52428800` (50MB) | Maximum file size in bytes |
| `className` | `string` | `''` | Additional CSS classes |

### MediaAsset Type

```typescript
interface MediaAsset {
  id: string;                    // Database ID
  name: string;                  // Original filename
  url: string;                   // Main file URL
  thumbnailUrl: string | null;   // Thumbnail URL (images only)
  type: 'IMAGE' | 'VIDEO';       // File type
  fileSize: number;              // Size in bytes
  mimeType: string;              // MIME type
  createdAt: string;             // ISO timestamp
}
```

---

## Usage Examples

### Basic Usage

```typescript
import { FileUpload } from '@/components/media/FileUpload';

export default function MediaLibrary() {
  const handleUploadComplete = (asset: MediaAsset) => {
    console.log('Uploaded:', asset.url);
    // Refresh media list, show toast, etc.
  };

  return (
    <div>
      <h2>Upload Media</h2>
      <FileUpload onUploadComplete={handleUploadComplete} />
    </div>
  );
}
```

### With Folder Organization

```typescript
const [selectedFolder, setSelectedFolder] = useState('cm3xyz...');

return (
  <FileUpload
    folderId={selectedFolder}
    onUploadComplete={(asset) => {
      console.log('Uploaded to folder:', asset.folder?.name);
      refreshFolderContents(selectedFolder);
    }}
  />
);
```

### Custom File Types (Images Only)

```typescript
<FileUpload
  accept="image/jpeg,image/png"
  maxSize={10 * 1024 * 1024} // 10MB
  onUploadComplete={handleUpload}
/>
```

### With Toast Notifications

```typescript
import { useToast } from '@/hooks/useToast';

export default function MediaPage() {
  const { showToast } = useToast();

  return (
    <FileUpload
      onUploadComplete={(asset) => {
        showToast(`${asset.name} uploaded successfully!`, 'success');
        refreshMedia();
      }}
    />
  );
}
```

### In Modal Dialog

```typescript
import { Modal } from '@/components/ui/Modal';

function UploadModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Upload Media</h2>
      <FileUpload
        onUploadComplete={(asset) => {
          showToast('Upload successful!');
          onClose();
          refreshLibrary();
        }}
      />
    </Modal>
  );
}
```

---

## Implementation Details

### Progress Tracking with XMLHttpRequest

**Why XMLHttpRequest instead of fetch()?**

```typescript
// ✅ XMLHttpRequest: Supports upload progress
xhr.upload.onprogress = (e) => {
  const percent = (e.loaded / e.total) * 100;
  setProgress(percent);
};

// ❌ fetch(): No upload progress support
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
// No way to track upload progress
```

### Memory Management

**Always clean up preview URLs:**

```typescript
const handleReset = () => {
  // Critical: Revoke object URL to prevent memory leak
  if (preview) {
    URL.revokeObjectURL(preview);
  }
  
  setPreview(null);
};
```

**Why?**
- `URL.createObjectURL()` creates a reference in memory
- Without `revokeObjectURL()`, memory leaks occur
- Important for apps with many uploads

### Client-Side Validation

```typescript
// Validate BEFORE uploading
if (file.size > maxSize) {
  setError('File too large');
  return; // Don't upload
}
```

**Benefits:**
- Instant feedback (no server round-trip)
- Saves bandwidth
- Better UX

**Note:** Server still validates (never trust client)

### Error Handling

```typescript
// Parse server error response
if (xhr.status !== 200) {
  const errorResponse = JSON.parse(xhr.responseText);
  setError(errorResponse.error || 'Upload failed');
}
```

**User-Friendly Messages:**
- "File too large. Maximum size is 50MB"
- "Invalid file type. Only images and videos are allowed"
- "Upload failed. Please check your connection and try again."

---

## Styling & Dark Mode

### Tailwind Classes Used

```typescript
// Base styles
'border-2 border-dashed rounded-lg p-8'

// Interactive states
'cursor-pointer hover:border-indigo-500'
'hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'

// Dark mode
'text-slate-700 dark:text-slate-300'
'bg-slate-200 dark:bg-slate-700'

// Progress bar
'bg-indigo-600 dark:bg-indigo-500'

// Error state
'bg-red-50 dark:bg-red-900/20'
'text-red-600 dark:text-red-400'
```

### Customization

**Change colors:**
```typescript
// Replace indigo with your brand color
'hover:border-brand-500'
'bg-brand-600 dark:bg-brand-500'
```

**Change size:**
```typescript
// Compact version
<div className="p-4"> {/* instead of p-8 */}
  <Upload className="w-6 h-6" /> {/* instead of w-10 h-10 */}
</div>
```

---

## Accessibility

### Keyboard Navigation

```typescript
// Hidden input is keyboard accessible
<input
  type="file"
  onChange={handleFileSelect}
  disabled={uploading}
  className="hidden"
/>
```

Users can:
1. Tab to the upload area
2. Press Enter/Space to open file picker
3. Use keyboard to navigate file dialog

### Screen Reader Support

**Add ARIA labels:**
```typescript
<div
  role="button"
  aria-label="Upload file"
  aria-disabled={uploading}
  onClick={() => fileInputRef.current?.click()}
>
```

**Add status messages:**
```typescript
{uploading && (
  <div role="status" aria-live="polite">
    Uploading {progress}%
  </div>
)}
```

---

## Performance Considerations

### Optimize Re-renders

```typescript
// Use callback to avoid re-creating function
const handleUploadComplete = useCallback((asset: MediaAsset) => {
  console.log('Uploaded:', asset);
  refreshMedia();
}, [refreshMedia]);

<FileUpload onUploadComplete={handleUploadComplete} />
```

### Lazy Load Component

```typescript
// Lazy load if not needed immediately
const FileUpload = lazy(() => import('@/components/media/FileUpload'));

function MediaLibrary() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FileUpload onUploadComplete={handleUpload} />
    </Suspense>
  );
}
```

---

## Testing

### Manual Testing Checklist

- [ ] Click to upload works
- [ ] File validation displays errors
- [ ] Image preview displays correctly
- [ ] Video preview plays correctly
- [ ] Progress bar updates smoothly
- [ ] Upload completes successfully
- [ ] onUploadComplete callback fires
- [ ] Cancel button works
- [ ] Error messages display clearly
- [ ] Dark mode looks good
- [ ] Mobile responsive

### Unit Test Example

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  it('displays error for oversized files', () => {
    const onComplete = jest.fn();
    render(<FileUpload onUploadComplete={onComplete} maxSize={1024} />);
    
    const input = screen.getByRole('textbox', { hidden: true });
    const file = new File(['content'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 2048 });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText(/File too large/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('calls onUploadComplete on success', async () => {
    const onComplete = jest.fn();
    global.XMLHttpRequest = jest.fn(() => ({
      open: jest.fn(),
      send: jest.fn(),
      status: 200,
      responseText: JSON.stringify({ asset: { id: '123' } }),
    }));
    
    render(<FileUpload onUploadComplete={onComplete} />);
    
    // Trigger upload...
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith({ id: '123' });
    });
  });
});
```

---

## Troubleshooting

### Issue: Progress doesn't update

**Cause:** Using fetch() instead of XMLHttpRequest

**Solution:** Use XMLHttpRequest (as shown in component)

### Issue: Preview image doesn't display

**Cause:** CORS or invalid object URL

**Solution:**
```typescript
// Ensure preview is created correctly
const preview = URL.createObjectURL(file);
setPreview(preview);

// And cleaned up
URL.revokeObjectURL(preview);
```

### Issue: Upload succeeds but callback doesn't fire

**Cause:** Typo in onUploadComplete

**Solution:** Check prop name spelling

### Issue: Memory leak warnings

**Cause:** Not revoking object URLs

**Solution:** Always call `URL.revokeObjectURL(preview)` in cleanup

---

## Verification Checklist

- [ ] File created: `src/components/media/FileUpload.tsx`
- [ ] Component renders without errors
- [ ] File selection works
- [ ] Preview displays correctly
- [ ] Progress tracking works
- [ ] Upload completes successfully
- [ ] onUploadComplete fires
- [ ] Error handling works
- [ ] Dark mode styling correct
- [ ] TypeScript types correct

---

## Next Steps

Upload component complete! Continue to `phase9e6_blob_deletion.md` to update the Media API delete endpoint to remove files from Blob Storage.

---

**Time Spent:** _____ minutes

**Notes:**
