/**
 * Professional Fortune 500 Style Email Dispatch and Reminder Engine
 * Event Date: October 15, 2026 • 6:00 PM - 7:30 PM IST / 8:30 AM - 10:00 AM EST
 */

export interface EmailLogEntry {
  id: string;
  recipientEmail: string;
  recipientName: string;
  recipientRole: 'learner' | 'admin';
  subject: string;
  previewText: string;
  htmlContent: string;
  sentAt: string;
  status: 'delivered' | 'scheduled';
  reminderWeek?: string;
}

export interface WeeklyReminderScheduleItem {
  id: string;
  weekLabel: string;
  targetDate: string;
  subject: string;
  previewSummary: string;
  keyActionItem: string;
}

export const WEEKLY_REMINDER_SCHEDULE: WeeklyReminderScheduleItem[] = [
  {
    id: 'week_4',
    weekLabel: 'Week 4 • Sep 17, 2026',
    targetDate: 'September 17, 2026',
    subject: '📋 4 Weeks to AI In Action: Pre-Event Checklist & Syllabus',
    previewSummary: 'Begin setting up your AI dev sandbox and review the 5 dimension benchmarks.',
    keyActionItem: 'Complete your AI Career Readiness Self-Assessment and review your radar report.'
  },
  {
    id: 'week_3',
    weekLabel: 'Week 3 • Sep 24, 2026',
    targetDate: 'September 24, 2026',
    subject: '💡 3 Weeks to AI In Action: Keynote Reveal & Live Q&A Form',
    previewSummary: 'Submit questions for Kapil Narula and review agentic prompt patterns.',
    keyActionItem: 'Submit your specific career transition question for the live executive Q&A.'
  },
  {
    id: 'week_2',
    weekLabel: 'Week 2 • Oct 1, 2026',
    targetDate: 'October 1, 2026',
    subject: '⚡ 2 Weeks to AI In Action: Hands-On Prompt Frameworks Pack',
    previewSummary: 'Download the Fortune 500 prompt engineering and agent orchestration templates.',
    keyActionItem: 'Download the interactive Jupyter/Colab prompt playground files.'
  },
  {
    id: 'week_1',
    weekLabel: 'Week 1 • Oct 8, 2026',
    targetDate: 'October 8, 2026',
    subject: '🎟️ 7 Days to Go: Your VIP Masterclass Pass & Calendar Sync',
    previewSummary: 'One week until showtime. Verify your calendar and virtual seat.',
    keyActionItem: 'Ensure the event is added to your primary calendar (Google/Outlook).'
  },
  {
    id: 'hours_24',
    weekLabel: '24 Hours Before • Oct 14, 2026',
    targetDate: 'October 14, 2026',
    subject: '⏰ Tomorrow: AI In Action Masterclass Live Stream Credentials',
    previewSummary: 'We open doors tomorrow at 6:00 PM IST / 8:30 AM EST. Access link inside.',
    keyActionItem: 'Test your browser audio/video setup and bookmark the live stream URL.'
  },
  {
    id: 'hours_1',
    weekLabel: '1 Hour Before • Oct 15, 2026',
    targetDate: 'October 15, 2026 5:00 PM',
    subject: '🚨 LIVE IN 60 MINUTES: AI In Action Masterclass Doors Opening',
    previewSummary: 'Kapil Narula is going live in 60 minutes. Join the executive waiting room now.',
    keyActionItem: 'Click your direct access link and join the stream room.'
  }
];

export function generateLearnerConfirmationEmail(name: string, email: string, registrationId: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
      <!-- Header Bar -->
      <div style="background: linear-gradient(135deg, #0b1222 0%, #1e1b4b 100%); padding: 36px 32px; text-align: left; color: #ffffff;">
        <div style="display: inline-block; padding: 4px 12px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(96, 165, 250, 0.4); border-radius: 9999px; font-size: 11px; font-weight: 700; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
          ✓ Registration Confirmed • VIP Pass
        </div>
        <h1 style="font-size: 24px; font-weight: 800; line-height: 1.25; margin: 0 0 8px 0; color: #f8fafc;">
          AI In Action: From Casual Prompting to Career Advancement
        </h1>
        <p style="font-size: 13px; color: #cbd5e1; margin: 0;">
          Presented by <strong>Kapil Narula</strong> & AI Career Readiness Portal
        </p>
      </div>

      <!-- Main Body -->
      <div style="padding: 32px;">
        <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-top: 0;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Your virtual seat has been secured for this live executive masterclass. We will dissect real-world AI transition strategies, agentic coding, multi-modal reasoning, and career positioning benchmarked against Fortune 500 standards.
        </p>

        <!-- Event Details Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 600;">📅 Date:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">Thursday, October 15, 2026</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">⏰ Time:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">6:00 PM – 7:30 PM IST (8:30 AM – 10:00 AM EST)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">🎙️ Speaker:</td>
              <td style="padding: 6px 0; color: #0f172a;">Kapil Narula (AI Architect & Tech Lead)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">🔑 Pass ID:</td>
              <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #2563eb;">${registrationId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">📍 Virtual Access:</td>
              <td style="padding: 6px 0; color: #059669; font-weight: 600;">Live Executive Meeting Room (Link activated 15m prior)</td>
            </tr>
          </table>
        </div>

        <!-- Weekly Reminders Callout -->
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 14px 16px; margin: 24px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #1e40af;">
            🗓️ Automated Weekly Reminders Active
          </h4>
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #1e3a8a;">
            You will automatically receive weekly preparatory briefings, prompt frameworks, and milestone reminders directly to <strong>${email}</strong> leading up to October 15, 2026.
          </p>
        </div>

        <!-- Action Buttons -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://calendar.google.com" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; margin-right: 10px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
            Add to Google Calendar
          </a>
          <span style="display: inline-block; padding: 12px 18px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; background-color: #f8fafc;">
            Outlook / Apple .ICS
          </span>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          You received this email because you registered for the AI Career Readiness Executive Webinar series. You can manage or clear notifications from your portal dashboard at any time.
        </p>
      </div>
    </div>
  `;
}

export function generateAdminAlertEmail(name: string, email: string, domain: string, category: string, registrationId: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #0f172a; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 24px; color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
          ⚡ Admin Executive Notification
        </div>
        <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #f8fafc;">
          New Webinar Attendee Registered
        </h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">
          AI In Action Masterclass (Oct 15, 2026)
        </p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px;">Participant:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email Address:</td>
            <td style="padding: 8px 0; color: #2563eb; font-weight: 600;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Role / Category:</td>
            <td style="padding: 8px 0; color: #0f172a;">${category || 'Working Professional'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Domain / Industry:</td>
            <td style="padding: 8px 0; color: #0f172a;">${domain || 'Technology & Engineering'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Registration ID:</td>
            <td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #475569;">${registrationId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Timestamp:</td>
            <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 14px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #475569;">
          <strong>Automated Action:</strong> Added to weekly reminder sequence. Reminders will be dispatched every Thursday until October 15, 2026.
        </div>
      </div>
    </div>
  `;
}

/**
 * Log and store sent email records in localStorage
 */
export function recordSentEmail(entry: Omit<EmailLogEntry, 'id' | 'sentAt'>): EmailLogEntry {
  const fullEntry: EmailLogEntry = {
    ...entry,
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sentAt: new Date().toISOString()
  };

  try {
    const existing: EmailLogEntry[] = JSON.parse(localStorage.getItem('portal_dispatched_emails') || '[]');
    existing.unshift(fullEntry);
    localStorage.setItem('portal_dispatched_emails', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    // ignore
  }

  return fullEntry;
}

export function getDispatchedEmails(): EmailLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem('portal_dispatched_emails') || '[]');
  } catch (e) {
    return [];
  }
}
