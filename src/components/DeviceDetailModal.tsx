import React from 'react';
import { AndroidDevice } from '../types/device';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Smartphone, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Layers, 
  Download 
} from 'lucide-react';

interface DeviceDetailModalProps {
  device: AndroidDevice | null;
  onClose: () => void;
  onRecheck: (device: AndroidDevice) => void;
  isScanning: boolean;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  device,
  onClose,
  onRecheck,
  isScanning
}) => {
  if (!device) return null;

  const isRooted = device.rootStatus === 'rooted';
  const isNotRooted = device.rootStatus === 'not_rooted';
  const isUnchecked = device.rootStatus === 'unchecked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isRooted
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : isNotRooted
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {device.model}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Android {device.androidVersion} ({device.codename}) · API {device.apiLevel} · {device.manufacturer}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left text-xs">
          
          {/* Main Root Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isRooted
              ? 'bg-rose-950/25 border-rose-800/60 text-rose-300'
              : isNotRooted
              ? 'bg-emerald-950/25 border-emerald-800/60 text-emerald-300'
              : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
          }`}>
            <div className="flex items-center gap-3">
              {isRooted ? (
                <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
              ) : isNotRooted ? (
                <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
              ) : (
                <Layers className="w-7 h-7 text-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Результат сканування безпеки
                </p>
                <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {isRooted
                    ? 'СТАТУС: Є (ROOT-ДОСТУП ВИЯВЛЕНО)'
                    : isNotRooted
                    ? 'СТАТУС: НЕМАЄ (ROOT-ПРАВА ВІДСУТНІ)'
                    : 'СТАТУС: НЕ ПЕРЕВІРЕНО'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isRooted
                    ? 'Пристрій має модифіковані системні файли або встановлений root-менеджер.'
                    : isNotRooted
                    ? 'Всі контрольні перевірки цілісності Android та SELinux пройдені успішно.'
                    : 'Запустіть перевірку, щоб протестувати наявність прав root.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRecheck(device)}
              disabled={isScanning}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isScanning ? 'Сканування...' : 'Повторити тест'}
            </button>
          </div>

          {/* Diagnostic Breakdown Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Контрольні показники перевірки
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Бінарник `su`</span>
                  <span className="font-semibold text-white">
                    {device.rootDetails.suBinaryFound ? 'ЗНАЙДЕНО' : 'Відсутній'}
                  </span>
                </div>
                {device.rootDetails.suBinaryFound ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Root-менеджер (Magisk/KSU)</span>
                  <span className="font-semibold text-white">
                    {device.rootDetails.superuserAppFound ? 'АКТИВНИЙ' : 'Не виявлено'}
                  </span>
                </div>
                {device.rootDetails.superuserAppFound ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">SELinux захист</span>
                  <span className="font-semibold text-white">
                    {device.rootDetails.selinuxPermissive ? 'Permissive (ВИМКНЕНО)' : 'Enforcing (Активний)'}
                  </span>
                </div>
                {device.rootDetails.selinuxPermissive ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Підпис прошивки (ro.build.tags)</span>
                  <span className="font-semibold text-white">
                    {device.rootDetails.testKeysDetected ? 'test-keys (Неофіційна)' : 'release-keys (Офіційна)'}
                  </span>
                </div>
                {device.rootDetails.testKeysDetected ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2 text-[11px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-slate-300">
              <div>
                <span className="text-slate-500 block">IP адреса:</span>
                <span className="font-mono text-slate-200">{device.ipAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Місто / Регіон:</span>
                <span className="text-slate-200">{device.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Збірка:</span>
                <span className="font-mono text-slate-200">{device.buildNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Роздільна здатність:</span>
                <span className="text-slate-200">{device.screenResolution}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Архітектура CPU:</span>
                <span className="text-slate-200">{device.cpuArchitecture}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Рівень заряду:</span>
                <span className="text-slate-200">{device.batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* Audit Logs Console */}
          <div>
            <div className="flex items-center gap-2 text-slate-300 mb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Журнал перевірки (Audit Logs)</h4>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-48 overflow-y-auto leading-relaxed">
              {device.rootDetails.logs.length === 0 ? (
                <p className="text-slate-600">Перевірка ще не запускалася для цього пристрою.</p>
              ) : (
                device.rootDetails.logs.map((log, index) => (
                  <div key={index} className={
                    log.includes('УВАГА') || log.includes('ЗНАЙДЕНО') || log.includes('Є ROOT')
                      ? 'text-rose-400 font-medium'
                      : log.includes('✓') || log.includes('НЕМАЄ ROOT')
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Android {device.androidVersion} · Сумісний діапазон 9 – 16
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
