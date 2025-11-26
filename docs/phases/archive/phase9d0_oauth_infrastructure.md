# Phase 9D-0: OAuth Infrastructure

## Overview

This document describes the **shared infrastructure** for all OAuth integrations. This infrastructure is built during Phase 9D-1 (Twitter OAuth) and reused across all subsequent platforms.

**Purpose**: Establish reusable patterns for OAuth flows across 7 social platforms

**Components**:
- BaseOAuthService (abstract class)
- Token encryption utilities
- State management patterns
- Common route patterns
- Error handling standards

---

## Core Infrastructure Components

### 1. BaseOAuthService (Abstract Class)

**Path**: `src/lib/oauth/base-oauth-service.ts`

All platform-specific OAuth services extend this base class:

```typescript
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export abstract class BaseOAuthService {
  abstract platform: Platform;
  abstract authorizationUrl: string;
  abstract tokenUrl: string;
  abstract profileUrl: string;
  abstract scopes: string[];

  // Must be implemented by platform-specific services
  abstract exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens>;
  
  abstract getUserProfile(accessToken: string): Promise<UserProfile>;
  
  abstract refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;
  
  abstract getTokenExpiry(response: any): Date | null;

  // Shared implementation
  async initiateOAuth(userId: string): Promise<string> {
    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    // Store state and verifier in database
    await prisma.oAuthState.create({
      data: {
        userId,
        platform: this.platform,
        state,
        codeVerifier,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Build authorization URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${this.platform.toLowerCase()}/callback`;
    const authUrl = new URL(this.authorizationUrl);
    
    authUrl.searchParams.set('client_id', this.getClientId());
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.scopes.join(' '));
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    return authUrl.toString();
  }

  async handleCallback(code: string, state: string): Promise<any> {
    // Validate state
    const oauthState = await prisma.oAuthState.findFirst({
      where: {
        state,
        platform: this.platform,
        expiresAt: { gt: new Date() },
      },
    });

    if (!oauthState) {
      throw new Error('Invalid or expired state');
    }

    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(code, oauthState.codeVerifier);

    // Fetch user profile
    const profile = await this.getUserProfile(tokens.access_token);

    // Store account in database
    const account = await this.saveAccount(
      oauthState.userId,
      profile,
      tokens
    );

    // Clean up state
    await prisma.oAuthState.delete({ where: { id: oauthState.id } });

    return account;
  }

  private async saveAccount(
    userId: string,
    profile: UserProfile,
    tokens: OAuthTokens
  ) {
    const tokenExpiry = this.getTokenExpiry(tokens);

    return await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId,
          platform: this.platform,
        },
      },
      create: {
        userId,
        platform: this.platform,
        platformUserId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        accessToken: this.encryptToken(tokens.access_token),
        refreshToken: tokens.refresh_token ? this.encryptToken(tokens.refresh_token) : null,
        tokenExpiry,
        connected: true,
        status: 'ACTIVE',
      },
      update: {
        platformUserId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        accessToken: this.encryptToken(tokens.access_token),
        refreshToken: tokens.refresh_token ? this.encryptToken(tokens.refresh_token) : null,
        tokenExpiry,
        connected: true,
        status: 'ACTIVE',
      },
    });
  }

  // PKCE helpers
  protected generateState(): string {
    return Buffer.from(crypto.randomUUID()).toString('base64url');
  }

  protected generateCodeVerifier(): string {
    return Buffer.from(crypto.randomUUID() + crypto.randomUUID()).toString('base64url');
  }

  protected generateCodeChallenge(verifier: string): string {
    const hash = require('crypto').createHash('sha256').update(verifier).digest();
    return Buffer.from(hash).toString('base64url');
  }

  // Token encryption
  protected encryptToken(token: string): string {
    // Implementation in token-encryption.ts
    const { encrypt } = require('./token-encryption');
    return encrypt(token);
  }

  protected decryptToken(encryptedToken: string): string {
    const { decrypt } = require('./token-encryption');
    return decrypt(encryptedToken);
  }

  // Environment variable helpers
  protected getClientId(): string {
    const key = `${this.platform}_CLIENT_ID`;
    const value = process.env[key];
    if (!value) throw new Error(`${key} not configured`);
    return value;
  }

  protected getClientSecret(): string {
    const key = `${this.platform}_CLIENT_SECRET`;
    const value = process.env[key];
    if (!value) throw new Error(`${key} not configured`);
    return value;
  }
}
```

### 2. Token Encryption

**Path**: `src/lib/oauth/token-encryption.ts`

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

if (!process.env.ENCRYPTION_KEY || KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Generate encryption key (run once, store in .env)
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

### 3. OAuthState Database Model

**Add to Prisma Schema** (`prisma/schema.prisma`):

```prisma
model OAuthState {
  id           String   @id @default(cuid())
  userId       String
  platform     Platform
  state        String   @unique
  codeVerifier String
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([state, platform])
  @@index([expiresAt])
  @@map("oauth_states")
}
```

### 4. Route Patterns

All platforms follow these route patterns:

#### Authorization Route Pattern
**Path**: `src/app/api/oauth/[platform]/authorize/route.ts`

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
    
    return NextResponse.json({ url: authorizationUrl });
  } catch (error) {
    console.error('OAuth initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}
```

#### Callback Route Pattern
**Path**: `src/app/api/oauth/[platform]/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { TwitterOAuthService } from '@/lib/oauth/twitter-oauth-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/accounts?error=${error}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/accounts?error=missing_params`
    );
  }

  try {
    const service = new TwitterOAuthService();
    await service.handleCallback(code, state);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/accounts?success=twitter`
    );
  } catch (error) {
    console.error('OAuth callback failed:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/accounts?error=oauth_failed`
    );
  }
}
```

#### Refresh Route Pattern
**Path**: `src/app/api/oauth/[platform]/refresh/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { TwitterOAuthService } from '@/lib/oauth/twitter-oauth-service';

export async function POST(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { accountId } = await request.json();

    // Verify user owns account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user!.id,
        platform: params.platform.toUpperCase() as any,
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
    const tokens = await service.refreshAccessToken(
      service.decryptToken(account.refreshToken)
    );

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
```

#### Disconnect Route Pattern
**Path**: `src/app/api/oauth/[platform]/disconnect/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { accountId } = await request.json();

    // Verify user owns account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user!.id,
        platform: params.platform.toUpperCase() as any,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Optional: Revoke token on platform
    // const service = new TwitterOAuthService();
    // await service.revokeToken(account.accessToken);

    // Delete from database
    await prisma.socialAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Disconnect failed:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
```

---

## Environment Setup

### Required Environment Variables

Add to `.env`:

```bash
# OAuth Encryption (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=your_64_character_hex_string

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Platform-specific credentials (added per platform)
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
# ... etc for other platforms
```

### Generate Encryption Key

Run once to generate encryption key:

```typescript
// scripts/generate-encryption-key.ts
import crypto from 'crypto';

const key = crypto.randomBytes(32).toString('hex');
console.log('Add to .env:');
console.log(`ENCRYPTION_KEY=${key}`);
```

```bash
npx tsx scripts/generate-encryption-key.ts
```

---

## Database Migration

After adding OAuthState model to schema:

```bash
npx prisma migrate dev --name add_oauth_state
npx prisma generate
```

---

## Security Best Practices

### 1. State Parameter (CSRF Protection)
- Unique random state for each OAuth flow
- 10-minute expiration
- Stored in database, validated on callback
- Deleted after use (one-time use)

### 2. PKCE (Code Challenge)
- Code verifier generated (43-128 characters)
- Code challenge = SHA256(verifier) base64url encoded
- Protects against authorization code interception
- Supported by all modern OAuth 2.0 platforms

### 3. Token Encryption
- AES-256-GCM encryption for tokens at rest
- Unique IV per encryption
- Authentication tag for integrity
- 256-bit encryption key

### 4. Token Storage
- Never log access/refresh tokens
- Encrypt before database storage
- Decrypt only when needed for API calls
- Set short token expiry where possible

### 5. Scopes
- Request minimum necessary permissions
- Document reason for each scope
- Handle scope denial gracefully
- Support scope upgrade if needed

---

## Error Handling Standards

### Error Types

```typescript
export class OAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public platform: string
  ) {
    super(message);
    this.name = 'OAuthError';
  }
}

// Common error codes
export const OAuthErrorCodes = {
  INVALID_STATE: 'invalid_state',
  TOKEN_EXPIRED: 'token_expired',
  REFRESH_FAILED: 'refresh_failed',
  INVALID_CREDENTIALS: 'invalid_credentials',
  USER_DENIED: 'access_denied',
  NETWORK_ERROR: 'network_error',
} as const;
```

### Error Response Format

```json
{
  "error": "oauth_error",
  "message": "User-friendly error message",
  "code": "INVALID_STATE",
  "platform": "TWITTER"
}
```

---

## Testing Infrastructure

### Mock OAuth Service (for testing)

```typescript
// src/lib/oauth/__mocks__/mock-oauth-service.ts
export class MockOAuthService extends BaseOAuthService {
  platform = 'TWITTER' as Platform;
  authorizationUrl = 'http://mock/authorize';
  tokenUrl = 'http://mock/token';
  profileUrl = 'http://mock/profile';
  scopes = ['read', 'write'];

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    return {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 7200,
      token_type: 'Bearer',
    };
  }

  async getUserProfile(): Promise<UserProfile> {
    return {
      id: 'mock_user_id',
      username: 'mockuser',
      displayName: 'Mock User',
      avatar: 'https://example.com/avatar.jpg',
    };
  }

  async refreshAccessToken(): Promise<OAuthTokens> {
    return this.exchangeCodeForTokens('refresh');
  }

  getTokenExpiry(response: any): Date {
    return new Date(Date.now() + response.expires_in * 1000);
  }
}
```

---

## Success Criteria

Infrastructure is complete when:

- [ ] BaseOAuthService class implemented
- [ ] Token encryption working with AES-256-GCM
- [ ] OAuthState database model created and migrated
- [ ] PKCE implementation (verifier/challenge) working
- [ ] Route patterns established for all 4 routes
- [ ] Error handling standards defined
- [ ] Environment variables documented
- [ ] Encryption key generated and stored
- [ ] Database migration applied
- [ ] Ready for platform-specific implementations

---

## Next Steps

After infrastructure is complete:

**Phase 9D-1**: Implement Twitter OAuth (first platform, validates infrastructure)
**Phases 9D-2 to 9D-7**: Implement remaining platforms using established patterns
