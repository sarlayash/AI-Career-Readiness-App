import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Calendar, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Bell, 
  FileText, 
  Download,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  WEEKLY_REMINDER_SCHEDULE, 
  generateLearnerConfirmationEmail, 
  generateAdminAlertEmail,
  getDispatchedEmails,
  recordSentEmail
} from '../services/emailService';
import { getGoogleCalendarUrl, downloadIcsFile } from '../services/calendarService';
import { dispatchWeeklyReminder } from '../services/firebase';
import { chimeService, notifyAppUpdate } from '../services/notificationService';

interface EmailRemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUserEmail?: string;
  registeredUserName?: string;
}

export const EmailRemindersModal: React.FC<EmailRemindersModalProps> = ({
  isOpen,
  onClose,
  registeredUserEmail,
  registeredUserName
}) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'learner_email' | 'admin_email' | 'history'>('schedule');
  const [dispatchingWeek, setDispatchingWeek] = useState<string | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentLearnerName = registeredUserName || user?.displayName || 'Registered Participant';
  const currentLearnerEmail = registeredUserEmail || user?.email || 'participant@example.com';
  const mockRegistrationId = `VIP-AI-${Math.floor(100000 + Math.random() * 900000)}`;

  const learnerHtml = generateLearnerConfirmationEmail(currentLearnerName, currentLearnerEmail, mockRegistrationId);
  const adminHtml = generateAdminAlertEmail(currentLearnerName, currentLearnerEmail, 'Technology & Enterprise', 'Senior Professional', mockRegistrationId);

  const dispatchedHistory = getDispatchedEmails();

  const handleTriggerTestReminder = async (weekLabel: string, topic: string) => {
    setDispatchingWeek(weekLabel);
    try {
      const count = await dispatchWeeklyReminder(weekLabel, topic, user?.email || 'admin@portal.internal');
      
      // Record simulated sent email
      recordSentEmail({
        recipientEmail: currentLearnerEmail,
        recipientName: currentLearnerName,
        recipientRole: 'learner',
        subject: `📅 ${weekLabel}: ${topic}`,
        previewText: `Upcoming event reminder for AI In Action Masterclass on Oct 15, 2026.`,
        htmlContent: `<div><h3>${weekLabel}</h3><p>${topic}</p></div>`,
        status: 'delivered',
        reminderWeek: weekLabel
      });

      chimeService.playSuccessChime();
      notifyAppUpdate();
      setDispatchSuccess(`Weekly reminder successfully dispatched to ${count || 1} attendee(s)!`);
      setTimeout(() => setDispatchSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to trigger weekly reminder:', err);
    } finally {
      setDispatchingWeek(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b101f] border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Executive Email & Weekly Reminders Hub
              </h2>
              <p className="text-xs text-slate-400">
                Automated weekly cadence until event date: <strong>October 15, 2026</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-2 bg-slate-900/40 overflow-x-auto text-xs py-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Reminders Schedule (6 Milestones)</span>
          </button>

          <button
            onClick={() => setActiveTab('learner_email')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'learner_email'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Learner Confirmation Email</span>
          </button>

          <button
            onClick={() => setActiveTab('admin_email')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'admin_email'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Alert Email (Kapil Narula)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Dispatched Log ({dispatchedHistory.length})</span>
          </button>
        </div>

        {/* Feedback notification toast */}
        {dispatchSuccess && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{dispatchSuccess}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WEEKLY REMINDERS SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border border-blue-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Automated Weekly Reminders Sequence
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Attendees receive these curated executive briefings every week to prepare for the <strong>October 15, 2026</strong> masterclass.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Google Cal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => downloadIcsFile()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>.ICS File</span>
                  </button>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-3">
                {WEEKLY_REMINDER_SCHEDULE.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                          {item.weekLabel}
                        </span>
                        <span className="text-xs text-slate-400">• {item.targetDate}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">
                        {item.subject}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.previewSummary}
                      </p>
                      <p className="text-[11px] text-indigo-300 font-medium pt-0.5">
                        👉 Action Item: {item.keyActionItem}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTriggerTestReminder(item.weekLabel, item.keyActionItem)}
                      disabled={dispatchingWeek === item.weekLabel}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all shrink-0 cursor-pointer self-start sm:self-center"
                      title="Simulate dispatching this reminder right now"
                    >
                      <Send className={`w-3 h-3 ${dispatchingWeek === item.weekLabel ? 'animate-spin' : ''}`} />
                      <span>{dispatchingWeek === item.weekLabel ? 'Sending...' : 'Test Send'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LEARNER CONFIRMATION EMAIL PREVIEW */}
          {activeTab === 'learner_email' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <strong>To:</strong> {currentLearnerName} &lt;{currentLearnerEmail}&gt;
                </div>
                <div>
                  <strong>Subject:</strong> Confirmed: AI In Action (Oct 15, 2026)
                </div>
              </div>

              <div 
                className="bg-white rounded-xl p-2 sm:p-4 text-slate-900 shadow-inner max-h-[500px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: learnerHtml }}
              />
            </div>
          )}

          {/* TAB 3: ADMIN ALERT EMAIL PREVIEW */}
          {activeTab === 'admin_email' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <strong>To:</strong> Kapil Narula &lt;kapilnarula27july@gmail.com&gt;
                </div>
                <div>
                  <strong>Type:</strong> Instant Administrative Alert
                </div>
              </div>

              <div 
                className="bg-white rounded-xl p-2 sm:p-4 text-slate-900 shadow-inner max-h-[500px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: adminHtml }}
              />
            </div>
          )}

          {/* TAB 4: DISPATCHED EMAIL LOG */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {dispatchedHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p>No email reminders have been dispatched yet.</p>
                  <p className="text-slate-500 mt-1">Register for the webinar or use "Test Send" on the schedule tab.</p>
                </div>
              ) : (
                dispatchedHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{item.subject}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Delivered
                      </span>
                    </div>
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Recipient: {item.recipientName} ({item.recipientEmail})</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(item.sentAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Powered by Fortune 500 Email Automation Service
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
