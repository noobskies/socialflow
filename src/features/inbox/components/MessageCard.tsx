import React from "react";
import { SocialMessage } from "@/types";
import {
  getPlatformIcon,
  getPlatformColor,
} from "@/features/calendar/utils/platformIcons";

interface MessageCardProps {
  message: SocialMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  isSelected,
  onSelect,
}) => {
  const platformColor = getPlatformColor(message.platform);

  return (
    <div
      onClick={() => onSelect(message.id)}
      className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative ${
        isSelected
          ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500 dark:border-l-indigo-400"
          : "border-l-4 border-l-transparent"
      }`}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={message.authorAvatar}
            className="w-10 h-10 rounded-full object-cover"
            alt={message.author}
          />
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${platformColor}`}
          >
            {getPlatformIcon(message.platform, "w-3 h-3 text-white")}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span
              className={`font-semibold text-sm truncate ${
                message.unread
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {message.author}
            </span>
            <span className="text-xs text-slate-400 shrink-0">
              {message.timestamp}
            </span>
          </div>
          <p
            className={`text-sm line-clamp-2 ${
              message.unread
                ? "text-slate-800 dark:text-slate-200 font-medium"
                : "text-slate-500 dark:text-slate-500"
            }`}
          >
            {message.content}
          </p>
        </div>
        {message.unread && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};
