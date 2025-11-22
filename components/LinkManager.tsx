
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
    avatar: 'https://picsum.photos/id/1011/200',
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
                   <img src={bioConfig.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800" />
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
                
                {bioConfig.links.map((link, idx) => (
                  <div key={link.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-start gap-3 group">
                    <div className="mt-2 text-slate-400 cursor-move hover:text-slate-600 dark:hover:text-slate-300">
                       <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-2">
                       <input 
                         type="text"
                         value={link.title}
                         onChange={(e) => {
                           const newLinks = [...bioConfig.links];
                           newLinks[idx].title = e.target.value;
                           setBioConfig({...bioConfig, links: newLinks});
                         }}
                         className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm font-medium outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                       />
                       <input 
                         type="text"
                         value={link.url}
                         onChange={(e) => {
                            const newLinks = [...bioConfig.links];
                            newLinks[idx].url = e.target.value;
                            setBioConfig({...bioConfig, links: newLinks});
                         }}
                         className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-500 dark:text-slate-400 outline-none focus:border-indigo-500"
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <button className={`w-8 h-5 rounded-full p-1 transition-colors ${link.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} onClick={() => {
                           const newLinks = [...bioConfig.links];
                           newLinks[idx].active = !newLinks[idx].active;
                           setBioConfig({...bioConfig, links: newLinks});
                       }}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${link.active ? 'translate-x-3' : 'translate-x-0'}`} />
                       </button>
                       <button className="text-slate-400 hover:text-rose-500 p-1">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Preview Phone */}
          <div className="w-full lg:w-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-3xl border-8 border-white dark:border-slate-700 shadow-xl overflow-hidden relative transition-colors duration-200">
              <div className={`w-full h-full overflow-y-auto hide-scrollbar ${
                bioConfig.theme === 'dark' ? 'bg-slate-900 text-white' : 
                bioConfig.theme === 'colorful' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-white text-slate-900'
              }`}>
                 <div className="p-8 flex flex-col items-center text-center pt-16">
                    <img src={bioConfig.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg mb-4 object-cover" />
                    <h3 className="font-bold text-xl mb-1">{bioConfig.displayName}</h3>
                    <p className="text-sm opacity-90 mb-8">{bioConfig.bio}</p>
                    
                    {/* Lead Capture Preview */}
                    {bioConfig.enableLeadCapture && (
                       <div className="w-full mb-6 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-left">
                          <p className="text-xs font-bold mb-2 opacity-90">{bioConfig.leadCaptureText}</p>
                          <div className="flex gap-2">
                             <div className="flex-1 h-8 bg-white/20 rounded text-xs flex items-center px-2 opacity-70">Email...</div>
                             <div className="w-8 h-8 bg-white text-indigo-600 rounded flex items-center justify-center">
                                <ArrowRight className="w-4 h-4" />
                             </div>
                          </div>
                       </div>
                    )}

                    <div className="w-full space-y-3">
                      {bioConfig.links.filter(l => l.active).map(link => (
                        <a 
                          key={link.id}
                          href="#" 
                          className={`block w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-lg ${
                            bioConfig.theme === 'colorful' 
                             ? 'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30' 
                             : 'bg-slate-900 text-white'
                          }`}
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                    
                    <div className="mt-12">
                      <p className="text-[10px] opacity-60 font-medium">Powered by SocialFlow</p>
                    </div>
                 </div>
              </div>
              
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white dark:bg-slate-900 rounded-b-xl shadow-sm z-10"></div>
          </div>
        </div>
      ) : (
         <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
               <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subscribers</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Leads collected from your Bio Page.</p>
               </div>
               <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
               </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50">
                     <th className="py-4 pl-6">Email</th>
                     <th className="py-4">Source</th>
                     <th className="py-4">Captured</th>
                     <th className="py-4 pr-6 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {MOCK_LEADS.map(lead => (
                     <tr key={lead.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 pl-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                 <Mail className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-slate-900 dark:text-white text-sm">{lead.email}</span>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className="text-sm text-slate-600 dark:text-slate-400">{lead.source}</span>
                        </td>
                        <td className="py-4">
                           <span className="text-sm text-slate-500 dark:text-slate-400">{lead.capturedAt}</span>
                        </td>
                        <td className="py-4 pr-6 text-right">
                           <button className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                     ))}
                  </tbody>
               </table>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default LinkManager;
