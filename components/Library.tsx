
import React, { useState } from 'react';
import { Search, Filter, Image as ImageIcon, FileText, Video, MoreHorizontal, Upload, Plus, Download, Trash2 } from 'lucide-react';
import { MediaAsset, Draft } from '../types';

interface LibraryProps {
  onCompose: (draft: Draft) => void;
}

const MOCK_ASSETS: MediaAsset[] = [
  { id: '1', type: 'image', url: 'https://picsum.photos/id/101/400/400', name: 'Summer Campaign Hero', createdAt: '2 days ago', tags: ['summer', 'hero'] },
  { id: '2', type: 'image', url: 'https://picsum.photos/id/103/400/400', name: 'Product Teaser v2', createdAt: '3 days ago', tags: ['product', 'teaser'] },
  { id: '3', type: 'template', content: 'Exciting news! 🚀 We are thrilled to announce [Product Name]...', name: 'Product Launch Template', createdAt: '1 week ago', tags: ['launch', 'announcement'] },
  { id: '4', type: 'video', url: 'https://picsum.photos/id/104/400/400', name: 'Behind the Scenes', createdAt: '1 week ago', tags: ['bts', 'video'] },
  { id: '5', type: 'image', url: 'https://picsum.photos/id/106/400/400', name: 'Team Offsite', createdAt: '2 weeks ago', tags: ['team', 'culture'] },
  { id: '6', type: 'template', content: 'Join us for our upcoming webinar on [Topic] this [Day]! 📅 Register here: [Link]', name: 'Webinar Invite', createdAt: '2 weeks ago', tags: ['webinar', 'event'] },
];

const Library: React.FC<LibraryProps> = ({ onCompose }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'template'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesFilter = activeFilter === 'all' || asset.type === activeFilter;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleUseAsset = (asset: MediaAsset) => {
    onCompose({
      mediaUrl: asset.type !== 'template' ? asset.url : undefined,
      content: asset.type === 'template' ? asset.content : undefined
    });
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your creative assets and templates</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'image', 'video', 'template'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeFilter === type 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            {/* Preview Area */}
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              {asset.type === 'image' || asset.type === 'video' ? (
                <>
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                  {asset.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Video className="w-5 h-5 text-slate-900 ml-1" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col">
                  <FileText className="w-8 h-8 text-indigo-400 mb-3" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium">{asset.content}</p>
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => handleUseAsset(asset)}
                  className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors" 
                  title="Use in Composer"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors" title="Download">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {asset.type === 'image' && <ImageIcon className="w-4 h-4 text-slate-400" />}
                    {asset.type === 'video' && <Video className="w-4 h-4 text-slate-400" />}
                    {asset.type === 'template' && <FileText className="w-4 h-4 text-slate-400" />}
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">{asset.type}</span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white truncate mb-1" title={asset.name}>{asset.name}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                Added {asset.createdAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
