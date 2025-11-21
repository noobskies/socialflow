
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, MousePointer2, Share2, MessageCircle, Trophy, Target } from 'lucide-react';

const engagementData = [
  { name: 'Mon', facebook: 4000, twitter: 2400, linkedin: 2400 },
  { name: 'Tue', facebook: 3000, twitter: 1398, linkedin: 2210 },
  { name: 'Wed', facebook: 2000, twitter: 9800, linkedin: 2290 },
  { name: 'Thu', facebook: 2780, twitter: 3908, linkedin: 2000 },
  { name: 'Fri', facebook: 1890, twitter: 4800, linkedin: 2181 },
  { name: 'Sat', facebook: 2390, twitter: 3800, linkedin: 2500 },
  { name: 'Sun', facebook: 3490, twitter: 4300, linkedin: 2100 },
];

const reachData = [
  { name: 'Week 1', value: 12000 },
  { name: 'Week 2', value: 19000 },
  { name: 'Week 3', value: 15000 },
  { name: 'Week 4', value: 28000 },
];

const competitorData = [
  { subject: 'Followers', A: 120, B: 110, fullMark: 150 },
  { subject: 'Engagement', A: 98, B: 130, fullMark: 150 },
  { subject: 'Posts/Week', A: 86, B: 130, fullMark: 150 },
  { subject: 'Reach', A: 99, B: 100, fullMark: 150 },
  { subject: 'Growth', A: 85, B: 90, fullMark: 150 },
  { subject: 'Sentiment', A: 65, B: 85, fullMark: 150 },
];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors'>('overview');

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Performance metrics across all channels</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'overview' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('competitors')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'competitors' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Competitors
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { label: 'Total Reach', value: '128.4K', change: '+12.5%', trend: 'up', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Engagement', value: '14.2K', change: '+8.2%', trend: 'up', icon: MousePointer2, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                { label: 'Shares', value: '3.4K', change: '-2.1%', trend: 'down', icon: Share2, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                { label: 'Comments', value: '1.8K', change: '+5.4%', trend: 'up', icon: MessageCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'}`}>
                        {stat.change}
                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{stat.label}</p>
                    </div>
                );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Engagement Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Engagement by Platform</h3>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="facebook" name="Facebook" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                        <Bar dataKey="twitter" name="Twitter" fill="#0ea5e9" radius={[4, 4, 0, 0]} stackId="a" />
                        <Bar dataKey="linkedin" name="LinkedIn" fill="#0284c7" radius={[4, 4, 0, 0]} stackId="a" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Audience Growth</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Performing Posts</h3>
                    <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                                <img src={`https://picsum.photos/100/100?random=${i}`} className="w-full h-full object-cover" alt="Post" />
                            </div>
                            <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">10 Tips for Better Social Media...</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Published 2 days ago • LinkedIn</p>
                            </div>
                            <div className="text-right">
                            <span className="block text-sm font-bold text-emerald-600 dark:text-emerald-400">4.2%</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Engagement</span>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Audience Demographics</h3>
                    <div className="space-y-6">
                    {[
                        { label: 'United States', val: 45, color: 'bg-blue-500' },
                        { label: 'United Kingdom', val: 20, color: 'bg-indigo-500' },
                        { label: 'Canada', val: 15, color: 'bg-purple-500' },
                        { label: 'Germany', val: 10, color: 'bg-emerald-500' }
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                                <span className="text-slate-500 dark:text-slate-400">{item.val}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
             {/* Competitor Header */}
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                        You
                    </div>
                    <div className="text-slate-400 font-bold text-xl">VS</div>
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xl">
                        Comp
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Competitive Landscape</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">You are outperforming your main competitor in <span className="font-semibold text-emerald-600 dark:text-emerald-400">Engagement</span> but trailing in <span className="font-semibold text-rose-600 dark:text-rose-400">Post Volume</span>.</p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                    Add Competitor
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance Comparison</h3>
                   <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competitorData}>
                            <PolarGrid stroke="#cbd5e1" strokeOpacity={0.2} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#94a3b8' }} />
                            <Radar name="You" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                            <Radar name="Competitor" dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                            <Legend />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Head-to-Head Stats</h3>
                    <div className="space-y-6">
                       {[
                         { label: 'Follower Growth', you: '+5.2%', comp: '+3.1%', win: true },
                         { label: 'Avg. Engagement', you: '4.8%', comp: '2.1%', win: true },
                         { label: 'Posting Frequency', you: '5/week', comp: '12/week', win: false },
                         { label: 'Video Content', you: '15%', comp: '45%', win: false },
                         { label: 'Response Time', you: '2h', comp: '5h', win: true },
                       ].map((metric, i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <span className="font-medium text-slate-700 dark:text-slate-300 w-1/3">{metric.label}</span>
                            <div className="flex-1 flex items-center justify-center gap-8">
                               <div className={`font-bold ${metric.win ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{metric.you}</div>
                               <div className={`font-bold ${!metric.win ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{metric.comp}</div>
                            </div>
                            <div className="w-8 flex justify-end">
                                {metric.win ? <Trophy className="w-4 h-4 text-amber-500" /> : <Target className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-2">AI Insight</h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
                            Your competitor is gaining traction with short-form video. Recommend increasing Reel and TikTok frequency to 3x per week to capture market share.
                        </p>
                    </div>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
