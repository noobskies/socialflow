
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Composer from './components/Composer';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Inbox from './components/Inbox';
import Library from './components/Library';
import LinkManager from './components/LinkManager';
import Automations from './components/Automations';
import CommandPalette from './components/CommandPalette';
import { ViewState, Draft } from './types';
import { Menu, LayoutDashboard, PenSquare, MessageSquare, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>(undefined);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCompose = (draft?: Draft) => {
    setInitialDraft(draft);
    setCurrentView(ViewState.COMPOSER);
    setMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.COMPOSER:
        return <Composer initialDraft={initialDraft} />;
      case ViewState.INBOX:
        return <Inbox />;
      case ViewState.CALENDAR:
        return <Calendar onCompose={handleCompose} />;
      case ViewState.LIBRARY:
        return <Library onCompose={handleCompose} />;
      case ViewState.LINKS:
        return <LinkManager />;
      case ViewState.AUTOMATIONS:
        return <Automations />;
      case ViewState.ANALYTICS:
        return <Analytics />;
      case ViewState.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCmdPaletteOpen} 
        onClose={() => setIsCmdPaletteOpen(false)} 
        setView={(view) => {
          setCurrentView(view);
          setIsCmdPaletteOpen(false);
        }} 
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <div className={`
        fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
         <Sidebar 
            currentView={currentView} 
            setView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} 
            currentTheme={theme}
            setTheme={setTheme}
         />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0 transition-colors duration-200">
           <div className="flex items-center space-x-3">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg text-slate-800 dark:text-white">SocialFlow AI</span>
           </div>
           <img 
              src="https://picsum.photos/100/100" 
              alt="User" 
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
            />
        </div>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-0">
           {renderView()}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-40 safe-area-pb transition-colors duration-200">
           <button 
             onClick={() => setCurrentView(ViewState.DASHBOARD)}
             className={`flex flex-col items-center gap-1 ${currentView === ViewState.DASHBOARD ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
           >
             <LayoutDashboard className="w-6 h-6" />
           </button>
           <button 
             onClick={() => setCurrentView(ViewState.CALENDAR)}
             className={`flex flex-col items-center gap-1 ${currentView === ViewState.CALENDAR ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
           >
             <CalendarIcon className="w-6 h-6" />
           </button>
           <div className="relative -top-6">
             <button 
               onClick={() => handleCompose()}
               className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 hover:bg-indigo-700 transition-transform active:scale-95 dark:shadow-indigo-900/40"
             >
               <PenSquare className="w-6 h-6" />
             </button>
           </div>
           <button 
             onClick={() => setCurrentView(ViewState.INBOX)}
             className={`flex flex-col items-center gap-1 ${currentView === ViewState.INBOX ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
           >
             <MessageSquare className="w-6 h-6" />
           </button>
           <button 
             onClick={() => setMobileMenuOpen(true)}
             className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
           >
             <MoreHorizontal className="w-6 h-6" />
           </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
