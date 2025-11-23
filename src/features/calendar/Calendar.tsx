import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Plus,
  X,
  Clock,
  Calendar as CalendarIcon,
  Youtube,
  Video,
  Pin,
  LayoutGrid,
  Kanban,
  MoreHorizontal,
  Eye,
  MousePointer2,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  Grid3X3,
  Smartphone,
  Download,
  FileText,
  Table,
  UploadCloud,
} from 'lucide-react';
import { Draft, Platform, Post, PlanTier } from '@/types';

interface CalendarProps {
  onCompose: (draft?: Draft) => void;
  posts?: Post[];
  onUpdatePost?: (post: Post) => void;
  onPostCreated?: (post: Post) => void;
  userPlan?: PlanTier;
}

const Calendar: React.FC<CalendarProps> = ({
  onCompose,
  posts = [],
  onUpdatePost,
  onPostCreated,
  userPlan = 'free',
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'kanban' | 'grid'>('calendar');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [draggedPost, setDraggedPost] = useState<Post | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handleDateClick = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onCompose({ scheduledDate: formattedDate });
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, post: Post) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    if (draggedPost && onUpdatePost) {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onUpdatePost({
        ...draggedPost,
        scheduledDate: formattedDate,
        status: 'scheduled',
      });
      setDraggedPost(null);
    }
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    setIsExportMenuOpen(false);
    const link = document.createElement('a');
    link.href = '#';
    link.download = `content-calendar.${format}`;
    alert(`Exporting calendar as ${format.toUpperCase()}...`);
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Simple CSV parser: date,time,content,platform
      const lines = text.split('\n').slice(1); // Skip header
      let count = 0;

      lines.forEach((line) => {
        if (!line.trim()) return;
        const [date, time, content, platform] = line
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''));

        if (date && content && onPostCreated) {
          const newPost: Post = {
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content,
            scheduledDate: date,
            time: time || '12:00',
            platforms: [(platform as Platform) || 'twitter'],
            status: 'scheduled',
          };
          onPostCreated(newPost);
          count++;
        }
      });

      alert(`Successfully imported ${count} posts!`);
    };

    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getPlatformIcon = (platform: Platform, className: string = 'w-3 h-3') => {
    switch (platform) {
      case 'twitter':
        return <Twitter className={className} />;
      case 'linkedin':
        return <Linkedin className={className} />;
      case 'facebook':
        return <Facebook className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'tiktok':
        return <Video className={className} />;
      case 'youtube':
        return <Youtube className={className} />;
      case 'pinterest':
        return <Pin className={className} />;
    }
  };

  const isAgency = userPlan === 'agency';

  // Kanban Columns Configuration
  const allColumns = [
    {
      id: 'draft',
      label: 'Drafts',
      color: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-600 dark:text-slate-400',
    },
    {
      id: 'pending_review',
      label: 'In Review',
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      color: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'published',
      label: 'Published',
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  const columns = isAgency ? allColumns : allColumns.filter((col) => col.id !== 'pending_review');

  // Grid View Logic (Instagram)
  const gridPosts = posts.filter((p) => p.platforms.includes('instagram') || p.mediaUrl);

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleBulkImport}
        className="hidden"
        accept=".csv"
      />

      {/* Post Details Modal */}
      {selectedPost && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Post Details</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Header Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {selectedPost.platforms.map((p) => (
                    <div
                      key={p}
                      className={`p-2 rounded-lg ${
                        p === 'twitter'
                          ? 'bg-sky-500'
                          : p === 'linkedin'
                            ? 'bg-blue-700'
                            : p === 'facebook'
                              ? 'bg-blue-600'
                              : p === 'instagram'
                                ? 'bg-pink-600'
                                : p === 'tiktok'
                                  ? 'bg-black'
                                  : p === 'youtube'
                                    ? 'bg-red-600'
                                    : 'bg-red-500'
                      } text-white shadow-sm`}
                    >
                      {getPlatformIcon(p, 'w-4 h-4')}
                    </div>
                  ))}
                  <div className="flex flex-col ml-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                      {selectedPost.platforms.join(', ')}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {selectedPost.scheduledDate} • {selectedPost.time}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    selectedPost.status === 'published'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : selectedPost.status === 'scheduled'
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        : selectedPost.status === 'pending_review'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {selectedPost.status.replace('_', ' ')}
                </span>
              </div>

              {/* Content Preview */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mb-6 shadow-inner">
                {selectedPost.content}
                {selectedPost.poll && (
                  <div className="mt-4 space-y-2">
                    {selectedPost.poll.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-xs bg-white dark:bg-slate-900"
                      >
                        <span>{opt}</span>
                        <span className="text-slate-400">0%</span>
                      </div>
                    ))}
                    <div className="text-xs text-slate-400 text-center mt-2">
                      {selectedPost.poll.duration} days remaining
                    </div>
                  </div>
                )}
              </div>

              {selectedPost.mediaUrl && (
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-64 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={selectedPost.mediaUrl}
                    alt="Post Media"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Post-Level Analytics (Only for Published) */}
              {selectedPost.status === 'published' && (
                <div className="mb-2 animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Performance Insights
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center text-slate-400 mb-1">
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="text-[10px] font-semibold uppercase">Impressions</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">1,240</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center text-slate-400 mb-1">
                        <MousePointer2 className="w-3 h-3 mr-1" />
                        <span className="text-[10px] font-semibold uppercase">Clicks</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">85</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center text-slate-400 mb-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span className="text-[10px] font-semibold uppercase">CTR</span>
                      </div>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        6.8%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2">
                    <ArrowUpRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-800 dark:text-indigo-200">
                      This post is performing <strong>24% better</strong> than your average{' '}
                      {selectedPost.platforms[0]} post.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedPost(null);
                  onCompose({
                    content: selectedPost.content,
                    platforms: selectedPost.platforms,
                    scheduledDate: selectedPost.scheduledDate,
                    mediaUrl: selectedPost.mediaUrl,
                    mediaType: selectedPost.mediaType,
                    status:
                      selectedPost.status === 'published' ? 'draft' : (selectedPost.status as any),
                    poll: selectedPost.poll,
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                {selectedPost.status === 'published' ? 'Duplicate' : 'Edit Post'}
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Plan, visualize, and manage your workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bulk Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title="Import CSV (date, time, content, platform)"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Import
          </button>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            {isExportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsExportMenuOpen(false)}
                ></div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-40 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2 text-red-500" /> Save as PDF
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center border-t border-slate-100 dark:border-slate-800"
                  >
                    <Table className="w-4 h-4 mr-2 text-green-500" /> Export CSV
                  </button>
                </div>
              </>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-md transition-all ${viewMode === 'calendar' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Month
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-md transition-all ${viewMode === 'kanban' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <Kanban className="w-4 h-4 mr-2" />
              Board
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </button>
          </div>

          <button
            onClick={() => onCompose()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm">
                  <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm">
                  <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            {days.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-slate-100 dark:divide-slate-800 divide-y">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // Offset for start of month mock
              const isCurrentMonth = dayNum > 0 && dayNum <= 31;
              // Simple filter for mock data
              const dayPosts = posts.filter(
                (p) => parseInt(p.scheduledDate.split('-')[2]) === dayNum
              );
              const isToday = dayNum === 5; // Mock today

              return (
                <div
                  key={i}
                  className={`min-h-[120px] p-2 transition-colors group relative flex flex-col ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-950/50' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30'} ${draggedPost && isCurrentMonth ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : ''}`}
                  onDragOver={isCurrentMonth ? handleDragOver : undefined}
                  onDrop={isCurrentMonth ? (e) => handleDrop(e, dayNum) : undefined}
                >
                  {isCurrentMonth && (
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        {dayNum}
                      </span>
                      <button
                        onClick={() => handleDateClick(dayNum)}
                        className="text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 overflow-y-auto">
                    {isCurrentMonth &&
                      dayPosts.map((post, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={(e) => handleDragStart(e, post)}
                          onClick={() => setSelectedPost(post)}
                          className={`p-2 rounded-md border text-xs flex flex-col gap-1 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm ${
                            post.status === 'published'
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'
                              : post.status === 'scheduled'
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400'
                                : post.status === 'pending_review'
                                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-1">
                              {post.platforms.slice(0, 2).map((p) => (
                                <span key={p} className="flex">
                                  {getPlatformIcon(p)}
                                </span>
                              ))}
                              {post.platforms.length > 2 && <span className="text-[8px]">+</span>}
                            </div>
                            <span className="font-semibold ml-1 opacity-75">{post.time}</span>
                          </div>
                          <span className="truncate opacity-90 pointer-events-none">
                            {post.content}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden animate-in fade-in duration-300">
          <div className="flex h-full gap-6 min-w-[1000px] pb-4">
            {columns.map((col) => {
              const colPosts = posts.filter((p) => p.status === col.id);

              return (
                <div
                  key={col.id}
                  className="flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  {/* Column Header */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${col.id === 'draft' ? 'bg-slate-400' : col.id === 'pending_review' ? 'bg-amber-500' : col.id === 'scheduled' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                      />
                      <h3 className="font-bold text-slate-700 dark:text-slate-200">{col.label}</h3>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">
                        {colPosts.length}
                      </span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Draggable Area (Simulated) */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {colPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex -space-x-1">
                            {post.platforms.map((p) => (
                              <div
                                key={p}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 ${
                                  p === 'twitter'
                                    ? 'bg-sky-500'
                                    : p === 'linkedin'
                                      ? 'bg-blue-700'
                                      : p === 'facebook'
                                        ? 'bg-blue-600'
                                        : p === 'instagram'
                                          ? 'bg-pink-600'
                                          : p === 'tiktok'
                                            ? 'bg-black'
                                            : p === 'youtube'
                                              ? 'bg-red-600'
                                              : 'bg-red-500'
                                }`}
                              >
                                {getPlatformIcon(p, 'w-3 h-3 text-white')}
                              </div>
                            ))}
                          </div>
                          <button className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-3 mb-3 font-medium">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-50 dark:border-slate-800">
                          <div className="flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {post.scheduledDate}
                          </div>
                          {post.status === 'published' && (
                            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                              4.2%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {colPosts.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
                        Drop items here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Grid View (Instagram Style)
        <div className="flex-1 flex justify-center animate-in fade-in duration-300 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border-8 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Phone Status Bar Sim */}
            <div className="bg-white dark:bg-slate-900 px-6 py-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white">9:41</span>
              <div className="flex gap-1.5">
                <div className="w-4 h-2.5 bg-slate-900 dark:bg-white rounded-sm"></div>
                <div className="w-0.5 h-2.5 bg-slate-900 dark:bg-white rounded-sm"></div>
              </div>
            </div>

            {/* Instagram Profile Header Sim */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&fit=crop"
                    alt="Profile"
                    className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  />
                </div>
                <div className="flex-1 flex justify-around text-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">128</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Posts</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">42.5K</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Followers</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">1.2K</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Following</div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Alex Creator</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Digital Creator • Tech & Design
                </div>
                <div className="text-xs text-slate-900 dark:text-white mt-1">
                  Building the future of social media tools. 👇
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  sfl.ai/alex
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold py-1.5 rounded-md">
                  Edit Profile
                </button>
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold py-1.5 rounded-md">
                  Share Profile
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0">
              <button className="flex-1 py-2.5 border-b-2 border-slate-900 dark:border-white">
                <LayoutGrid className="w-5 h-5 mx-auto text-slate-900 dark:text-white" />
              </button>
              <button className="flex-1 py-2.5 border-b-2 border-transparent">
                <Video className="w-5 h-5 mx-auto text-slate-400" />
              </button>
            </div>

            {/* The Grid */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
              <div className="grid grid-cols-3 gap-0.5">
                {gridPosts.map((post, i) => (
                  <div
                    key={post.id}
                    className="aspect-square relative bg-slate-100 dark:bg-slate-800 cursor-pointer group"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.mediaUrl ? (
                      <>
                        <img
                          src={post.mediaUrl}
                          alt="Post"
                          className="w-full h-full object-cover"
                        />
                        {post.mediaType === 'video' && (
                          <div className="absolute top-1 right-1">
                            <Video className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2 text-center bg-indigo-50 dark:bg-indigo-900/20">
                        <span className="text-[10px] text-indigo-900 dark:text-indigo-200 font-medium line-clamp-3">
                          {post.content}
                        </span>
                      </div>
                    )}

                    {post.status !== 'published' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm uppercase">
                          {post.status === 'draft' ? 'Draft' : 'Scheduled'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty Slots for Planning */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={`empty-${i}`}
                    className="aspect-square bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => onCompose()}
                  >
                    <Plus className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
