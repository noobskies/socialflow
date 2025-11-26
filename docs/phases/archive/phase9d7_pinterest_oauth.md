# Phase 9D-7: Pinterest OAuth Integration

## Overview

Implement OAuth 2.0 authentication for Pinterest, enabling users to connect their Pinterest accounts for creating pins and accessing analytics.

**Estimated Time**: 60-75 minutes
**Dependencies**: Phase 9D-1 complete (infrastructure built)
**Difficulty**: Easy-Medium

---

## Prerequisites

### Required Credentials
- Pinterest Developer Account
- Pinterest App with approved API access
- App ID and App Secret

### Developer Portal Setup

1. **Visit Pinterest Developers**
   - Go to https://developers.pinterest.com/
   - Sign in with your Pinterest account

2. **Create a New App**
   - Click "My apps" → "Create app"
   - **App name**: "SocialFlow"
   - **App description**: "AI-powered social media management platform"
   - Agree to terms
   - Click "Create"

3. **Configure App Settings**
   - Go to your app dashboard
   - Add **Redirect URI**: `http://localhost:3000/api/oauth/pinterest/callback`
   - For production: `https://yourdomain.com/api/oauth/pinterest/callback`
   - Save changes

4. **Request API Access**
   - Fill out the API access request form
   - Provide use case details
   - Wait for approval (typically 1-3 days)

5. **Get Credentials**
   - Go to app dashboard
   - Copy **App ID** (save to .env as PINTEREST_APP_ID)
   - Copy **App secret** (save to .env as PINTEREST_APP_SECRET)
   - Keep these secure!

### Environment Variables

Add to `.env`:

```bash
# Pinterest OAuth
PINTEREST_APP_ID=your_pinterest_app_id_here
PINTEREST_APP_SECRET=your_pinterest_app_secret_here
```

### Required Scopes

```typescript
scopes: [
  'user_accounts:read',       // Read user account info
  'boards:read',              // Read boards
  'boards:write',             // Create/manage boards
  'pins:read',                // Read pins
  'pins:write'                // Create pins
]
```

**Scope Explanations**:
- `user_accounts:read` - Access to basic user account information
- `boards:read` - Read user's boards and their details
- `boards:write` - Create and manage boards
- `pins:read` - Read user's pins
- `pins:write` - Create pins on behalf of user

### Platform-Specific Notes

- **PKCE Support**: Recommended (code verifier/challenge)
- **Token Lifetime**: Access tokens expire in 30 days
- **Refresh Tokens**: Provided, valid until revoked
- **Rate Limits**:
  - 1000 API calls per hour per user
  - 200 pins per day per user
- **Special Requirements**:
  - API access requires approval
  - Must comply with Pinterest Brand Guidelines

---

## Implementation Plan

### Files to Create

1. **OAuth Service**: `src/lib/oauth/pinterest-oauth-service.ts`
2. **Authorization Route**: `src/app/api/oauth/pinterest/authorize/route.ts`
3. **Callback Route**: `src/app/api/oauth/pinterest/callback/route.ts`
4. **Refresh Route**: `src/app/api/oauth/pinterest/refresh/route.ts`
5. **Disconnect Route**: `src/app/api/oauth/pinterest/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Create Pinterest OAuth Service (35-45 min)

**File**: `src/lib/oauth/pinterest-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class PinterestOAuthService extends BaseOAuthService {
  platform = Platform.PINTEREST;
  authorizationUrl = 'https://www.pinterest.com/oauth/';
  tokenUrl = 'https://api.pinterest.com/v5/oauth/token';
  profileUrl = 'https://api.pinterest.com/v5/user_account';
  scopes = [
    'user_accounts:read',
    'boards:read',
    'boards:write',
    'pins:read',
    'pins:write'
  ];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/pinterest/callback`;

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${this.getClientId()}:${this.getClientSecret()}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Pinterest token exchange failed:', error);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(this.profileUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Pinterest profile fetch failed:', error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.username || data.id,
      username: data.username,
      displayName: data.username,
      avatar: data.profile_image,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${this.getClientId()}:${this.getClientSecret()}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Pinterest token refresh failed:', error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  getTokenExpiry(response: any): Date | null {
    // Pinterest tokens expire in 30 days
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.PINTEREST_APP_ID;
    if (!value) throw new Error('PINTEREST_APP_ID not configured');
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.PINTEREST_APP_SECRET;
    if (!value) throw new Error('PINTEREST_APP_SECRET not configured');
    return value;
  }
}
```

### Step 2: Create Authorization Route (10 min)

**File**: `src/app/api/oauth/pinterest/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { PinterestOAuthService } from '@/lib/oauth/pinterest-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new PinterestOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('Pinterest OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Pinterest OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Callback Route (15 min)

**File**: `src/app/api/oauth/pinterest/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { PinterestOAuthService } from '@/lib/oauth/pinterest-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial or errors
  if (error) {
    console.log('Pinterest OAuth error:', error);
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=${error}`
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=missing_params`
    );
  }

  try {
    const service = new PinterestOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=pinterest&account=${account.id}`
    );
  } catch (error) {
    console.error('Pinterest OAuth callback failed:', error);
    
    let errorCode = 'oauth_failed';
    if (error instanceof Error) {
      if (error.message.includes('Invalid or expired state')) {
        errorCode = 'invalid_state';
      } else if (error.message.includes('token')) {
        errorCode = 'token_exchange_failed';
      }
    }
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=${errorCode}`
    );
  }
}
```

### Step 4: Create Refresh Route (10 min)

**File**: `src/app/api/oauth/pinterest/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { PinterestOAuthService } from '@/lib/oauth/pinterest-oauth-service';
import { Platform } from '@prisma/client';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID required' },
        { status: 400 }
      );
    }

    // Verify user owns account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user!.id,
        platform: Platform.PINTEREST,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if (!account.refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 400 }
      );
    }

    const service = new PinterestOAuthService();
    const decryptedRefreshToken = service.decryptToken(account.refreshToken);
    const tokens = await service.refreshAccessToken(decryptedRefreshToken);

    // Update tokens in database
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: service.encryptToken(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? service.encryptToken(tokens.refresh_token)
          : account.refreshToken,
        tokenExpiry: service.getTokenExpiry(tokens),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Pinterest token refreshed successfully'
    });
  } catch (error) {
    console.error('Pinterest token refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/pinterest/disconnect/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID required' },
        { status: 400 }
      );
    }

    // Verify user owns account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user!.id,
        platform: Platform.PINTEREST,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.socialAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Pinterest account disconnected'
    });
  } catch (error) {
    console.error('Pinterest disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 6: Testing (15 min)

#### Manual Testing Checklist

- [ ] Authorization URL opens Pinterest OAuth page
- [ ] User can approve app permissions
- [ ] Callback receives tokens successfully
- [ ] Account appears in database with encrypted tokens
- [ ] Pinterest profile data correct (username, profile image)
- [ ] Token refresh works (30-day tokens)
- [ ] Disconnect removes account from database

---

## Platform-Specific Implementation Details

### Pinterest User Account Response

```json
{
  "username": "johndoe",
  "account_type": "BUSINESS",
  "profile_image": "https://i.pinimg.com/...",
  "website_url": "https://example.com",
  "board_count": 15
}
```

### Token Response Format

```json
{
  "access_token": "pina_ABCDEFGHIJKLMNOP...",
  "refresh_token": "pinr_ABCDEFGHIJKLMNOP...",
  "token_type": "bearer",
  "expires_in": 2592000,
  "refresh_token_expires_in": 31536000,
  "scope": "user_accounts:read,boards:read,boards:write,pins:read,pins:write"
}
```

**Note**: Pinterest tokens expire in 30 days (2,592,000 seconds). Refresh tokens expire in 365 days.

---

## Security Considerations

### CSRF Protection
- State parameter validated on callback
- 10-minute expiration enforced
- Single-use token

### Token Lifecycle
- Access tokens expire in 30 days
- Refresh tokens expire in 365 days
- Proactive refresh before 25-day mark
- Monitor both token expiry dates

### Content Guidelines
- Must comply with Pinterest Brand Guidelines
- Images must meet Pinterest specifications
- Implement content moderation

---

## Known Limitations

### Platform Constraints
- **API Approval Required**: API access requires Pinterest approval
- **Pin Requirements**:
  - Image format: JPG, PNG, or WebP
  - Min size: 100x100 pixels
  - Max size: 10MB
  - Aspect ratio: 2:3 recommended
- **Rate Limits**: 200 pins per day per user
- **No Video Support**: Pinterest API v5 doesn't support video pins yet

### API Restrictions
- 1000 API calls per hour per user
- Cannot schedule pins (must post immediately)
- Limited analytics data
- Cannot create Idea Pins via API

---

## Troubleshooting

### Issue: "API access not approved"
**Cause**: App hasn't been approved for API access
**Solution**:
1. Submit API access request in Pinterest Developer Portal
2. Provide clear use case description
3. Wait for approval (1-3 days typically)
4. Check email for approval notification

### Issue: Token expires after 30 days
**Cause**: Pinterest access tokens have 30-day lifetime
**Solution**:
1. Implement automatic token refresh
2. Refresh proactively before 25-day mark
3. Handle refresh failures gracefully
4. Prompt user to reconnect if refresh fails

### Issue: "Invalid image" error
**Cause**: Image doesn't meet Pinterest requirements
**Solution**:
1. Validate image format (JPG, PNG, WebP)
2. Check file size (max 10MB)
3. Verify minimum dimensions (100x100)
4. Use 2:3 aspect ratio for best results

### Issue: Refresh token expired
**Cause**: Refresh token expires after 365 days
**Solution**:
1. Monitor refresh token expiry
2. Prompt user to re-authenticate before expiry
3. Update account status to 'TOKEN_EXPIRED'
4. Provide "Reconnect" button in UI

---

## API Reference

### Pinterest API v5 Documentation
- **OAuth 2.0**: https://developers.pinterest.com/docs/api/v5/#tag/Authentication
- **User Account**: https://developers.pinterest.com/docs/api/v5/#operation/user_account/get
- **Boards**: https://developers.pinterest.com/docs/api/v5/#tag/boards
- **Pins**: https://developers.pinterest.com/docs/api/v5/#tag/pins
- **Rate Limits**: https://developers.pinterest.com/docs/api/v5/#tag/Rate-limits

### Endpoints Used

1. **Authorization**: `https://www.pinterest.com/oauth/`
2. **Token Exchange**: `https://api.pinterest.com/v5/oauth/token`
3. **User Account**: `https://api.pinterest.com/v5/user_account`
4. **Create Pin**: `https://api.pinterest.com/v5/pins` (future use)

---

## Success Criteria

- [ ] Pinterest Developer Account created
- [ ] API access approved
- [ ] OAuth credentials configured in .env
- [ ] PinterestOAuthService implemented
- [ ] All 5 API routes created
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored with encrypted tokens
- [ ] User profile data fetched correctly
- [ ] Token refresh works (30-day tokens)
- [ ] Disconnect works
- [ ] Error handling for API approval status

**Estimated Time**: 60-75 minutes

---

## Phase 9D Complete!

After completing Pinterest OAuth, all 7 social platform OAuth integrations are complete:

- ✅ Phase 9D-1: Twitter/X OAuth
- ✅ Phase 9D-2: LinkedIn OAuth
- ✅ Phase 9D-3: Instagram OAuth
- ✅ Phase 9D-4: Facebook OAuth
- ✅ Phase 9D-5: TikTok OAuth
- ✅ Phase 9D-6: YouTube OAuth
- ✅ Phase 9D-7: Pinterest OAuth

---

## Next Phase

**Phase 9E**: File Storage & Media Upload with Vercel Blob
