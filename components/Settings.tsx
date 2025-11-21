
import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Mail, Smartphone, Check, Users, Share2, Plus, Trash2, ExternalLink, Twitter, Facebook, Linkedin, Instagram, AlertCircle, Zap, Key, Lock, Activity, Fingerprint, History, LogOut, Palette, Code, Copy, RefreshCw, Youtube, Video, Pin } from 'lucide-react';
import { SocialAccount, TeamMember, BrandingConfig, ApiKey } from '../types';

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: 'twitter', username: '@socialflow', avatar: '', connected: true },
  { id: '2', platform: 'linkedin', username: 'SocialFlow Inc.', avatar: '', connected: true },
  { id: '3', platform: 'facebook', username: 'SocialFlow', avatar: '', connected: false },
  { id: '4', platform: 'instagram', username: '@socialflow.ai', avatar: '', connected: true },
  { id: '5', platform: 'tiktok', username: '@socialflow_tok', avatar: '', connected: false },
  { id: '6', platform: 'youtube', username: 'SocialFlow TV', avatar: '', connected: false },
  { id: '7', platform: 'pinterest', username: 'SocialFlow Pins', avatar: '', connected: false },
];

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Alex Creator', email: 'alex@socialflow.ai', role: 'admin', avatar: 'https://picsum.photos/id/1011/100', status: 'active' },
  { id: '2', name: 'Sarah Design', email: 'sarah@socialflow.ai', role: 'editor', avatar: 'https://picsum.photos/id/1027/100', status: 'active' },
  { id: '3', name: 'Mike Analyst', email: 'mike@socialflow.ai', role: 'viewer', avatar: 'https://picsum.photos/id/1005/100', status: 'invited' },
];

const MOCK_AUDIT_LOG = [
  { id: 1, action: 'Login Success', user: 'Alex Creator', ip: '192.168.1.42', location: 'San Francisco, US', date: 'Just now' },
  { id: 2, action: 'Updated Billing Plan', user: 'Alex Creator', ip: '192.168.1.42', location: 'San Francisco, US', date: '2 days ago' },
  { id: 3, action: 'Invited Team Member', user: 'Alex Creator', ip: '192.168.1.42', location: 'San Francisco, US', date: '1 week ago' },
  { id: 4, action: 'Connected Twitter', user: 'Sarah Design', ip: '10.0.0.15', location: 'New York, US', date: '1 week ago' },
];

const MOCK_API_KEYS: ApiKey[] = [
  { id: '1', name: 'Production App', key: 'pk_live_...4829', lastUsed: '2 mins ago', createdAt: '2023-09-01' },
  { id: '2', name: 'Staging', key: 'pk_test_...9921', lastUsed: '1 day ago', createdAt: '2023-10-15' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'team' | 'billing' | 'notifications' | 'security' | 'branding' | 'developer'>('profile');
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [team, setTeam] = useState(MOCK_TEAM);

  // Mock Notification Settings
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    postSuccess: true,
    postFailure: true,
    mentions: true,
    newFollowers: false,
    marketing: false
  });

  // Mock Security Settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    sso: false
  });

  // Mock Branding Settings
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: 'SocialFlow Agency',
    primaryColor: '#4f46e5',
    logoUrl: 'https://picsum.photos/200/200',
    removeWatermark: true,
    customDomain: 'social.myagency.com'
  });

  const toggleConnection = (id: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, connected: !acc.connected } : acc
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
              <div className="flex items-center space-x-6 mb-8">
                <img src="https://picsum.photos/100/100" alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                <div>
                  <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Change Avatar</button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. Max 1MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" defaultValue="Alex Creator" className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input type="email" defaultValue="alex@socialflow.ai" className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                  <textarea defaultValue="Digital creator passionate about tech & design." className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Save Changes</button>
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connected Accounts</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your social media connections. Pro plan allows up to 10 accounts.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </button>
              </div>
              
              <div className="space-y-4">
                {accounts.map(acc => (
                  <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        acc.platform === 'twitter' ? 'bg-sky-500' :
                        acc.platform === 'linkedin' ? 'bg-blue-700' :
                        acc.platform === 'facebook' ? 'bg-blue-600' : 
                        acc.platform === 'instagram' ? 'bg-pink-600' :
                        acc.platform === 'tiktok' ? 'bg-black' :
                        acc.platform === 'youtube' ? 'bg-red-600' : 'bg-red-500'
                      }`}>
                        {acc.platform === 'twitter' && <Twitter className="w-6 h-6 text-white" />}
                        {acc.platform === 'linkedin' && <Linkedin className="w-6 h-6 text-white" />}
                        {acc.platform === 'facebook' && <Facebook className="w-6 h-6 text-white" />}
                        {acc.platform === 'instagram' && <Instagram className="w-6 h-6 text-white" />}
                        {acc.platform === 'tiktok' && <Video className="w-6 h-6 text-white" />}
                        {acc.platform === 'youtube' && <Youtube className="w-6 h-6 text-white" />}
                        {acc.platform === 'pinterest' && <Pin className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-900 dark:text-white capitalize">{acc.platform}</h3>
                         <p className="text-sm text-slate-500 dark:text-slate-400">{acc.connected ? acc.username : 'Not connected'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {acc.connected ? (
                        <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-xs font-bold">
                          <Check className="w-3 h-3 mr-1" /> Connected
                        </span>
                      ) : (
                        <span className="flex items-center text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                          Disconnected
                        </span>
                      )}
                      <button 
                        onClick={() => toggleConnection(acc.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          acc.connected 
                            ? 'border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900' 
                            : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'
                        }`}
                      >
                        {acc.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team Members</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage access and roles for your workspace.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Member</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {team.map(member => (
                      <tr key={member.id} className="group">
                        <td className="py-4 pl-2">
                          <div className="flex items-center space-x-3">
                            <img src={member.avatar} className="w-10 h-10 rounded-full" alt={member.name} />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                           <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2 py-1 font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                             <option selected={member.role === 'admin'}>Admin</option>
                             <option selected={member.role === 'editor'}>Editor</option>
                             <option selected={member.role === 'viewer'}>Viewer</option>
                           </select>
                        </td>
                        <td className="py-4">
                          {member.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                              Invited
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right pr-2">
                          <button className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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
        );

      case 'billing':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-bold uppercase tracking-wider">Current Plan</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">Pro Plan</h2>
                <p className="text-indigo-200 max-w-xl mb-6">Your plan renews on November 24, 2024. You have 16 AI credits remaining for this cycle.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-indigo-200 uppercase font-bold mb-1">Social Accounts</p>
                    <p className="text-2xl font-bold">4 / 10</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                     <p className="text-xs text-indigo-200 uppercase font-bold mb-1">AI Credits</p>
                     <p className="text-2xl font-bold">84 used</p>
                  </div>
                   <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                     <p className="text-xs text-indigo-200 uppercase font-bold mb-1">Team Members</p>
                     <p className="text-2xl font-bold">3 / 5</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Free Plan */}
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Free</h3>
                 <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$0<span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/mo</span></p>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Perfect for individuals just getting started.</p>
                 <button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Downgrade</button>
                 <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> 3 Social Accounts</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> 10 AI Credits/mo</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Basic Analytics</li>
                 </ul>
               </div>

               {/* Pro Plan (Active) */}
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-indigo-600 shadow-md relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">CURRENT PLAN</div>
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Pro</h3>
                 <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$15<span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/mo</span></p>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">For creators and small businesses growing fast.</p>
                 <button className="w-full mt-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg cursor-default">Current Plan</button>
                 <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> 10 Social Accounts</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> 100 AI Credits/mo</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Advanced Analytics</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Link in Bio Pro</li>
                 </ul>
               </div>

               {/* Agency Plan */}
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Agency</h3>
                 <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$45<span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/mo</span></p>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Best for teams managing multiple clients.</p>
                 <button className="w-full mt-6 py-2 bg-slate-900 dark:bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">Upgrade</button>
                 <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> 25 Social Accounts</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Unlimited AI</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Client Portals</li>
                   <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Priority Support</li>
                 </ul>
               </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
               
               <div className="space-y-6">
                 <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Digest</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Receive a weekly summary of your performance and upcoming posts.</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({...prev, emailDigest: !prev.emailDigest}))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.emailDigest ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                       <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.emailDigest ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Post Publishing</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Get notified when a scheduled post goes live or fails.</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({...prev, postSuccess: !prev.postSuccess}))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.postSuccess ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                       <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.postSuccess ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Mentions & Comments</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Alert me when someone mentions my brand or comments on a post.</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({...prev, mentions: !prev.mentions}))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.mentions ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                       <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.mentions ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Marketing Updates</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Receive news about new features and promotions.</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({...prev, marketing: !prev.marketing}))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.marketing ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                       <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.marketing ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             {/* Authentication */}
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                   <Shield className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                   Authentication
                </h2>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center">
                         <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 mr-4">
                            <Fingerprint className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Two-Factor Authentication</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${security.twoFactor ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${security.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center">
                         <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 mr-4">
                            <Key className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Single Sign-On (SSO)</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Login with your corporate identity provider.</p>
                         </div>
                      </div>
                      <div className="flex items-center">
                         <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded mr-3">ENTERPRISE</span>
                         <button 
                           disabled
                           className="text-xs font-medium text-slate-400 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-700 cursor-not-allowed"
                         >
                           Configure
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Active Sessions / Audit */}
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                   <Activity className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                   Audit Log
                </h2>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <th className="pb-3 pl-2">Action</th>
                            <th className="pb-3">User</th>
                            <th className="pb-3">Location</th>
                            <th className="pb-3 text-right pr-2">Time</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                         {MOCK_AUDIT_LOG.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                               <td className="py-3 pl-2 text-sm font-medium text-slate-900 dark:text-white">{log.action}</td>
                               <td className="py-3 text-sm text-slate-600 dark:text-slate-300">{log.user}</td>
                               <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                                  {log.ip} • {log.location}
                               </td>
                               <td className="py-3 text-xs text-slate-500 dark:text-slate-400 text-right pr-2">{log.date}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
             
             <div className="flex justify-center">
                <button className="flex items-center text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium text-sm px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                   <LogOut className="w-4 h-4 mr-2" />
                   Sign out of all devices
                </button>
             </div>
          </div>
        );
        
      case 'branding':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Branding & White-Labeling
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Customize the platform appearance for your clients.</p>
                  </div>
                  <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">AGENCY ONLY</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                         <input 
                           type="text" 
                           value={branding.companyName} 
                           onChange={(e) => setBranding({...branding, companyName: e.target.value})}
                           className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Color</label>
                         <div className="flex items-center gap-2">
                           <input 
                             type="color" 
                             value={branding.primaryColor} 
                             onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                             className="w-10 h-10 border border-slate-300 dark:border-slate-700 rounded p-1 cursor-pointer bg-white dark:bg-slate-800"
                           />
                           <input 
                             type="text" 
                             value={branding.primaryColor} 
                             onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                             className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                           />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Domain</label>
                         <input 
                           type="text" 
                           value={branding.customDomain} 
                           onChange={(e) => setBranding({...branding, customDomain: e.target.value})}
                           className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                         />
                         <p className="text-xs text-slate-400 mt-1">CNAME record required. See documentation.</p>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Logo Upload</label>
                         <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <img src={branding.logoUrl} alt="Logo" className="h-12 mb-4 object-contain" />
                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Click to upload</p>
                            <p className="text-xs text-slate-400 mt-1">SVG, PNG or JPG (Max 2MB)</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                         <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Remove "Powered by SocialFlow"</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Hide all SocialFlow branding from client reports and dashboard.</p>
                         </div>
                         <button 
                           onClick={() => setBranding({...branding, removeWatermark: !branding.removeWatermark})}
                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${branding.removeWatermark ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                         >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${branding.removeWatermark ? 'translate-x-6' : 'translate-x-1'}`} />
                         </button>
                      </div>
                   </div>
                </div>
                <div className="mt-8 flex justify-end">
                   <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Save Branding</button>
                </div>
             </div>
          </div>
        );
      
      case 'developer':
        return (
           <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                      <Code className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Developer Settings
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage API keys and webhooks for custom integrations.</p>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Key
                  </button>
                </div>

                <div className="space-y-4">
                   {MOCK_API_KEYS.map(key => (
                     <div key={key.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div>
                           <h3 className="font-bold text-slate-900 dark:text-white text-sm">{key.name}</h3>
                           <div className="flex items-center mt-1 gap-2">
                              <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">{key.key}</code>
                              <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400" title="Copy">
                                 <Copy className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-slate-500 dark:text-slate-400">Last used: {key.lastUsed}</p>
                           <p className="text-xs text-slate-400 dark:text-slate-500">Created: {key.createdAt}</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                   <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Webhooks
                   </h3>
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">No webhooks configured</p>
                      <button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">Add your first endpoint</button>
                   </div>
                </div>
             </div>
           </div>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'accounts', label: 'Social Accounts', icon: Share2 },
              { id: 'team', label: 'Team Members', icon: Users },
              { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security & Login', icon: Shield },
              { id: 'branding', label: 'Branding', icon: Palette },
              { id: 'developer', label: 'Developer API', icon: Code },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 overflow-y-auto pb-20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
