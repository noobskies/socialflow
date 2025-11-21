
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Twitter, Linkedin, Facebook, Instagram, Plus, X, Clock, Calendar as CalendarIcon, Youtube, Video, Pin } from 'lucide-react';
import { Draft, Platform, Post } from '../types';

interface CalendarProps {
  onCompose: (draft?: Draft) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onCompose }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Mock calendar data with type info
  const posts: Post[] = [
    { id: '1', scheduledDate: '2023-10-03', platforms: ['twitter'], content: 'Launching our new feature...', status: 'published', time: '9:00 AM' },
    { id: '2', scheduledDate: '2023-10-03', platforms: ['linkedin'], content: 'Company growth update...', status: 'published', time: '11:30 AM' },
    { id: '3', scheduledDate: '2023-10-05', platforms: ['facebook'], content: 'Community spotlight...', status: 'scheduled', time: '2:00 PM' },
    { id: '4', scheduledDate: '2023-10-08', platforms: ['twitter'], content: 'Thread about AI...', status: 'scheduled', time: '10:00 AM' },
    { id: '5', scheduledDate: '2023-10-12', platforms: ['linkedin'], content: 'Hiring engineers...', status: 'draft', time: '1:00 PM' },
    { id: '6', scheduledDate: '2023-10-15', platforms: ['twitter'], content: 'Customer testimonial...', status: 'scheduled', time: '3:45 PM' },
    { id: '7', scheduledDate: '2023-10-15', platforms: ['instagram'], content: 'Team lunch photo...', status: 'draft', time: '4:00 PM' },
    { id: '8', scheduledDate: '2023-10-20', platforms: ['youtube'], content: 'New Tutorial Video', status: 'scheduled', time: '12:00 PM' },
    { id: '9', scheduledDate: '2023-10-22', platforms: ['pinterest'], content: 'Inspiration Board', status: 'published', time: '5:00 PM' },
  ];

  const handleDateClick = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onCompose({ scheduledDate: formattedDate });
  };

  const getPlatformIcon = (platform: Platform, className: string = "w-3 h-3") => {
    switch(platform) {
      case 'twitter': return <Twitter className={className} />;
      case 'linkedin': return <Linkedin className={className} />;
      case 'facebook': return <Facebook className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'tiktok': return <Video className={className} />;
      case 'youtube': return <Youtube className={className} />;
      case 'pinterest': return <Pin className={className} />;
    }
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Post Details Modal */}
      {selectedPost && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm p-4" onClick={() => setSelectedPost(null)}>
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Post Details</h3>
                <button onClick={() => setSelectedPost(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                   {selectedPost.platforms.map(p => (
                     <div key={p} className={`p-2 rounded-lg ${
                        p === 'twitter' ? 'bg-sky-500' :
                        p === 'linkedin' ? 'bg-blue-700' :
                        p === 'facebook' ? 'bg-blue-600' :
                        p === 'instagram' ? 'bg-pink-600' :
                        p === 'tiktok' ? 'bg-black' :
                        p === 'youtube' ? 'bg-red-600' : 'bg-red-500'
                     } text-white`}>
                        {getPlatformIcon(p, 'w-4 h-4')}
                     </div>
                   ))}
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                     selectedPost.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                     selectedPost.status === 'scheduled' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' :
                     'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                   }`}>
                     {selectedPost.status}
                   </span>
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 space-x-4">
                   <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5" /> {currentMonth+1}/{selectedPost.scheduledDate.split('-')[2]}</div>
                   <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {selectedPost.time}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                   {selectedPost.content}
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setSelectedPost(null);
                    onCompose({ 
                      content: selectedPost.content, 
                      platforms: selectedPost.platforms,
                      scheduledDate: selectedPost.scheduledDate 
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  Edit Post
                </button>
                <button onClick={() => setSelectedPost(null)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Close
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Plan and visualize your social strategy</p>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={() => onCompose()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm">
               <Plus className="w-4 h-4 mr-2" />
               New Post
            </button>
            <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-200 min-w-[140px] text-center text-sm">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            {days.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-slate-100 dark:divide-slate-800 divide-y">
            {Array.from({ length: 35 }).map((_, i) => {
                const dayNum = i - 2; // Offset for start of month mock
                const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                const dayString = dayNum.toString();
                // Simple filter for mock data assuming current year/month
                const dayPosts = posts.filter(p => parseInt(p.scheduledDate.split('-')[2]) === dayNum);
                const isToday = dayNum === 5; // Mock today

                return (
                    <div key={i} className={`min-h-[120px] p-2 transition-colors group relative flex flex-col ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-950/50' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                        {isCurrentMonth && (
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
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
                            {isCurrentMonth && dayPosts.map((post, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedPost(post)}
                                    className={`p-2 rounded-md border text-xs flex flex-col gap-1 cursor-pointer transition-all hover:shadow-sm ${
                                    post.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' :
                                    post.status === 'scheduled' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400' :
                                    'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                }`}>
                                    <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-1">
                                            {post.platforms.map(p => (
                                               <span key={p} className="flex">{getPlatformIcon(p)}</span>
                                            ))}
                                            <span className="font-semibold ml-1">{post.time}</span>
                                         </div>
                                    </div>
                                    <span className="truncate opacity-90">{post.content}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
