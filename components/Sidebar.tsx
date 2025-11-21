
import React from 'react';
import { LayoutDashboard, PenSquare, Calendar as CalendarIcon, BarChart3, Settings, Zap, MessageSquare, FolderOpen, Link, Workflow, Sun, Moon, Monitor } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentTheme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentTheme, setTheme }) => {
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

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight">SocialFlow AI</span>
      </div>

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

      <div className="p-4 border-t border-slate-800">
        
        {/* Theme Switcher */}
        <div className="flex bg-slate-950/50 p-1 rounded-lg mb-4 border border-slate-800">
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

        <button 
            onClick={() => setView(ViewState.SETTINGS)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                currentView === ViewState.SETTINGS 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <img 
              src="https://picsum.photos/100/100" 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-indigo-500"
            />
            <div>
              <p className="text-sm font-semibold text-white">Alex Creator</p>
              <p className="text-xs text-indigo-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
