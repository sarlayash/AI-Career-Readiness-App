/**
 * Device and Browser Detection Utility
 * Safely parses user agent and screen metrics to detect device type, OS, and browser.
 */

export interface DeviceDetails {
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  osName: string;
  browserName: string;
  fullDescription: string;
}

export function detectDeviceAndBrowser(): DeviceDetails {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      deviceType: 'Desktop',
      osName: 'Unknown OS',
      browserName: 'Unknown Browser',
      fullDescription: 'Desktop (Web)'
    };
  }

  const ua = navigator.userAgent || '';
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';

  // Device detection
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);
  const isMobile = /mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua);

  if (isTablet) {
    deviceType = 'Tablet';
  } else if (isMobile || (window.innerWidth <= 768 && 'ontouchstart' in window)) {
    deviceType = 'Mobile';
  }

  // OS Detection
  let osName = 'Unknown OS';
  if (/android/i.test(ua)) {
    osName = 'Android';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    osName = 'iOS';
  } else if (/mac os x/i.test(ua)) {
    osName = 'macOS';
  } else if (/windows/i.test(ua)) {
    osName = 'Windows';
  } else if (/linux/i.test(ua)) {
    osName = 'Linux';
  } else if (/cros/i.test(ua)) {
    osName = 'ChromeOS';
  }

  // Browser Detection
  let browserName = 'Browser';
  if (/whatsapp/i.test(ua)) {
    browserName = 'WhatsApp Webview';
  } else if (/linkedin/i.test(ua)) {
    browserName = 'LinkedIn In-App';
  } else if (/instagram/i.test(ua)) {
    browserName = 'Instagram In-App';
  } else if (/edg/i.test(ua)) {
    browserName = 'Microsoft Edge';
  } else if (/chrome|crios/i.test(ua) && !/opr|brave/i.test(ua)) {
    browserName = 'Google Chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browserName = 'Mozilla Firefox';
  } else if (/safari/i.test(ua) && !/chrome|crios|opr|edg/i.test(ua)) {
    browserName = 'Apple Safari';
  } else if (/opr|opera/i.test(ua)) {
    browserName = 'Opera';
  } else if (/samsungbrowser/i.test(ua)) {
    browserName = 'Samsung Internet';
  }

  const fullDescription = `${deviceType} (${browserName} on ${osName})`;

  return {
    deviceType,
    osName,
    browserName,
    fullDescription
  };
}
