import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class TikTokOAuthService extends BaseOAuthService {
  platform = Platform.TIKTOK;
  authorizationUrl = "https://www.tiktok.com/v2/auth/authorize/";
  tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
  profileUrl = "https://open.tiktokapis.com/v2/user/info/";
  scopes = ["user.info.basic", "video.list", "video.upload"];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/tiktok/callback`;

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: this.getClientId(),
        client_secret: this.getClientSecret(),
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("TikTok token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`TikTok OAuth error: ${data.error.message}`);
    }

    return {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires_in: data.data.expires_in,
      token_type: data.data.token_type,
    };
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(this.profileUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: ["open_id", "union_id", "avatar_url", "display_name"],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("TikTok profile fetch failed:", error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`TikTok profile error: ${data.error.message}`);
    }

    const user = data.data.user;

    return {
      id: user.open_id,
      username: user.display_name,
      displayName: user.display_name,
      avatar: user.avatar_url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: this.getClientId(),
        client_secret: this.getClientSecret(),
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("TikTok token refresh failed:", error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`TikTok refresh error: ${data.error.message}`);
    }

    return {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires_in: data.data.expires_in,
      token_type: data.data.token_type,
    };
  }

  getTokenExpiry(response: OAuthTokens): Date | null {
    // TikTok tokens expire in 24 hours (86400 seconds)
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.TIKTOK_CLIENT_KEY;
    if (!value) throw new Error("TIKTOK_CLIENT_KEY not configured");
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.TIKTOK_CLIENT_SECRET;
    if (!value) throw new Error("TIKTOK_CLIENT_SECRET not configured");
    return value;
  }
}
