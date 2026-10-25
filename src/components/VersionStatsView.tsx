import React from 'react';
import { AndroidDevice } from '../types/device';
import { ANDROID_VERSIONS_META } from '../data/initialDevices';
import { ShieldCheck, ShieldAlert, Cpu, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VersionStatsViewProps {
  devices: AndroidDevice[];
  onFilterByVersion: (version: number) => void;
}

export const VersionStatsView: React.FC<VersionStatsViewProps> = ({
  devices,
  onFilterByVersion
}) => {
  const versions = [16, 15, 14, 13, 12, 11, 10, 9];

  const versionCounts = versions.map((v) => {
    const matching = devices.filter((d) => d.androidVersion === v);
    const rooted = matching.filter((d) => d.rootStatus === 'rooted').length;
    const clean = matching.filter((d) => d.rootStatus === 'not_rooted').length;
    const unchecked = matching.filter((d) => d.rootStatus === 'unchecked').length;
    return {
      version: v,
      meta: ANDROID_VERSIONS_META[v],
      total: matching.length,
      rooted,
      clean,
      unchecked,
      percentage: devices.length > 0 ? Math.round((matching.length / devices.length) * 100) : 0
    };
  });

  return (
    <div className="space-y-6 text-left">
      {/* Intro Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Аналітика версій ОС Android (Мінімум 9 — Максимум 16)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Розподіл встановлень додатку за версіями Android та співвідношення пристроїв з виявленим Root-доступом (Є) та без нього (Немає).
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shrink-0">
            Діапазон підтримки: Android 9.0 – 16.0
          </div>
        </div>
      </div>

      {/* Version Matrix Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {versionCounts.map(({ version, meta, total, rooted, clean, unchecked, percentage }) => {
          return (
            <div
              key={version}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      Android {version}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      API {meta.apiLevel}
                    </span>
                    {version === 9 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                        Мінімум
                      </span>
                    )}
                    {version === 16 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                        Найновіша
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-300 tabular-nums">
                    {total} пристроїв ({percentage}%)
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Кодове імʼя: <span className="text-slate-300">{meta.codename}</span> ({meta.releaseYear})
                </p>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full mt-3 overflow-hidden flex">
                  {clean > 0 && (
                    <div 
                      className="h-full bg-emerald-500 transition-all" 
                      style={{ width: `${(clean / Math.max(1, total)) * 100}%` }}
                      title={`Без Root (Немає): ${clean}`}
                    />
                  )}
                  {rooted > 0 && (
                    <div 
                      className="h-full bg-rose-500 transition-all" 
                      style={{ width: `${(rooted / Math.max(1, total)) * 100}%` }}
                      title={`Є Root: ${rooted}`}
                    />
                  )}
                  {unchecked > 0 && (
                    <div 
                      className="h-full bg-slate-700 transition-all" 
                      style={{ width: `${(unchecked / Math.max(1, total)) * 100}%` }}
                      title={`Не перевірено: ${unchecked}`}
                    />
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Немає: <strong className="tabular-nums">{clean}</strong>
                  </span>
                  <span className="text-rose-400 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Є Root: <strong className="tabular-nums">{rooted}</strong>
                  </span>
                  <span className="text-amber-400 font-medium">
                    Очікують: <strong className="tabular-nums">{unchecked}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-end">
                <button
                  onClick={() => onFilterByVersion(version)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  Переглянути пристрої Android {version} →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Architecture Notes */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-3">
        <h3 className="font-bold text-white text-sm">Особливості перевірки Root на Android 9 - 16:</h3>
        <ul className="space-y-2 list-disc list-inside text-slate-400">
          <li>
            <strong className="text-slate-200">Android 9 (Pie):</strong> Пошук бінарних файлів у `/system/bin/su` та перевірка наявності SuperSU / Magisk ранніх версій.
          </li>
          <li>
            <strong className="text-slate-200">Android 10 - 13:</strong> Посилений SELinux Enforcing та dynamic partitions. Виявлення Magisk з Zygisk та інʼєкцій у Zygote.
          </li>
          <li>
            <strong className="text-slate-200">Android 14 - 16:</strong> Модулі рівня ядра (KernelSU, APatch), перевірка Play Integrity API hardware-backed атестації та контролю доступу.
          </li>
        </ul>
      </div>
    </div>
  );
};
