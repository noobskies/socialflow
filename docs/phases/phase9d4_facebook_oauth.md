# Phase 9D-4: Facebook OAuth Integration

## Overview

Implement OAuth 2.0 authentication for Facebook, enabling users to connect their Facebook Pages for posting content and analytics.

**Estimated Time**: 75-90 minutes
**Dependencies**: Phase 9D-1 complete (infrastructure built)
**Difficulty**: Medium

---

## Prerequisites

### Required Credentials
- Facebook Developer Account
- Facebook App configured for Pages API
- App ID and App Secret

### Developer Portal Setup

1. **Visit Facebook Developers** (or use existing app from Instagram setup)
   - Go to https://developers.facebook.com/
   - Sign in with your Facebook account

2. **Create a New App** (or use existing)
   - Click "Create App"
   - **Use case**: Select "Other"
   - **App type**: Select "Business"
   - Click "Next"
   - **App name**: "SocialFlow"
   - **App contact email**: Your email
   - Click "Create app"

3. **Add Pages API Product**
   - In app dashboard, click "Add Products"
   - Find "Facebook Login"
   - Click "Set Up"

4. **Configure App Settings**
   - Go to Settings → Basic
   - Add **App Domains**: `localhost` (for development)
   - Add **Privacy Policy URL**: Your privacy policy URL
   - Save changes

5. **Configure OAuth Settings**
   - Go to "Facebook Login" → Settings
   - Add **Valid OAuth Redirect URIs**:
     - `http://localhost:3000/api/oauth/facebook/callback`
     - For production: `https://yourdomain.com/api/oauth/facebook/callback`
   - Save changes

6. **Get Credentials**
   - Go to Settings → Basic
   - Copy **App ID** (save to .env as FACEBOOK_APP_ID)
   - Copy **App Secret** (save to .env as FACEBOOK_APP_SECRET)
   - Keep these secure!

### Environment Variables

Add to `.env`:

```bash
# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

### Required Scopes

```typescript
scopes: [
  'pages_show_list',              // List Pages user manages
  'pages_read_engagement',        // Read Page engagement metrics
  'pages_manage_posts',           // Create posts on Pages
  'pages_read_user_content',      // Read user content on Pages
  'public_profile'                // Basic profile information
]
```

**Scope Explanations**:
- `pages_show_list` - List all Facebook Pages user manages
- `pages_read_engagement` - Access to Page insights and analytics
- `pages_manage_posts` - Permission to create/publish posts on Pages
- `pages_read_user_content` - Read posts and content on Pages
- `public_profile` - Access to user's public profile information

### Platform-Specific Notes

- **PKCE Support**: Optional (not required)
- **Token Lifetime**: Short-lived tokens (1 hour), long-lived tokens (60 days)
- **Refresh Tokens**: Not provided, but can exchange short-lived for long-lived tokens
- **Rate Limits**: 
  - 200 API calls per hour per user
  - No specific post limits (subject to spam detection)
- **Special Requirements**:
  - User must be admin/editor of Facebook Page
  - Page-level access tokens (not user-level)

---

## Implementation Plan

### Files to Create

1. **OAuth Service**: `src/lib/oauth/facebook-oauth-service.ts`
2. **Authorization Route**: `src/app/api/oauth/facebook/authorize/route.ts`
3. **Callback Route**: `src/app/api/oauth/facebook/callback/route.ts`
4. **Refresh Route**: `src/app/api/oauth/facebook/refresh/route.ts` (exchange for long-lived)
5. **Disconnect Route**: `src/app/api/oauth/facebook/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Create Facebook OAuth Service (40-50 min)

**File**: `src/lib/oauth/facebook-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class FacebookOAuthService extends BaseOAuthService {
  platform = Platform.FACEBOOK;
  authorizationUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
  profileUrl = 'https://graph.facebook.com/v18.0/me';
  scopes = [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'pages_read_user_content',
    'public_profile'
  ];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/facebook/callback`;

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
      console.error('Facebook token exchange failed:', error);
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
    // Get user's Pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,picture`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!pagesResponse.ok) {
      throw new Error('Failed to fetch Facebook Pages');
    }

    const pagesData = await pagesResponse.json();
    
    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error('No Facebook Pages found. Please create or get access to a Facebook Page first.');
    }

    // Use first Page (or let user select in UI)
    const page = pagesData.data[0];

    // Exchange user token for Page token
    const pageToken = page.access_token;

    return {
      id: page.id,
      username: page.name,
      displayName: page.name,
      avatar: page.picture?.data?.url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    // Exchange current long-lived token for new one
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
    const value = process.env.FACEBOOK_APP_ID;
    if (!value) throw new Error('FACEBOOK_APP_ID not configured');
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.FACEBOOK_APP_SECRET;
    if (!value) throw new Error('FACEBOOK_APP_SECRET not configured');
    return value;
  }
}
```

### Step 2: Create Authorization Route (10 min)

**File**: `src/app/api/oauth/facebook/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { FacebookOAuthService } from '@/lib/oauth/facebook-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new FacebookOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('Facebook OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Facebook OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Callback Route (15 min)

**File**: `src/app/api/oauth/facebook/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { FacebookOAuthService } from '@/lib/oauth/facebook-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial or errors
  if (error) {
    console.log('Facebook OAuth error:', error, errorDescription);
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
    const service = new FacebookOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=facebook&account=${account.id}`
    );
  } catch (error) {
    console.error('Facebook OAuth callback failed:', error);
    
    let errorCode = 'oauth_failed';
    let errorMessage = 'Failed to connect Facebook account';
    
    if (error instanceof Error) {
      if (error.message.includes('No Facebook Pages found')) {
        errorCode = 'no_pages';
        errorMessage = 'Please create or get access to a Facebook Page first';
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

**File**: `src/app/api/oauth/facebook/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { FacebookOAuthService } from '@/lib/oauth/facebook-oauth-service';
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
        platform: Platform.FACEBOOK,
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
    const service = new FacebookOAuthService();
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
      message: 'Facebook token refreshed successfully'
    });
  } catch (error) {
    console.error('Facebook token refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/facebook/disconnect/route.ts`

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
        platform: Platform.FACEBOOK,
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
      message: 'Facebook account disconnected'
    });
  } catch (error) {
    console.error('Facebook disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 6: Testing (20 min)

#### Manual Testing Checklist

- [ ] Authorization URL opens Facebook OAuth page
- [ ] User can select Facebook Page
- [ ] User can approve permissions
- [ ] Callback receives tokens and exchanges for long-lived token
- [ ] Account appears in database with encrypted Page token
- [ ] Facebook Page data correct (name, picture)
- [ ] Token refresh works (exchanges for new long-lived token)
- [ ] Disconnect removes account from database

---

## Platform-Specific Implementation Details

### Facebook Page Response

```json
{
  "data": [
    {
      "id": "123456789",
      "name": "My Business Page",
      "access_token": "EAABwzLixnjYBO...",
      "picture": {
        "data": {
          "url": "https://scontent.xx.fbcdn.net/..."
        }
      }
    }
  ]
}
```

### Token Exchange Flow

1. **Short-lived user token** (1 hour) received from initial OAuth
2. **Exchange for long-lived user token** (60 days)
3. **Get Page access tokens** (never expire until revoked)
4. **Refresh before 60-day expiry** by exchanging current token

### Token Response Format

```json
{
  "access_token": "EAABwzLixnjYBO...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

---

## Security Considerations

### CSRF Protection
- State parameter validated on callback
- 10-minute expiration enforced
- Single-use token

### Page-Level Tokens
- Store Page access tokens (not user tokens)
- Page tokens don't expire (until user revokes)
- More secure than user-level tokens

### Token Lifecycle
- Short-lived user tokens (1 hour) immediately exchanged
- Long-lived user tokens (60 days) stored encrypted
- Page tokens fetched and stored separately
- Proactive refresh before 60-day expiration

---

## Known Limitations

### Platform Constraints
- **Page Access Required**: User must be admin/editor of Facebook Page
- **No Personal Profiles**: Can only post to Pages, not personal timelines
- **Content Limitations**: Subject to Facebook's spam detection
- **Review Required**: Some scopes require App Review approval

### API Restrictions
- 200 API calls per hour per user
- Cannot schedule posts more than 30 days in advance
- Video uploads limited to 1GB file size
- Limited analytics compared to native Facebook

---

## Troubleshooting

### Issue: "No Facebook Pages found"
**Cause**: User doesn't manage any Facebook Pages
**Solution**:
1. Create a Facebook Page (facebook.com/pages/create)
2. Or get admin/editor access to existing Page
3. Re-authenticate after getting Page access

### Issue: "Permission denied" error
**Cause**: Missing required permissions or user declined
**Solution**:
1. Verify all scopes are requested
2. Some scopes require App Review
3. User must approve all permissions

### Issue: Token expires after 60 days
**Cause**: Long-lived tokens expire without refresh
**Solution**:
1. Implement token expiry monitoring
2. Refresh token before 50-day mark
3. Prompt user to re-authenticate if refresh fails

### Issue: "Page token invalid"
**Cause**: Page access revoked or Page deleted
**Solution**:
1. Catch API errors for invalid Page tokens
2. Update account status to 'TOKEN_EXPIRED'
3. Prompt user to reconnect

---

## API Reference

### Facebook Graph API Documentation
- **Pages API**: https://developers.facebook.com/docs/pages-api
- **Publishing**: https://developers.facebook.com/docs/pages-api/posts
- **OAuth**: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
- **Insights**: https://developers.facebook.com/docs/graph-api/reference/insights

### Endpoints Used

1. **Authorization**: `https://www.facebook.com/v18.0/dialog/oauth`
2. **Token Exchange**: `https://graph.facebook.com/v18.0/oauth/access_token`
3. **Long-lived Token**: `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token`
4. **User Pages**: `https://graph.facebook.com/v18.0/me/accounts`
5. **Page Publishing**: `https://graph.facebook.com/v18.0/{page-id}/feed`

---

## Success Criteria

- [ ] Facebook Developer App created
- [ ] Facebook Login product added
- [ ] OAuth credentials configured in .env
- [ ] FacebookOAuthService implemented
- [ ] All 5 API routes created
- [ ] Token exchange to long-lived working
- [ ] Page selection implemented
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored with encrypted Page token
- [ ] Page data fetched correctly
- [ ] Token refresh works
- [ ] Disconnect works
- [ ] Error handling for users without Pages

**Estimated Time**: 75-90 minutes

---

## Next Steps

After completing Facebook OAuth:

**Phase 9D-5**: TikTok OAuth
