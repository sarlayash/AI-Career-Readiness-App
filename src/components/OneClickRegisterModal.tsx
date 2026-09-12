import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Bell, 
  Mail, 
  ArrowRight, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WebinarConfig, WebinarRegistration, PortalNotification } from '../types/assessment';
import { registerForWebinar, createPortalNotification, loginWithGoogle } from '../services/firebase';
import { 
  chimeService, 
  requestPushNotificationPermission, 
  sendBrowserPushNotification,
  notifyAppUpdate 
} from '../services/notificationService';
import { getGoogleCalendarUrl, downloadIcsFile } from '../services/calendarService';
import { 
  generateLearnerConfirmationEmail, 
  generateAdminAlertEmail, 
  recordSentEmail 
} from '../services/emailService';

interface OneClickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  webinarConfig: WebinarConfig | null;
  onRegistrationSuccess: (registration: WebinarRegistration) => void;
  onOpenEmailHub: () => void;
}

export const OneClickRegisterModal: React.FC<OneClickRegisterModalProps> = ({
  isOpen,
  onClose,
  webinarConfig,
  onRegistrationSuccess,
  onOpenEmailHub
}) => {
  const { user, signInDirectLearner } = useAuth();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [domain, setDomain] = useState('IT / Software & Engineering');
  const [category, setCategory] = useState('Working professional');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<WebinarRegistration | null>(null);

  if (!isOpen) return null;

  const eventTitle = webinarConfig?.title || "AI In Action: From Casual Prompting to Career Advancement";
  const eventDate = webinarConfig?.date || "October 15, 2026";
  const eventTime = webinarConfig?.time || "6:00 PM - 7:30 PM IST / 8:30 AM - 10:00 AM EST";

  const executeRegistration = async (userName: string, userEmail: string, userUid?: string) => {
    setLoading(true);
    try {
      // 1. Request push notification permission if enabled
      if (pushEnabled) {
        await requestPushNotificationPermission();
      }

      const registrationId = `REG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      const newRegistration: WebinarRegistration = {
        registrationId,
        uid: userUid || user?.uid,
        fullName: userName.trim() || 'Attendee',
        email: userEmail.trim().toLowerCase(),
        participantCategory: category,
        domain: domain,
        webinarTitle: eventTitle,
        webinarDate: `${eventDate} • ${eventTime}`,
        registeredAt: now,
        calendarAdded: false,
        remindersEnabled: true,
        remindersSent: 0,
        status: 'confirmed'
      };

      // 2. Save registration in Firestore / LocalStorage
      await registerForWebinar(newRegistration);

      // 3. Create Learner Notification
      const learnerNotif: PortalNotification = {
        notificationId: `notif_learner_${Date.now()}`,
        recipientType: 'learner',
        recipientUid: userUid || user?.uid,
        title: '🎉 1-Click Registration Confirmed!',
        message: `You are registered for "${eventTitle}" on ${eventDate}. Weekly reminders and prep guides are activated.`,
        type: 'registration',
        createdAt: now,
        read: false,
        cleared: false,
        metadata: {
          registrationId,
          attendeeEmail: newRegistration.email,
          eventDate
        }
      };
      await createPortalNotification(learnerNotif);

      // 4. Create Admin Notification
      const adminNotif: PortalNotification = {
        notificationId: `notif_admin_${Date.now()}`,
        recipientType: 'admin',
        title: '🚨 New Webinar Registration',
        message: `${newRegistration.fullName} (${newRegistration.email}) from ${newRegistration.domain} just registered.`,
        type: 'registration',
        createdAt: now,
        read: false,
        cleared: false,
        metadata: {
          registrationId,
          attendeeName: newRegistration.fullName,
          attendeeEmail: newRegistration.email,
          domain: newRegistration.domain
        }
      };
      await createPortalNotification(adminNotif);

      // 5. Trigger browser push notification
      sendBrowserPushNotification(`Registration Confirmed: ${eventTitle}`, {
        body: `See you on ${eventDate}! Check your email for weekly briefings.`,
        tag: 'webinar-registration'
      });

      // 6. Record professional automated emails
      recordSentEmail({
        recipientEmail: newRegistration.email,
        recipientName: newRegistration.fullName,
        recipientRole: 'learner',
        subject: `Confirmed: ${eventTitle} (Oct 15, 2026)`,
        previewText: `Your VIP pass for AI In Action is confirmed. Access link and weekly reminder sequence inside.`,
        htmlContent: generateLearnerConfirmationEmail(newRegistration.fullName, newRegistration.email, registrationId),
        status: 'delivered'
      });

      recordSentEmail({
        recipientEmail: 'kapilnarula27july@gmail.com',
        recipientName: 'Kapil Narula (Admin)',
        recipientRole: 'admin',
        subject: `Admin Alert: New Attendee - ${newRegistration.fullName}`,
        previewText: `${newRegistration.fullName} (${newRegistration.email}) registered for AI In Action.`,
        htmlContent: generateAdminAlertEmail(newRegistration.fullName, newRegistration.email, newRegistration.domain || '', newRegistration.participantCategory || '', registrationId),
        status: 'delivered'
      });

      // 7. Play sound cue & trigger UI updates
      chimeService.playSuccessChime();
      notifyAppUpdate();

      setConfirmedRegistration(newRegistration);
      onRegistrationSuccess(newRegistration);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantGoogleRegister = async () => {
    try {
      setLoading(true);
      const googleUser = await loginWithGoogle();
      if (googleUser && googleUser.email) {
        await executeRegistration(googleUser.displayName || 'Google User', googleUser.email, googleUser.uid);
      }
    } catch (err) {
      console.error('Google registration error:', err);
      setLoading(false);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    try {
      let activeUid = user?.uid;
      if (!user) {
        const createdAccount = await signInDirectLearner(fullName || 'Executive Attendee', email, category, domain);
        activeUid = createdAccount.uid;
      }
      await executeRegistration(fullName || 'Executive Attendee', email, activeUid);
    } catch (err) {
      console.error('Manual registration error:', err);
      await executeRegistration(fullName || 'Executive Attendee', email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b101f] border border-blue-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedRegistration ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Instant Registration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
                {eventTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Hosted by <strong>Kapil Narula</strong> • {eventDate} • {eventTime}
              </p>
            </div>

            {/* Instant Google One-Click */}
            {!user ? (
              <div className="space-y-4">
                <button
                  onClick={handleInstantGoogleRegister}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Register with 1-Click Google Sign-In</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase tracking-widest font-mono">
                    or register with email
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Quick Email Form */}
                <form onSubmit={handleManualRegister} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Corporate or Personal Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Domain
                      </label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                      >
                        <option value="IT / Software & Engineering">IT / Software</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Data & Analytics">Data & Analytics</option>
                        <option value="Finance & Operations">Finance & Operations</option>
                        <option value="Marketing & Growth">Marketing & Growth</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                      >
                        <option value="Working professional">Working professional</option>
                        <option value="Executive / Leader">Executive / Leader</option>
                        <option value="Student / Career Switcher">Student / Switcher</option>
                      </select>
                    </div>
                  </div>

                  {/* Push Notification Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={(e) => setPushEnabled(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-slate-900"
                      />
                      <span>Enable Browser Push Notifications & Weekly Email Reminders</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>{loading ? 'Registering...' : 'Confirm 1-Click Registration (Free)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Registering as:</span>
                    <strong className="text-slate-100">{user.displayName || 'Learner'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Email address:</span>
                    <span className="text-blue-400 font-mono">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span>Push notifications & weekly reminders will be activated automatically.</span>
                </div>

                <button
                  onClick={() => executeRegistration(user.displayName || 'Learner', user.email || '')}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Confirming...' : '1-Click Confirm Registration'}</span>
                </button>
              </div>
            )}

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Compliant with Fortune 500 enterprise privacy & spam prevention standards.</span>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                Registration Confirmed
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                You're In! See You Oct 15, 2026.
              </h2>
              <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Confirmation email and push notification have been dispatched to <strong>{confirmedRegistration.email}</strong>.
              </p>
            </div>

            {/* Calendar & Email Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Google Cal</span>
              </a>

              <button
                onClick={() => downloadIcsFile()}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Outlook / Apple .ICS</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenEmailHub();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Preview Confirmation Email & Weekly Reminders Cadence</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
