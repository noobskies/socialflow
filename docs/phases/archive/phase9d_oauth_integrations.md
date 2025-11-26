# Phase 9D: Social Platform OAuth Integrations

**Objective**: Implement OAuth authentication flows for connecting social media accounts (Twitter, LinkedIn, Instagram, Facebook, TikTok, YouTube, Pinterest).

**Estimated Time**: 6-8 hours

**Prerequisites**:
- Phase 9A complete (Database with SocialAccount model)
- Phase 9B complete (Authentication system)
- Phase 9C complete (Accounts API endpoints)
- OAuth app credentials from each platform

---

## Overview

This phase implements OAuth 2.0 flows to securely connect users' social media accounts. Each platform has unique OAuth requirements, scopes, and API endpoints.

**OAuth Flow**:
1. User clicks "Connect [Platform]" button
2. Redirect to platform's OAuth authorization page
3. User grants permissions
4. Platform redirects back with authorization code
5. Exchange code for access/refresh tokens
6. Store tokens in database
7. Fetch user profile data

**Platforms Covered**:
- Twitter/X (OAuth 2.0)
- LinkedIn (OAuth 2.0)
- Instagram (via Facebook OAuth)
- Facebook (OAuth 2.0)
- TikTok (OAuth 2.0)
- YouTube (Google OAuth 2.0)
- Pinterest (OAuth 2.0)

---

## Step 1: Environment Variables

Add to `.env.local`:

```bash
# Application URL
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Twitter/X OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Facebook/Instagram OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Google (YouTube) OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# TikTok OAuth
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Pinterest OAuth
PINTEREST_APP_ID=your_pinterest_app_id
PINTEREST_APP_SECRET=your_pinterest_app_secret
```

---

## Step 2: OAuth Configuration Helper

Create `src/lib/oauth-config.ts`:

```typescript
export const oauthConfigs = {
  twitter: {
    authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    profileUrl: 'https://api.twitter.com/2/users/me',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  },
  linkedin: {
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    profileUrl: 'https://api.linkedin.com/v2/userinfo',
    scopes: ['openid', 'profile', 'email', 'w_member_social'],
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  },
  facebook: {
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    profileUrl: 'https://graph.facebook.com/me',
    scopes: [
      'pages_manage_posts',
      'pages_read_engagement',
      'instagram_basic',
      'instagram_content_publish',
    ],
    clientId: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
  },
  google: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    profileUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  tiktok: {
    authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    profileUrl: 'https://open.tiktokapis.com/v2/user/info/',
    scopes: ['user.info.basic', 'video.publish', 'video.list'],
    clientId: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
  },
  pinterest: {
    authorizationUrl: 'https://www.pinterest.com/oauth/',
    tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
    profileUrl: 'https://api.pinterest.com/v5/user_account',
    scopes: ['boards:read', 'boards:write', 'pins:read', 'pins:write'],
    clientId: process.env.PINTEREST_APP_ID!,
    clientSecret: process.env.PINTEREST_APP_SECRET!,
  },
};

export type Platform = keyof typeof oauthConfigs;

export function getOAuthConfig(platform: Platform) {
  return oauthConfigs[platform];
}

export function generateState() {
  return Buffer.from(crypto.randomUUID()).toString('base64url');
}

export function generateCodeVerifier() {
  return Buffer.from(crypto.randomUUID() + crypto.randomUUID()).toString('base64url');
}

export function generateCodeChallenge(verifier: string) {
  return Buffer.from(
    require('crypto').createHash('sha256').update(verifier).digest()
  ).toString('base64url');
}
```

---

## Step 3: OAuth Initiation Route

Create `src/app/api/oauth/[platform]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { getOAuthConfig, generateState, generateCodeVerifier, generateCodeChallenge } from '@/lib/oauth-config';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const platform = params.platform as any;
  const config = getOAuthConfig(platform);

  if (!config) {
    return NextResponse.json(
      { error: 'Invalid platform' },
      { status: 400 }
    );
  }

  // Generate PKCE parameters for security
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store in HTTP-only cookies
  const cookieStore = cookies();
  cookieStore.set(`oauth_state_${platform}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });
  cookieStore.set(`oauth_verifier_${platform}`, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  });

  // Build authorization URL
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`;
  const authUrl = new URL(config.authorizationUrl);
  
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', config.scopes.join(' '));
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  // Platform-specific parameters
  if (platform === 'twitter') {
    authUrl.searchParams.set('code_challenge_method', 'S256');
  } else if (platform === 'google') {
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
  }

  return NextResponse.redirect(authUrl.toString());
}
```

---

## Step 4: OAuth Callback Route

Create `src/app/api/oauth/[platform]/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { getOAuthConfig } from '@/lib/oauth-config';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { user, error } = await requireAuth();
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=unauthorized`
    );
  }

  const platform = params.platform as any;
  const config = getOAuthConfig(platform);
  const { searchParams } = new URL(request.url);

  // Extract OAuth response
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=${errorParam}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=missing_params`
    );
  }

  // Verify state to prevent CSRF
  const cookieStore = cookies();
  const storedState = cookieStore.get(`oauth_state_${platform}`)?.value;
  const codeVerifier = cookieStore.get(`oauth_verifier_${platform}`)?.value;

  if (!storedState || state !== storedState) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=invalid_state`
    );
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`;
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        ...(codeVerifier && { code_verifier: codeVerifier }),
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();

    // Fetch user profile from platform
    const profileResponse = await fetch(config.profileUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile');
    }

    const profile = await profileResponse.json();

    // Extract platform-specific data
    const accountData = extractPlatformData(platform, profile, tokens);

    // Save or update account in database
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: user!.id,
        platform: platform.toUpperCase() as any,
      },
    });

    if (existingAccount) {
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          ...accountData,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000)
            : null,
          connected: true,
          status: 'ACTIVE',
        },
      });
    } else {
      await prisma.socialAccount.create({
        data: {
          userId: user!.id,
          platform: platform.toUpperCase() as any,
          ...accountData,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000)
            : null,
          connected: true,
          status: 'ACTIVE',
        },
      });
    }

    // Clean up cookies
    cookieStore.delete(`oauth_state_${platform}`);
    cookieStore.delete(`oauth_verifier_${platform}`);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?connected=${platform}`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=oauth_failed`
    );
  }
}

function extractPlatformData(platform: string, profile: any, tokens: any) {
  switch (platform) {
    case 'twitter':
      return {
        username: profile.data?.username || profile.username,
        displayName: profile.data?.name || profile.name,
        avatar: profile.data?.profile_image_url,
        platformUserId: profile.data?.id || profile.id,
      };

    case 'linkedin':
      return {
        username: profile.email,
        displayName: profile.name,
        avatar: profile.picture,
        platformUserId: profile.sub,
      };

    case 'facebook':
      return {
        username: profile.name,
        displayName: profile.name,
        avatar: profile.picture?.data?.url,
        platformUserId: profile.id,
      };

    case 'google':
      return {
        username: profile.email,
        displayName: profile.name,
        avatar: profile.picture,
        platformUserId: profile.id,
      };

    case 'tiktok':
      return {
        username: profile.data?.user?.display_name,
        displayName: profile.data?.user?.display_name,
        avatar: profile.data?.user?.avatar_url,
        platformUserId: profile.data?.user?.open_id,
      };

    case 'pinterest':
      return {
        username: profile.username,
        displayName: profile.username,
        avatar: profile.profile_image,
        platformUserId: profile.id,
      };

    default:
      return {
        username: 'Unknown',
        displayName: 'Unknown',
        platformUserId: 'unknown',
      };
  }
}
```

---

## Step 5: Token Refresh Utility

Create `src/lib/oauth-refresh.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { getOAuthConfig } from '@/lib/oauth-config';

export async function refreshAccessToken(accountId: string) {
  const account = await prisma.socialAccount.findUnique({
    where: { id: accountId },
  });

  if (!account || !account.refreshToken) {
    throw new Error('Account or refresh token not found');
  }

  const config = getOAuthConfig(account.platform.toLowerCase() as any);

  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: account.refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();

    // Update account with new tokens
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || account.refreshToken,
        tokenExpiry: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
        status: 'ACTIVE',
      },
    });

    return tokens.access_token;
  } catch (error) {
    // Mark account as having token issues
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: { status: 'TOKEN_EXPIRED' },
    });
    throw error;
  }
}

export async function getValidAccessToken(accountId: string) {
  const account = await prisma.socialAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  // Check if token is expired or about to expire (within 5 minutes)
  const now = new Date();
  const expiryBuffer = new Date(now.getTime() + 5 * 60 * 1000);

  if (account.tokenExpiry && account.tokenExpiry < expiryBuffer) {
    // Token expired or expiring soon, refresh it
    return await refreshAccessToken(accountId);
  }

  return account.accessToken;
}
```

---

## Step 6: Connect Account UI Component

Create `src/components/settings/ConnectAccountButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Platform } from '@/lib/oauth-config';

interface Props {
  platform: Platform;
  connected: boolean;
  onDisconnect?: () => void;
}

const platformLabels = {
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  google: 'YouTube',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
};

export function ConnectAccountButton({ platform, connected, onDisconnect }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    window.location.href = `/api/oauth/${platform}`;
  };

  const handleDisconnect = async () => {
    if (onDisconnect) {
      setLoading(true);
      await onDisconnect();
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">{platformLabels[platform]}</h3>
        <p className="text-sm text-gray-600">
          {connected ? 'Connected' : 'Not connected'}
        </p>
      </div>
      
      {connected ? (
        <button
          onClick={handleDisconnect}
          disabled={loading}
          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      )}
    </div>
  );
}
```

---

## Step 7: Platform App Setup Instructions

### Twitter/X OAuth App Setup

1. Go to https://developer.twitter.com/portal/dashboard
2. Create a new project and app
3. In App Settings → User authentication settings:
   - App permissions: Read and Write
   - Type of App: Web App
   - Callback URL: `http://localhost:3000/api/oauth/twitter/callback`
   - Website URL: `http://localhost:3000`
4. Save Client ID and Client Secret

### LinkedIn OAuth App Setup

1. Go to https://www.linkedin.com/developers/apps
2. Create a new app
3. In Auth tab:
   - Add redirect URL: `http://localhost:3000/api/oauth/linkedin/callback`
   - Request access to `w_member_social` scope
4. Save Client ID and Client Secret

### Facebook/Instagram OAuth Setup

1. Go to https://developers.facebook.com/apps
2. Create a new app (Business type)
3. Add Facebook Login product
4. In Facebook Login → Settings:
   - Add redirect URI: `http://localhost:3000/api/oauth/facebook/callback`
5. Request advanced access for Instagram permissions
6. Save App ID and App Secret

### Google/YouTube OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/oauth/google/callback`
5. Save Client ID and Client Secret

### TikTok OAuth Setup

1. Go to https://developers.tiktok.com/
2. Create a new app
3. In Login Kit:
   - Add redirect URI: `http://localhost:3000/api/oauth/tiktok/callback`
   - Request content posting permissions
4. Save Client Key and Client Secret

### Pinterest OAuth Setup

1. Go to https://developers.pinterest.com/apps/
2. Create a new app
3. In OAuth settings:
   - Add redirect URI: `http://localhost:3000/api/oauth/pinterest/callback`
4. Save App ID and App Secret

---

## Step 8: Testing OAuth Flows

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Twitter Connection

1. Navigate to Settings page
2. Click "Connect Twitter"
3. Authorize on Twitter
4. Should redirect back with success message

### 3. Verify Token Storage

```bash
npx prisma studio
```

Check `SocialAccount` table for stored tokens.

### 4. Test Token Refresh

```typescript
// In any API route
import { getValidAccessToken } from '@/lib/oauth-refresh';

const token = await getValidAccessToken(accountId);
```

---

## Security Best Practices

1. **HTTPS Only in Production**
   - All OAuth callbacks must use HTTPS
   - Update `.env` for production URLs

2. **Token Encryption**
   - Consider encrypting tokens at rest
   - Use environment-specific encryption keys

3. **State Parameter**
   - Always verify state to prevent CSRF
   - Use HTTP-only cookies

4. **PKCE Flow**
   - Implement for all platforms
   - Protects against authorization code interception

5. **Scope Minimization**
   - Only request needed permissions
   - Can expand scopes later

---

## Next Steps

**Phase 9E**: File Storage & Media Upload
- Vercel Blob Storage integration
- Image upload and resize
- Video processing

---

## Verification Checklist

- [ ] OAuth apps created for all platforms
- [ ] Environment variables configured
- [ ] OAuth initiation routes working
- [ ] Callback routes handling tokens
- [ ] Tokens stored in database
- [ ] Token refresh mechanism tested
- [ ] Connect/disconnect UI working
- [ ] State verification implemented
- [ ] PKCE flow implemented
- [ ] Error handling for failed OAuth

**Time Spent**: ___ hours

**Notes**:
