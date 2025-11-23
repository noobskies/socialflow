import React from 'react';
import { X, Search, Book, MessageCircle, PlayCircle, ExternalLink, Zap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Help & Support
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles, guides, and tutorials..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer group bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              <Book className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Documentation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Browse detailed guides on all features.
            </p>
            <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              Browse Docs <ExternalLink className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer group bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Video Tutorials</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Step-by-step walkthroughs.
            </p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-xs font-bold">
              Watch Videos <ExternalLink className="w-3 h-3 ml-1" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer group bg-white dark:bg-slate-900 md:col-span-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Contact Support</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Our team is available 24/7 to help you.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
