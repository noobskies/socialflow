# Phase 9D-6: YouTube OAuth Integration

## Overview

Implement OAuth 2.0 authentication for YouTube via Google, enabling users to connect their YouTube channels for posting videos and analytics.

**Estimated Time**: 75-90 minutes
**Dependencies**: Phase 9D-1 complete (infrastructure built)
**Difficulty**: Medium

---

## Prerequisites

### Required Credentials
- Google Cloud Project
- YouTube Data API v3 enabled
- OAuth 2.0 Client ID and Client Secret

### Developer Portal Setup

1. **Visit Google Cloud Console**
   - Go to https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click project dropdown → "New Project"
   - **Project name**: "SocialFlow"
   - Click "Create"

3. **Enable YouTube Data API v3**
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - **User Type**: External
   - **App name**: "SocialFlow"
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Add scopes (see Required Scopes section)
   - Add test users if needed
   - Save and continue

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - **Application type**: Web application
   - **Name**: "SocialFlow Web Client"
   - **Authorized redirect URIs**:
     - Add: `http://localhost:3000/api/oauth/youtube/callback`
     - For production: `https://yourdomain.com/api/oauth/youtube/callback`
   - Click "Create"

6. **Get Credentials**
   - Copy **Client ID** (save to .env as YOUTUBE_CLIENT_ID)
   - Copy **Client Secret** (save to .env as YOUTUBE_CLIENT_SECRET)
   - Keep these secure!

### Environment Variables

Add to `.env`:

```bash
# YouTube OAuth (Google)
YOUTUBE_CLIENT_ID=your_google_client_id_here
YOUTUBE_CLIENT_SECRET=your_google_client_secret_here
```

### Required Scopes

```typescript
scopes: [
  'https://www.googleapis.com/auth/youtube.upload',           // Upload videos
  'https://www.googleapis.com/auth/youtube.readonly',         // Read channel info
  'https://www.googleapis.com/auth/userinfo.profile'          // Basic profile
]
```

**Scope Explanations**:
- `youtube.upload` - Permission to upload and manage videos
- `youtube.readonly` - Read access to channel information and analytics
- `userinfo.profile` - Access to user's basic profile information

### Platform-Specific Notes

- **PKCE Support**: Recommended but optional
- **Token Lifetime**: Access tokens expire in 1 hour
- **Refresh Tokens**: Provided, valid until revoked
- **Rate Limits**:
  - 10,000 quota units per day per project
  - Video uploads: 6 per day (can request increase)
- **Special Requirements**:
  - YouTube channel required
  - Must comply with YouTube Terms of Service
  - Video uploads require OAuth consent screen verification

---

## Implementation Plan

### Files to Create

1. **OAuth Service**: `src/lib/oauth/youtube-oauth-service.ts`
2. **Authorization Route**: `src/app/api/oauth/youtube/authorize/route.ts`
3. **Callback Route**: `src/app/api/oauth/youtube/callback/route.ts`
4. **Refresh Route**: `src/app/api/oauth/youtube/refresh/route.ts`
5. **Disconnect Route**: `src/app/api/oauth/youtube/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Create YouTube OAuth Service (40-50 min)

**File**: `src/lib/oauth/youtube-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class YouTubeOAuthService extends BaseOAuthService {
  platform = Platform.YOUTUBE;
  authorizationUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  tokenUrl = 'https://oauth2.googleapis.com/token';
  profileUrl = 'https://www.googleapis.com/youtube/v3/channels';
  scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/youtube/callback`;

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('YouTube token exchange failed:', error);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // Get user's YouTube channels
    const response = await fetch(
      `${this.profileUrl}?part=snippet&mine=true`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('YouTube profile fetch failed:', error);
      throw new Error(`Failed to fetch YouTube channel: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No YouTube channel found. Please create a YouTube channel first.');
    }

    const channel = data.items[0];

    return {
      id: channel.id,
      username: channel.snippet.title,
      displayName: channel.snippet.title,
      avatar: channel.snippet.thumbnails?.default?.url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('YouTube token refresh failed:', error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  getTokenExpiry(response: any): Date | null {
    // Google tokens expire in 1 hour (3600 seconds)
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.YOUTUBE_CLIENT_ID;
    if (!value) throw new Error('YOUTUBE_CLIENT_ID not configured');
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.YOUTUBE_CLIENT_SECRET;
    if (!value) throw new Error('YOUTUBE_CLIENT_SECRET not configured');
    return value;
  }

  // Override to add Google-specific parameters
  async initiateOAuth(userId: string): Promise<string> {
    const baseUrl = await super.initiateOAuth(userId);
    const url = new URL(baseUrl);
    
    // Add Google-specific parameters
    url.searchParams.set('access_type', 'offline'); // Request refresh token
    url.searchParams.set('prompt', 'consent'); // Force consent screen
    
    return url.toString();
  }
}
```

### Step 2: Create Authorization Route (10 min)

**File**: `src/app/api/oauth/youtube/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { YouTubeOAuthService } from '@/lib/oauth/youtube-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new YouTubeOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('YouTube OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate YouTube OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Callback Route (15 min)

**File**: `src/app/api/oauth/youtube/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { YouTubeOAuthService } from '@/lib/oauth/youtube-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial or errors
  if (error) {
    console.log('YouTube OAuth error:', error);
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
    const service = new YouTubeOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=youtube&account=${account.id}`
    );
  } catch (error) {
    console.error('YouTube OAuth callback failed:', error);
    
    let errorCode = 'oauth_failed';
    let errorMessage = 'Failed to connect YouTube account';
    
    if (error instanceof Error) {
      if (error.message.includes('No YouTube channel found')) {
        errorCode = 'no_channel';
        errorMessage = 'Please create a YouTube channel first';
      } else if (error.message.includes('Invalid or expired state')) {
        errorCode = 'invalid_state';
      } else if (error.message.includes('token')) {
        errorCode = 'token_exchange_failed';
      }
    }
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?error=${errorCode}&message=${encodeURIComponent(errorMessage)}`
    );
  }
}
```

### Step 4: Create Refresh Route (10 min)

**File**: `src/app/api/oauth/youtube/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { YouTubeOAuthService } from '@/lib/oauth/youtube-oauth-service';
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
        platform: Platform.YOUTUBE,
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

    const service = new YouTubeOAuthService();
    const decryptedRefreshToken = service.decryptToken(account.refreshToken);
    const tokens = await service.refreshAccessToken(decryptedRefreshToken);

    // Update tokens in database
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: service.encryptToken(tokens.access_token),
        // Refresh token may not be returned, keep existing if so
        refreshToken: tokens.refresh_token
          ? service.encryptToken(tokens.refresh_token)
          : account.refreshToken,
        tokenExpiry: service.getTokenExpiry(tokens),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'YouTube token refreshed successfully'
    });
  } catch (error) {
    console.error('YouTube token refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/youtube/disconnect/route.ts`

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
        platform: Platform.YOUTUBE,
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
      message: 'YouTube account disconnected'
    });
  } catch (error) {
    console.error('YouTube disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 6: Testing (20 min)

#### Manual Testing Checklist

- [ ] Authorization URL opens Google OAuth page
- [ ] User can select Google account with YouTube channel
- [ ] User can approve permissions
- [ ] Callback receives tokens successfully
- [ ] Account appears in database with encrypted tokens
- [ ] YouTube channel data correct (name, thumbnail)
- [ ] Token refresh works (1-hour tokens)
- [ ] Disconnect removes account from database

---

## Platform-Specific Implementation Details

### YouTube Channel Response

```json
{
  "items": [
    {
      "id": "UCxxxxxxxxxxxxxxxx",
      "snippet": {
        "title": "My YouTube Channel",
        "description": "Channel description",
        "thumbnails": {
          "default": {
            "url": "https://yt3.ggpht.com/..."
          }
        }
      }
    }
  ]
}
```

### Token Response Format

```json
{
  "access_token": "ya29.a0AfH6SMC...",
  "refresh_token": "1//0gCPxxxxxxxxxxx",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"
}
```

**Note**: Google tokens expire in 1 hour (3,600 seconds). Refresh tokens don't expire unless revoked.

---

## Security Considerations

### CSRF Protection
- State parameter validated on callback
- 10-minute expiration enforced
- Single-use token

### Token Lifecycle
- Access tokens expire in 1 hour
- Refresh tokens valid until revoked
- Proactive refresh before expiration
- Monitor token expiry

### Scope Justification
- Request minimum necessary scopes
- Document reason for each scope
- Handle scope denial gracefully

---

## Known Limitations

### Platform Constraints
- **Channel Required**: User must have a YouTube channel
- **Upload Quota**: 6 video uploads per day (can request increase)
- **Video Requirements**:
  - Format: MP4, MOV, AVI, WMV, FLV, 3GP, WebM
  - Size: Max 256GB or 12 hours
  - Title: Max 100 characters
  - Description: Max 5,000 characters
- **OAuth Verification**: App requires verification for production use

### API Restrictions
- 10,000 quota units per day per project
- Video processing may take time
- Cannot edit video file after upload
- Limited analytics data without YouTube Analytics API

---

## Troubleshooting

### Issue: "No YouTube channel found"
**Cause**: User doesn't have a YouTube channel
**Solution**:
1. User must create a YouTube channel
2. Go to youtube.com → Sign in → Create channel
3. Re-authenticate after creating channel

### Issue: Token expires after 1 hour
**Cause**: Google access tokens have 1-hour lifetime
**Solution**:
1. Implement automatic token refresh
2. Refresh proactively before 50-minute mark
3. Keep refresh token secure
4. Prompt user to reconnect if refresh fails

### Issue: "Access Not Configured"
**Cause**: YouTube Data API v3 not enabled in Google Cloud Project
**Solution**:
1. Go to Google Cloud Console
2. Enable YouTube Data API v3
3. Wait a few minutes for propagation
4. Retry authentication

### Issue: Upload quota exceeded
**Cause**: Exceeded 6 uploads per day limit
**Solution**:
1. Request quota increase in Google Cloud Console
2. Provide justification for increase
3. Wait for approval
4. Implement upload scheduling

---

## API Reference

### YouTube Data API v3 Documentation
- **OAuth 2.0**: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps
- **Channels**: https://developers.google.com/youtube/v3/docs/channels
- **Videos Upload**: https://developers.google.com/youtube/v3/docs/videos/insert
- **Quota**: https://developers.google.com/youtube/v3/getting-started#quota

### Endpoints Used

1. **Authorization**: `https://accounts.google.com/o/oauth2/v2/auth`
2. **Token Exchange**: `https://oauth2.googleapis.com/token`
3. **Channels List**: `https://www.googleapis.com/youtube/v3/channels`
4. **Videos Insert**: `https://www.googleapis.com/youtube/v3/videos` (future use)

---

## Success Criteria

- [ ] Google Cloud Project created
- [ ] YouTube Data API v3 enabled
- [ ] OAuth credentials configured in .env
- [ ] YouTubeOAuthService implemented
- [ ] All 5 API routes created
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored with encrypted tokens
- [ ] YouTube channel data fetched correctly
- [ ] Token refresh works (1-hour tokens)
- [ ] Disconnect works
- [ ] Error handling for users without channels

**Estimated Time**: 75-90 minutes

---

## Next Steps

After completing YouTube OAuth:

**Phase 9D-7**: Pinterest OAuth
