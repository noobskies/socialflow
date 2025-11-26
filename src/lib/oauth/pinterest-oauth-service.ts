import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class PinterestOAuthService extends BaseOAuthService {
  platform = Platform.PINTEREST;
  authorizationUrl = "https://www.pinterest.com/oauth/";
  tokenUrl = "https://api.pinterest.com/v5/oauth/token";
  profileUrl = "https://api.pinterest.com/v5/user_account";
  scopes = [
    "user_accounts:read",
    "boards:read",
    "boards:write",
    "pins:read",
    "pins:write",
  ];

  async exchangeCodeForTokens(
    code: string,
    _codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/pinterest/callback`;

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
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Pinterest token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(this.profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Pinterest profile fetch failed:", error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.username || data.account_type,
      username: data.username,
      displayName: data.username,
      avatar: data.profile_image,
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
      console.error("Pinterest token refresh failed:", error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  getTokenExpiry(response: { expires_in?: number }): Date | null {
    // Pinterest tokens expire in 30 days (2,592,000 seconds)
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.PINTEREST_APP_ID;
    if (!value) throw new Error("PINTEREST_APP_ID not configured");
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.PINTEREST_APP_SECRET;
    if (!value) throw new Error("PINTEREST_APP_SECRET not configured");
    return value;
  }
}
