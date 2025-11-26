import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class YouTubeOAuthService extends BaseOAuthService {
  platform = Platform.YOUTUBE;
  authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  tokenUrl = "https://oauth2.googleapis.com/token";
  profileUrl = "https://www.googleapis.com/youtube/v3/channels";
  scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  async exchangeCodeForTokens(
    code: string,
    _codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/youtube/callback`;

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // Get user's YouTube channels
    const response = await fetch(`${this.profileUrl}?part=snippet&mine=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube profile fetch failed:", error);
      throw new Error(
        `Failed to fetch YouTube channel: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error(
        "No YouTube channel found. Please create a YouTube channel first."
      );
    }

    const channel = data.items[0];

    return {
      id: channel.id,
      username: channel.snippet.title,
      displayName: channel.snippet.title,
      avatar: channel.snippet.thumbnails?.default?.url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube token refresh failed:", error);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  getTokenExpiry(response: { expires_in?: number }): Date | null {
    // Google tokens expire in 1 hour (3600 seconds)
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.YOUTUBE_CLIENT_ID;
    if (!value) throw new Error("YOUTUBE_CLIENT_ID not configured");
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.YOUTUBE_CLIENT_SECRET;
    if (!value) throw new Error("YOUTUBE_CLIENT_SECRET not configured");
    return value;
  }

  // Override to add Google-specific parameters
  async initiateOAuth(userId: string): Promise<string> {
    const baseUrl = await super.initiateOAuth(userId);
    const url = new URL(baseUrl);

    // Add Google-specific parameters
    url.searchParams.set("access_type", "offline"); // Request refresh token
    url.searchParams.set("prompt", "consent"); // Force consent screen

    return url.toString();
  }
}
