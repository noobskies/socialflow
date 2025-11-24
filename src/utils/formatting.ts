export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function splitTweetThread(text: string, maxLength = 280): string[] {
  if (text.length <= maxLength) return [text];

  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      parts.push(remaining);
      break;
    }

    // Try to split at a word boundary
    let splitIndex = remaining.lastIndexOf(" ", maxLength);
    if (splitIndex === -1) {
      // No space found, force split
      splitIndex = maxLength;
    }

    parts.push(remaining.substring(0, splitIndex));
    remaining = remaining.substring(splitIndex).trim();
  }

  return parts;
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPlatformName(platform: string): string {
  const names: Record<string, string> = {
    twitter: "Twitter",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    pinterest: "Pinterest",
  };
  return names[platform] || capitalizeFirst(platform);
}
