import React from "react";
import { Link as LinkIcon, Layout, Users } from "lucide-react";
import { ToastType } from "@/types";
import { useLinkManager } from "./useLinkManager";
import { ShortenerTab } from "./tabs/ShortenerTab";
import { BioTab } from "./tabs/BioTab";
import { LeadsTab } from "./tabs/LeadsTab";

interface LinkManagerProps {
  showToast: (message: string, type: ToastType) => void;
}

const LinkManager: React.FC<LinkManagerProps> = ({ showToast }) => {
  const manager = useLinkManager();

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Link Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Trackable short links & Bio pages
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          <button
            onClick={() => manager.setActiveTab("shortener")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              manager.activeTab === "shortener"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Short Links
          </button>
          <button
            onClick={() => manager.setActiveTab("bio")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              manager.activeTab === "bio"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Layout className="w-4 h-4 mr-2" />
            Link in Bio
          </button>
          <button
            onClick={() => manager.setActiveTab("leads")}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              manager.activeTab === "leads"
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Leads
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {manager.activeTab === "shortener" && (
          <ShortenerTab links={manager.links} showToast={showToast} />
        )}
        {manager.activeTab === "bio" && (
          <BioTab
            config={manager.bioConfig}
            onConfigChange={(updates) =>
              manager.setBioConfig({ ...manager.bioConfig, ...updates })
            }
            showToast={showToast}
          />
        )}
        {manager.activeTab === "leads" && <LeadsTab />}
      </div>
    </div>
  );
};

export default LinkManager;
