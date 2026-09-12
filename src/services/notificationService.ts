/**
 * Browser Push Notification and Sound Cue Service
 */

class AudioChimeService {
  private audioCtx: AudioContext | null = null;

  public playSuccessChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Note 1: 587.33 Hz (D5)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: 880.00 Hz (A5)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.1);
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.6);
    } catch (e) {
      // Audio autoplay policy or unavailable
    }
  }
}

export const chimeService = new AudioChimeService();

/**
 * Request Web Push notification permission from the user
 */
export async function requestPushNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Web Push Notifications are not supported in this browser.');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return 'denied';
    }
  }

  return Notification.permission;
}

/**
 * Triggers a browser native push notification if permitted
 */
export function sendBrowserPushNotification(title: string, options?: NotificationOptions): boolean {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      return true;
    } catch (err) {
      console.warn('Failed to display native push notification:', err);
      return false;
    }
  }
  return false;
}

/**
 * Dispatch internal notification refresh event
 */
export function notifyAppUpdate(): void {
  window.dispatchEvent(new CustomEvent('portal_notifications_updated'));
}
