import React, { useState } from 'react';
import { AndroidDevice } from '../types/device';
import { ANDROID_VERSIONS_META } from '../data/initialDevices';
import { performRootCheck } from '../utils/rootChecker';
import { X, Smartphone, Plus, Layers, AlertCircle } from 'lucide-react';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (newDevice: AndroidDevice) => void;
}

const PRESET_MODELS = [
  { model: 'Samsung Galaxy S24 Ultra', manufacturer: 'Samsung', defaultVer: 15 },
  { model: 'Google Pixel 9 Pro', manufacturer: 'Google', defaultVer: 16 },
  { model: 'Xiaomi 14 Pro', manufacturer: 'Xiaomi', defaultVer: 14 },
  { model: 'OnePlus 12', manufacturer: 'OnePlus', defaultVer: 14 },
  { model: 'Nothing Phone (2)', manufacturer: 'Nothing', defaultVer: 13 },
  { model: 'Samsung Galaxy S22', manufacturer: 'Samsung', defaultVer: 12 },
  { model: 'Redmi Note 11', manufacturer: 'Xiaomi', defaultVer: 11 },
  { model: 'Samsung Galaxy S10', manufacturer: 'Samsung', defaultVer: 10 },
  { model: 'Google Pixel 3a (Мінімальна ОС)', manufacturer: 'Google', defaultVer: 9 }
];

const UKRAINIAN_CITIES = [
  'Київ, Україна',
  'Львів, Україна',
  'Одеса, Україна',
  'Харків, Україна',
  'Дніпро, Україна',
  'Запоріжжя, Україна',
  'Вінниця, Україна',
  'Івано-Франківськ, Україна',
  'Тернопіль, Україна',
  'Полтава, Україна'
];

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onAddDevice
}) => {
  if (!isOpen) return null;

  const [selectedPreset, setSelectedPreset] = useState(PRESET_MODELS[0].model);
  const [customModel, setCustomModel] = useState('');
  const [manufacturer, setManufacturer] = useState('Samsung');
  const [androidVersion, setAndroidVersion] = useState<number>(15);
  const [location, setLocation] = useState(UKRAINIAN_CITIES[0]);
  const [rootPreset, setRootPreset] = useState<'unchecked' | 'rooted' | 'not_rooted'>('unchecked');

  const handlePresetChange = (modelName: string) => {
    setSelectedPreset(modelName);
    const preset = PRESET_MODELS.find(p => p.model === modelName);
    if (preset) {
      setManufacturer(preset.manufacturer);
      setAndroidVersion(preset.defaultVer);
      setCustomModel('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalModel = customModel.trim() ? customModel.trim() : selectedPreset;
    const versionMeta = ANDROID_VERSIONS_META[androidVersion] || { codename: 'Android', apiLevel: 30 };

    const randomOctet1 = 178 + Math.floor(Math.random() * 20);
    const randomOctet2 = Math.floor(Math.random() * 255);
    const randomOctet3 = Math.floor(Math.random() * 255);
    const ipAddress = `${randomOctet1}.${randomOctet2}.${randomOctet3}.${Math.floor(Math.random() * 250) + 1}`;

    const newId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const baseDevice: AndroidDevice = {
      id: newId,
      model: finalModel,
      manufacturer,
      androidVersion,
      apiLevel: versionMeta.apiLevel,
      codename: versionMeta.codename,
      buildNumber: `UP1A.${Math.floor(100000 + Math.random() * 900000)}.001`,
      downloadedAt: new Date().toISOString(),
      ipAddress,
      location,
      screenResolution: '1080 x 2400 (420 ppi)',
      cpuArchitecture: 'arm64-v8a',
      batteryLevel: Math.floor(40 + Math.random() * 58),
      rootStatus: rootPreset,
      rootDetails: {
        suBinaryFound: false,
        superuserAppFound: false,
        testKeysDetected: false,
        busyboxInstalled: false,
        selinuxPermissive: false,
        dangerousPropsFound: false,
        logs: ['Додаток успішно завантажено на пристрій.']
      }
    };

    if (rootPreset === 'rooted') {
      const res = performRootCheck(baseDevice, true);
      baseDevice.rootStatus = res.status;
      baseDevice.rootDetails = res.details;
      baseDevice.lastCheckedAt = new Date().toISOString();
    } else if (rootPreset === 'not_rooted') {
      const res = performRootCheck(baseDevice, false);
      baseDevice.rootStatus = res.status;
      baseDevice.rootDetails = res.details;
      baseDevice.lastCheckedAt = new Date().toISOString();
    }

    onAddDevice(baseDevice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold">
              Симулювати завантаження додатку
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-left">
          
          {/* Preset Model */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Оберіть модель пристрою:
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {PRESET_MODELS.map((p) => (
                <option key={p.model} value={p.model}>
                  {p.model} ({p.manufacturer})
                </option>
              ))}
            </select>
          </div>

          {/* Or Custom Model Name */}
          <div>
            <label className="block text-slate-400 mb-1">
              Або введіть свою назву моделі:
            </label>
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="наприклад: Nothing Phone (3)"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Android Version Selector (Strictly 9 - 16) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Версія Android: <span className="text-emerald-400 font-bold">Android {androidVersion}</span>
              </label>
              <span className="text-slate-400 text-[11px]">
                {ANDROID_VERSIONS_META[androidVersion]?.codename} (API {ANDROID_VERSIONS_META[androidVersion]?.apiLevel})
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mt-2">
              {[9, 10, 11, 12, 13, 14, 15, 16].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setAndroidVersion(v)}
                  className={`py-2 px-1 rounded-lg border text-center transition-colors cursor-pointer font-mono font-bold ${
                    androidVersion === v
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              Вимога: Мінімум Android 9 (Pie, API 28), максимум Android 16 (Baklava, API 36).
            </p>
          </div>

          {/* City / Location */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Регіон завантаження (IP географія):
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {UKRAINIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Root status preset */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Початковий статус Root:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRootPreset('unchecked')}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  rootPreset === 'unchecked'
                    ? 'bg-slate-800 border-amber-400/60 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Не перевірено (Новий)
              </button>
              <button
                type="button"
                onClick={() => setRootPreset('not_rooted')}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  rootPreset === 'not_rooted'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Немає Root (Чистий)
              </button>
              <button
                type="button"
                onClick={() => setRootPreset('rooted')}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  rootPreset === 'rooted'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Є Root (Magisk/KSU)
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              Додати до списку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
