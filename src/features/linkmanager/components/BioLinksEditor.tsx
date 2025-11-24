import React from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";

interface BioLink {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

interface BioLinksEditorProps {
  links: BioLink[];
  onLinksChange: (links: BioLink[]) => void;
}

export const BioLinksEditor: React.FC<BioLinksEditorProps> = ({
  links,
  onLinksChange,
}) => {
  const updateLink = (index: number, updates: Partial<BioLink>) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onLinksChange(newLinks);
  };

  const deleteLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index));
  };

  const addLink = () => {
    const newLink: BioLink = {
      id: Date.now().toString(),
      title: "New Link",
      url: "https://example.com",
      active: true,
    };
    onLinksChange([...links, newLink]);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
          Links
        </label>
        <button
          onClick={addLink}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Link
        </button>
      </div>

      {links.map((link, index) => (
        <div
          key={link.id}
          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group"
        >
          <div className="cursor-move text-slate-400 hover:text-slate-600">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={link.title}
              onChange={(e) => updateLink(index, { title: e.target.value })}
              className="block w-full text-sm font-bold bg-transparent outline-none text-slate-900 dark:text-white mb-1"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, { url: e.target.value })}
              className="block w-full text-xs text-slate-500 bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => deleteLink(index)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
