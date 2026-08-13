import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, TrendingUp, BookOpen, Briefcase, Star, BarChart2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenTradeSimulator: () => void;
  watchlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenSettings,
  onOpenNotifications,
  onOpenTradeSimulator,
  watchlistCount
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="bg-[#0f131e] border-b border-[#363A45] flex justify-between items-center w-full px-6 h-12 z-40 sticky top-0">
      {/* Left side: Brand, Search, Nav links */}
      <div className="flex items-center gap-6">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveTab('Markets'); }}
          className="text-base font-bold text-[#b6c4ff] flex items-center gap-1.5 font-display tracking-tight"
        >
          <BarChart2 className="w-5 h-5 text-[#b6c4ff]" />
          <span>TerminalPro</span>
        </a>

        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-2 text-[#c3c5d8] text-[18px]">
            search
          </span>
          <button
            onClick={onOpenSearch}
            className="bg-[#1E222D] border border-[#363A45] rounded text-xs pl-8 pr-3 py-1 w-64 text-left text-[#dfe2f2] placeholder:text-[#c3c5d8] hover:border-[#b6c4ff] transition-colors flex justify-between items-center"
          >
            <span className="text-[#c3c5d8]">Search (Ctrl+K)</span>
            <kbd className="hidden sm:inline-block text-[10px] bg-[#2A2E39] px-1.5 py-0.5 rounded text-[#B2B5BE]">⌘K</kbd>
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {['Products', 'Community', 'Markets', 'News', 'Brokers', 'Watchlist'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-1 transition-colors cursor-pointer text-xs font-medium ${
                  isActive 
                    ? 'text-[#b6c4ff] border-b-2 border-[#b6c4ff] font-semibold' 
                    : 'text-[#c3c5d8] hover:text-[#b6c4ff]'
                }`}
              >
                {tab}
                {tab === 'Watchlist' && watchlistCount > 0 && (
                  <span className="ml-1 bg-[#2962ff] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {watchlistCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenNotifications}
          className="text-[#c3c5d8] hover:text-[#b6c4ff] transition-colors relative p-1 rounded hover:bg-[#1E222D]"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
        </button>

        <button 
          onClick={onOpenSettings}
          className="text-[#c3c5d8] hover:text-[#b6c4ff] transition-colors p-1 rounded hover:bg-[#1E222D]"
          title="Terminal Settings"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        <div 
          onClick={onOpenTradeSimulator}
          className="h-7 w-7 rounded-full overflow-hidden border border-[#363A45] cursor-pointer hover:border-[#b6c4ff] transition-colors"
          title="User Account & Virtual Portfolio"
        >
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Elzj2O08xncDG-UywPXPKQMYjXN0nXKGIlpTDHIlvUpCTSPTK9PwGEiGCr9K_oqXUYmk41CP6i0dqU7Pu0x7t_XOHguVT4WQKXpf4IumqWoOGwJ-ovKmNXLyGxL5AfOi50A3hA3vew0sabesJVpr85sYGsWnr6M9xR9o118Am4RdO1n1Ly2OP04HfFV9b_hh04DB6idaOkJ7ZbLYdXvEmACWmEQPTE9-OFjMt2cKduk5Pv0w-0oOQQ" 
            alt="User avatar"
          />
        </div>

        <button 
          onClick={onOpenTradeSimulator}
          className="bg-[#b6c4ff] text-[#002780] px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <span>Get started</span>
        </button>
      </div>
    </header>
  );
};
