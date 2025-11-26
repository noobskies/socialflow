# Phase 9D-1: Twitter/X OAuth Integration

## Overview

Implement OAuth 2.0 authentication for Twitter/X, enabling users to connect their Twitter accounts for posting and analytics. This is the **first platform implementation** and includes building the shared OAuth infrastructure.

**Estimated Time**: 3-4 hours (includes infrastructure setup)
**Dependencies**: Phase 9C complete (Accounts API)
**Difficulty**: Medium (includes infrastructure setup)

---

## Prerequisites

### Required Credentials
- Twitter Developer Account
- Twitter App with OAuth 2.0 enabled
- Client ID and Client Secret

### Developer Portal Setup

1. **Visit Twitter Developer Portal**
   - Go to https://developer.twitter.com/portal/dashboard
   - Sign in with your Twitter account

2. **Create a New Project**
   - Click "Create Project"
   - Name: "SocialFlow"
   - Use case: "Building a Social Media Management Tool"
   - Project description: "AI-powered social media management platform"

3. **Create App**
   - Click "Create App"
   - App name: "SocialFlow Production" (or similar unique name)
   - Click "Complete"

4. **Configure OAuth 2.0 Settings**
   - Navigate to App Settings → User authentication settings
   - Click "Set up"
   - **App permissions**: Read and Write
   - **Type of App**: Web App, Automated App or Bot
   - **App info**:
     - Callback URI: `http://localhost:3000/api/oauth/twitter/callback`
     - Website URL: `http://localhost:3000`
   - Click "Save"

5. **Get Credentials**
   - Copy **Client ID** (save to .env as TWITTER_CLIENT_ID)
   - Copy **Client Secret** (save to .env as TWITTER_CLIENT_SECRET)
   - Keep these secure!

### Environment Variables

Add to `.env`:

```bash
# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
```

### Required Scopes

```typescript
scopes: [
  'tweet.read',      // Read tweets
  'tweet.write',     // Post tweets
  'users.read',      // Read user profile
  'offline.access'   // Get refresh tokens
]
```

**Scope Explanations**:
- `tweet.read` - Required to fetch user's tweets and timeline
- `tweet.write` - Required to post tweets on behalf of user
- `users.read` - Required to get user profile (username, display name, avatar)
- `offline.access` - Required to receive refresh tokens for long-term access

### Platform-Specific Notes

- **PKCE Required**: Twitter requires PKCE (code challenge/verifier) for all OAuth flows
- **Token Lifetime**: Access tokens expire in 2 hours
- **Refresh Tokens**: Provided with `offline.access` scope, valid until revoked
- **Rate Limits**: 
  - OAuth token endpoint: 10 requests per 15 minutes per app
  - User lookup: 300 requests per 15 minutes per user
- **Special Requirements**: Must use OAuth 2.0 (not OAuth 1.0a)

---

## Implementation Plan

### Architecture

```
User clicks "Connect Twitter"
         ↓
POST /api/oauth/twitter/authorize
         ↓
Generate state + code_verifier
Store in database (OAuthState)
         ↓
Redirect to Twitter OAuth page
         ↓
User authorizes app
         ↓
GET /api/oauth/twitter/callback?code=...&state=...
         ↓
Validate state parameter
Exchange code + code_verifier for tokens
         ↓
GET user profile from Twitter
         ↓
Save account to database (encrypted tokens)
         ↓
Redirect to settings page with success message
```

### API Routes

1. **POST /api/oauth/twitter/authorize** - Initiate OAuth flow
2. **GET /api/oauth/twitter/callback** - Handle OAuth callback
3. **POST /api/oauth/twitter/refresh** - Refresh access token
4. **POST /api/oauth/twitter/disconnect** - Disconnect account

### Service Class

**TwitterOAuthService** extends BaseOAuthService

**Key Methods**:
- `exchangeCodeForTokens()` - Exchange auth code for access/refresh tokens
- `getUserProfile()` - Fetch user data from Twitter API v2
- `refreshAccessToken()` - Get new access token using refresh token
- `getTokenExpiry()` - Calculate token expiration date

### Files to Create

1. **Infrastructure** (Phase 9D-0)
   - `src/lib/oauth/base-oauth-service.ts`
   - `src/lib/oauth/token-encryption.ts`
   - Database migration for OAuthState model

2. **Twitter-Specific** (This Phase)
   - `src/lib/oauth/twitter-oauth-service.ts`
   - `src/app/api/oauth/twitter/authorize/route.ts`
   - `src/app/api/oauth/twitter/callback/route.ts`
   - `src/app/api/oauth/twitter/refresh/route.ts`
   - `src/app/api/oauth/twitter/disconnect/route.ts`

---

## Implementation Steps

### Step 1: Build Infrastructure (60-90 min)

**See Phase 9D-0 documentation for complete infrastructure setup.**

1. Create BaseOAuthService class
2. Implement token encryption
3. Add OAuthState database model
4. Run migration
5. Generate encryption key

**Verify infrastructure**:
```bash
npx prisma studio
# Check that oauth_states table exists
```

### Step 2: Create Twitter OAuth Service (45 min)

**File**: `src/lib/oauth/twitter-oauth-service.ts`

```typescript
import { BaseOAuthService, OAuthTokens, UserProfile } from './base-oauth-service';
import { Platform } from '@prisma/client';

export class TwitterOAuthService extends BaseOAuthService {
  platform = Platform.TWITTER;
  authorizationUrl = 'https://twitter.com/i/oauth2/authorize';
  tokenUrl = 'https://api.twitter.com/2/oauth2/token';
  profileUrl = 'https://api.twitter.com/2/users/me';
  scopes = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/twitter/callback`;

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
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twitter token exchange failed:', error);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(
      `${this.profileUrl}?user.fields=profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Twitter profile fetch failed:', error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    const user = data.data;

    return {
      id: user.id,
      username: user.username,
      displayName: user.name,
      avatar: user.profile_image_url,
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
      console.error('Twitter token refresh failed:', error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  getTokenExpiry(response: any): Date | null {
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  // Optional: Revoke token when user disconnects
  async revokeToken(accessToken: string): Promise<void> {
    try {
      await fetch('https://api.twitter.com/2/oauth2/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${this.getClientId()}:${this.getClientSecret()}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          token: accessToken,
          token_type_hint: 'access_token',
        }),
      });
    } catch (error) {
      console.error('Token revocation failed (non-critical):', error);
      // Don't throw - revocation is best effort
    }
  }
}
```

### Step 3: Create Authorization Route (15 min)

**File**: `src/app/api/oauth/twitter/authorize/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { TwitterOAuthService } from '@/lib/oauth/twitter-oauth-service';

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const service = new TwitterOAuthService();
    const authorizationUrl = await service.initiateOAuth(user!.id);
    
    return NextResponse.json({ 
      url: authorizationUrl 
    });
  } catch (error) {
    console.error('Twitter OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Twitter OAuth' },
      { status: 500 }
    );
  }
}
```

### Step 4: Create Callback Route (30 min)

**File**: `src/app/api/oauth/twitter/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { TwitterOAuthService } from '@/lib/oauth/twitter-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle user denial
  if (error) {
    console.log('Twitter OAuth error:', error);
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
    const service = new TwitterOAuthService();
    const account = await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${baseUrl}/settings/accounts?success=twitter&account=${account.id}`
    );
  } catch (error) {
    console.error('Twitter OAuth callback failed:', error);
    
    // Provide specific error messages
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

### Step 5: Create Refresh Route (15 min)

**File**: `src/app/api/oauth/twitter/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { TwitterOAuthService } from '@/lib/oauth/twitter-oauth-service';
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
        platform: Platform.TWITTER,
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

    const service = new TwitterOAuthService();
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
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Twitter token refresh failed:', error);
    
    // Mark account as having token issues
    if (request.json && (await request.json()).accountId) {
      await prisma.socialAccount.update({
        where: { id: (await request.json()).accountId },
        data: { status: 'TOKEN_EXPIRED' },
      }).catch(() => {});
    }
    
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

### Step 6: Create Disconnect Route (10 min)

**File**: `src/app/api/oauth/twitter/disconnect/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { TwitterOAuthService } from '@/lib/oauth/twitter-oauth-service';
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
        platform: Platform.TWITTER,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Optional: Revoke token on Twitter
    if (account.accessToken) {
      const service = new TwitterOAuthService();
      const decryptedToken = service.decryptToken(account.accessToken);
      await service.revokeToken(decryptedToken);
    }

    // Delete from database
    await prisma.socialAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Twitter account disconnected'
    });
  } catch (error) {
    console.error('Twitter disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

### Step 7: Testing (45 min)

#### Unit Tests

**File**: `src/lib/oauth/__tests__/twitter-oauth-service.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { TwitterOAuthService } from '../twitter-oauth-service';

describe('TwitterOAuthService', () => {
  const service = new TwitterOAuthService();

  it('should have correct platform configuration', () => {
    expect(service.platform).toBe('TWITTER');
    expect(service.authorizationUrl).toContain('twitter.com');
    expect(service.scopes).toContain('tweet.write');
  });

  it('should generate valid authorization URL', async () => {
    const userId = 'test-user-id';
    const url = await service.initiateOAuth(userId);
    
    expect(url).toContain('twitter.com/i/oauth2/authorize');
    expect(url).toContain('client_id=');
    expect(url).toContain('state=');
    expect(url).toContain('code_challenge=');
  });

  it('should calculate token expiry correctly', () => {
    const response = { expires_in: 7200 };
    const expiry = service.getTokenExpiry(response);
    
    expect(expiry).toBeInstanceOf(Date);
    expect(expiry!.getTime()).toBeGreaterThan(Date.now());
  });
});
```

#### Manual Testing Checklist

1. **Authorization Flow**
   ```bash
   # Start dev server
   npm run dev
   
   # Navigate to http://localhost:3000/settings/accounts
   # Click "Connect Twitter"
   # Should redirect to Twitter OAuth page
   ```

2. **User Authorization**
   - Verify app name and permissions displayed correctly
   - Click "Authorize app"
   - Should redirect back to app

3. **Callback Handling**
   - Verify redirect to `/settings/accounts?success=twitter`
   - Check database for new account:
     ```bash
     npx prisma studio
     # Check SocialAccount table
     ```

4. **Token Storage**
   - Verify tokens are encrypted (not plaintext in database)
   - Verify all fields populated correctly

5. **Token Refresh**
   ```bash
   curl -X POST http://localhost:3000/api/oauth/twitter/refresh \
     -H "Content-Type: application/json" \
     -d '{"accountId": "account-id-here"}' \
     -H "Cookie: your-session-cookie"
   ```

6. **Disconnect**
   ```bash
   curl -X POST http://localhost:3000/api/oauth/twitter/disconnect \
     -H "Content-Type: application/json" \
     -d '{"accountId": "account-id-here"}' \
     -H "Cookie: your-session-cookie"
   ```

---

## Platform-Specific Implementation Details

### Twitter API v2 User Object

```json
{
  "data": {
    "id": "123456789",
    "name": "John Doe",
    "username": "johndoe",
    "profile_image_url": "https://pbs.twimg.com/profile_images/..."
  }
}
```

### Token Response Format

```json
{
  "token_type": "bearer",
  "expires_in": 7200,
  "access_token": "VGhpc0lzQW5FeGFtcGxlVG9rZW4...",
  "scope": "tweet.read tweet.write users.read offline.access",
  "refresh_token": "bWaXNBblVuZGVmaW5lZEhhc2hDb2Rl..."
}
```

### PKCE Implementation

Twitter requires PKCE with S256 challenge method:

```typescript
// Code verifier: 43-128 character random string
const codeVerifier = generateCodeVerifier(); // Base64url random string

// Code challenge: SHA256(verifier) base64url encoded
const codeChallenge = generateCodeChallenge(codeVerifier);

// Send challenge in authorization request
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

// Send verifier in token exchange
tokenParams.set('code_verifier', codeVerifier);
```

### Error Responses

Common Twitter OAuth errors:

```json
{
  "error": "invalid_request",
  "error_description": "Value passed for the authorization code was invalid."
}
```

```json
{
  "error": "invalid_grant",
  "error_description": "The provided authorization grant is invalid, expired, or revoked."
}
```

---

## Security Considerations

### CSRF Protection
- State parameter is unique per request
- Stored in database with 10-minute expiration
- Validated on callback before token exchange
- Deleted after single use

### PKCE Implementation
- Code verifier: 128 character base64url string
- Code challenge: SHA256 hash of verifier
- Protects against authorization code interception
- Required by Twitter API

### Token Storage
- Access tokens encrypted with AES-256-GCM
- Refresh tokens encrypted separately
- Never logged or exposed in responses
- Decrypted only when needed for API calls

### Scope Minimization
Only request necessary permissions:
- `tweet.read` - Required for viewing tweets
- `tweet.write` - Required for posting
- `users.read` - Required for profile info
- `offline.access` - Required for long-term access

---

## Known Limitations

### Twitter API Limitations
- **Access Token Expiry**: 2 hours (must refresh frequently)
- **Rate Limits**: 
  - Token endpoint: 10 requests/15 min per app
  - User lookup: 300 requests/15 min per user
- **No Scope Upgrade**: Must re-authorize to add permissions

### Platform Constraints
- OAuth 2.0 only (OAuth 1.0a deprecated)
- PKCE required (no implicit flow)
- Callback URL must match exactly (including protocol)

---

## Troubleshooting

### Issue: "Invalid redirect URI"
**Cause**: Callback URL doesn't match Twitter app settings
**Solution**: 
1. Check Twitter Developer Portal → App Settings → User authentication settings
2. Verify callback URL exactly matches: `http://localhost:3000/api/oauth/twitter/callback`
3. Include protocol (http/https) and port

### Issue: "Invalid state parameter"
**Cause**: State expired or doesn't match
**Solution**:
1. Check OAuthState record in database
2. Verify 10-minute expiration hasn't passed
3. Clear expired states: `DELETE FROM oauth_states WHERE expiresAt < NOW()`

### Issue: "Token exchange failed"
**Cause**: Invalid code verifier or expired authorization code
**Solution**:
1. Verify code verifier stored correctly in database
2. Exchange code immediately (within 30 seconds)
3. Check client credentials are correct

### Issue: "Failed to fetch user profile"
**Cause**: Invalid access token or incorrect API call
**Solution**:
1. Verify token not expired
2. Check Authorization header format: `Bearer {token}`
3. Verify user.fields parameter included in request

---

## API Reference

### Twitter API v2 Documentation
- **OAuth 2.0**: https://developer.twitter.com/en/docs/authentication/oauth-2-0
- **User lookup**: https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me
- **Post tweet**: https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
- **Rate limits**: https://developer.twitter.com/en/docs/twitter-api/rate-limits

### Endpoints Used

1. **Authorization**: `https://twitter.com/i/oauth2/authorize`
2. **Token Exchange**: `https://api.twitter.com/2/oauth2/token`
3. **User Profile**: `https://api.twitter.com/2/users/me`
4. **Token Revocation**: `https://api.twitter.com/2/oauth2/revoke`

---

## Success Criteria

- [ ] Infrastructure complete (Phase 9D-0)
- [ ] Twitter Developer App created
- [ ] OAuth credentials configured
- [ ] TwitterOAuthService implemented
- [ ] All 4 API routes created
- [ ] Unit tests passing
- [ ] Manual OAuth flow works end-to-end
- [ ] Account stored in database with encrypted tokens
- [ ] Token refresh works correctly
- [ ] Disconnect removes account successfully
- [ ] No plaintext tokens in database
- [ ] Error handling works for common failures

**Estimated Total Time**: 3-4 hours

---

## Next Steps

After completing Twitter OAuth:

**Phase 9D-2**: LinkedIn OAuth (uses same infrastructure)
**Phase 9D-3**: Instagram OAuth (via Facebook)
**Phase 9D-4**: Facebook OAuth
**Phase 9D-5**: TikTok OAuth
**Phase 9D-6**: YouTube OAuth (Google)
**Phase 9D-7**: Pinterest OAuth
