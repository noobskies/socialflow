import React from "react";
import { ThumbsUp } from "lucide-react";
import { SocialMessage, ToastType } from "@/types";
import { ConversationHeader } from "./ConversationHeader";
import { AIReplyButtons } from "./AIReplyButtons";
import { ReplyBox } from "./ReplyBox";
import { generateReply } from "@/services/geminiService";

interface ConversationViewProps {
  message: SocialMessage;
  replyText: string;
  onReplyChange: (text: string) => void;
  isGenerating: boolean;
  onGeneratingChange: (value: boolean) => void;
  onClearReply: () => void;
  showToast: (message: string, type: ToastType) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  message,
  replyText,
  onReplyChange,
  isGenerating,
  onGeneratingChange,
  onClearReply,
  showToast,
}) => {
  const handleAiReply = async (
    tone: "supportive" | "witty" | "professional" | "gratitude"
  ) => {
    onGeneratingChange(true);
    const reply = await generateReply(message.content, tone);
    onReplyChange(reply);
    onGeneratingChange(false);
    showToast("AI Reply generated!", "success");
  };

  const handleSend = () => {
    showToast(`Reply sent to ${message.author}`, "success");
    onClearReply();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-hidden relative transition-colors duration-200">
      <ConversationHeader message={message} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Original Post Context */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 max-w-md w-full shadow-sm opacity-75">
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">
              In reply to your post
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-md shrink-0"></div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  We are excited to announce our Series B funding round led
                  by...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incoming Message */}
        <div className="flex gap-4">
          <img
            src={message.authorAvatar}
            className="w-10 h-10 rounded-full shrink-0"
            alt="Author"
          />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-lg">
            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              {message.content}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {message.timestamp}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ThumbsUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
        <AIReplyButtons
          onGenerate={handleAiReply}
          isGenerating={isGenerating}
        />
        <ReplyBox
          replyText={replyText}
          onReplyChange={onReplyChange}
          onSend={handleSend}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};
