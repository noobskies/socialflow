
import React from 'react';
import { ArrowUpRight, Users, Eye, TrendingUp, Sparkles, Link as LinkIcon, CheckCircle2, Circle, CalendarClock, AlertCircle, MoreHorizontal, Twitter, Linkedin, Facebook, Instagram, PenSquare, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', visitors: 4000, engagement: 2400 },
  { name: 'Tue', visitors: 3000, engagement: 1398 },
  { name: 'Wed', visitors: 2000, engagement: 9800 },
  { name: 'Thu', visitors: 2780, engagement: 3908 },
  { name: 'Fri', visitors: 1890, engagement: 4800 },
  { name: 'Sat', visitors: 2390, engagement: 3800 },
  { name: 'Sun', visitors: 3490, engagement: 4300 },
];

const Dashboard: React.FC = () => {
  const onboardingSteps = [
    { id: 1, label: 'Connect a social account', completed: true },
    { id: 2, label: 'Create your first post', completed: true },
    { id: 3, label: 'Setup your Link in Bio', completed: false },
    { id: 4, label: 'Invite a team member', completed: false },
  ];
  
  const completedSteps = onboardingSteps.filter(s => s.completed).length;
  const progress = (completedSteps / onboardingSteps.length) * 100;

  const upcomingPosts = [
    { id: 1, content: "Launching our new summer collection! ☀️ #summer #fashion", platform: 'instagram', time: 'Today, 2:00 PM' },
    { id: 2, content: "5 tips for better productivity. Thread 🧵", platform: 'twitter', time: 'Tomorrow, 9:00 AM' },
    { id: 3, content: "We are hiring! Join our team.", platform: 'linkedin', time: 'Fri, 10:00 AM' },
  ];

  return (
    <div className="space-y-6 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back! You have <span className="font-bold text-indigo-600 dark:text-indigo-400">84</span> AI credits remaining this month.</p>
        </div>
        <div className="flex space-x-2">
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Onboarding Progress Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Getting Started</h3>
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold">{progress}% Complete</span>
               </div>
               <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 max-w-md">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
               </div>
               <div className="flex flex-wrap gap-4">
                  {onboardingSteps.map(step => (
                     <div key={step.id} className="flex items-center gap-2">
                        {step.completed ? (
                           <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                           <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        )}
                        <span className={`text-sm font-medium ${step.completed ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>{step.label}</span>
                     </div>
                  ))}
               </div>
            </div>
            <button className="shrink-0 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200 dark:shadow-none">
               Continue Setup
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 dark:from-indigo-900/20 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Followers', value: '84.3K', change: '+12%', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Impressions', value: '1.2M', change: '+8.1%', icon: Eye, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Engagement Rate', value: '5.4%', change: '+2.3%', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'AI Posts Generated', value: '128', change: '+43%', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                  {stat.change}
                  {stat.change.startsWith('+') && <ArrowUpRight className="w-3 h-3 ml-1" />}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Engagement Overview</h3>
            <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="engagement" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        <div className="space-y-6">
           {/* Quick Draft Widget */}
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <PenSquare className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Quick Draft
                 </h3>
              </div>
              <textarea 
                placeholder="What's on your mind?" 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 mb-3 transition-all"
              ></textarea>
              <div className="flex justify-end relative z-10">
                 <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                 </button>
              </div>
           </div>

           {/* Upcoming Schedule Widget */}
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <CalendarClock className="w-5 h-5 mr-2 text-slate-400" />
                    Up Next
                 </h3>
                 <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">View Calendar</button>
              </div>
              <div className="space-y-4">
                 {upcomingPosts.map((post) => (
                    <div key={post.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          post.platform === 'instagram' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                          post.platform === 'twitter' ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' :
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                       }`}>
                          {post.platform === 'instagram' && <Instagram className="w-4 h-4" />}
                          {post.platform === 'twitter' && <Twitter className="w-4 h-4" />}
                          {post.platform === 'linkedin' && <Linkedin className="w-4 h-4" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-1">{post.content}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{post.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                 Schedule New Post
              </button>
           </div>

           {/* Account Health */}
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Health</h3>
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All Systems Operational</span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">100%</span>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500 dark:text-slate-400">Connected Accounts</span>
                     <span className="font-bold text-slate-900 dark:text-white">4 / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                     <div className="bg-indigo-600 h-1.5 rounded-full w-[40%]"></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                     <AlertCircle className="w-3 h-3" />
                     <span>Instagram token expires in 5 days</span>
                  </div>
               </div>
           </div>
        </div>
      </div>

      {/* Link Performance (Quick View) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
               <LinkIcon className="w-5 h-5 mr-2 text-slate-400" />
               Top Active Links
            </h3>
            <div className="space-y-5">
               {[
                 { name: 'Summer Sale', clicks: 1240, url: 'sfl.ai/smr24' },
                 { name: 'Bio Link', clicks: 856, url: 'sfl.ai/alex' },
                 { name: 'New Blog', clicks: 432, url: 'sfl.ai/blog2' },
               ].map((link, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{link.name}</p>
                      <p className="text-xs text-indigo-500 dark:text-indigo-400">{link.url}</p>
                    </div>
                    <div className="text-right">
                       <span className="block font-bold text-slate-900 dark:text-white">{link.clicks}</span>
                       <span className="text-[10px] text-slate-400 uppercase">Clicks</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                View All Links
            </button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent AI Generations</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">Summer Campaign Strategy for Instagram...</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Created 2h ago</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full font-medium">Blog to Post</span>
                  </div>
                </div>
                <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400">
                   <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
