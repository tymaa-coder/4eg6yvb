export type RootStatus = 'unchecked' | 'rooted' | 'not_rooted';

export interface RootInspectionDetails {
  suBinaryFound: boolean;
  suBinaryPath?: string;
  superuserAppFound: boolean;
  superuserAppName?: string;
  testKeysDetected: boolean;
  busyboxInstalled: boolean;
  selinuxPermissive: boolean;
  dangerousPropsFound: boolean;
  checkedAt?: string;
  checkDurationMs?: number;
  logs: string[];
}

export interface AndroidDevice {
  id: string;
  model: string;
  manufacturer: string;
  androidVersion: number; // 9, 10, 11, 12, 13, 14, 15, 16
  apiLevel: number;
  codename: string;
  buildNumber: string;
  downloadedAt: string; // ISO string
  lastCheckedAt?: string;
  ipAddress: string;
  location: string;
  screenResolution: string;
  cpuArchitecture: string;
  batteryLevel: number;
  isCurrentDevice?: boolean;
  rootStatus: RootStatus;
  rootDetails: RootInspectionDetails;
}

export type RootFilter = 'all' | 'rooted' | 'not_rooted' | 'unchecked';
export type VersionFilter = 'all' | number;
