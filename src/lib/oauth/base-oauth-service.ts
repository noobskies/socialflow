import { prisma } from "@/lib/prisma";
import { Platform } from "../../generated/prisma/client";
import crypto from "crypto";
import { encrypt, decrypt } from "./token-encryption";

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
  scope?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

/**
 * Abstract base class for OAuth service implementations
 * All platform-specific OAuth services should extend this class
 */
export abstract class BaseOAuthService {
  // Platform-specific configuration (must be implemented by subclasses)
  abstract platform: Platform;
  abstract authorizationUrl: string;
  abstract tokenUrl: string;
  abstract profileUrl: string;
  abstract scopes: string[];

  // Platform-specific implementations (must be implemented by subclasses)
  abstract exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens>;

  abstract getUserProfile(accessToken: string): Promise<UserProfile>;

  abstract refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;

  abstract getTokenExpiry(response: any): Date | null;

  /**
   * Initiates the OAuth flow by generating authorization URL
   * @param userId - The user ID initiating OAuth
   * @returns Authorization URL to redirect user to
   */
  async initiateOAuth(userId: string): Promise<string> {
    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    // Store state and verifier in database with 10-minute expiration
    await prisma.oAuthState.create({
      data: {
        userId,
        platform: this.platform,
        state,
        codeVerifier,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Build authorization URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${this.platform.toLowerCase()}/callback`;
    const authUrl = new URL(this.authorizationUrl);

    authUrl.searchParams.set("client_id", this.getClientId());
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", this.scopes.join(" "));
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");

    return authUrl.toString();
  }

  /**
   * Handles the OAuth callback after user authorization
   * @param code - Authorization code from OAuth provider
   * @param state - State parameter for CSRF protection
   * @returns Created/updated social account
   */
  async handleCallback(code: string, state: string): Promise<any> {
    // Validate state parameter
    const oauthState = await prisma.oAuthState.findFirst({
      where: {
        state,
        platform: this.platform,
        expiresAt: { gt: new Date() },
      },
    });

    if (!oauthState) {
      throw new Error("Invalid or expired state");
    }

    // Exchange authorization code for tokens
    const tokens = await this.exchangeCodeForTokens(
      code,
      oauthState.codeVerifier
    );

    // Fetch user profile from platform
    const profile = await this.getUserProfile(tokens.access_token);

    // Save account to database
    const account = await this.saveAccount(oauthState.userId, profile, tokens);

    // Clean up state (one-time use)
    await prisma.oAuthState.delete({ where: { id: oauthState.id } });

    return account;
  }

  /**
   * Saves or updates social account in database
   * @param userId - User ID
   * @param profile - User profile from platform
   * @param tokens - OAuth tokens
   * @returns Created/updated account
   */
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
        refreshToken: tokens.refresh_token
          ? this.encryptToken(tokens.refresh_token)
          : null,
        tokenExpiry,
        connected: true,
        status: "ACTIVE",
      },
      update: {
        platformUserId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        accessToken: this.encryptToken(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? this.encryptToken(tokens.refresh_token)
          : null,
        tokenExpiry,
        connected: true,
        status: "ACTIVE",
        lastChecked: new Date(),
      },
    });
  }

  // PKCE Helper Methods

  /**
   * Generates a random state parameter for CSRF protection
   */
  protected generateState(): string {
    return Buffer.from(crypto.randomUUID()).toString("base64url");
  }

  /**
   * Generates a random code verifier for PKCE
   */
  protected generateCodeVerifier(): string {
    return Buffer.from(crypto.randomUUID() + crypto.randomUUID()).toString(
      "base64url"
    );
  }

  /**
   * Generates code challenge from verifier using SHA256
   */
  protected generateCodeChallenge(verifier: string): string {
    const hash = crypto.createHash("sha256").update(verifier).digest();
    return Buffer.from(hash).toString("base64url");
  }

  // Token Encryption Methods

  /**
   * Encrypts a token for secure storage
   */
  protected encryptToken(token: string): string {
    return encrypt(token);
  }

  /**
   * Decrypts a token for API use
   */
  public decryptToken(encryptedToken: string): string {
    return decrypt(encryptedToken);
  }

  // Environment Variable Helpers

  /**
   * Gets client ID from environment variables
   */
  protected getClientId(): string {
    const key = `${this.platform}_CLIENT_ID`;
    const value = process.env[key];
    if (!value) throw new Error(`${key} not configured`);
    return value;
  }

  /**
   * Gets client secret from environment variables
   */
  protected getClientSecret(): string {
    const key = `${this.platform}_CLIENT_SECRET`;
    const value = process.env[key];
    if (!value) throw new Error(`${key} not configured`);
    return value;
  }
}
