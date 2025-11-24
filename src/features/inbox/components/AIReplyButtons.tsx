import React from "react";
import { Sparkles } from "lucide-react";

interface AIReplyButtonsProps {
  onGenerate: (
    tone: "supportive" | "witty" | "professional" | "gratitude"
  ) => void;
  isGenerating: boolean;
}

export const AIReplyButtons: React.FC<AIReplyButtonsProps> = ({
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2 shrink-0">
        <Sparkles className="w-3 h-3 mr-1" />
        AI Smart Reply
      </div>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("gratitude")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        🙏 Say Thanks
      </button>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("supportive")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        🤝 Helpfully Answer
      </button>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("witty")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        ⚡ Witty Comeback
      </button>
      <button
        disabled={isGenerating}
        onClick={() => onGenerate("professional")}
        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
      >
        👔 Professional
      </button>
    </div>
  );
};
