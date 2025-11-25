# Phase 9D-2: LinkedIn OAuth Integration

## Overview

Implement OAuth 2.0 authentication for LinkedIn, enabling users to connect their LinkedIn accounts for posting professional content and analytics.

**Estimated Time**: 60-90 minutes
**Dependencies**: Phase 9D-1 complete (infrastructure built)
**Difficulty**: Easy

---

## Prerequisites

### Required Credentials
- LinkedIn Developer Account
- LinkedIn App with OAuth configured
- Client ID and Client Secret

### Developer Portal Setup

1. **Visit LinkedIn Developers**
   - Go to https://www.linkedin.com/developers/apps
   - Sign in with your LinkedIn account

2. **Create a New App**
   - Click "Create app"
   - **App name**: "SocialFlow"
   - **LinkedIn Page**: Create or select your company page
   - **Privacy policy URL**: Your privacy policy URL
   - **App logo**: Upload logo (minimum 100x100px)
   - Click "Create app"

3. **Configure Products**
   - Go to "Products" tab
   - Request access to "Share on LinkedIn" product
   - Request access to "Sign In with LinkedIn using OpenID Connect" product
   - Wait for approval (usually instant for Sign In, review required for Share)

4. **Configure OAuth Settings**
   - Go to "Auth" tab
   - **Authorized redirect URLs for your app**:
     - Add: `http://localhost:3000/api/oauth/linkedin/callback`
     - For production: `https://yourdomain.com/api/oauth/linkedin/callback`
   - Save changes

5. **Get Credentials**
   - Go to "Auth" tab
   - Copy **Client ID** (save to .env as LINKEDIN_CLIENT_ID)
   - Copy **Client Secret** (save to .env as LINKEDIN_CLIENT_SECRET)
   - Keep these secure!

### Environment Variables

Add to `.env`:

```bash
# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

### Required Scopes

```typescript
scopes: [
  'openid',              // OpenID Connect authentication
  'profile',             // Basic profile information
  'email',               // User's email address
  'w_member_social'      // Post on behalf of user
]
```

**Scope Explanations**:
- `openid` - Required for OpenID Connect authentication flow
- `profile` - Access to user's name and profile information
- `email` - Access to user's email address for identification
- `w_member_social` - Permission to create posts on user's behalf

### Platform-Specific Notes

- **PKCE Support**: Optional (not required, but recommended)
- **Token Lifetime**: Access tokens expire in 60 days
- **Refresh Tokens**: Not provided (must re-authenticate after expiration)
- **Rate Limits**:
  - API calls: Throttled per user per app
  - Post creation: 100 posts per day per user
- **Special Requirements**: Must use OpenID Connect for profile data

---

## Implementation Plan

### Files to Create

1. **OAuth Service**: `src/lib/oauth/linkedin-oauth-service.ts`
2. **Authorization Route**: `src/app/api/oauth/linkedin/authorize/route.ts`
3. **Callback Route**: `src/app/api/oauth/linkedin/callback/route.ts`
4. **Refresh Route**: `src/app/api/oauth/linkedin/refresh/route.ts` (returns error - no refresh)
5. **Disconnect Route**: `src/app/api/oauth/linkedin/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Create LinkedIn OAuth Service (30-40 min)

**File**: `src/lib/oauth/linkedin-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class LinkedInOAuthService extends BaseOAuthService {
  platform = Platform.LINKEDIN;
  authorizationUrl = 'https://www.linkedin.com/oauth/v2/authorization';
  tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
  profileUrl = 'https://api.linkedin.com/v2/userinfo';
  scopes = ['openid', 'profile', 'email', 'w_member_social'];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`;

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LinkedIn token exchange failed:', error);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // LinkedIn uses OpenID Connect userinfo endpoint
    const response = await fetch(this.profileUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LinkedIn profile fetch failed:', error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.sub, // OpenID Connect subject identifier
      username: data.email || data.name, // LinkedIn doesn't provide username
      displayName: data.name,
      avatar: data.picture,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    // LinkedIn doesn't provide refresh tokens
    throw new Error('LinkedIn does not support token refresh. User must re-authenticate.');
  }

  getTokenExpiry(response: any): Date | null {
    // LinkedIn tokens expire in 60 days
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }
}
```

### Step 2: Create Authorization Route (10 min)

**File**: `src/app/api/oauth/linkedin/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { LinkedInOAuthService } from '@/lib/oauth/linkedin-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new LinkedInOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('LinkedIn OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate LinkedIn OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Callback Route (20 min)

**File**: `src/app/api/oauth/linkedin/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { LinkedInOAuthService } from '@/lib/oauth/linkedin-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial
  if (error) {
    console.log('LinkedIn OAuth error:', error, errorDescription);
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
    const service = new LinkedInOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=linkedin&account=${account.id}`
    );
  } catch (error) {
    console.error('LinkedIn OAuth callback failed:', error);
    
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

**File**: `src/app/api/oauth/linkedin/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  // LinkedIn doesn't support refresh tokens
  return NextResponse.json(
    { 
      error: 'LinkedIn does not support token refresh',
      message: 'Please disconnect and reconnect your LinkedIn account to refresh authentication.',
      requiresReauth: true
    },
    { status: 400 }
  );
}
```

### Step 5: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/linkedin/disconnect/route.ts`

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
        platform: Platform.LINKEDIN,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Note: LinkedIn doesn't provide token revocation endpoint
    // Simply delete from database
    await prisma.socialAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ 
      success: true,
      message: 'LinkedIn account disconnected'
    });
  } catch (error) {
    console.error('LinkedIn disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 6: Testing (20 min)

#### Manual Testing Checklist

- [ ] Authorization URL opens LinkedIn OAuth page
- [ ] User can approve app with correct permissions
- [ ] Callback receives tokens successfully
- [ ] Account appears in database with encrypted tokens
- [ ] User profile data correct (name, email, picture)
- [ ] Disconnect removes account from database
- [ ] Refresh route returns appropriate error

---

## Platform-Specific Implementation Details

### OpenID Connect UserInfo Response

```json
{
  "sub": "a1b2c3d4e5",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://media.licdn.com/dms/image/...",
  "email": "john.doe@example.com",
  "email_verified": true,
  "locale": "en-US"
}
```

### Token Response Format

```json
{
  "access_token": "AQXdSP_W41_UPs5ioq_t...",
  "expires_in": 5184000,
  "scope": "openid profile email w_member_social"
}
```

**Note**: No refresh token provided. Access token expires in 60 days (5,184,000 seconds).

### Error Responses

```json
{
  "error": "invalid_request",
  "error_description": "Missing required parameter: redirect_uri"
}
```

```json
{
  "error": "access_denied",
  "error_description": "The user denied your request"
}
```

---

## Security Considerations

### CSRF Protection
- State parameter validated on callback
- 10-minute expiration enforced
- Single-use token

### No Refresh Tokens
- Users must re-authenticate every 60 days
- Implement token expiry monitoring
- Show re-authentication prompt when token near expiration

### Scope Access
- Only request necessary scopes
- `w_member_social` requires LinkedIn review and approval
- Plan for scope upgrade flow if needed

---

## Known Limitations

### Platform Constraints
- **No Refresh Tokens**: Must re-authenticate every 60 days
- **Review Required**: `w_member_social` scope requires LinkedIn approval
- **Rate Limits**: 100 posts per day per user
- **OpenID Only**: Must use OpenID Connect for profile data (not REST API v2)

### API Restrictions
- Cannot post as company page without additional permissions
- Cannot schedule posts (must post immediately)
- Limited analytics data compared to native LinkedIn

---

## Troubleshooting

### Issue: "Application does not have access to this feature"
**Cause**: `w_member_social` scope not approved
**Solution**:
1. Go to LinkedIn Developers → Your App → Products
2. Request access to "Share on LinkedIn"
3. Wait for approval (usually 24-48 hours)
4. Re-authenticate user after approval

### Issue: "Redirect URI mismatch"
**Cause**: Callback URL doesn't match LinkedIn app settings
**Solution**:
1. Check Developer Portal → Auth → Authorized redirect URLs
2. Verify exact match including protocol and port
3. No trailing slash in redirect URL

### Issue: Token expired after 60 days
**Cause**: LinkedIn tokens expire without refresh
**Solution**:
1. Implement token expiry monitoring
2. Show re-authentication prompt to user
3. Update account status to 'TOKEN_EXPIRED'
4. Provide "Reconnect" button in UI

---

## API Reference

### LinkedIn Documentation
- **OAuth 2.0**: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
- **Share API**: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
- **OpenID Connect**: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
- **Rate Limits**: https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits

### Endpoints Used

1. **Authorization**: `https://www.linkedin.com/oauth/v2/authorization`
2. **Token Exchange**: `https://www.linkedin.com/oauth/v2/accessToken`
3. **User Profile** (OpenID): `https://api.linkedin.com/v2/userinfo`
4. **Create Post**: `https://api.linkedin.com/v2/ugcPosts` (future use)

---

## Success Criteria

- [ ] LinkedIn Developer App created and approved
- [ ] OAuth credentials configured in .env
- [ ] LinkedInOAuthService implemented
- [ ] All 5 API routes created
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored with encrypted tokens
- [ ] Profile data fetched correctly
- [ ] Disconnect works
- [ ] Refresh route returns appropriate error
- [ ] Documentation updated

**Estimated Time**: 60-90 minutes

---

## Next Steps

After completing LinkedIn OAuth:

**Phase 9D-3**: Instagram OAuth (via Facebook Graph API)
