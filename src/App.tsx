import React, { useState, useEffect } from 'react';
import { AndroidDevice } from './types/device';
import { INITIAL_DEVICES, ANDROID_VERSIONS_META } from './data/initialDevices';
import { detectCurrentDevice } from './utils/deviceDetector';
import { performRootCheck } from './utils/rootChecker';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { DeviceList } from './components/DeviceList';
import { MobileSimulator } from './components/MobileSimulator';
import { VersionStatsView } from './components/VersionStatsView';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { AddDeviceModal } from './components/AddDeviceModal';
import { RootScanModal } from './components/RootScanModal';
import { 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search, 
  ArrowRight,
  Info
} from 'lucide-react';

const STORAGE_KEY = 'rootchecker_devices_v2';

export default function App() {
  const [devices, setDevices] = useState<AndroidDevice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load devices from localStorage', e);
    }
    return INITIAL_DEVICES;
  });

  const [activeTab, setActiveTab] = useState<'fleet' | 'mobile' | 'stats'>('fleet');
  const [selectedDeviceForDetails, setSelectedDeviceForDetails] = useState<AndroidDevice | null>(null);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  // Scanning states
  const [activeScanningId, setActiveScanningId] = useState<string | null>(null);
  const [scanModalDevice, setScanModalDevice] = useState<AndroidDevice | null>(null);
  const [scanModalResult, setScanModalResult] = useState<'rooted' | 'not_rooted' | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  // Auto-detect and register current device if not already present
  useEffect(() => {
    const currentDevice = detectCurrentDevice();
    setDevices((prev) => {
      const exists = prev.some((d) => d.isCurrentDevice);
      if (!exists) {
        return [currentDevice, ...prev];
      }
      return prev;
    });
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [devices]);

  // Current session device
  const currentDevice = devices.find((d) => d.isCurrentDevice) || devices[0];

  // Handler: check root for a single device with visual modal and feedback
  const handleCheckDevice = (targetDevice: AndroidDevice, forceRoot?: boolean) => {
    setActiveScanningId(targetDevice.id);
    setScanModalDevice(targetDevice);
    setIsScanModalOpen(true);

    // Compute result
    const result = performRootCheck(targetDevice, forceRoot);
    setScanModalResult(result.status);

    // After animation delay, commit update to state
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.id === targetDevice.id) {
            return {
              ...d,
              rootStatus: result.status,
              rootDetails: result.details,
              lastCheckedAt: new Date().toISOString()
            };
          }
          return d;
        })
      );
      setActiveScanningId(null);
    }, 1800);
  };

  // Handler: Check all devices in fleet sequentially
  const handleCheckAllDevices = () => {
    setIsCheckingAll(true);
    let delay = 0;

    devices.forEach((dev) => {
      setTimeout(() => {
        const result = performRootCheck(dev);
        setDevices((prev) =>
          prev.map((d) => (d.id === dev.id ? {
            ...d,
            rootStatus: result.status,
            rootDetails: result.details,
            lastCheckedAt: new Date().toISOString()
          } : d))
        );
      }, delay);
      delay += 250;
    });

    setTimeout(() => {
      setIsCheckingAll(false);
    }, delay + 300);
  };

  // Handler: add a newly simulated device
  const handleAddDevice = (newDevice: AndroidDevice) => {
    setDevices((prev) => [newDevice, ...prev]);
  };

  // Handler: delete a device
  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    if (selectedDeviceForDetails?.id === id) {
      setSelectedDeviceForDetails(null);
    }
  };

  // Handler: switch Android version for current device (Android 9 - 16)
  const handleUpdateCurrentDeviceVersion = (ver: number) => {
    const meta = ANDROID_VERSIONS_META[ver];
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === currentDevice.id) {
          return {
            ...d,
            androidVersion: ver,
            apiLevel: meta.apiLevel,
            codename: meta.codename,
            rootStatus: 'unchecked',
            rootDetails: {
              ...d.rootDetails,
              logs: [`Версію Android змінено на ${ver} (${meta.codename}). Потрібно повторити перевірку root.`]
            }
          };
        }
        return d;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddDevice={() => setIsAddDeviceOpen(true)}
        onCheckAllDevices={handleCheckAllDevices}
        isCheckingAll={isCheckingAll}
        totalDevices={devices.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Prominent Current Device Quick Bar (When entering the app) */}
        {currentDevice && activeTab === 'fleet' && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                    Ваш поточний пристрій
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    Android {currentDevice.androidVersion} ({currentDevice.codename})
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {currentDevice.model}
                </h2>
                <p className="text-xs text-slate-400">
                  Підтримка: Android 9 (Pie) — Android 16 (Baklava). Натисніть кнопку для діагностики root.
                </p>
              </div>
            </div>

            {/* Current Device Status and Main "ПЕРЕВІРИТИ РУТ" Button */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Next to Device */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Статус:</span>
                {currentDevice.rootStatus === 'rooted' ? (
                  <span className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                    <XCircle className="w-4 h-4" />
                    Є (Root знайдено)
                  </span>
                ) : currentDevice.rootStatus === 'not_rooted' ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    НЕМАЄ (Чистий)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                    <HelpCircle className="w-4 h-4" />
                    Не перевірено
                  </span>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => handleCheckDevice(currentDevice)}
                disabled={activeScanningId === currentDevice.id}
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${activeScanningId === currentDevice.id ? 'animate-spin' : ''}`} />
                <span>ПЕРЕВІРИТИ РУТ</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: All Devices Fleet View */}
        {activeTab === 'fleet' && (
          <div>
            <StatsBar devices={devices} />
            <DeviceList
              devices={devices}
              onCheckDevice={handleCheckDevice}
              onOpenDetails={(dev) => setSelectedDeviceForDetails(dev)}
              onDeleteDevice={handleDeleteDevice}
              activeScanningId={activeScanningId}
            />
          </div>
        )}

        {/* Tab 2: Mobile App Simulator */}
        {activeTab === 'mobile' && (
          <MobileSimulator
            currentDevice={currentDevice}
            onCheckDevice={handleCheckDevice}
            onUpdateDeviceVersion={handleUpdateCurrentDeviceVersion}
            isScanning={activeScanningId === currentDevice.id}
            onOpenDetails={(dev) => setSelectedDeviceForDetails(dev)}
          />
        )}

        {/* Tab 3: Version Statistics (Android 9 - 16) */}
        {activeTab === 'stats' && (
          <VersionStatsView
            devices={devices}
            onFilterByVersion={(ver) => {
              setActiveTab('fleet');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            RootChecker Hub · Аудит прав суперкористувача (Android 9 Pie – Android 16 Baklava)
          </span>
          <span className="font-mono text-[11px]">
            API 28 – API 36
          </span>
        </div>
      </footer>

      {/* Modals */}
      <DeviceDetailModal
        device={selectedDeviceForDetails}
        onClose={() => setSelectedDeviceForDetails(null)}
        onRecheck={(dev) => handleCheckDevice(dev)}
        isScanning={activeScanningId === selectedDeviceForDetails?.id}
      />

      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onAddDevice={handleAddDevice}
      />

      <RootScanModal
        device={scanModalDevice}
        isOpen={isScanModalOpen}
        onComplete={() => setIsScanModalOpen(false)}
        resultStatus={scanModalResult}
      />
    </div>
  );
}
