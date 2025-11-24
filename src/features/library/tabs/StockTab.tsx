import React, { useState } from "react";
import { Search } from "lucide-react";
import { Draft } from "@/types";
import { MOCK_STOCK_PHOTOS } from "@/utils/constants";

interface StockTabProps {
  onCompose: (draft: Draft) => void;
}

export const StockTab: React.FC<StockTabProps> = ({ onCompose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="animate-in fade-in duration-300 relative h-full flex flex-col">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Unsplash Stock Photos
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search free high-resolution photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Stock Photo Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
          {MOCK_STOCK_PHOTOS.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800"
            >
              <img
                src={url}
                alt="Stock"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() =>
                    onCompose({ mediaUrl: url, mediaType: "image" })
                  }
                  className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
                >
                  Use Image
                </button>
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] text-white/80 opacity-0 group-hover:opacity-100 font-medium drop-shadow-md">
                Photo by Unsplash
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
