# Phase 9F9: Lead Capture API

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Create API for lead capture from bio pages, migrating from `MOCK_LEADS` to real backend. This enables the LinkManager feature's Leads tab with email collection, source tracking, and CSV export.

### What This Enables

- Capture emails from bio page forms
- Track lead sources
- View all captured leads
- Export leads to CSV
- Filter by date range
- Integration ready for email services

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const MOCK_LEADS: Lead[] = [/* hardcoded */];

// LeadsTab.tsx
const [leads, setLeads] = useState(MOCK_LEADS);
```

### Target (Real API)
```typescript
// AppContext.tsx
const [leads, setLeads] = useState<Lead[]>([]);
useEffect(() => {
  fetch('/api/links/leads').then(res => res.json()).then(data => setLeads(data.leads));
}, []);

// LeadsTab.tsx
const { leads, leadsLoading } = useAppContext();
```

---

## Database Schema

The Lead model already exists in Prisma schema:

```prisma
model Lead {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  email     String
  source    String   // Where lead came from (e.g., "Bio Page - Newsletter")
  metadata  Json?    // Additional data (name, custom fields, etc.)
  
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
  @@map("leads")
}
```

**No migration needed** - schema already exists from Phase 9A.

---

## API Implementation

### Step 1: Create Leads API Routes (25 min)

**File**: `src/app/api/links/leads/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/links/leads
 * List all captured leads for authenticated user
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const source = searchParams.get('source'); // Filter by source
    const startDate = searchParams.get('startDate'); // Filter by date
    const endDate = searchParams.get('endDate');

    const where: any = { userId: user!.id };

    if (source) {
      where.source = source;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      leads,
      count: leads.length,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/links/leads
 * Capture a new lead (public endpoint, no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation schema
    const schema = z.object({
      email: z.string().email('Invalid email address'),
      source: z.string().min(1, 'Source is required'),
      username: z.string().min(1, 'Username is required'), // Bio page username
      metadata: z.record(z.any()).optional(), // Optional custom fields
    });

    const validated = schema.parse(body);

    // Find user by bio page username
    const bioPage = await prisma.bioPage.findUnique({
      where: { username: validated.username },
      select: { userId: true, enableLeadCapture: true },
    });

    if (!bioPage) {
      return NextResponse.json(
        { error: 'Bio page not found' },
        { status: 404 }
      );
    }

    if (!bioPage.enableLeadCapture) {
      return NextResponse.json(
        { error: 'Lead capture is disabled for this page' },
        { status: 403 }
      );
    }

    // Check for duplicate email (optional, can allow duplicates)
    const existing = await prisma.lead.findFirst({
      where: {
        userId: bioPage.userId,
        email: validated.email,
      },
    });

    if (existing) {
      // Return success anyway (don't reveal if email already exists)
      return NextResponse.json(
        { success: true, message: 'Thanks for subscribing!' },
        { status: 200 }
      );
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        email: validated.email,
        source: validated.source,
        metadata: validated.metadata as any,
        userId: bioPage.userId,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Thanks for subscribing!', leadId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error capturing lead:', error);
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}
```

**File**: `src/app/api/links/leads/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/links/leads/[id]
 * Delete a specific lead
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    // Verify ownership
    const lead = await prisma.lead.findFirst({
      where: { id, userId: user!.id },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Delete lead
    await prisma.lead.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
```

---

### Step 2: CSV Export Endpoint (15 min)

**File**: `src/app/api/links/leads/export/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/links/leads/export
 * Export leads as CSV
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { userId: user!.id };

    if (source) {
      where.source = source;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Generate CSV
    const csvHeader = 'Email,Source,Captured At\n';
    const csvRows = leads
      .map((lead) => {
        const date = new Date(lead.createdAt).toISOString();
        return `${lead.email},${lead.source},${date}`;
      })
      .join('\n');

    const csv = csvHeader + csvRows;

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
```

---

### Step 3: Update Bio Page Form (10 min)

Update the public bio page to submit leads to the API.

**File**: `src/app/bio/[username]/page.tsx` (Update form section)

```typescript
'use client';

import { useState } from 'react';

function LeadCaptureForm({ username, text }: { username: string; text: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/links/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'Bio Page - Newsletter',
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
      <h3 className="font-semibold mb-2">{text || 'Stay Updated'}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder:text-white/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {message && (
          <p className="text-sm text-center">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
```

---

### Step 4: Add to AppContext (10 min)

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Leads
  leads: Lead[];
  leadsLoading: boolean;
  leadsError: string | null;
  refetchLeads: () => Promise<void>;
}

export function AppContextProvider({ children, showToast, onOpenUpgrade }: AppProviderProps) {
  // ... existing state

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  // Fetch function
  const fetchLeads = useCallback(async () => {
    await fetchAPI<Lead[]>(
      '/api/links/leads',
      setLeads,
      setLeadsLoading,
      setLeadsError,
      'leads'
    );
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    fetchAssets();
    fetchFolders();
    fetchLinks();
    fetchBioConfig();
    fetchLeads();
  }, [fetchPosts, fetchAccounts, fetchAssets, fetchFolders, fetchLinks, fetchBioConfig, fetchLeads]);

  const value: AppContextType = {
    // ... existing values

    // Leads
    leads,
    leadsLoading,
    leadsError,
    refetchLeads: fetchLeads,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

### Step 5: Update LinkManager Component (5 min)

**File**: `src/features/linkmanager/tabs/LeadsTab.tsx`

Add loading/error states:

```typescript
export const LeadsTab: React.FC<LeadsTabProps> = ({ leads }) => {
  const { leadsLoading, leadsError, refetchLeads } = useAppContext();

  const handleExport = async () => {
    window.location.href = '/api/links/leads/export';
  };

  if (leadsLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (leadsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{leadsError}</p>
        <button
          onClick={refetchLeads}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          No leads captured yet. Enable lead capture on your bio page!
        </p>
      </div>
    );
  }

  // Existing leads table with export button
};
```

---

## Testing

### API Testing

```bash
# List leads
curl -X GET http://localhost:3000/api/links/leads \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Capture lead (public, no auth)
curl -X POST http://localhost:3000/api/links/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "source": "Bio Page - Newsletter",
    "username": "alexcreator"
  }'

# Delete lead
curl -X DELETE http://localhost:3000/api/links/leads/LEAD_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Export CSV
curl -X GET http://localhost:3000/api/links/leads/export \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -o leads.csv
```

### Manual Testing Checklist

**1. Lead Capture**
- [ ] Submit form on bio page
- [ ] Verify lead appears in dashboard
- [ ] Test with invalid email
- [ ] Test duplicate email handling

**2. Lead Management**
- [ ] View all leads
- [ ] Filter by source
- [ ] Filter by date range
- [ ] Delete individual lead
- [ ] Export to CSV

**3. Data Validation**
- [ ] Email validation works
- [ ] Source tracking correct
- [ ] Timestamps accurate
- [ ] User isolation working

---

## Cleanup

**Remove from constants.ts**:

```typescript
// DELETE this export
export const MOCK_LEADS = [/* ... */];
```

**Remove unused imports**:

```typescript
// In LinkManager.tsx, remove:
import { MOCK_LEADS } from '@/utils/constants';
```

---

## Time Estimate

- **Step 1**: Create Leads API - 25 min
- **Step 2**: CSV export endpoint - 15 min
- **Step 3**: Update bio page form - 10 min
- **Step 4**: Update AppContext - 10 min
- **Step 5**: Update LinkManager component - 5 min
- **Testing**: 10 min

**Total**: ~75 minutes (1.25 hours)

---

## Success Criteria

- [ ] GET /api/links/leads returns user's leads
- [ ] POST /api/links/leads captures new lead (public)
- [ ] DELETE /api/links/leads/[id] removes lead
- [ ] GET /api/links/leads/export returns CSV
- [ ] Bio page form submits leads
- [ ] Email validation works
- [ ] Duplicate handling correct
- [ ] CSV export functional
- [ ] Loading/error states work
- [ ] Date filtering works
- [ ] Source tracking accurate
- [ ] Users only see their own leads
- [ ] No MOCK_LEADS in codebase

---

## Optional Enhancements

### Email Service Integration

Integrate with Mailchimp, SendGrid, or ConvertKit:

```typescript
// After capturing lead, send to email service
await fetch('https://api.mailchimp.com/3.0/lists/LIST_ID/members', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email_address: lead.email,
    status: 'subscribed',
  }),
});
```

---

## Next Steps

After completing this phase:
1. Continue to **phase9f10_inbox_apis.md** (Inbox Messages & Listening)
2. Update progress.md with completion
3. Test lead capture flow end-to-end

---

**Status**: Ready for implementation (~1.25 hours)
