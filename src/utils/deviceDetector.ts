import { AndroidDevice } from '../types/device';

export function detectCurrentDevice(): AndroidDevice {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1080;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 2400;
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2;

  let model = 'Google Pixel 9 Pro (Цей пристрій)';
  let manufacturer = 'Google';
  let androidVersion = 15;
  let apiLevel = 35;
  let codename = 'Vanilla Ice Cream';
  let buildNumber = 'AP2A.240805.005';

  // Check if real Android user agent
  const androidMatch = ua.match(/Android\s+([0-9\.]+)/i);
  if (androidMatch && androidMatch[1]) {
    const parsedMajor = parseInt(androidMatch[1], 10);
    if (!isNaN(parsedMajor)) {
      // Clamp between min 9 and max 16 as requested
      androidVersion = Math.max(9, Math.min(16, parsedMajor));
      apiLevel = 28 + (androidVersion - 9);
      if (androidVersion === 9) codename = 'Pie (Мін. підтримувана)';
      else if (androidVersion === 10) codename = 'Quince Tart (10)';
      else if (androidVersion === 11) codename = 'Red Velvet Cake (11)';
      else if (androidVersion === 12) codename = 'Snow Cone (12)';
      else if (androidVersion === 13) codename = 'Tiramisu (13)';
      else if (androidVersion === 14) codename = 'Upside Down Cake (14)';
      else if (androidVersion === 15) codename = 'Vanilla Ice Cream (15)';
      else if (androidVersion === 16) codename = 'Baklava (16 Preview)';
    }

    // Try to detect model
    if (ua.includes('SM-') || ua.includes('Samsung')) {
      manufacturer = 'Samsung';
      model = 'Samsung Galaxy (Цей пристрій)';
    } else if (ua.includes('Pixel')) {
      manufacturer = 'Google';
      model = 'Google Pixel (Цей пристрій)';
    } else if (ua.includes('Xiaomi') || ua.includes('Redmi') || ua.includes('POCO')) {
      manufacturer = 'Xiaomi';
      model = 'Xiaomi Phone (Цей пристрій)';
    }
  } else {
    // If running in browser/desktop environment, provide a realistic top-tier current client
    model = 'Google Pixel 9 Pro (Поточний сеанс)';
    manufacturer = 'Google';
    androidVersion = 15;
    apiLevel = 35;
    codename = 'Vanilla Ice Cream';
  }

  return {
    id: 'dev_current_session',
    model,
    manufacturer,
    androidVersion,
    apiLevel,
    codename,
    buildNumber,
    downloadedAt: new Date().toISOString(),
    ipAddress: '194.44.180.201 (Локальна мережа)',
    location: 'Поточне підключення (Київ/UA)',
    screenResolution: `${Math.round(screenWidth * pixelRatio)} x ${Math.round(screenHeight * pixelRatio)} (${screenWidth}x${screenHeight} CSS)`,
    cpuArchitecture: 'arm64-v8a',
    batteryLevel: 94,
    isCurrentDevice: true,
    rootStatus: 'unchecked',
    rootDetails: {
      suBinaryFound: false,
      superuserAppFound: false,
      testKeysDetected: false,
      busyboxInstalled: false,
      selinuxPermissive: false,
      dangerousPropsFound: false,
      logs: ['Додаток щойно завантажено. Натисніть «Перевірити рут», щоб просканувати цей пристрій.']
    }
  };
}
