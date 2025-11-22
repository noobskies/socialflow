
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PenSquare, Calendar as CalendarIcon, BarChart3, Settings, Zap, MessageSquare, FolderOpen, Link, Workflow, Sun, Moon, Monitor, Bell, ChevronDown, Plus, Check, HelpCircle, Crown, Briefcase } from 'lucide-react';
import { ViewState, Workspace, BrandingConfig, PlanTier } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentTheme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  branding: BrandingConfig;
  userPlan: PlanTier;
  onOpenNotifications?: () => void;
  onOpenHelp?: () => void;
  onOpenUpgrade?: () => void;
}

const AGENCY_WORKSPACES: Workspace[] = [
  { id: '1', name: 'SocialFlow Agency', role: 'owner' },
  { id: '2', name: 'Client: TechCorp', role: 'member' },
  { id: '3', name: 'Client: GreenFoods', role: 'owner' },
];

const PERSONAL_WORKSPACE: Workspace[] = [
  { id: '1', name: 'My Workspace', role: 'owner' }
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentTheme, setTheme, branding, userPlan, onOpenNotifications, onOpenHelp, onOpenUpgrade }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(PERSONAL_WORKSPACE);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(PERSONAL_WORKSPACE[0]);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  // Update workspaces based on plan
  useEffect(() => {
    if (userPlan === 'agency') {
      setWorkspaces(AGENCY_WORKSPACES);
      setActiveWorkspace(AGENCY_WORKSPACES[0]);
    } else {
      setWorkspaces(PERSONAL_WORKSPACE);
      setActiveWorkspace(PERSONAL_WORKSPACE[0]);
    }
  }, [userPlan]);

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.COMPOSER, label: 'Create Post', icon: PenSquare },
    { id: ViewState.INBOX, label: 'Inbox', icon: MessageSquare },
    { id: ViewState.CALENDAR, label: 'Calendar', icon: CalendarIcon },
    { id: ViewState.LIBRARY, label: 'Library', icon: FolderOpen },
    { id: ViewState.LINKS, label: 'Link Manager', icon: Link },
    { id: ViewState.AUTOMATIONS, label: 'Automations', icon: Workflow },
    { id: ViewState.ANALYTICS, label: 'Analytics', icon: BarChart3 },
  ];

  // Use branding logo if available, otherwise default icon
  const hasCustomLogo = branding.logoUrl && branding.logoUrl.length > 0 && userPlan === 'agency';

  // Credits Logic
  const totalCredits = userPlan === 'free' ? 10 : userPlan === 'pro' ? 100 : Infinity;
  const usedCredits = 8; // Mock usage
  const creditsPercent = totalCredits === Infinity ? 100 : (usedCredits / totalCredits) * 100;

  const isSingleUser = userPlan === 'free' || userPlan === 'pro';

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-xl">
      {/* Workspace Switcher / Branding Header */}
      <div className="p-4 border-b border-slate-800 relative z-20">
        <button 
          onClick={() => !isSingleUser && setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors group ${!isSingleUser ? 'hover:bg-slate-800 cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            {hasCustomLogo ? (
               <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white flex items-center justify-center">
                  <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
               </div>
            ) : (
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/50 group-hover:scale-105 transition-transform shrink-0">
                 {isSingleUser ? <Zap className="w-5 h-5 text-white fill-current" /> : <Briefcase className="w-5 h-5 text-white" />}
               </div>
            )}
            <div className="text-left min-w-0">
              <span className="block text-sm font-bold tracking-tight truncate w-32">
                 {hasCustomLogo ? branding.companyName : activeWorkspace.name}
              </span>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider truncate">
                 {hasCustomLogo ? activeWorkspace.name : (isSingleUser ? 'Personal' : activeWorkspace.role)}
              </span>
            </div>
          </div>
          {!isSingleUser && (
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {isWorkspaceDropdownOpen && !isSingleUser && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
            <div className="max-h-60 overflow-y-auto">
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 transition-colors text-sm"
                >
                  <span className={ws.id === activeWorkspace.id ? 'text-white font-medium' : 'text-slate-300'}>{ws.name}</span>
                  {ws.id === activeWorkspace.id && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-700 p-2">
               <button className="w-full flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                  <Plus className="w-3 h-3 mr-2" /> Create Workspace
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Tools */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        
        {/* Usage Stats / Upgrade */}
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">AI Credits</span>
              <span className="text-xs text-slate-400">{userPlan === 'agency' ? 'Unlimited' : `${usedCredits}/${totalCredits}`}</span>
           </div>
           {userPlan !== 'agency' && (
             <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${creditsPercent}%` }}></div>
             </div>
           )}
           {userPlan === 'free' && (
              <button onClick={onOpenUpgrade} className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center">
                 <Crown className="w-3 h-3 mr-1" /> Upgrade to Pro
              </button>
           )}
        </div>

        {/* Theme Switcher */}
        <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setTheme('light')}
            className={`flex-1 flex justify-center py-1.5 rounded-md transition-colors ${currentTheme === 'light' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            title="Light Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={`flex-1 flex justify-center py-1.5 rounded-md transition-colors ${currentTheme === 'system' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            title="System Preference"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`flex-1 flex justify-center py-1.5 rounded-md transition-colors ${currentTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <button 
               onClick={() => setView(ViewState.SETTINGS)}
               className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors border border-slate-700 ${
                   currentView === ViewState.SETTINGS 
                   ? 'bg-slate-800 text-white' 
                   : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800'
               }`}
           >
             <Settings className="w-4 h-4" />
             <span className="text-xs font-medium">Settings</span>
           </button>
           <button 
               onClick={onOpenHelp}
               className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors border border-slate-700 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800"
           >
             <HelpCircle className="w-4 h-4" />
             <span className="text-xs font-medium">Help</span>
           </button>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 flex items-center space-x-3">
          <div className="relative shrink-0">
             <img 
               src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop" 
               alt="User" 
               className="w-9 h-9 rounded-full border-2 border-indigo-500"
             />
             <div className="absolute -top-1 -right-1 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Alex Creator</p>
            <p className="text-[10px] text-indigo-400 truncate uppercase font-bold">{userPlan} Plan</p>
          </div>
          <button onClick={onOpenNotifications} className="text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
