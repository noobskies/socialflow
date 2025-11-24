import React from "react";
import { Send, Smile, Loader2 } from "lucide-react";

interface ReplyBoxProps {
  replyText: string;
  onReplyChange: (text: string) => void;
  onSend: () => void;
  isGenerating: boolean;
}

export const ReplyBox: React.FC<ReplyBoxProps> = ({
  replyText,
  onReplyChange,
  onSend,
  isGenerating,
}) => {
  return (
    <div className="relative">
      <textarea
        value={replyText}
        onChange={(e) => onReplyChange(e.target.value)}
        placeholder={
          isGenerating ? "Gemini is thinking..." : "Write a reply..."
        }
        className={`w-full border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[100px] text-slate-900 dark:text-white ${
          isGenerating
            ? "bg-slate-50 dark:bg-slate-800 text-slate-400"
            : "bg-white dark:bg-slate-800"
        }`}
      />
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
          <Smile className="w-5 h-5" />
        </button>
        <button
          onClick={onSend}
          disabled={!replyText.trim() || isGenerating}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
