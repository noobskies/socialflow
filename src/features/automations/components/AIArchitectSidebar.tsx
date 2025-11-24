import React, { useState } from "react";
import { Bot, Zap, Loader2 } from "lucide-react";
import { ToastType } from "@/types";
import { suggestWorkflows } from "@/services/geminiService";

interface AIArchitectSidebarProps {
  onAddSuggestion: (suggestion: any) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const AIArchitectSidebar: React.FC<AIArchitectSidebarProps> = ({
  onAddSuggestion,
  showToast,
}) => {
  const [businessType, setBusinessType] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSuggest = async () => {
    if (!businessType) return;
    setIsSuggesting(true);
    const newSuggestions = await suggestWorkflows(businessType);
    setSuggestions(newSuggestions);
    setIsSuggesting(false);
  };

  const handleAddSuggestion = (suggestion: any) => {
    onAddSuggestion(suggestion);
    setSuggestions(suggestions.filter((s) => s !== suggestion));
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-indigo-200" />
        <h3 className="font-bold text-lg">AI Architect</h3>
      </div>
      <p className="text-indigo-100 text-sm mb-4">
        Tell me about your business, and I'll design the perfect automation
        strategy.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="e.g. Coffee Shop, SaaS, Gym"
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-indigo-200 outline-none focus:bg-white/20"
        />
        <button
          onClick={handleSuggest}
          disabled={!businessType || isSuggesting}
          className="bg-white text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {isSuggesting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/10 rounded-lg p-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
            >
              <h4 className="font-bold text-sm">{s.name}</h4>
              <p className="text-xs text-indigo-100 mb-2 opacity-80">
                {s.description}
              </p>
              <button
                onClick={() => handleAddSuggestion(s)}
                className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded text-xs font-bold transition-colors"
              >
                Add Workflow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
