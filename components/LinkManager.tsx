
import React, { useState } from 'react';
import { Link as LinkIcon, Copy, ExternalLink, Plus, MoreHorizontal, Smartphone, Layout, Sparkles, Trash2, GripVertical, ArrowRight, Loader2, Mail, Users, Download } from 'lucide-react';
import { ShortLink, BioPageConfig, ToastType, Lead } from '../types';
import { generateBio } from '../services/geminiService';

interface LinkManagerProps {
  showToast: (message: string, type: ToastType) => void;
}

// Mock Data
const MOCK_LINKS: ShortLink[] = [
  { id: '1', title: 'Summer Sale Landing Page', originalUrl: 'https://myshop.com/summer-sale-2024', shortCode: 'smr24', clicks: 1243, createdAt: '2 days ago', tags: ['campaign', 'sales'] },
  { id: '2', title: 'Latest Blog Post', originalUrl: 'https://blog.myshop.com/5-tips-for-summer', shortCode: 'tips5', clicks: 856, createdAt: '5 days ago', tags: ['content'] },
  { id: '3', title: 'Newsletter Signup', originalUrl: 'https://myshop.com/newsletter', shortCode: 'join', clicks: 342, createdAt: '2 weeks ago', tags: ['growth'] },
];

const MOCK_LEADS: Lead[] = [
  { id: '1', email: 'sarah.j@example.com', source: 'Bio Link', capturedAt: '2 hours ago' },
  { id: '2', email: 'mike.dev@tech.co', source: 'Bio Link', capturedAt: '5 hours ago' },
  { id: '3', email: 'designer@creative.studio', source: 'Bio Link', capturedAt: '1 day ago' },
  { id: '4', email: 'hello@startup.io', source: 'Bio Link', capturedAt: '2 days ago' },
];

const LinkManager: React.FC<LinkManagerProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<'shortener' | 'bio' | 'leads'>('shortener');
  const [links, setLinks] = useState<ShortLink[]>(MOCK_LINKS);
  const [isGenerating, setIsGenerating] = useState(false);

  // Bio Page State
  const [bioConfig, setBioConfig] = useState<BioPageConfig>({
    username: '@alexcreator',
    displayName: 'Alex Creator',
    bio: 'Digital creator passionate about tech & design. 🎨✨',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop',
    theme: 'colorful',
    links: [
      { id: '1', title: 'My Website', url: 'https://alex.com', active: true },
      { id: '2', title: 'Latest YouTube Video', url: 'https://youtube.com/watch?v=123', active: true },
      { id: '3', title: 'Book a Consultation', url: 'https://calendly.com/alex', active: true },
    ],
    enableLeadCapture: true,
    leadCaptureText: 'Join my weekly newsletter for tips!'
  });

  const [bioNiche, setBioNiche] = useState('');

  const handleGenerateBio = async () => {
    if (!bioNiche) return;
    setIsGenerating(true);
    const newBio = await generateBio(bioConfig.username, bioNiche, 'professional yet fun');
    setBioConfig(prev => ({ ...prev, bio: newBio }));
    setIsGenerating(false);
    showToast('Bio generated successfully!', 'success');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Link Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Trackable short links & Bio pages</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('shortener')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'shortener' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Short Links
          </button>
          <button 
            onClick={() => setActiveTab('bio')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'bio' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Layout className="w-4 h-4 mr-2" />
            Link in Bio
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'leads' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Leads
          </button>
        </div>
      </div>

      {activeTab === 'shortener' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Clicks</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2,441</h3>
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                <ArrowRight className="w-3 h-3 mr-1 rotate-[-45deg]" /> +12% this week
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Links</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</h3>
              <div className="mt-2 text-xs text-slate-400">
                3 expiring soon
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
               <div>
                 <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Create New Link</p>
                 <p className="text-xs text-slate-500 dark:text-slate-400">Shorten, brand, and track</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                 <Plus className="w-6 h-6" />
               </div>
            </div>
          </div>

          {/* Link Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="py-4 pl-6">Link Details</th>
                    <th className="py-4">Short URL</th>
                    <th className="py-4">Clicks</th>
                    <th className="py-4">Date</th>
                    <th className="py-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {links.map(link => (
                    <tr key={link.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 pl-6">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{link.title}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{link.originalUrl}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                            sfl.ai/{link.shortCode}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(`sfl.ai/${link.shortCode}`)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4">
                         <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{link.clicks.toLocaleString()}</span>
                      </td>
                      <td className="py-4">
                         <span className="text-sm text-slate-500 dark:text-slate-400">{link.createdAt}</span>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'bio' ? (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)] animate-in fade-in duration-300">
          {/* Editor Panel */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
               <h3 className="font-bold text-slate-900 dark:text-white">Profile & Links</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                   <img src={bioConfig.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover" />
                   <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Change Image</button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Display Name</label>
                  <input 
                    type="text" 
                    value={bioConfig.displayName}
                    onChange={(e) => setBioConfig({...bioConfig, displayName: e.target.value})}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Bio</label>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center" onClick={handleGenerateBio}>
                      {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin"/> : <Sparkles className="w-3 h-3 mr-1" />}
                      AI Reword
                    </span>
                  </div>
                  <textarea 
                    value={bioConfig.bio}
                    onChange={(e) => setBioConfig({...bioConfig, bio: e.target.value})}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none h-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="mt-2 flex gap-2">
                     <input 
                        type="text"
                        placeholder="Describe your niche for AI (e.g., Tech Reviewer)"
                        value={bioNiche}
                        onChange={(e) => setBioNiche(e.target.value)}
                        className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                     />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Lead Capture Settings */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                       <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Lead Capture Form</h3>
                    </div>
                    <button 
                      onClick={() => setBioConfig(prev => ({ ...prev, enableLeadCapture: !prev.enableLeadCapture }))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${bioConfig.enableLeadCapture ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                       <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${bioConfig.enableLeadCapture ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                 </div>
                 {bioConfig.enableLeadCapture && (
                    <div>
                       <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">Call to Action Text</label>
                       <input 
                          type="text"
                          value={bioConfig.leadCaptureText}
                          onChange={(e) => setBioConfig(prev => ({...prev, leadCaptureText: e.target.value}))}
                          className="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                       />
                    </div>
                 )}
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Links Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Links</label>
                  <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded">
                    <Plus className="w-3 h-3 mr-1" /> Add Link
                  </button>
                </div>
                
                {bioConfig.links.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group">
                    <div className="cursor-move text-slate-400 hover:text-slate-600">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                       <input 
                         type="text" 
                         value={link.title}
                         onChange={(e) => {
                            const newLinks = [...bioConfig.links];
                            newLinks[index].title = e.target.value;
                            setBioConfig({...bioConfig, links: newLinks});
                         }}
                         className="block w-full text-sm font-bold bg-transparent outline-none text-slate-900 dark:text-white mb-1"
                       />
                       <input 
                         type="text" 
                         value={link.url}
                         onChange={(e) => {
                            const newLinks = [...bioConfig.links];
                            newLinks[index].url = e.target.value;
                            setBioConfig({...bioConfig, links: newLinks});
                         }}
                         className="block w-full text-xs text-slate-500 bg-transparent outline-none"
                       />
                    </div>
                    <button 
                      onClick={() => {
                         const newLinks = bioConfig.links.filter((_, i) => i !== index);
                         setBioConfig({...bioConfig, links: newLinks});
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-[380px] shrink-0 flex justify-center items-start pt-8">
             <div className="w-[320px] h-[650px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden relative">
                {/* Phone Frame */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                
                {/* Bio Page Content */}
                <div className={`w-full h-full overflow-y-auto bg-white pt-12 pb-8 px-6 ${bioConfig.theme === 'dark' ? 'bg-slate-900 text-white' : bioConfig.theme === 'colorful' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-50 text-slate-900'}`}>
                   <div className="flex flex-col items-center text-center mb-8">
                      <img src={bioConfig.avatar} className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 object-cover" alt="Profile" />
                      <h2 className="font-bold text-xl mb-1">{bioConfig.displayName}</h2>
                      <p className="text-sm opacity-90">{bioConfig.username}</p>
                      <p className="text-sm mt-3 opacity-80 leading-relaxed">{bioConfig.bio}</p>
                   </div>
                   
                   {bioConfig.enableLeadCapture && (
                      <div className="mb-6">
                         <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                            <p className="text-sm font-bold mb-3 text-center">{bioConfig.leadCaptureText}</p>
                            <input type="email" placeholder="Email Address" className="w-full mb-2 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-sm placeholder:text-white/60 outline-none" disabled />
                            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold" disabled>Subscribe</button>
                         </div>
                      </div>
                   )}

                   <div className="space-y-3">
                      {bioConfig.links.filter(l => l.active).map(link => (
                         <div key={link.id} className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center font-bold text-sm hover:bg-white/20 transition-colors cursor-pointer">
                            {link.title}
                         </div>
                      ))}
                   </div>
                   
                   <div className="mt-8 text-center">
                      <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Powered by SocialFlow</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <th className="py-4 pl-6">Email Address</th>
                          <th className="py-4">Source</th>
                          <th className="py-4">Captured</th>
                          <th className="py-4 pr-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                       {MOCK_LEADS.map(lead => (
                          <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                             <td className="py-4 pl-6 font-medium text-slate-900 dark:text-white text-sm">{lead.email}</td>
                             <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{lead.source}</td>
                             <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{lead.capturedAt}</td>
                             <td className="py-4 pr-6 text-right">
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                   <Mail className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              {MOCK_LEADS.length === 0 && (
                 <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No leads captured yet.</p>
                 </div>
              )}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                 <button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LinkManager;
