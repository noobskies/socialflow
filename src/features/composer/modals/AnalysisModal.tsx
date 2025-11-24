import React from "react";
import { X, Sparkles, AlertTriangle } from "lucide-react";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    score: number;
    engagementPrediction: string;
    suggestions: string[];
  } | null;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20">
          <h3 className="font-bold text-xl text-indigo-900 dark:text-indigo-200 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            Content Analysis
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Quality Score
              </p>
              <div className="text-4xl font-black text-slate-900 dark:text-white">
                {result.score}
                <span className="text-lg text-slate-400 font-medium">/100</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Predicted Reach
              </p>
              <div
                className={`text-lg font-bold px-3 py-1 rounded-full ${
                  result.engagementPrediction === "High"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : result.engagementPrediction === "Medium"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {result.engagementPrediction}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
              Suggestions for Improvement
            </h4>
            <ul className="space-y-2">
              {result.suggestions.map((s: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-3 shrink-0"></div>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
