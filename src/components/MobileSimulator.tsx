import React, { useState } from 'react';
import { AndroidDevice } from '../types/device';
import { ANDROID_VERSIONS_META } from '../data/initialDevices';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Cpu, 
  BatteryMedium, 
  Wifi, 
  Smartphone, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ToggleLeft, 
  ToggleRight,
  Info
} from 'lucide-react';

interface MobileSimulatorProps {
  currentDevice: AndroidDevice;
  onCheckDevice: (device: AndroidDevice, forceRoot?: boolean) => void;
  onUpdateDeviceVersion: (version: number) => void;
  isScanning: boolean;
  onOpenDetails: (device: AndroidDevice) => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  currentDevice,
  onCheckDevice,
  onUpdateDeviceVersion,
  isScanning,
  onOpenDetails
}) => {
  const [simulateRootToggle, setSimulateRootToggle] = useState<boolean>(false);
  const currentTime = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  const handleRunCheck = () => {
    onCheckDevice(currentDevice, simulateRootToggle);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
      {/* Phone Case Frame */}
      <div className="relative w-full max-w-[360px] sm:w-[360px] h-[720px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Top Punch Hole Camera & Speaker */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          </div>
        </div>

        {/* Android Status Bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none z-10 bg-slate-950/40">
          <span>{currentTime}</span>
          <div className="flex items-center gap-2">
            <span>5G</span>
            <Wifi className="w-3 h-3" />
            <span className="tabular-nums">{currentDevice.batteryLevel}%</span>
            <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* App Content inside Android Phone */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          
          {/* App Top Bar inside Mobile */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight">RootChecker APK</h1>
                  <p className="text-[10px] text-slate-400">Версія клієнта: v2.4 (Android 9–16)</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                API {currentDevice.apiLevel}
              </span>
            </div>

            {/* Device Identity Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-slate-400">Поточний пристрій</p>
                  <h3 className="text-sm font-semibold text-white mt-0.5">{currentDevice.model}</h3>
                </div>
                <Smartphone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-400">ОС: </span>
                  <span className="font-semibold text-emerald-300">Android {currentDevice.androidVersion}</span>
                  <span className="text-slate-400 text-[10px]"> ({currentDevice.codename})</span>
                </div>
                <div>
                  <span className="text-slate-400">Збірка: </span>
                  <span className="font-mono text-[10px] text-slate-300">{currentDevice.buildNumber}</span>
                </div>
              </div>

              {/* Status Next to Device (Required by Prompt) */}
              <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Статус Root на пристрої:</span>
                {currentDevice.rootStatus === 'rooted' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    Є (Root наявний)
                  </span>
                )}
                {currentDevice.rootStatus === 'not_rooted' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    НЕМАЄ (Чистий)
                  </span>
                )}
                {currentDevice.rootStatus === 'unchecked' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50 text-xs">
                    Не перевірено
                  </span>
                )}
              </div>
            </div>

            {/* Central Action: Check Root Button */}
            <div className="mt-6 flex flex-col items-center text-center">
              <button
                onClick={handleRunCheck}
                disabled={isScanning}
                className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isScanning ? (
                  <>
                    <Search className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Сканування системних файлів...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                    <span>ПЕРЕВІРИТИ РУТ</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Натисніть для миттєвої перевірки бінарників `su`, Magisk та SELinux
              </p>
            </div>

            {/* Scan Result Inspection View */}
            {currentDevice.rootStatus !== 'unchecked' && (
              <div className={`mt-5 p-3.5 rounded-xl border text-left ${
                currentDevice.rootStatus === 'rooted'
                  ? 'bg-rose-950/30 border-rose-800/60'
                  : 'bg-emerald-950/30 border-emerald-800/60'
              }`}>
                <div className="flex items-center gap-2">
                  {currentDevice.rootStatus === 'rooted' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-xs font-bold ${
                      currentDevice.rootStatus === 'rooted' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {currentDevice.rootStatus === 'rooted'
                        ? 'УВАГА: ROOT ДОСТУП Є!'
                        : 'БЕЗПЕЧНО: ROOT ПРАВА НЕМАЄ'}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {currentDevice.rootStatus === 'rooted'
                        ? currentDevice.rootDetails.superuserAppName || 'Виявлено системні бінарники su'
                        : 'Всі тести цілісності системи успішно пройдено'}
                    </p>
                  </div>
                </div>

                {/* Quick Diagnostics Checklist */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Бінарний файл `su`:</span>
                    <span className={currentDevice.rootDetails.suBinaryFound ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-medium'}>
                      {currentDevice.rootDetails.suBinaryFound ? 'Є (знайдено)' : 'Немає'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Root-менеджер:</span>
                    <span className={currentDevice.rootDetails.superuserAppFound ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-medium'}>
                      {currentDevice.rootDetails.superuserAppFound ? 'Є (активний)' : 'Немає'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>SELinux захист:</span>
                    <span className={currentDevice.rootDetails.selinuxPermissive ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-medium'}>
                      {currentDevice.rootDetails.selinuxPermissive ? 'Permissive (вимкнено)' : 'Enforcing (увімкнено)'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDetails(currentDevice)}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Переглянути повний журнал аудиту
                </button>
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Home, Back, Recents) */}
          <div className="pt-4 pb-1 border-t border-slate-800/60 flex items-center justify-around text-slate-500">
            <div className="w-3 h-3 border-l-2 border-b-2 border-slate-600 rotate-45 -translate-y-0.5"></div>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600"></div>
            <div className="w-3 h-3 border-2 border-slate-600 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Version Switcher */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-left space-y-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Layers className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Панель симулятора мобільного додатку</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Тут ви можете змінювати версію Android пристрою (від Android 9 до Android 16) та тестувати реакцію кнопки «Перевірити рут».
          </p>
        </div>

        {/* Android Version Selector: Strictly Android 9 - 16 */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Версія Android (Мінімум 9, максимум 16):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[9, 10, 11, 12, 13, 14, 15, 16].map((ver) => {
              const meta = ANDROID_VERSIONS_META[ver];
              const isSelected = currentDevice.androidVersion === ver;
              return (
                <button
                  key={ver}
                  onClick={() => onUpdateDeviceVersion(ver)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">Android {ver}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{meta.codename.split(' ')[0]}</div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            * Підтримка строго з Android 9 (API 28) до Android 16 (API 36 Baklava).
          </p>
        </div>

        {/* Test Root Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">Тестовий стан: Симулювати Root</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Увімкніть, щоб перевірка виявила наявність Root-доступу (Magisk/KernelSU)
            </p>
          </div>
          <button
            onClick={() => setSimulateRootToggle(!simulateRootToggle)}
            className="cursor-pointer text-slate-300 hover:text-white transition-colors"
          >
            {simulateRootToggle ? (
              <ToggleRight className="w-8 h-8 text-rose-400" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-500" />
            )}
          </button>
        </div>

        {/* Quick Instructions */}
        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-200">Як працює: </span>
            Коли користувач натискає кнопку «Перевірити рут» у додатку, алгоритм перевіряє системні каталоги Android на наявність прав суперкористувача і одразу оновлює статус біля пристрою («Є» або «Немає»).
          </div>
        </div>
      </div>
    </div>
  );
};
