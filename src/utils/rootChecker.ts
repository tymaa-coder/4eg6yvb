import { AndroidDevice, RootInspectionDetails } from '../types/device';

export interface RootScanStep {
  step: number;
  title: string;
  detail: string;
  status: 'pending' | 'scanning' | 'passed' | 'warning' | 'failed';
}

export function performRootCheck(
  device: AndroidDevice,
  forceRootResult?: boolean
): { status: 'rooted' | 'not_rooted'; details: RootInspectionDetails } {
  // If explicitly specified or if pre-configured
  const isRooted = forceRootResult !== undefined 
    ? forceRootResult 
    : device.rootStatus === 'rooted' 
      ? true 
      : device.rootStatus === 'not_rooted' 
        ? false 
        : Math.random() < 0.25; // 25% chance of root for random simulated new devices

  const logs: string[] = [];
  const startTime = Date.now();

  logs.push(`[${new Date().toLocaleTimeString('uk-UA')}] Запуск перевірки системи безпеки Android ${device.androidVersion} (API ${device.apiLevel})`);
  logs.push(`Ціль: ${device.model} (${device.buildNumber})`);

  let suBinaryFound = false;
  let suBinaryPath: string | undefined = undefined;
  let superuserAppFound = false;
  let superuserAppName: string | undefined = undefined;
  let testKeysDetected = false;
  let busyboxInstalled = false;
  let selinuxPermissive = false;
  let dangerousPropsFound = false;

  if (isRooted) {
    // Choose root method based on Android version
    if (device.androidVersion >= 14) {
      // Modern Android 14, 15, 16 often use KernelSU or APatch or Magisk v27
      const methods = [
        {
          name: 'KernelSU v0.9.5 (модуль ядра Linux)',
          suPath: '/system/xbin/su (symlink до ksu_driver)',
          hasBusybox: true,
          dangerousProps: false,
          testKeys: false,
          permissive: false
        },
        {
          name: 'Magisk v27.0 (Zygisk + Shamiko)',
          suPath: '/sbin/su',
          hasBusybox: true,
          dangerousProps: true,
          testKeys: false,
          permissive: false
        },
        {
          name: 'APatch Android Kernel Framework v10763',
          suPath: '/system/bin/su',
          hasBusybox: true,
          dangerousProps: false,
          testKeys: true,
          permissive: true
        }
      ];
      const selected = methods[Math.floor(Math.random() * methods.length)];
      suBinaryFound = true;
      suBinaryPath = selected.suPath;
      superuserAppFound = true;
      superuserAppName = selected.name;
      busyboxInstalled = selected.hasBusybox;
      dangerousPropsFound = selected.dangerousProps;
      testKeysDetected = selected.testKeys;
      selinuxPermissive = selected.permissive;
    } else {
      // Android 9-13
      suBinaryFound = true;
      suBinaryPath = '/system/xbin/su';
      superuserAppFound = true;
      superuserAppName = 'Magisk v25.2 / Superuser';
      busyboxInstalled = true;
      dangerousPropsFound = true;
      testKeysDetected = Math.random() > 0.5;
      selinuxPermissive = Math.random() > 0.6;
    }

    logs.push(`[1/6] Перевірка бінарних файлів su у стандартних шляхах...`);
    logs.push(`⚠️ ЗНАЙДЕНО: ${suBinaryPath}`);
    logs.push(`[2/6] Сканування списку встановлених пакетів root-менеджерів...`);
    logs.push(`⚠️ ВИЯВЛЕНО: ${superuserAppName}`);
    logs.push(`[3/6] Аналіз системних властивостей ro.build.tags...`);
    logs.push(testKeysDetected ? `⚠️ ТЕГ ЗБІРКИ: test-keys (несертифікований образ)` : `✓ release-keys`);
    logs.push(`[4/6] Перевірка статусу SELinux...`);
    logs.push(selinuxPermissive ? `⚠️ РЕЖИМ SELINUX: Permissive (захист ядра вимкнено)` : `✓ Enforcing (але виявлено перехоплення системних викликів)`);
    logs.push(`[5/6] Пошук набору утиліт BusyBox... ${busyboxInstalled ? '⚠️ Знайдено (/system/xbin/busybox)' : '✓ Не виявлено'}`);
    logs.push(`[6/6] Перевірка властивостей налагодження (ro.debuggable / ro.secure)... ${dangerousPropsFound ? '⚠️ ro.debuggable=1' : '✓ Безпечні значення'}`);
    logs.push(`КІНЦЕВИЙ СТАТУС: Є ROOT (Виявлено права суперкористувача!)`);
  } else {
    // Clean device
    logs.push(`[1/6] Перевірка бінарних файлів su (/system/bin, /system/xbin, /sbin)... ✓ Чисто`);
    logs.push(`[2/6] Сканування системних пакетів на наявність Magisk, KernelSU, SuperSU... ✓ Відсутні`);
    logs.push(`[3/6] Аналіз підпису збірки (ro.build.tags)... ✓ release-keys (Оригінальна прошивка)`);
    logs.push(`[4/6] Перевірка SELinux: ✓ Enforcing (Примусовий режим захисту ядра)`);
    logs.push(`[5/6] Пошук бінарників Busybox... ✓ Відсутні`);
    logs.push(`[6/6] Перевірка системних розділів на доступ для запису: ✓ Лише читання (ro)`);
    logs.push(`КІНЦЕВИЙ СТАТУС: НЕМАЄ ROOT (Пристрій повністю захищений, root-прав не виявлено)`);
  }

  const duration = Math.min(520, Math.max(280, Date.now() - startTime + Math.floor(Math.random() * 200)));

  return {
    status: isRooted ? 'rooted' : 'not_rooted',
    details: {
      suBinaryFound,
      suBinaryPath,
      superuserAppFound,
      superuserAppName,
      testKeysDetected,
      busyboxInstalled,
      selinuxPermissive,
      dangerousPropsFound,
      checkedAt: new Date().toISOString(),
      checkDurationMs: duration,
      logs
    }
  };
}
