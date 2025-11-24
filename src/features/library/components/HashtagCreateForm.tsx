import React from "react";

interface HashtagCreateFormProps {
  name: string;
  onNameChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

export const HashtagCreateForm: React.FC<HashtagCreateFormProps> = ({
  name,
  onNameChange,
  content,
  onContentChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">
        Create New Group
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Group Name
          </label>
          <input
            type="text"
            placeholder="e.g. Summer Campaign"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Hashtags
          </label>
          <textarea
            placeholder="#summer #sun #fun"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={!name || !content}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Group
        </button>
      </div>
    </div>
  );
};
