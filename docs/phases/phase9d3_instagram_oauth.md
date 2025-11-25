# Phase 9D-3: Instagram OAuth Integration

## Overview

Implement OAuth authentication for Instagram via Facebook Graph API, enabling users to connect their Instagram Business or Creator accounts for posting content and analytics.

**Estimated Time**: 90-120 minutes
**Dependencies**: Phase 9D-1 complete (infrastructure built)
**Difficulty**: Medium (requires Facebook app setup)

---

## Prerequisites

### Required Credentials
- Facebook Developer Account
- Facebook App with Instagram Basic Display or Instagram Graph API
- App ID and App Secret

### Important Notes

**Instagram has two APIs**:
1. **Instagram Basic Display API** - For personal accounts (read-only access to profile, media)
2. **Instagram Graph API** - For Business/Creator accounts (posting, insights, full management)

**This implementation uses Instagram Graph API** for business features (posting, analytics).

### Developer Portal Setup

1. **Visit Facebook Developers**
   - Go to https://developers.facebook.com/
   - Sign in with your Facebook account

2. **Create a New App**
   - Click "Create App"
   - **Use case**: Select "Other"
   - **App type**: Select "Business"
   - Click "Next"
   - **App name**: "SocialFlow"
   - **App contact email**: Your email
   - Click "Create app"

3. **Add Instagram Graph API Product**
   - In app dashboard, click "Add Products"
   - Find "Instagram Graph API"
   - Click "Set Up"

4. **Configure App Settings**
   - Go to Settings → Basic
   - Add **App Domains**: `localhost` (for development)
   - Add **Privacy Policy URL**: Your privacy policy URL
   - Add **Terms of Service URL**: Your terms of service URL
   - Save changes

5. **Configure OAuth Settings**
   - Go to "Instagram Graph API" → Settings
   - Add **Valid OAuth Redirect URIs**:
     - `http://localhost:3000/api/oauth/instagram/callback`
     - For production: `https://yourdomain.com/api/oauth/instagram/callback`
   - Save changes

6. **Get Credentials**
   - Go to Settings → Basic
   - Copy **App ID** (save to .env as INSTAGRAM_APP_ID)
   - Copy **App Secret** (save to .env as INSTAGRAM_APP_SECRET)
   - Keep these secure!

7. **Connect Instagram Business Account**
   - User must have:
     - Facebook Page
     - Instagram Business or Creator account connected to that Page
   - This is configured during OAuth flow

### Environment Variables

Add to `.env`:

```bash
# Instagram OAuth (via Facebook)
INSTAGRAM_APP_ID=your_facebook_app_id_here
INSTAGRAM_APP_SECRET=your_facebook_app_secret_here
```

### Required Scopes

```typescript
scopes: [
  'instagram_basic',                    // Basic profile access
  'instagram_content_publish',          // Publish posts
  'pages_read_engagement',              // Read Page data
  'pages_show_list',                    // List Pages
  'business_management'                 // Manage business assets
]
```

**Scope Explanations**:
- `instagram_basic` - Access to Instagram Business account profile and media
- `instagram_content_publish` - Permission to publish photos, videos, stories
- `pages_read_engagement` - Read engagement metrics from connected Facebook Page
- `pages_show_list` - List Facebook Pages user manages
- `business_management` - Access to business assets (required for Instagram Business accounts)

### Platform-Specific Notes

- **PKCE Support**: Optional (not required)
- **Token Lifetime**: Short-lived tokens (1 hour), long-lived tokens (60 days)
- **Refresh Tokens**: Not provided, but can exchange short-lived for long-lived tokens
- **Rate Limits**:
  - 200 API calls per hour per user
  - 25 posts per 24 hours per user
- **Special Requirements**:
  - Instagram account must be Business or Creator account
  - Must be connected to a Facebook Page
  - Cannot use personal Instagram accounts

---

## Implementation Plan

### Files to Create

1. **OAuth Service**: `src/lib/oauth/instagram-oauth-service.ts`
2. **Authorization Route**: `src/app/api/oauth/instagram/authorize/route.ts`
3. **Callback Route**: `src/app/api/oauth/instagram/callback/route.ts`
4. **Refresh Route**: `src/app/api/oauth/instagram/refresh/route.ts` (exchange for long-lived)
5. **Disconnect Route**: `src/app/api/oauth/instagram/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Create Instagram OAuth Service (45-60 min)

**File**: `src/lib/oauth/instagram-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class InstagramOAuthService extends BaseOAuthService {
  platform = Platform.INSTAGRAM;
  authorizationUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
  profileUrl = 'https://graph.facebook.com/v18.0/me';
  scopes = [
    'instagram_basic',
    'instagram_content_publish',
    'pages_read_engagement',
    'pages_show_list',
    'business_management'
  ];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/instagram/callback`;

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Instagram token exchange failed:', error);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Exchange short-lived token for long-lived token (60 days)
    const longLivedToken = await this.exchangeForLongLivedToken(data.access_token);

    return {
      access_token: longLivedToken.access_token,
      token_type: 'bearer',
      expires_in: longLivedToken.expires_in,
    };
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // First, get connected Instagram Business accounts
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account,name,access_token`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!accountsResponse.ok) {
      throw new Error('Failed to fetch Instagram accounts');
    }

    const accountsData = await accountsResponse.json();
    const pageWithInstagram = accountsData.data?.find(
      (page: any) => page.instagram_business_account
    );

    if (!pageWithInstagram) {
      throw new Error('No Instagram Business account found. Please connect an Instagram Business account to your Facebook Page.');
    }

    const igAccountId = pageWithInstagram.instagram_business_account.id;

    // Get Instagram account details
    const igResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username,name,profile_picture_url`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!igResponse.ok) {
      throw new Error('Failed to fetch Instagram profile');
    }

    const igData = await igResponse.json();

    return {
      id: igData.id,
      username: igData.username,
      displayName: igData.name || igData.username,
      avatar: igData.profile_picture_url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    // Instagram doesn't have traditional refresh tokens
    // Instead, exchange current long-lived token for a new one
    return await this.exchangeForLongLivedToken(refreshToken);
  }

  private async exchangeForLongLivedToken(shortLivedToken: string): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        fb_exchange_token: shortLivedToken,
      })
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Long-lived token exchange failed:', error);
      throw new Error('Failed to get long-lived token');
    }

    return await response.json();
  }

  getTokenExpiry(response: any): Date | null {
    // Long-lived tokens expire in 60 days
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.INSTAGRAM_APP_ID;
    if (!value) throw new Error('INSTAGRAM_APP_ID not configured');
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.INSTAGRAM_APP_SECRET;
    if (!value) throw new Error('INSTAGRAM_APP_SECRET not configured');
    return value;
  }
}
```

### Step 2: Create Authorization Route (15 min)

**File**: `src/app/api/oauth/instagram/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { InstagramOAuthService } from '@/lib/oauth/instagram-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new InstagramOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('Instagram OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Instagram OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Callback Route (20 min)

**File**: `src/app/api/oauth/instagram/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { InstagramOAuthService } from '@/lib/oauth/instagram-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial or errors
  if (error) {
    console.log('Instagram OAuth error:', error, errorDescription);
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
    const service = new InstagramOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=instagram&account=${account.id}`
    );
  } catch (error) {
    console.error('Instagram OAuth callback failed:', error);
    
    let errorCode = 'oauth_failed';
    let errorMessage = 'Failed to connect Instagram account';
    
    if (error instanceof Error) {
      if (error.message.includes('No Instagram Business account found')) {
        errorCode = 'no_business_account';
        errorMessage = 'Please connect an Instagram Business account to your Facebook Page';
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

### Step 4: Create Refresh Route (15 min)

**File**: `src/app/api/oauth/instagram/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { InstagramOAuthService } from '@/lib/oauth/instagram-oauth-service';
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
        platform: Platform.INSTAGRAM,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if (!account.accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 400 }
      );
    }

    // Exchange current token for new long-lived token
    const service = new InstagramOAuthService();
    const decryptedToken = service.decryptToken(account.accessToken);
    const tokens = await service.refreshAccessToken(decryptedToken);

    // Update tokens in database
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: service.encryptToken(tokens.access_token),
        tokenExpiry: service.getTokenExpiry(tokens),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Instagram token refreshed successfully'
    });
  } catch (error) {
    console.error('Instagram token refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/instagram/disconnect/route.ts`

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
        platform: Platform.INSTAGRAM,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Note: Facebook doesn't require token revocation on logout
    // Simply delete from database
    await prisma.socialAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Instagram account disconnected'
    });
  } catch (error) {
    console.error('Instagram disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 6: Testing (30 min)

#### Manual Testing Checklist

- [ ] Authorization URL opens Facebook OAuth page
- [ ] User can select Facebook Page with Instagram Business account
- [ ] User can approve permissions
- [ ] Callback receives tokens and exchanges for long-lived token
- [ ] Account appears in database with encrypted tokens
- [ ] Instagram profile data correct (username, display name, avatar)
- [ ] Token refresh works (exchanges for new long-lived token)
- [ ] Disconnect removes account from database

---

## Platform-Specific Implementation Details

### Instagram Business Account Response

```json
{
  "id": "17841400455970028",
  "username": "johndoe_business",
  "name": "John Doe",
  "profile_picture_url": "https://scontent.cdninstagram.com/..."
}
```

### Token Exchange Flow

1. **Short-lived token** (1 hour) received from initial OAuth
2. **Exchange for long-lived token** (60 days)
3. **Refresh before expiry** by exchanging current long-lived token for new one

### Token Response Format

```json
{
  "access_token": "EAABwzLixnjYBO...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**Note**: expires_in is in seconds (60 days = 5,183,944 seconds)

### Error Responses

```json
{
  "error": {
    "message": "Error validating access token: Session has expired",
    "type": "OAuthException",
    "code": 190
  }
}
```

---

## Security Considerations

### CSRF Protection
- State parameter validated on callback
- 10-minute expiration enforced
- Single-use token

### Token Lifecycle
- Short-lived tokens (1 hour) immediately exchanged
- Long-lived tokens (60 days) stored encrypted
- Proactive refresh before 60-day expiration
- Monitor token expiry and prompt re-authentication

### Required Account Type
- Only Business or Creator Instagram accounts supported
- Must be connected to Facebook Page
- Personal accounts cannot be used

---

## Known Limitations

### Platform Constraints
- **Business Account Required**: Cannot use personal Instagram accounts
- **Facebook Page Required**: Instagram Business must be connected to Facebook Page
- **Content Limitations**: 
  - 25 posts per 24 hours per user
  - Video must be less than 60 seconds
  - Images must be 1:1 aspect ratio or 4:5
- **No Direct Messages**: Cannot access Instagram DMs via API
- **Limited Analytics**: Only basic insights available

### API Restrictions
- 200 API calls per hour per user
- Cannot schedule Stories (must post immediately)
- Cannot post Reels via API
- No access to Instagram Shopping features

---

## Troubleshooting

### Issue: "No Instagram Business account found"
**Cause**: User's Instagram account not connected to Facebook Page or not Business/Creator account
**Solution**:
1. Convert Instagram account to Business or Creator
2. Connect to Facebook Page:
   - Instagram app → Settings → Account → Switch to Professional Account
   - Link to Facebook Page
3. Re-authenticate

### Issue: "Invalid scope" error
**Cause**: Missing required permissions or app not approved
**Solution**:
1. Verify all scopes requested are available for your app
2. Some scopes require App Review approval
3. Check Facebook App Dashboard → App Review

### Issue: Token expires after 60 days
**Cause**: Long-lived tokens expire without automatic refresh
**Solution**:
1. Implement token expiry monitoring
2. Refresh token before 50-day mark
3. Prompt user to re-authenticate if refresh fails

### Issue: "Session has expired" error
**Cause**: User changed Facebook password or revoked permissions
**Solution**:
1. Catch OAuthException errors
2. Update account status to 'TOKEN_EXPIRED'
3. Prompt user to reconnect account

---

## API Reference

### Facebook Graph API Documentation
- **Instagram Graph API**: https://developers.facebook.com/docs/instagram-api
- **Pages API**: https://developers.facebook.com/docs/pages
- **OAuth**: https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
- **Publishing**: https://developers.facebook.com/docs/instagram-api/guides/content-publishing

### Endpoints Used

1. **Authorization**: `https://www.facebook.com/v18.0/dialog/oauth`
2. **Token Exchange**: `https://graph.facebook.com/v18.0/oauth/access_token`
3. **Long-lived Token**: `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token`
4. **User Pages**: `https://graph.facebook.com/v18.0/me/accounts`
5. **Instagram Profile**: `https://graph.facebook.com/v18.0/{ig-account-id}`

---

## Success Criteria

- [ ] Facebook Developer App created
- [ ] Instagram Graph API product added
- [ ] OAuth credentials configured in .env
- [ ] InstagramOAuthService implemented
- [ ] All 5 API routes created
- [ ] Token exchange to long-lived working
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored with encrypted tokens
- [ ] Instagram Business account detected correctly
- [ ] Profile data fetched successfully
- [ ] Token refresh works
- [ ] Disconnect works
- [ ] Error handling for non-Business accounts

**Estimated Time**: 90-120 minutes

---

## Next Steps

After completing Instagram OAuth:

**Phase 9D-4**: Facebook OAuth (Pages publishing)
