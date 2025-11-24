import React from "react";
import { X, Plus, ListChecks, Trash2 } from "lucide-react";

interface PollCreatorProps {
  options: string[];
  setOptions: (options: string[]) => void;
  duration: number;
  setDuration: (duration: number) => void;
  onClose: () => void;
}

export const PollCreator: React.FC<PollCreatorProps> = ({
  options,
  setOptions,
  duration,
  setDuration,
  onClose,
}) => {
  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="px-6 pb-6 relative z-10 animate-in fade-in slide-in-from-top-2">
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
            <ListChecks className="w-4 h-4 mr-2 text-indigo-500" />
            Create Poll
          </h4>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
              {options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(idx)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {options.length < 4 && (
            <button
              onClick={handleAddOption}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Option
            </button>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Poll Duration:
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>7 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;
