import React, { useState } from 'react';
import { AndroidDevice, RootFilter, VersionFilter } from '../types/device';
import { 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  RefreshCw, 
  Smartphone, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Cpu
} from 'lucide-react';

interface DeviceListProps {
  devices: AndroidDevice[];
  onCheckDevice: (device: AndroidDevice) => void;
  onOpenDetails: (device: AndroidDevice) => void;
  onDeleteDevice: (id: string) => void;
  activeScanningId: string | null;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onCheckDevice,
  onOpenDetails,
  onDeleteDevice,
  activeScanningId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rootFilter, setRootFilter] = useState<RootFilter>('all');
  const [versionFilter, setVersionFilter] = useState<VersionFilter>('all');
  const [sortBy, setSortBy] = useState<'downloadDate' | 'version' | 'model'>('downloadDate');

  // Filter devices
  const filteredDevices = devices.filter((device) => {
    // Search query
    const matchesSearch = 
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Root filter
    if (rootFilter === 'rooted' && device.rootStatus !== 'rooted') return false;
    if (rootFilter === 'not_rooted' && device.rootStatus !== 'not_rooted') return false;
    if (rootFilter === 'unchecked' && device.rootStatus !== 'unchecked') return false;

    // Version filter
    if (versionFilter !== 'all' && device.androidVersion !== versionFilter) return false;

    return true;
  });

  // Sort devices
  filteredDevices.sort((a, b) => {
    if (sortBy === 'downloadDate') {
      return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime();
    }
    if (sortBy === 'version') {
      return b.androidVersion - a.androidVersion;
    }
    return a.model.localeCompare(b.model);
  });

  const exportReport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(devices, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `rootcheck_devices_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ['ID', 'Модель', 'Виробник', 'Версія Android', 'API', 'Статус Root', 'Дата завантаження', 'IP', 'Місто'];
      const rows = devices.map(d => [
        d.id,
        `"${d.model}"`,
        `"${d.manufacturer}"`,
        `Android ${d.androidVersion}`,
        d.apiLevel,
        d.rootStatus === 'rooted' ? 'Є (Root знайдено)' : d.rootStatus === 'not_rooted' ? 'Немає (Чистий)' : 'Не перевірено',
        d.downloadedAt,
        d.ipAddress,
        `"${d.location}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `rootcheck_devices_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук за моделлю, IP або містом..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Tabs for Root Status */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/60 border border-slate-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => setRootFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              rootFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Всі ({devices.length})
          </button>
          <button
            onClick={() => setRootFilter('rooted')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              rootFilter === 'rooted'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60 font-semibold'
                : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Є Root
          </button>
          <button
            onClick={() => setRootFilter('not_rooted')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              rootFilter === 'not_rooted'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold'
                : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Немає Root
          </button>
          <button
            onClick={() => setRootFilter('unchecked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              rootFilter === 'unchecked'
                ? 'bg-slate-800 text-amber-300 font-semibold'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            Не перевірено
          </button>
        </div>

        {/* Android Version Selector */}
        <div className="flex items-center gap-2">
          <select
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="all">Усі версії (Android 9–16)</option>
            <option value="16">Android 16 (Baklava)</option>
            <option value="15">Android 15 (Vanilla)</option>
            <option value="14">Android 14 (Upside Down)</option>
            <option value="13">Android 13 (Tiramisu)</option>
            <option value="12">Android 12 (Snow Cone)</option>
            <option value="11">Android 11 (Red Velvet)</option>
            <option value="10">Android 10 (Quince)</option>
            <option value="9">Android 9 (Pie - Мін.)</option>
          </select>

          {/* Export Button */}
          <button
            onClick={() => exportReport('csv')}
            title="Експорт списку у CSV файл"
            className="p-2 text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Пристрій та модель</th>
                <th className="py-3 px-4 font-semibold">Версія ОС (Android 9–16)</th>
                <th className="py-3 px-4 font-semibold">Дата завантаження</th>
                <th className="py-3 px-4 font-semibold text-center">
                  СТАТУС ROOT (Є / НЕМАЄ)
                </th>
                <th className="py-3 px-4 font-semibold text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Пристроїв не знайдено за заданими критеріями пошуку або фільтрами.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const isCurrent = device.isCurrentDevice;
                  const isScanning = activeScanningId === device.id;

                  return (
                    <tr
                      key={device.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCurrent ? 'bg-emerald-950/10' : ''
                      }`}
                    >
                      {/* Device Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {device.model}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                                  Цей пристрій
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="font-mono">{device.ipAddress}</span>
                              <span>·</span>
                              <span>{device.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Android Version Column */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">
                            Android {device.androidVersion}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {device.codename} (API {device.apiLevel})
                          </span>
                        </div>
                      </td>

                      {/* Download Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 tabular-nums">
                        <div>
                          {new Date(device.downloadedAt).toLocaleDateString('uk-UA')}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(device.downloadedAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* ROOT STATUS COLUMN - Prominent Indicator Required by Prompt */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isScanning ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-medium animate-pulse border border-emerald-500/30">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Перевірка...
                          </span>
                        ) : device.rootStatus === 'rooted' ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold shadow-sm">
                              <XCircle className="w-4 h-4 text-rose-400" />
                              Є (Root знайдено)
                            </span>
                            <span className="text-[10px] text-rose-400/90 mt-0.5 truncate max-w-[170px]" title={device.rootDetails.superuserAppName}>
                              {device.rootDetails.superuserAppName || 'su binary'}
                            </span>
                          </div>
                        ) : device.rootStatus === 'not_rooted' ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              НЕМАЄ (Root відсутній)
                            </span>
                            <span className="text-[10px] text-emerald-400/80 mt-0.5">
                              Захищений пристрій
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-xs">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                            Не перевірено
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* "Перевірити рут" Button */}
                          <button
                            onClick={() => onCheckDevice(device)}
                            disabled={isScanning}
                            title="Перевірити наявність Root-доступу на цьому пристрої"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
                            <span>Перевірити</span>
                          </button>

                          {/* Details Button */}
                          <button
                            onClick={() => onOpenDetails(device)}
                            title="Детальний звіт безпеки"
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Delete button (except current device) */}
                          {!isCurrent && (
                            <button
                              onClick={() => onDeleteDevice(device.id)}
                              title="Видалити пристрій зі списку"
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
