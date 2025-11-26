# Phase 9F11: Team Management API

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Create API for team member management, migrating from `MOCK_TEAM` to real backend. This enables the Settings feature's Team tab with invitation system, role management, and collaboration features.

### What This Enables

- Invite team members via email
- Assign roles (admin, editor, viewer)
- Manage member permissions
- Remove team members
- Track invitation status
- Team collaboration on posts

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const MOCK_TEAM: TeamMember[] = [/* hardcoded */];

// TeamTab.tsx
const [team, setTeam] = useState(MOCK_TEAM);
```

### Target (Real API)
```typescript
// AppContext.tsx
const [team, setTeam] = useState<TeamMember[]>([]);
useEffect(() => {
  fetch('/api/team').then(res => res.json()).then(data => setTeam(data.members));
}, []);
```

---

## Database Schema

The TeamMember model already exists in Prisma schema:

```prisma
model TeamMember {
  id          String       @id @default(cuid())
  workspaceId String
  workspace   Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  userId      String?      // Null if invitation pending
  user        User?        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  email       String
  role        MemberRole   // admin, editor, viewer
  status      MemberStatus // active, invited, suspended
  
  invitedBy   String?
  invitedAt   DateTime     @default(now())
  joinedAt    DateTime?
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([workspaceId, email])
  @@index([workspaceId])
  @@index([userId])
  @@index([email])
  @@map("team_members")
}

enum MemberRole {
  admin
  editor
  viewer
}

enum MemberStatus {
  active
  invited
  suspended
}
```

**No migration needed** - schema already exists from Phase 9A.

---

## API Implementation

### Step 1: Create Team API Routes (35 min)

**File**: `src/app/api/team/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { MemberRole } from '@prisma/client';

/**
 * GET /api/team
 * List all team members for user's workspace
 */
export async function GET(_request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Get user's workspace (assuming each user has one workspace for now)
    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: { userId: user!.id },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({
        members: [],
        count: 0,
      });
    }

    return NextResponse.json({
      members: workspace.members,
      count: workspace.members.length,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team
 * Invite a new team member
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();

    // Validation schema
    const schema = z.object({
      email: z.string().email('Invalid email address'),
      role: z.enum(['admin', 'editor', 'viewer'] as const),
    });

    const validated = schema.parse(body);

    // Get user's workspace and verify admin role
    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: user!.id,
            role: 'admin', // Only admins can invite
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if email already invited
    const existing = await prisma.teamMember.findUnique({
      where: {
        workspaceId_email: {
          workspaceId: workspace.id,
          email: validated.email,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User already invited or is a member' },
        { status: 409 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    // Create team member
    const member = await prisma.teamMember.create({
      data: {
        workspaceId: workspace.id,
        email: validated.email,
        role: validated.role as MemberRole,
        status: existingUser ? 'active' : 'invited',
        userId: existingUser?.id,
        invitedBy: user!.id,
        joinedAt: existingUser ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send invitation email
    // await sendInvitationEmail(validated.email, workspace.name);

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error inviting team member:', error);
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}
```

**File**: `src/app/api/team/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { MemberRole } from '@prisma/client';

/**
 * PATCH /api/team/[id]
 * Update team member role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    // Validation schema
    const schema = z.object({
      role: z.enum(['admin', 'editor', 'viewer'] as const),
    });

    const validated = schema.parse(body);

    // Get member and verify permissions
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user!.id },
            },
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Check if requesting user is admin
    const requestingMember = member.workspace.members[0];
    if (!requestingMember || requestingMember.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update member roles' },
        { status: 403 }
      );
    }

    // Update role
    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        role: validated.role as MemberRole,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ member: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/team/[id]
 * Remove team member
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    // Get member and verify permissions
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user!.id },
            },
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Check if requesting user is admin
    const requestingMember = member.workspace.members[0];
    if (!requestingMember || requestingMember.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can remove team members' },
        { status: 403 }
      );
    }

    // Prevent removing last admin
    if (member.role === 'admin') {
      const adminCount = await prisma.teamMember.count({
        where: {
          workspaceId: member.workspaceId,
          role: 'admin',
          status: 'active',
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last admin' },
          { status: 400 }
        );
      }
    }

    // Delete member
    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}
```

---

### Step 2: Add to AppContext (10 min)

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Team
  team: TeamMember[];
  teamLoading: boolean;
  teamError: string | null;
  refetchTeam: () => Promise<void>;
}

export function AppContextProvider({ children, showToast, onOpenUpgrade }: AppProviderProps) {
  // ... existing state

  // Team state
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);

  // Fetch function
  const fetchTeam = useCallback(async () => {
    await fetchAPI<TeamMember[]>(
      '/api/team',
      setTeam,
      setTeamLoading,
      setTeamError,
      'members'
    );
  }, []);

  // Fetch on mount (optional - can lazy load when Settings opens)
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
    fetchAssets();
    fetchFolders();
    fetchLinks();
    fetchBioConfig();
    fetchLeads();
    // fetchTeam(); // Optional: only fetch when needed
  }, [fetchPosts, fetchAccounts, fetchAssets, fetchFolders, fetchLinks, fetchBioConfig, fetchLeads]);

  const value: AppContextType = {
    // ... existing values

    // Team
    team,
    teamLoading,
    teamError,
    refetchTeam: fetchTeam,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

### Step 3: Update Settings Component (10 min)

**File**: `src/features/settings/tabs/TeamTab.tsx`

Add loading/error states:

```typescript
export const TeamTab: React.FC<TeamTabProps> = () => {
  const { team, teamLoading, teamError, refetchTeam } = useAppContext();

  if (teamLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{teamError}</p>
        <button
          onClick={refetchTeam}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // Existing team management UI
};
```

---

## Testing

### API Testing

```bash
# List team members
curl -X GET http://localhost:3000/api/team \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Invite member
curl -X POST http://localhost:3000/api/team \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "email": "newmember@example.com",
    "role": "editor"
  }'

# Update role
curl -X PATCH http://localhost:3000/api/team/MEMBER_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"role": "viewer"}'

# Remove member
curl -X DELETE http://localhost:3000/api/team/MEMBER_ID \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

### Manual Testing Checklist

**1. Team Invitations**
- [ ] Invite new member (admin only)
- [ ] Verify email validation
- [ ] Test duplicate invitation
- [ ] Check invitation email sent

**2. Role Management**
- [ ] Update member role (admin only)
- [ ] Verify non-admins cannot change roles
- [ ] Test all role types (admin, editor, viewer)

**3. Member Removal**
- [ ] Remove team member (admin only)
- [ ] Verify last admin cannot be removed
- [ ] Check cascade deletion

**4. Permissions**
- [ ] Verify admin permissions
- [ ] Test editor permissions
- [ ] Test viewer permissions

---

## Cleanup

**Remove from constants.ts**:

```typescript
// DELETE this export
export const MOCK_TEAM = [/* ... */];
```

---

## Time Estimate

- **Step 1**: Create Team API - 35 min
- **Step 2**: Update AppContext - 10 min
- **Step 3**: Update Settings component - 10 min
- **Testing**: 10 min

**Total**: ~65 minutes (1 hour)

---

## Success Criteria

- [ ] GET /api/team returns workspace members
- [ ] POST /api/team invites new member
- [ ] PATCH /api/team/[id] updates role
- [ ] DELETE /api/team/[id] removes member
- [ ] Only admins can manage team
- [ ] Cannot remove last admin
- [ ] Email validation works
- [ ] Loading/error states work
- [ ] No MOCK_TEAM in codebase

---

## Next Steps

After completing this phase:
1. Continue to **phase9f12_products_integration.md** (Products Integration)
2. Implement email invitation system
3. Set up workspace creation flow

---

**Status**: Ready for implementation (~1 hour)
