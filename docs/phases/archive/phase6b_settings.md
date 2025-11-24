# Phase 6b: Settings Refactoring

## Current State Analysis

**File**: `components/Settings.tsx`  
**Lines**: 813 lines (LARGEST COMPONENT!)  
**Complexity**: Very High - 8 tabs, forms, team management, feature gating

### Problems

1. **Massive Monolith**: Single 813-line file handles 8 different settings sections
2. **Giant Switch Statement**: renderContent() switch with 8 cases (400+ lines)
3. **Mixed Concerns**: Forms, tables, toggles, feature gates, navigation all together
4. **Repeated Patterns**: Feature gate overlays duplicated 3 times
5. **State Explosion**: 7+ useState hooks for different concerns
6. **Hard to Navigate**: Difficult to find specific settings logic
7. **Testing Nightmare**: Tightly coupled, hard to isolate

### Current Structure

```typescript
Settings.tsx (813 lines)
├── Sidebar Navigation (8 tabs)
├── Profile Tab
│   ├── Avatar upload
│   ├── Profile form (name, email, bio)
│   └── Save button
├── Accounts Tab
│   ├── Connected accounts list
│   ├── Connection toggle logic
│   └── Add account button
├── Team Tab (Agency only)
│   ├── Feature gate overlay
│   ├── Team members table
│   ├── Role dropdowns
│   └── Invite member action
├── Billing Tab
│   ├── Current plan card
│   ├── Payment method card
│   └── Change plan button
├── Notifications Tab
│   ├── 6 notification toggles
│   └── Toggle handlers
├── Security Tab
│   ├── 2FA toggle
│   ├── SSO config (enterprise)
│   ├── Audit log table
│   └── Sign out all devices
├── Branding Tab (Agency only)
│   ├── Feature gate overlay
│   └── White-label settings form
└── Developer Tab (Agency only)
    ├── Feature gate overlay
    └── API keys management
```

## Goals

1. **Break Down Massive Monolith**: Extract 8 tab components + shared widgets
2. **Apply Orchestrator Pattern**: Main Settings.tsx becomes ~150-line coordinator
3. **Extract Custom Hook**: Create `useSettings` for state management
4. **Reuse Components**: Import FeatureGateOverlay from Analytics
5. **Better Organization**: Move to `/src/features/settings/`
6. **Move Mock Data**: Centralize team, audit log data
7. **Maintain Functionality**: Zero regression, all features work

## Component Breakdown

### Files to Create (19 total)

#### Core (3 files)
1. **Settings.tsx** - Main orchestrator (~150 lines)
2. **useSettings.ts** - Custom hook for state management
3. **SettingsSidebar.tsx** - Navigation sidebar with 8 tabs

#### Tabs (8 files)
4. **ProfileTab.tsx** - Profile settings with avatar, form
5. **AccountsTab.tsx** - Social account connections
6. **TeamTab.tsx** - Team member management (agency)
7. **BillingTab.tsx** - Plan and payment info
8. **NotificationsTab.tsx** - Notification preferences
9. **SecurityTab.tsx** - 2FA, SSO, audit log
10. **BrandingTab.tsx** - White-label settings (agency)
11. **DeveloperTab.tsx** - API keys (agency)

#### Widgets (8 files)
12. **AccountCard.tsx** - Individual account connection card
13. **TeamMemberRow.tsx** - Team member table row
14. **NotificationToggle.tsx** - Reusable toggle switch
15. **PlanCard.tsx** - Current plan display card
16. **PaymentMethodCard.tsx** - Payment method display
17. **SecurityToggle.tsx** - 2FA/SSO toggle card
18. **AuditLogTable.tsx** - Security audit log
19. **TabLockIcon.tsx** - Lock icon for locked tabs

## File Structure

```
/src/features/settings/
├── Settings.tsx           # Orchestrator (~150 lines)
├── useSettings.ts         # Custom hook
├── SettingsSidebar.tsx    # Navigation sidebar
│
├── tabs/
│   ├── ProfileTab.tsx
│   ├── AccountsTab.tsx
│   ├── TeamTab.tsx
│   ├── BillingTab.tsx
│   ├── NotificationsTab.tsx
│   ├── SecurityTab.tsx
│   ├── BrandingTab.tsx
│   └── DeveloperTab.tsx
│
└── widgets/
    ├── AccountCard.tsx
    ├── TeamMemberRow.tsx
    ├── NotificationToggle.tsx
    ├── PlanCard.tsx
    ├── PaymentMethodCard.tsx
    ├── SecurityToggle.tsx
    ├── AuditLogTable.tsx
    └── TabLockIcon.tsx
```

## Implementation Plan

### Sub-Phase 6b-A: Foundation (Core Structure)

**Goal**: Set up orchestrator, sidebar, and hook

**Steps**:
1. Create `/src/features/settings/` directory
2. Create `useSettings.ts` custom hook
   - Extract activeTab state
   - Extract team state
   - Extract notifications state
   - Extract security state
   - Extract connectingId state (for loading)
   - Extract save handlers
3. Create `SettingsSidebar.tsx`
   - 8 navigation buttons
   - Active state styling
   - Lock icons for agency features
   - Props: activeTab, onTabChange, userPlan
4. Create `Settings.tsx` orchestrator
   - Import and use `useSettings`
   - Render SettingsSidebar
   - Conditional tab rendering

**Files Created**: 3  
**Expected Result**: Navigation working, tabs switching

---

### Sub-Phase 6b-B: Profile, Accounts, Billing Tabs

**Goal**: Extract simple form/display tabs

**Steps**:
1. Create `tabs/ProfileTab.tsx`
   - Avatar upload section
   - Profile form (name, email, bio)
   - Save button with callback
   - Props: onSave, showToast
2. Create `tabs/AccountsTab.tsx`
   - Header with "Add Account" button
   - Map over accounts array
   - Render AccountCard for each
   - Props: accounts, onToggleConnection, connectingId
3. Create `widgets/AccountCard.tsx`
   - Platform icon/color
   - Connection status badge
   - Connect/Disconnect button
   - Loading state
   - Props: account, onToggle, isConnecting
4. Create `tabs/BillingTab.tsx`
   - PlanCard component
   - PaymentMethodCard component
   - Props: userPlan, onOpenUpgrade
5. Create `widgets/PlanCard.tsx`
   - Gradient header with plan name
   - Change plan button
6. Create `widgets/PaymentMethodCard.tsx`
   - Card display (Visa ending in...)
   - Edit button

**Files Created**: 6  
**Expected Result**: Profile, Accounts, Billing tabs working

---

### Sub-Phase 6b-C: Notifications & Security Tabs

**Goal**: Extract toggle-heavy tabs

**Steps**:
1. Create `tabs/NotificationsTab.tsx`
   - List of notification preferences
   - NotificationToggle for each setting
   - Props: notifications, onToggleNotification
2. Create `widgets/NotificationToggle.tsx`
   - Label and description
   - Toggle switch component
   - Props: title, description, enabled, onToggle
3. Create `tabs/SecurityTab.tsx`
   - SecurityToggle for 2FA
   - SecurityToggle for SSO (disabled, enterprise badge)
   - AuditLogTable component
   - "Sign out all devices" button
   - Props: security, onToggleSecurity
4. Create `widgets/SecurityToggle.tsx`
   - Icon, title, description
   - Toggle switch or disabled button
   - Props: icon, title, description, enabled, onToggle, locked, badge
5. Create `widgets/AuditLogTable.tsx`
   - Table with audit log entries
   - Props: logs (array of audit events)

**Files Created**: 5  
**Expected Result**: Notifications and Security tabs working

---

### Sub-Phase 6b-D: Team, Branding, Developer Tabs (Agency Features)

**Goal**: Extract agency-only features with gates

**Steps**:
1. Create `tabs/TeamTab.tsx`
   - Import FeatureGateOverlay from analytics
   - Conditional render based on userPlan
   - Team members table
   - Invite member button
   - Props: userPlan, onOpenUpgrade, team, onUpdateTeam
2. Create `widgets/TeamMemberRow.tsx`
   - Avatar, name, email
   - Role dropdown
   - Status badge
   - Delete button
   - Props: member, onUpdateRole, onDelete
3. Create `tabs/BrandingTab.tsx`
   - Import FeatureGateOverlay from analytics
   - Conditional render based on userPlan
   - Branding form fields (faded when locked)
   - Props: userPlan, onOpenUpgrade, branding, setBranding
4. Create `tabs/DeveloperTab.tsx`
   - Import FeatureGateOverlay from analytics
   - Conditional render based on userPlan
   - API keys section (faded when locked)
   - Props: userPlan, onOpenUpgrade
5. Create `widgets/TabLockIcon.tsx`
   - Simple Lock icon component for sidebar
   - Props: none (just renders icon)

**Files Created**: 5  
**Expected Result**: All 8 tabs working, feature gates functional

---

### Sub-Phase 6b-E: Integration & Cleanup

**Goal**: Polish, verify, and update imports

**Steps**:
1. Update `components/Settings.tsx` (legacy) imports in `App.tsx`
   - Change to `/src/features/settings/Settings`
2. Move mock data to `/src/utils/constants.ts`
   - MOCK_TEAM
   - MOCK_AUDIT_LOG
3. Update imports in new Settings components to use path aliases
4. Verify TypeScript compilation (0 errors)
5. Test all 8 tabs
6. Test account connection flow (loading states)
7. Test team management (role changes, invite)
8. Test notification toggles
9. Test security toggles
10. Test feature gating (free vs agency)
11. Verify dark mode appearance
12. Test responsive layouts

**Files Modified**: 2  
**Expected Result**: Settings fully refactored, all features working

## Implementation Details

### useSettings Hook Pattern

```typescript
// /src/features/settings/useSettings.ts
import { useState } from 'react';
import { TeamMember, SocialAccount } from '@/types';
import { MOCK_TEAM } from '@/utils/constants';

type SettingsTab = 'profile' | 'accounts' | 'team' | 'billing' | 'notifications' | 'security' | 'branding' | 'developer';

interface NotificationSettings {
  emailDigest: boolean;
  postSuccess: boolean;
  postFailure: boolean;
  mentions: boolean;
  newFollowers: boolean;
  marketing: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  sso: boolean;
}

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailDigest: true,
    postSuccess: true,
    postFailure: true,
    mentions: true,
    newFollowers: false,
    marketing: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    sso: false,
  });

  const handleToggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleSecurity = (key: keyof SecuritySettings) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    activeTab,
    setActiveTab,
    team,
    setTeam,
    connectingId,
    setConnectingId,
    notifications,
    handleToggleNotification,
    security,
    handleToggleSecurity,
  };
}
```

### Settings Orchestrator Pattern

```typescript
// /src/features/settings/Settings.tsx
import React from 'react';
import { useSettings } from './useSettings';
import { SettingsSidebar } from './SettingsSidebar';
import { ProfileTab } from './tabs/ProfileTab';
import { AccountsTab } from './tabs/AccountsTab';
import { TeamTab } from './tabs/TeamTab';
import { BillingTab } from './tabs/BillingTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { SecurityTab } from './tabs/SecurityTab';
import { BrandingTab } from './tabs/BrandingTab';
import { DeveloperTab } from './tabs/DeveloperTab';
import { SettingsProps } from '@/types';

export const Settings: React.FC<SettingsProps> = ({
  showToast,
  branding,
  setBranding,
  userPlan,
  onOpenUpgrade,
  accounts,
  onToggleConnection,
}) => {
  const settings = useSettings();

  const handleSave = (section: string) => {
    showToast(`${section} saved successfully!`, 'success');
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-8 h-full">
        <SettingsSidebar
          activeTab={settings.activeTab}
          onTabChange={settings.setActiveTab}
          userPlan={userPlan}
        />

        <div className="flex-1 min-w-0 overflow-y-auto pb-20">
          {settings.activeTab === 'profile' && (
            <ProfileTab onSave={handleSave} showToast={showToast} />
          )}

          {settings.activeTab === 'accounts' && (
            <AccountsTab
              accounts={accounts}
              onToggleConnection={onToggleConnection}
              connectingId={settings.connectingId}
              setConnectingId={settings.setConnectingId}
              showToast={showToast}
            />
          )}

          {settings.activeTab === 'team' && (
            <TeamTab
              userPlan={userPlan}
              onOpenUpgrade={onOpenUpgrade}
              team={settings.team}
              setTeam={settings.setTeam}
            />
          )}

          {settings.activeTab === 'billing' && (
            <BillingTab userPlan={userPlan} onOpenUpgrade={onOpenUpgrade} />
          )}

          {settings.activeTab === 'notifications' && (
            <NotificationsTab
              notifications={settings.notifications}
              onToggleNotification={settings.handleToggleNotification}
            />
          )}

          {settings.activeTab === 'security' && (
            <SecurityTab
              security={settings.security}
              onToggleSecurity={settings.handleToggleSecurity}
            />
          )}

          {settings.activeTab === 'branding' && (
            <BrandingTab
              userPlan={userPlan}
              onOpenUpgrade={onOpenUpgrade}
              branding={branding}
              setBranding={setBranding}
            />
          )}

          {settings.activeTab === 'developer' && (
            <DeveloperTab userPlan={userPlan} onOpenUpgrade={onOpenUpgrade} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
```

### SettingsSidebar Pattern

```typescript
// /src/features/settings/SettingsSidebar.tsx
import React from 'react';
import { User, Share2, Users, CreditCard, Bell, Shield, Palette, Code, Lock } from 'lucide-react';
import { PlanTier } from '@/types';

type SettingsTab = 'profile' | 'accounts' | 'team' | 'billing' | 'notifications' | 'security' | 'branding' | 'developer';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  userPlan: PlanTier;
}

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'accounts', label: 'Social Accounts', icon: Share2 },
  { id: 'team', label: 'Team Members', icon: Users, requiresAgency: true },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Login', icon: Shield },
  { id: 'branding', label: 'Branding', icon: Palette, requiresAgency: true },
  { id: 'developer', label: 'Developer API', icon: Code, requiresAgency: true },
] as const;

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange,
  userPlan,
}) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isLocked = item.requiresAgency && userPlan !== 'agency';

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as SettingsTab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </div>
              {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
```

### NotificationToggle Pattern (Reusable)

```typescript
// /src/features/settings/widgets/NotificationToggle.tsx
import React from 'react';

interface NotificationToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  enabled,
  onToggle,
}) => {
  return (
    <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          {description}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
```

## Verification Steps

After each sub-phase:

1. **TypeScript Compilation**: Run `npm run type-check` - must pass with 0 errors
2. **Dev Server**: Run `npm run dev` - must start without errors
3. **Visual Verification**: Navigate to Settings page
4. **Tab Navigation**: Click through all 8 tabs
5. **Forms**: Test profile form, verify save action
6. **Account Connections**: Test connect/disconnect flow, verify loading states
7. **Team Management**: Test role changes, invite action (agency plan)
8. **Toggles**: Test all notification and security toggles
9. **Feature Gating**: Test with free/pro/agency plans
10. **Dark Mode**: Toggle theme, verify all tabs adapt
11. **Responsive**: Test mobile layout (sidebar collapses)

## Success Metrics

### Before (Phase 6b Start)
- **Main File**: 813 lines (largest component!)
- **Total Files**: 1
- **Components**: All inline, giant switch statement
- **Reusability**: None (everything custom per tab)
- **Testability**: Very difficult
- **Navigation**: Hardcoded in render function

### After (Phase 6b Complete)
- **Main File**: ~150 lines (-82%)
- **Total Files**: 19 (+18)
- **Components**: 18 extracted, focused components
- **Reusability**: High (NotificationToggle, AccountCard, etc.)
- **Testability**: Easy (each component isolated)
- **Navigation**: Clean SettingsSidebar component
- **Organization**: Professional `/src/features/settings/` structure

### Quality Gates
- ✅ TypeScript: 0 compilation errors
- ✅ ESLint: No new warnings
- ✅ Functionality: All 8 tabs work perfectly
- ✅ Forms: All save actions functional
- ✅ Toggles: All switches working
- ✅ Loading States: Connection flow smooth
- ✅ Feature Gates: Properly enforced
- ✅ Dark Mode: Fully supported
- ✅ Responsive: Mobile/tablet/desktop

## Dependencies

### Existing Packages
- `lucide-react` - Already installed
- All custom types from `@/types`

### Reused Components
- `FeatureGateOverlay` - Imported from `/src/features/analytics/widgets/`

### No New Dependencies Required
- Uses existing UI patterns
- Leverages current design system

## Migration Notes

### For Other Developers

1. **Import Change**: Update `App.tsx` import from `./components/Settings` to `@/features/settings/Settings`
2. **Mock Data**: MOCK_TEAM and MOCK_AUDIT_LOG moved to `/src/utils/constants.ts`
3. **Reused Component**: FeatureGateOverlay imported from analytics feature
4. **Props Interface**: No changes to Settings component props

### Backwards Compatibility

- ✅ Component API unchanged
- ✅ All props remain the same
- ✅ Visual appearance identical
- ✅ User experience unchanged

## Next Steps

After Phase 6b completion:
1. Commit changes: "Phase 6b: Complete Settings refactoring"
2. Update `progress.md` with metrics
3. Proceed to **Phase 6c: Calendar Refactoring**
