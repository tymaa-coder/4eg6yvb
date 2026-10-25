import React, { useEffect, useState } from 'react';
import { AndroidDevice } from '../types/device';
import { ShieldAlert, ShieldCheck, Search, CheckCircle2, XCircle, Terminal } from 'lucide-react';

interface RootScanModalProps {
  device: AndroidDevice | null;
  isOpen: boolean;
  onComplete: () => void;
  resultStatus: 'rooted' | 'not_rooted' | null;
}

const SCAN_STEPS = [
  'Пошук бінарного файлу su у каталогах /system/bin, /system/xbin, /sbin...',
  'Сканування встановлених додатків Magisk, KernelSU, APatch...',
  'Аналіз системних підписів прошивки ro.build.tags...',
  'Перевірка режиму безпеки ядра SELinux (Enforcing / Permissive)...',
  'Аналіз монтування розділів /system та прав доступу rw/ro...',
  'Формування фінального вердикту безпеки пристрою...'
];

export const RootScanModal: React.FC<RootScanModalProps> = ({
  device,
  isOpen,
  onComplete,
  resultStatus
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen || !device) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    setCurrentStepIndex(0);
    setIsFinished(false);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsFinished(true);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, device]);

  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Search className={`w-4 h-4 ${!isFinished ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isFinished ? 'Діагностику завершено' : 'Сканування Root-доступу'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {device.model} · Android {device.androidVersion}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${Math.round(((currentStepIndex + 1) / SCAN_STEPS.length) * 100)}%` }}
            />
          </div>

          {/* Steps checklist */}
          <div className="space-y-2 text-xs">
            {SCAN_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div 
                  key={idx}
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                    isCurrent 
                      ? 'bg-slate-800/80 text-emerald-300 font-medium' 
                      : isPast 
                      ? 'text-slate-400' 
                      : 'text-slate-600 opacity-60'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>

          {/* Final Verdict when finished */}
          {isFinished && (
            <div className={`p-4 rounded-xl border mt-4 text-center ${
              resultStatus === 'rooted'
                ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}>
              <div className="flex justify-center mb-1.5">
                {resultStatus === 'rooted' ? (
                  <ShieldAlert className="w-8 h-8 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                )}
              </div>
              <h4 className="text-base font-bold">
                {resultStatus === 'rooted' ? 'СТАТУС: Є (ROOT ЗНАЙДЕНО)' : 'СТАТУС: НЕМАЄ (ROOT ВІДСУТНІЙ)'}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {resultStatus === 'rooted'
                  ? 'Біля пристрою у списку встановлено позначку «Є»'
                  : 'Біля пристрою у списку встановлено позначку «Немає»'}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {isFinished && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
            <button
              onClick={onComplete}
              className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Зрозуміло, перейти до списку
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
