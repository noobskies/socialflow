# Phase 9F3: Accounts Migration & Testing

**Part of Phase 9F: Connect Frontend to Backend APIs**

---

## Objective

Verify that social accounts data flows correctly from database → API → Context → Components throughout features that display or manage platform connections.

---

## Features Using Accounts Data

1. **Dashboard** - Account health widget, connected platforms display
2. **Composer** - Platform selector (only show connected accounts)
3. **Settings** - Accounts tab (manage connections)
4. **Sidebar** - Account indicators
5. **Analytics** - Filter by platform

---

## Testing Social Accounts

### Step 1: Verify Accounts API

```bash
# Test Accounts API directly
curl http://localhost:3000/api/accounts \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"

# Expected response:
{
  "accounts": [
    {
      "id": "cm...",
      "platform": "TWITTER",
      "username": "@socialflow",
      "status": "CONNECTED",
      "accessToken": "[encrypted]",
      "expiresAt": "2024-..."
    },
    ...
  ],
  "count": 3
}
```

### Step 2: Update Dashboard Account Widget

```typescript
// src/features/dashboard/widgets/AccountHealth.tsx
import { useAppContext } from '@/app/_components/AppContext';

export const AccountHealth: React.FC = () => {
  const { accounts, accountsLoading, accountsError } = useAppContext();
  
  if (accountsLoading) {
    return <div className="animate-pulse">Loading accounts...</div>;
  }
  
  if (accountsError) {
    return <div className="text-red-500">Error: {accountsError}</div>;
  }
  
  const connectedCount = accounts.filter(a => a.status === 'CONNECTED').length;
  const totalCount = 7; // Total platforms available
  
  const healthPercentage = (connectedCount / totalCount) * 100;
  
  return (
    <div>
      <h3>Account Health</h3>
      <p>{connectedCount} of {totalCount} accounts connected</p>
      <div className="progress-bar">
        <div style={{ width: `${healthPercentage}%` }} />
      </div>
      
      {accounts.map(account => (
        <div key={account.id}>
          <span>{account.platform}</span>
          <span>{account.username}</span>
          <span className={
            account.status === 'CONNECTED' 
              ? 'text-green-500' 
              : 'text-red-500'
          }>
            {account.status}
          </span>
        </div>
      ))}
    </div>
  );
};
```

### Step 3: Update Composer Platform Selector

```typescript
// src/features/composer/components/PlatformSelector.tsx
import { useAppContext } from '@/app/_components/AppContext';

export const PlatformSelector: React.FC = () => {
  const { accounts, accountsLoading } = useAppContext();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  
  // Only show connected accounts
  const connectedAccounts = accounts.filter(a => a.status === 'CONNECTED');
  
  if (accountsLoading) {
    return <div>Loading platforms...</div>;
  }
  
  if (connectedAccounts.length === 0) {
    return (
      <div>
        <p>No accounts connected.</p>
        <a href="/settings/accounts">Connect Account</a>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {connectedAccounts.map(account => (
        <button
          key={account.id}
          onClick={() => togglePlatform(account.platform)}
          className={selectedPlatforms.includes(account.platform) 
            ? 'bg-blue-500' 
            : 'bg-gray-200'
          }
        >
          <PlatformIcon platform={account.platform} />
          <span>{account.platform}</span>
        </button>
      ))}
    </div>
  );
};
```

### Step 4: Update Settings Accounts Tab

```typescript
// src/features/settings/tabs/AccountsTab.tsx
import { useAppContext } from '@/app/_components/AppContext';

export const AccountsTab: React.FC = () => {
  const { 
    accounts, 
    accountsLoading, 
    accountsError, 
    refetchAccounts 
  } = useAppContext();
  
  const handleConnect = async (platform: Platform) => {
    // Redirect to OAuth flow
    window.location.href = `/api/oauth/${platform.toLowerCase()}/authorize`;
  };
  
  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to disconnect');
      
      // Refresh accounts
      await refetchAccounts();
      
      showToast('Account disconnected', 'success');
    } catch (error) {
      showToast('Failed to disconnect account', 'error');
    }
  };
  
  return (
    <div>
      <h2>Connected Accounts</h2>
      
      {accountsLoading ? (
        <div>Loading...</div>
      ) : accountsError ? (
        <div>Error: {accountsError}</div>
      ) : (
        <div className="space-y-4">
          {PLATFORMS.map(platform => {
            const account = accounts.find(a => a.platform === platform);
            const isConnected = account?.status === 'CONNECTED';
            
            return (
              <div key={platform} className="flex items-center justify-between p-4 border">
                <div>
                  <PlatformIcon platform={platform} />
                  <span className="font-medium">{platform}</span>
                  {account && (
                    <span className="text-sm text-gray-500">
                      {account.username}
                    </span>
                  )}
                </div>
                
                {isConnected ? (
                  <button 
                    onClick={() => handleDisconnect(account!.id)}
                    className="text-red-500"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect(platform)}
                    className="text-blue-500"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

---

## Testing Checklist

### Dashboard Tests

- [ ] AccountHealth widget shows correct connected count
- [ ] Account status indicators are accurate (green/red)
- [ ] All 7 platforms listed (even if not connected)
- [ ] Usernames display correctly for connected accounts
- [ ] Loading state displays smoothly
- [ ] Error state handles API failures

### Composer Tests

- [ ] Platform selector only shows connected accounts
- [ ] Disconnected platforms are hidden/disabled
- [ ] Selecting platform works correctly
- [ ] Warning shown if no accounts connected
- [ ] Link to settings if no accounts connected

### Settings Tests

- [ ] All 7 platforms listed in Accounts tab
- [ ] Connected accounts show "Disconnect" button
- [ ] Disconnected accounts show "Connect" button
- [ ] Connect button redirects to OAuth flow
- [ ] Disconnect removes account from list
- [ ] Refresh updates account status
- [ ] Toast notifications work

### OAuth Flow Tests

- [ ] Clicking "Connect" opens OAuth authorization page
- [ ] After authorization, redirected back to app
- [ ] Account appears as connected immediately
- [ ] Token stored in database (encrypted)
- [ ] Username/profile data fetched correctly

---

## Common Issues & Solutions

### Issue: Accounts not appearing

**Debug Steps**:
1. Check GET /api/accounts returns data
2. Verify userId filter in API route
3. Check database has SocialAccount records
4. Ensure user is authenticated

**Solution**:
```typescript
// Add logging
useEffect(() => {
  console.log('Accounts:', accounts);
  console.log('Loading:', accountsLoading);
  console.log('Error:', accountsError);
}, [accounts, accountsLoading, accountsError]);
```

### Issue: OAuth callback fails

**Cause**: Redirect URI mismatch or invalid state

**Solution**:
1. Verify redirect URI in platform developer portal
2. Check NEXT_PUBLIC_APP_URL environment variable
3. Verify state parameter in database
4. Check OAuth state hasn't expired (10 min limit)

### Issue: Token refresh not working

**Cause**: Refresh token expired or invalid

**Solution**:
```typescript
// Implement token refresh
const handleRefreshToken = async (accountId: string) => {
  try {
    const response = await fetch(`/api/oauth/${platform}/refresh`, {
      method: 'POST',
      body: JSON.stringify({ accountId }),
    });
    
    if (response.ok) {
      await refetchAccounts();
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
};
```

### Issue: Account status not updating

**Cause**: Context not refetching after mutation

**Solution**:
```typescript
// Always refetch after connect/disconnect
await handleConnect(platform);
await refetchAccounts(); // Force refresh

// OR use optimistic updates
setAccounts(prev => [...prev, newAccount]);
```

---

## OAuth Integration Testing

### Test Each Platform

For each of the 7 platforms, verify:

1. **Twitter/X**
   - [ ] Connect redirects to Twitter OAuth
   - [ ] Callback receives code and state
   - [ ] Access token stored
   - [ ] Username fetched from API
   - [ ] Token refreshes before expiry (2 hours)

2. **LinkedIn**
   - [ ] OpenID Connect flow works
   - [ ] Access token valid for 60 days
   - [ ] Profile data includes username
   - [ ] Refresh token works

3. **Instagram**
   - [ ] Business API authorization works
   - [ ] Long-lived token generated (60 days)
   - [ ] Username from Instagram Business Account
   - [ ] Token refreshes before expiry

4. **Facebook**
   - [ ] Page authorization works
   - [ ] Long-lived tokens generated
   - [ ] Page list fetched correctly
   - [ ] Page tokens stored separately

5. **TikTok**
   - [ ] PKCE flow works
   - [ ] Access token valid for 24 hours
   - [ ] Username fetched from API
   - [ ] Token refreshes automatically

6. **YouTube**
   - [ ] Google OAuth works
   - [ ] Access token valid for 1 hour
   - [ ] Channel name fetched
   - [ ] Refresh token works

7. **Pinterest**
   - [ ] OAuth flow works (pending app approval)
   - [ ] Access token valid for 30 days
   - [ ] Profile data fetched correctly

---

## Verification Commands

```bash
# 1. Check database has accounts
npx prisma studio
# Navigate to SocialAccount table

# 2. Test Accounts API
curl http://localhost:3000/api/accounts \
  -H "Cookie: better-auth.session_token=..."

# 3. Test OAuth authorization
curl http://localhost:3000/api/oauth/twitter/authorize

# 4. Check token encryption
# Tokens should be encrypted in database (not plain text)
```

---

## Security Verification

Ensure:

- [ ] Access tokens encrypted in database (AES-256-GCM)
- [ ] Refresh tokens encrypted separately
- [ ] State parameters expire after 10 minutes
- [ ] PKCE used for platforms that support it
- [ ] userId always filtered in queries
- [ ] OAuth state validated on callback
- [ ] HTTPS used for OAuth redirects (production)

---

## Success Criteria

Phase 9F3 is complete when:

- [ ] All connected accounts display correctly
- [ ] OAuth flows work for all 7 platforms
- [ ] Connect/disconnect updates UI immediately
- [ ] Token refresh works automatically
- [ ] Composer shows only connected platforms
- [ ] Settings allows account management
- [ ] No security vulnerabilities
- [ ] Error handling prevents crashes
- [ ] Multiple users see their own accounts only

---

## Next Steps

1. ✅ Accounts migration complete
2. → Continue to `phase9f4_bulk_migration.md` - Migrate remaining constants
3. → Continue to `phase9f5_testing.md` - Comprehensive testing

---

**Implementation Time**: ~30 minutes

**Status**: Accounts integration verified, ready for bulk migration
