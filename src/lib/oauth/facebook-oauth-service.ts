import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class FacebookOAuthService extends BaseOAuthService {
  platform = Platform.FACEBOOK;
  authorizationUrl = "https://www.facebook.com/v18.0/dialog/oauth";
  tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token";
  profileUrl = "https://graph.facebook.com/v18.0/me";
  scopes = [
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "pages_read_user_content",
    "public_profile",
  ];

  async exchangeCodeForTokens(
    code: string,
    _codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/facebook/callback`;

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Facebook token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Exchange short-lived token for long-lived token (60 days)
    const longLivedToken = await this.exchangeForLongLivedToken(
      data.access_token
    );

    return {
      access_token: longLivedToken.access_token,
      token_type: "bearer",
      expires_in: longLivedToken.expires_in,
    };
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // Get user's Pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,picture`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!pagesResponse.ok) {
      throw new Error("Failed to fetch Facebook Pages");
    }

    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error(
        "No Facebook Pages found. Please create or get access to a Facebook Page first."
      );
    }

    // Use first Page (or let user select in UI later)
    const page = pagesData.data[0];

    // Note: Page access token is included in the response (page.access_token)
    // We'll store it when we save the account to the database

    return {
      id: page.id,
      username: page.name,
      displayName: page.name,
      avatar: page.picture?.data?.url,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    // Exchange current long-lived token for new one
    return await this.exchangeForLongLivedToken(refreshToken);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async exchangeForLongLivedToken(
    shortLivedToken: string
  ): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: this.getClientId(),
          client_secret: this.getClientSecret(),
          fb_exchange_token: shortLivedToken,
        })
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Long-lived token exchange failed:", error);
      throw new Error("Failed to get long-lived token");
    }

    return await response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTokenExpiry(response: any): Date | null {
    // Long-lived tokens expire in 60 days
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }

  protected getClientId(): string {
    const value = process.env.FACEBOOK_APP_ID;
    if (!value) throw new Error("FACEBOOK_APP_ID not configured");
    return value;
  }

  protected getClientSecret(): string {
    const value = process.env.FACEBOOK_APP_SECRET;
    if (!value) throw new Error("FACEBOOK_APP_SECRET not configured");
    return value;
  }
}
