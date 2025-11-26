import {
  BaseOAuthService,
  OAuthTokens,
  UserProfile,
} from "./base-oauth-service";
import { Platform } from "../../generated/prisma/client";

export class LinkedInOAuthService extends BaseOAuthService {
  platform = Platform.LINKEDIN;
  authorizationUrl = "https://www.linkedin.com/oauth/v2/authorization";
  tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
  profileUrl = "https://api.linkedin.com/v2/userinfo";
  scopes = ["openid", "profile", "email", "w_member_social"];

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokens> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`;

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        code_verifier: codeVerifier, // Include for PKCE support
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LinkedIn token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for tokens: ${response.statusText}`
      );
    }

    return await response.json();
  }

  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // LinkedIn uses OpenID Connect userinfo endpoint
    const response = await fetch(this.profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LinkedIn profile fetch failed:", error);
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.sub, // OpenID Connect subject identifier
      username: data.email || data.name, // LinkedIn doesn't provide username
      displayName: data.name,
      avatar: data.picture,
    };
  }

  async refreshAccessToken(_refreshToken: string): Promise<OAuthTokens> {
    // LinkedIn doesn't provide refresh tokens
    throw new Error(
      "LinkedIn does not support token refresh. User must re-authenticate."
    );
  }

  getTokenExpiry(response: { expires_in?: number }): Date | null {
    // LinkedIn tokens expire in 60 days
    if (!response.expires_in) return null;
    return new Date(Date.now() + response.expires_in * 1000);
  }
}
