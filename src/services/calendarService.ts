/**
 * Calendar synchronization service for AI In Action Webinar
 * Event Date: October 15, 2026 • 6:00 PM - 7:30 PM IST (12:30 PM - 2:00 PM UTC)
 */

export interface CalendarEventDetails {
  title: string;
  description: string;
  location: string;
  startDateUtc: string; // YYYYMMDDTHHMMSSZ
  endDateUtc: string;   // YYYYMMDDTHHMMSSZ
}

export const WEBINAR_CALENDAR_EVENT: CalendarEventDetails = {
  title: "AI In Action: From Casual Prompting to Career Advancement",
  description: `Executive Masterclass on AI Career Readiness.
Key Topics: High-leverage agentic workflows, multi-modal reasoning, prompt engineering frameworks, and practical career transition playbooks.
Speaker: Kapil Narula (Global AI Career Architect & Tech Lead)
Platform: Virtual Executive Room (Meeting link sent via email confirmation).
Portal: AI Career Readiness Framework 1.0`,
  location: "Online Virtual Room (Link provided upon registration)",
  startDateUtc: "20261015T123000Z", // Oct 15, 2026 18:00 IST = 12:30 UTC
  endDateUtc: "20261015T140000Z"   // Oct 15, 2026 19:30 IST = 14:00 UTC
};

/**
 * Generates direct Google Calendar web event URL
 */
export function getGoogleCalendarUrl(event: CalendarEventDetails = WEBINAR_CALENDAR_EVENT): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.startDateUtc}/${event.endDateUtc}`,
    details: event.description,
    location: event.location,
    sf: 'true',
    output: 'xml'
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates and downloads an .ics iCalendar file for Apple Calendar, Outlook, etc.
 */
export function downloadIcsFile(event: CalendarEventDetails = WEBINAR_CALENDAR_EVENT): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AI Career Readiness Portal//Webinar Masterclass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ai-in-action-20261015@aicareerportal.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${event.startDateUtc}`,
    `DTEND:${event.endDateUtc}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: AI In Action Webinar begins in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'AI-In-Action-Webinar-Oct15-2026.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
