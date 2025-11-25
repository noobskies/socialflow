import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class InstagramOAuthService extends BaseOAuthService {
  platform = Platform.INSTAGRAM;
  authorizationUrl = "https://www.instagram.com/oauth/authorize";
  tokenUrl = "https://api.instagram.com/oauth/access_token";
  profileUrl = "https://graph.instagram.com/me";
  scopes = [
    "instagram_business_basic",
    "instagram_business_content_publish",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
    "instagram_business_manage_insights",
  ];

  async exchangeCodeForTokens(
    code: string,
    _codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/instagram/callback`;

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Instagram token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check for short-lived token and exchange for long-lived
    if (data.access_token) {
      // Exchange short-lived token for long-lived token (60 days)
      const longLivedToken = await this.exchangeForLongLivedToken(
        data.access_token
      );
      return longLivedToken;
    }

    return {
      access_token: data.access_token,
      token_type: "bearer",
      expires_in: data.expires_in,
    };
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // Get Instagram Business account details
    const response = await fetch(
      `${this.profileUrl}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Instagram profile fetch failed:", error);
      throw new Error("Failed to fetch Instagram profile");
    }

    const data = await response.json();

    return {
      id: data.id,
      username: data.username,
      displayName: data.name || data.username,
      avatar: data.profile_picture_url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    // Instagram long-lived tokens can be refreshed before expiry
    // Use the current token to get a new long-lived token
    return await this.exchangeForLongLivedToken(refreshToken);
  }

  private async exchangeForLongLivedToken(
    shortLivedToken: string
  ): Promise<OAuthTokens> {
    const response = await fetch(
      `https://graph.instagram.com/access_token?` +
        new URLSearchParams({
          grant_type: "ig_exchange_token",
          client_secret: this.getClientSecret(),
          access_token: shortLivedToken,
        })
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Long-lived token exchange failed:", error);
      throw new Error("Failed to get long-lived token");
    }

    const data = await response.json();

    return {
      access_token: data.access_token,
      token_type: "bearer",
      expires_in: data.expires_in, // 60 days in seconds
    };
  }

  getTokenExpiry(response: OAuthTokens): Date | null {
    // Long-lived tokens expire in 60 days
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.INSTAGRAM_APP_ID;
    if (!value) throw new Error("INSTAGRAM_APP_ID not configured");
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.INSTAGRAM_APP_SECRET;
    if (!value) throw new Error("INSTAGRAM_APP_SECRET not configured");
    return value;
  }
}
