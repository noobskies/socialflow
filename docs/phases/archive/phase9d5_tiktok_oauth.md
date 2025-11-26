# Phase 9D-5: TikTok OAuth Integration

## Overview

Implement OAuth 2.0 authentication for TikTok, enabling users to connect their TikTok accounts for posting videos and analytics.

**Estimated Time**: 90-120 minutes
**Dependencies**: Phase 9D-1 complete (infrastructure built)
**Difficulty**: Medium-Hard (requires app review)

---

## Prerequisites

### Required Credentials
- TikTok Developer Account
- TikTok App with Content Posting API access
- Client Key and Client Secret

### Developer Portal Setup

1. **Visit TikTok Developers**
   - Go to https://developers.tiktok.com/
   - Sign in with your TikTok account

2. **Create a New App**
   - Click "Manage apps"
   - Click "Create an app"
   - **App name**: "SocialFlow"
   - **App description**: "AI-powered social media management platform"
   - Click "Create"

3. **Configure App Settings**
   - Go to App → Settings
   - Add **Redirect URL**: `http://localhost:3000/api/oauth/tiktok/callback`
   - For production: `https://yourdomain.com/api/oauth/tiktok/callback`
   - Save changes

4. **Request API Access**
   - Go to "Add products"
   - Enable "Login Kit"
   - Request "Content Posting API" (requires review)
   - Submit for approval (may take 1-2 weeks)

5. **Get Credentials**
   - Go to App → Settings → Basic information
   - Copy **Client Key** (save to .env as TIKTOK_CLIENT_KEY)
   - Copy **Client Secret** (save to .env as TIKTOK_CLIENT_SECRET)
   - Keep these secure!

### Environment Variables

Add to `.env`:

```bash
# TikTok OAuth
TIKTOK_CLIENT_KEY=your_tiktok_client_key_here
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret_here
```

### Required Scopes

```typescript
scopes: [
  'user.info.basic',        // Basic user information
  'video.list',             // List user's videos
  'video.upload'            // Upload videos (requires review)
]
```

**Scope Explanations**:
- `user.info.basic` - Access to basic user profile (username, display name, avatar)
- `video.list` - Permission to retrieve user's video list
- `video.upload` - Permission to upload videos on behalf of user (requires Content Posting API approval)

### Platform-Specific Notes

- **PKCE Support**: Required (code verifier/challenge mandatory)
- **Token Lifetime**: Access tokens expire in 24 hours
- **Refresh Tokens**: Provided, valid for 1 year
- **Rate Limits**:
  - 100 API calls per minute per user
  - 1000 API calls per day per user
- **Special Requirements**:
  - Content Posting API requires app review
  - Must comply with TikTok Community Guidelines
  - Videos must meet technical requirements (format, size, duration)

---

## Implementation Plan

### Files to Create

1. **OAuth Service**: `src/lib/oauth/tiktok-oauth-service.ts`
2. **Authorization Route**: `src/app/api/oauth/tiktok/authorize/route.ts`
3. **Callback Route**: `src/app/api/oauth/tiktok/callback/route.ts`
4. **Refresh Route**: `src/app/api/oauth/tiktok/refresh/route.ts`
5. **Disconnect Route**: `src/app/api/oauth/tiktok/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Create TikTok OAuth Service (50-60 min)

**File**: `src/lib/oauth/tiktok-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class TikTokOAuthService extends BaseOAuthService {
  platform = Platform.TIKTOK;
  authorizationUrl = 'https://www.tiktok.com/v2/auth/authorize/';
  tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
  profileUrl = 'https://open.tiktokapis.com/v2/user/info/';
  scopes = ['user.info.basic', 'video.list', 'video.upload'];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/tiktok/callback`;

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.getClientId(),
        client_secret: this.getClientSecret(),
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('TikTok token exchange failed:', error);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`TikTok OAuth error: ${data.error.message}`);
    }

    return {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires_in: data.data.expires_in,
      token_type: data.data.token_type,
    };
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(this.profileUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: ['open_id', 'union_id', 'avatar_url', 'display_name'],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('TikTok profile fetch failed:', error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`TikTok profile error: ${data.error.message}`);
    }

    const user = data.data.user;

    return {
      id: user.open_id,
      username: user.display_name,
      displayName: user.display_name,
      avatar: user.avatar_url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.getClientId(),
        client_secret: this.getClientSecret(),
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('TikTok token refresh failed:', error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`TikTok refresh error: ${data.error.message}`);
    }

    return {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires_in: data.data.expires_in,
      token_type: data.data.token_type,
    };
  }

  getTokenExpiry(response: any): Date | null {
    // TikTok tokens expire in 24 hours (86400 seconds)
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.TIKTOK_CLIENT_KEY;
    if (!value) throw new Error('TIKTOK_CLIENT_KEY not configured');
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.TIKTOK_CLIENT_SECRET;
    if (!value) throw new Error('TIKTOK_CLIENT_SECRET not configured');
    return value;
  }
}
```

### Step 2: Create Authorization Route (15 min)

**File**: `src/app/api/oauth/tiktok/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { TikTokOAuthService } from '@/lib/oauth/tiktok-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new TikTokOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('TikTok OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate TikTok OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Callback Route (20 min)

**File**: `src/app/api/oauth/tiktok/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { TikTokOAuthService } from '@/lib/oauth/tiktok-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial or errors
  if (error) {
    console.log('TikTok OAuth error:', error, errorDescription);
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
    const service = new TikTokOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=tiktok&account=${account.id}`
    );
  } catch (error) {
    console.error('TikTok OAuth callback failed:', error);
    
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

### Step 4: Create Refresh Route (15 min)

**File**: `src/app/api/oauth/tiktok/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { TikTokOAuthService } from '@/lib/oauth/tiktok-oauth-service';
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
        platform: Platform.TIKTOK,
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

    const service = new TikTokOAuthService();
    const decryptedRefreshToken = service.decryptToken(account.refreshToken);
    const tokens = await service.refreshAccessToken(decryptedRefreshToken);

    // Update tokens in database
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: service.encryptToken(tokens.access_token),
        refreshToken: service.encryptToken(tokens.refresh_token),
        tokenExpiry: service.getTokenExpiry(tokens),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'TikTok token refreshed successfully'
    });
  } catch (error) {
    console.error('TikTok token refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/tiktok/disconnect/route.ts`

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
        platform: Platform.TIKTOK,
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
      message: 'TikTok account disconnected'
    });
  } catch (error) {
    console.error('TikTok disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 6: Testing (30 min)

#### Manual Testing Checklist

- [ ] Authorization URL opens TikTok OAuth page
- [ ] User can approve app permissions
- [ ] Callback receives tokens with PKCE validation
- [ ] Account appears in database with encrypted tokens
- [ ] TikTok profile data correct (display name, avatar)
- [ ] Token refresh works (24-hour tokens)
- [ ] Disconnect removes account from database

---

## Platform-Specific Implementation Details

### TikTok User Info Response

```json
{
  "data": {
    "user": {
      "open_id": "a1b2c3d4e5f6g7h8",
      "union_id": "u9i8o7p6",
      "avatar_url": "https://p16-sign-va.tiktokcdn.com/...",
      "display_name": "John Doe"
    }
  },
  "error": {
    "code": "ok",
    "message": ""
  }
}
```

### Token Response Format

```json
{
  "data": {
    "access_token": "act.example...",
    "refresh_token": "rft.example...",
    "expires_in": 86400,
    "token_type": "Bearer",
    "scope": "user.info.basic,video.list,video.upload"
  },
  "error": {
    "code": "ok",
    "message": ""
  }
}
```

**Note**: TikTok tokens expire in 24 hours (86,400 seconds). Refresh tokens valid for 1 year.

### PKCE Implementation

TikTok requires PKCE (already handled by BaseOAuthService):
- Code verifier: 43-128 character random string
- Code challenge: SHA256(verifier) base64url encoded
- Challenge method: S256

---

## Security Considerations

### CSRF Protection
- State parameter validated on callback
- 10-minute expiration enforced
- Single-use token

### PKCE Required
- Code verifier generated and stored
- Code challenge sent in authorization
- Verified in token exchange

### Token Lifecycle
- Access tokens expire in 24 hours
- Refresh tokens valid for 1 year
- Proactive refresh before expiration
- Monitor token expiry

### Content Guidelines
- Must comply with TikTok Community Guidelines
- Content may be rejected if violates policies
- Implement content moderation

---

## Known Limitations

### Platform Constraints
- **App Review Required**: Content Posting API requires approval (1-2 weeks)
- **Short Token Lifetime**: 24-hour access tokens require frequent refresh
- **Video Requirements**:
  - Format: MP4, MOV, WEBM
  - Size: Max 4GB
  - Duration: 3 seconds to 10 minutes
  - Resolution: 540x960 minimum
- **No Scheduling**: Must post immediately (cannot schedule for future)

### API Restrictions
- 100 API calls per minute per user
- 1000 API calls per day per user
- Cannot edit videos after posting
- Limited analytics data
- No access to TikTok Live features

---

## Troubleshooting

### Issue: "App not approved for Content Posting API"
**Cause**: Content Posting API requires TikTok approval
**Solution**:
1. Submit app for review in TikTok Developer Portal
2. Provide clear use case and app description
3. Wait for approval (typically 1-2 weeks)
4. Use `user.info.basic` and `video.list` scopes until approved

### Issue: Token expires after 24 hours
**Cause**: TikTok access tokens have 24-hour lifetime
**Solution**:
1. Implement automatic token refresh
2. Refresh proactively before 20-hour mark
3. Handle refresh failures gracefully
4. Prompt user to reconnect if refresh fails

### Issue: "Invalid code verifier"
**Cause**: PKCE code verifier mismatch or expired
**Solution**:
1. Verify code verifier stored correctly in database
2. Ensure state parameter matches
3. Complete OAuth flow within 10 minutes

### Issue: Video upload fails
**Cause**: Video doesn't meet TikTok's technical requirements
**Solution**:
1. Validate video format (MP4, MOV, WEBM only)
2. Check file size (max 4GB)
3. Verify duration (3s-10min)
4. Ensure minimum resolution (540x960)

---

## API Reference

### TikTok API Documentation
- **OAuth 2.0**: https://developers.tiktok.com/doc/login-kit-web
- **Content Posting**: https://developers.tiktok.com/doc/content-posting-api-get-started
- **User Info**: https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info
- **Rate Limits**: https://developers.tiktok.com/doc/rate-limits

### Endpoints Used

1. **Authorization**: `https://www.tiktok.com/v2/auth/authorize/`
2. **Token Exchange**: `https://open.tiktokapis.com/v2/oauth/token/`
3. **User Info**: `https://open.tiktokapis.com/v2/user/info/`
4. **Video Upload**: `https://open.tiktokapis.com/v2/post/publish/video/init/` (future use)

---

## Success Criteria

- [ ] TikTok Developer App created
- [ ] Content Posting API approved (or pending)
- [ ] OAuth credentials configured in .env
- [ ] TikTokOAuthService implemented
- [ ] All 5 API routes created
- [ ] PKCE implementation working
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored with encrypted tokens
- [ ] Profile data fetched correctly
- [ ] Token refresh works (24-hour tokens)
- [ ] Disconnect works
- [ ] Error handling for API approval status

**Estimated Time**: 90-120 minutes

---

## Next Steps

After completing TikTok OAuth:

**Phase 9D-6**: YouTube OAuth (Google OAuth 2.0)
