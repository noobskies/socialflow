"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

export default function OAuthResultPage() {
  const searchParams = useSearchParams();
  const [closing, setClosing] = useState(false);

  const success = searchParams.get("success") === "true";
  const platform = searchParams.get("platform");
  const accountId = searchParams.get("account");
  const error = searchParams.get("error");

  useEffect(() => {
    // Send message to parent window
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "oauth-result",
          success,
          platform,
          accountId,
          error,
        },
        window.location.origin
      );

      // Auto-close after 1.5 seconds
      const timer = setTimeout(() => {
        setClosing(true);
        setTimeout(() => {
          window.close();
        }, 500);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, platform, accountId, error]);

  const platformNames: Record<string, string> = {
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    youtube: "YouTube",
    pinterest: "Pinterest",
  };

  const platformName = platform
    ? platformNames[platform] || platform
    : "Account";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {success ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connected Successfully!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Your {platformName} account has been connected to SocialFlow.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connection Failed
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {error === "missing_params"
                ? "Missing required parameters from OAuth provider."
                : error === "invalid_state"
                  ? "Invalid or expired OAuth state. Please try again."
                  : error === "token_exchange_failed"
                    ? "Failed to exchange authorization code for access token."
                    : error === "access_denied"
                      ? "You denied access to the application."
                      : `Failed to connect ${platformName} account. Please try again.`}
            </p>
          </>
        )}

        {closing && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Closing window...</span>
          </div>
        )}
      </div>
    </div>
  );
}
