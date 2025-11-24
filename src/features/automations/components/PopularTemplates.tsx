import React from "react";
import { Plus } from "lucide-react";

const TEMPLATES = [
  "RSS to Twitter",
  "Instagram to Pinterest",
  "Welcome New Followers",
];

interface PopularTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

export const PopularTemplates: React.FC<PopularTemplatesProps> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">
        Popular Templates
      </h3>
      <div className="space-y-3">
        {TEMPLATES.map((template) => (
          <div
            key={template}
            onClick={() => onSelectTemplate(template)}
            className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer group"
          >
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {template}
            </span>
            <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
