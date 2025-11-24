import { useState } from "react";
import { Platform, Draft, PlatformOptions } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useComposer(initialDraft?: Draft) {
  const [content, setContent] = useLocalStorage(
    "draft_content",
    initialDraft?.content || "",
    1000
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
    initialDraft?.platforms || ["twitter"]
  );
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    initialDraft?.mediaUrl || null
  );
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(
    initialDraft?.mediaType || null
  );
  const [platformOptions, setPlatformOptions] = useState<PlatformOptions>(
    initialDraft?.platformOptions || {}
  );

  const [isPollActive, setIsPollActive] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(1);

  const [altText, setAltText] = useState("");

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleMediaUpload = (url: string, type: "image" | "video") => {
    setMediaUrl(url);
    setMediaType(type);
    setIsPollActive(false); // Disable poll if media attached
  };

  const togglePoll = () => {
    if (isPollActive) {
      setIsPollActive(false);
    } else {
      setIsPollActive(true);
      setMediaUrl(null); // Remove media if poll active
      setMediaType(null);
    }
  };

  const clearDraft = () => {
    setContent("");
    setMediaUrl(null);
    setMediaType(null);
    setIsPollActive(false);
    setPollOptions(["", ""]);
    setAltText("");
    localStorage.removeItem("draft_content");
  };

  return {
    // Content
    content,
    setContent,

    // Platforms
    selectedPlatforms,
    togglePlatform,

    // Media
    mediaUrl,
    mediaType,
    handleMediaUpload,
    removeMedia: () => {
      setMediaUrl(null);
      setMediaType(null);
    },

    // Alt Text
    altText,
    setAltText,

    // Poll
    isPollActive,
    pollOptions,
    setPollOptions,
    pollDuration,
    setPollDuration,
    togglePoll,

    // Platform Options
    platformOptions,
    setPlatformOptions,

    // Actions
    clearDraft,
  };
}
