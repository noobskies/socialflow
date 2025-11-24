import React from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Video,
  Youtube,
  Pin,
} from "lucide-react";
import { Platform } from "@/types";

/**
 * Get the Lucide icon component for a given platform
 */
export const getPlatformIcon = (
  platform: Platform,
  className: string = "w-3 h-3"
) => {
  switch (platform) {
    case "twitter":
      return <Twitter className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "facebook":
      return <Facebook className={className} />;
    case "instagram":
      return <Instagram className={className} />;
    case "tiktok":
      return <Video className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "pinterest":
      return <Pin className={className} />;
  }
};

/**
 * Get the background color class for a given platform
 */
export const getPlatformColor = (platform: Platform): string => {
  switch (platform) {
    case "twitter":
      return "bg-sky-500";
    case "linkedin":
      return "bg-blue-700";
    case "facebook":
      return "bg-blue-600";
    case "instagram":
      return "bg-pink-600";
    case "tiktok":
      return "bg-black";
    case "youtube":
      return "bg-red-600";
    case "pinterest":
      return "bg-red-500";
  }
};
