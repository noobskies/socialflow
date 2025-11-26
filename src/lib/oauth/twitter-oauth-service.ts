import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class TwitterOAuthService extends BaseOAuthService {
  platform = Platform.TWITTER;
  authorizationUrl = "https://twitter.com/i/oauth2/authorize";
  tokenUrl = "https://api.twitter.com/2/oauth2/token";
  profileUrl = "https://api.twitter.com/2/users/me";
  scopes = ["tweet.read", "tweet.write", "users.read", "offline.access"];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/twitter/callback`;

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.getClientId()}:${this.getClientSecret()}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Twitter token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(
      `${this.profileUrl}?user.fields=profile_image_url`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Twitter profile fetch failed:", error);
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
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.getClientId()}:${this.getClientSecret()}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Twitter token refresh failed:", error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  getTokenExpiry(response: OAuthTokens): Date | null {
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  /**
   * Optional: Revoke token when user disconnects
   */
  async revokeToken(accessToken: string): Promise<void> {
    try {
      await fetch("https://api.twitter.com/2/oauth2/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.getClientId()}:${this.getClientSecret()}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          token: accessToken,
          token_type_hint: "access_token",
        }),
      });
    } catch (error) {
      console.error("Token revocation failed (non-critical):", error);
      // Don't throw - revocation is best effort
    }
  }
}
