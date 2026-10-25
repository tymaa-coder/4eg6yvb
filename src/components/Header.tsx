import React from 'react';
import { Smartphone, Plus, RefreshCw, ShieldCheck, DownloadCloud } from 'lucide-react';

interface HeaderProps {
  activeTab: 'fleet' | 'mobile' | 'stats';
  setActiveTab: (tab: 'fleet' | 'mobile' | 'stats') => void;
  onOpenAddDevice: () => void;
  onCheckAllDevices: () => void;
  isCheckingAll: boolean;
  totalDevices: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddDevice,
  onCheckAllDevices,
  isCheckingAll,
  totalDevices
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              RootChecker Hub
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('fleet')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                activeTab === 'fleet'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Всі пристрої ({totalDevices})
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mobile'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Мобільний додаток (Клієнт)
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                activeTab === 'stats'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Аналітика версій (Android 9–16)
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCheckAllDevices}
              disabled={isCheckingAll}
              title="Перевірити рут на всіх завантажених пристроях"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingAll ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Перевірити всі</span>
            </button>
            <button
              onClick={onOpenAddDevice}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">Нове завантаження</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center gap-4 py-2 border-t border-slate-800/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`whitespace-nowrap pb-1 ${activeTab === 'fleet' ? 'text-emerald-400 font-semibold border-b border-emerald-400' : 'text-slate-400'}`}
          >
            Всі пристрої ({totalDevices})
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`whitespace-nowrap pb-1 flex items-center gap-1 ${activeTab === 'mobile' ? 'text-emerald-400 font-semibold border-b border-emerald-400' : 'text-slate-400'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Мобільний додаток
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap pb-1 ${activeTab === 'stats' ? 'text-emerald-400 font-semibold border-b border-emerald-400' : 'text-slate-400'}`}
          >
            Аналітика (Android 9-16)
          </button>
        </div>
      </div>
    </header>
  );
};
