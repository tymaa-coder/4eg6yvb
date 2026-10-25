import React from 'react';
import { AndroidDevice } from '../types/device';
import { ShieldAlert, ShieldCheck, HelpCircle, Smartphone, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  devices: AndroidDevice[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ devices }) => {
  const total = devices.length;
  const rootedCount = devices.filter(d => d.rootStatus === 'rooted').length;
  const notRootedCount = devices.filter(d => d.rootStatus === 'not_rooted').length;
  const uncheckedCount = devices.filter(d => d.rootStatus === 'unchecked').length;

  const rootedPercent = total > 0 ? Math.round((rootedCount / total) * 100) : 0;
  const notRootedPercent = total > 0 ? Math.round((notRootedCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">Завантажень додатку</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white tabular-nums">{total}</span>
            <span className="text-xs text-slate-500">пристроїв</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Android 9 – Android 16</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Smartphone className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-rose-400/90 font-medium">Root виявлено (Є)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-400 tabular-nums">{rootedCount}</span>
            <span className="text-xs text-slate-400 tabular-nums">({rootedPercent}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Magisk / KernelSU / APatch</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-emerald-400/90 font-medium">Без Root (Немає)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400 tabular-nums">{notRootedCount}</span>
            <span className="text-xs text-slate-400 tabular-nums">({notRootedPercent}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Повністю безпечні</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-amber-400/90 font-medium">Очікують перевірки</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400 tabular-nums">{uncheckedCount}</span>
            <span className="text-xs text-slate-500">нових</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Потребують запуску тесту</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
