export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateHashtag(tag: string): boolean {
  // Hashtag should start with # and contain only alphanumeric and underscore
  return /^#[a-zA-Z0-9_]+$/.test(tag);
}

export function validateContentLength(
  content: string,
  platform: string
): { valid: boolean; message?: string } {
  const limits: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
  };

  const limit = limits[platform];
  if (!limit) return { valid: true };

  if (content.length > limit) {
    return {
      valid: false,
      message: `Content exceeds ${platform} limit of ${limit} characters`,
    };
  }

  return { valid: true };
}
