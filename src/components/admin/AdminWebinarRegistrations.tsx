import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Mail, 
  Download, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  Bell,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { WebinarRegistration } from '../../types/assessment';
import { getAllWebinarRegistrations, dispatchWeeklyReminder } from '../../services/firebase';
import { WEEKLY_REMINDER_SCHEDULE } from '../../services/emailService';
import { chimeService, notifyAppUpdate } from '../../services/notificationService';

interface AdminWebinarRegistrationsProps {
  onOpenEmailHub: () => void;
}

export const AdminWebinarRegistrations: React.FC<AdminWebinarRegistrationsProps> = ({ onOpenEmailHub }) => {
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(WEEKLY_REMINDER_SCHEDULE[0].id);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await getAllWebinarRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      (reg.domain && reg.domain.toLowerCase().includes(q)) ||
      (reg.participantCategory && reg.participantCategory.toLowerCase().includes(q))
    );
  });

  const handleDispatchSelectedReminder = async () => {
    const target = WEEKLY_REMINDER_SCHEDULE.find(w => w.id === selectedWeek) || WEEKLY_REMINDER_SCHEDULE[0];
    setIsDispatching(true);
    try {
      const count = await dispatchWeeklyReminder(target.weekLabel, target.keyActionItem);
      chimeService.playSuccessChime();
      notifyAppUpdate();
      setDispatchSuccess(`Dispatched "${target.weekLabel}" reminder to ${count} attendee(s)!`);
      setTimeout(() => setDispatchSuccess(null), 5000);
      fetchRegistrations();
    } catch (err) {
      console.error('Failed to dispatch reminder:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Registration ID', 'Full Name', 'Email', 'Domain', 'Category', 'Registered At', 'Status'];
    const rows = filteredRegistrations.map(r => [
      r.registrationId,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      `"${(r.domain || '').replace(/"/g, '""')}"`,
      `"${(r.participantCategory || '').replace(/"/g, '""')}"`,
      r.registeredAt,
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Webinar-Attendees-Oct15-2026-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Total Registered Attendees</span>
          <p className="text-2xl font-bold text-slate-100 mt-1">{registrations.length}</p>
          <span className="text-[11px] text-blue-400 mt-1 inline-block">1-Click Registrations</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Confirmed Status</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {registrations.filter(r => r.status === 'confirmed').length}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">100% Verified</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Target Event Date</span>
          <p className="text-lg font-bold text-slate-100 mt-1">Oct 15, 2026</p>
          <span className="text-[11px] text-indigo-400 mt-1 inline-block">6:00 PM - 7:30 PM IST</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Reminders Schedule</span>
          <p className="text-lg font-bold text-amber-300 mt-1">6 Milestones</p>
          <button
            onClick={onOpenEmailHub}
            className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer mt-1 inline-block"
          >
            Manage Cadence →
          </button>
        </div>
      </div>

      {/* Admin Reminders Dispatcher Panel */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-900/40 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Automated Weekly Reminders Dispatch Console
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send an instant simulated reminder blast to all registered attendees for October 15, 2026.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none"
            >
              {WEEKLY_REMINDER_SCHEDULE.map(item => (
                <option key={item.id} value={item.id}>
                  {item.weekLabel}
                </option>
              ))}
            </select>

            <button
              onClick={handleDispatchSelectedReminder}
              disabled={isDispatching || registrations.length === 0}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-md"
            >
              <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
              <span>{isDispatching ? 'Sending...' : 'Dispatch Reminder'}</span>
            </button>
          </div>
        </div>

        {dispatchSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{dispatchSuccess}</span>
          </div>
        )}
      </div>

      {/* Attendees Table Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">
              Registered Attendees ({filteredRegistrations.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-400 outline-none w-48 sm:w-64"
              />
            </div>

            <button
              onClick={handleExportCsv}
              disabled={filteredRegistrations.length === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchRegistrations}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Attendee</th>
                <th className="py-3 px-4">Domain & Category</th>
                <th className="py-3 px-4">Registered At</th>
                <th className="py-3 px-4">Pass ID</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    {loading ? 'Loading attendees...' : 'No webinar registrations found.'}
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.registrationId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{reg.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{reg.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{reg.domain || 'Technology & Engineering'}</div>
                      <div className="text-[11px] text-slate-500">{reg.participantCategory || 'Working professional'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(reg.registeredAt).toLocaleDateString()} {new Date(reg.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-400">
                      {reg.registrationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
