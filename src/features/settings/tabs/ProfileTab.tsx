import React from "react";
import { ToastType } from "@/types";

interface ProfileTabProps {
  onSave: (section: string) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onSave }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Profile Settings
        </h2>
        <div className="flex items-center space-x-6 mb-8">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 object-cover"
          />
          <div>
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Change Avatar
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              JPG, GIF or PNG. Max 1MB.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Alex Creator"
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="alex@socialflow.ai"
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bio
            </label>
            <textarea
              defaultValue="Digital creator passionate about tech & design."
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onSave("Profile")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
