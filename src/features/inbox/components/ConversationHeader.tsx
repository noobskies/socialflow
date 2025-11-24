import React from "react";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { SocialMessage } from "@/types";
import { getPlatformColor } from "@/features/calendar/utils/platformIcons";

interface ConversationHeaderProps {
  message: SocialMessage;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  message,
}) => {
  const platformColor = getPlatformColor(message.platform);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <img
          src={message.authorAvatar}
          className="w-10 h-10 rounded-full"
          alt={message.author}
        />
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {message.author}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {message.authorHandle}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${platformColor}`}
            >
              {message.platform}
            </div>
            <span className="text-xs text-slate-400">{message.type}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400"
          title="Mark as Resolved"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
