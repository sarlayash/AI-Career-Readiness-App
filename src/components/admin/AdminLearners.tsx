import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Tablet, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award, 
  Mail, 
  ExternalLink, 
  Filter, 
  Copy, 
  Check, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { UserAccount } from '../../types/assessment';
import { exportLearnersCsv } from '../../services/firebase';

interface AdminLearnersProps {
  users: UserAccount[];
  loading: boolean;
  onRefresh: () => void;
  onViewReport?: (uid: string) => void;
  lastRefreshed?: Date;
}

export const AdminLearners: React.FC<AdminLearnersProps> = ({
  users,
  loading,
  onRefresh,
  onViewReport,
  lastRefreshed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'not_started' | 'webinar'>('all');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'Mobile' | 'Desktop' | 'Tablet'>('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Metrics calculations
  const totalCount = users.length;
  const completedCount = users.filter((u) => u.assessmentStatus === 'completed' || (u.latestScore !== undefined)).length;
  const webinarCount = users.filter((u) => u.isMasterclassRegistered).length;
  const mobileCount = users.filter((u) => u.deviceType === 'Mobile').length;
  const desktopCount = users.filter((u) => u.deviceType === 'Desktop' || !u.deviceType).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter learners
  const filteredUsers = users.filter((u) => {
    // Search
    const term = searchTerm.toLowerCase();
    const nameMatch = (u.displayName || '').toLowerCase().includes(term);
    const emailMatch = (u.email || '').toLowerCase().includes(term);
    const domainMatch = (u.domain || '').toLowerCase().includes(term);
    const catMatch = (u.participantCategory || '').toLowerCase().includes(term);
    const matchesSearch = !term || nameMatch || emailMatch || domainMatch || catMatch;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'completed') {
      matchesStatus = u.assessmentStatus === 'completed' || u.latestScore !== undefined;
    } else if (statusFilter === 'not_started') {
      matchesStatus = u.assessmentStatus !== 'completed' && u.latestScore === undefined;
    } else if (statusFilter === 'webinar') {
      matchesStatus = !!u.isMasterclassRegistered;
    }

    // Device filter
    let matchesDevice = true;
    if (deviceFilter !== 'all') {
      matchesDevice = u.deviceType === deviceFilter;
    }

    return matchesSearch && matchesStatus && matchesDevice;
  });

  const renderDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'Mobile':
        return <Smartphone className="w-3.5 h-3.5 text-sky-400" />;
      case 'Tablet':
        return <Tablet className="w-3.5 h-3.5 text-violet-400" />;
      default:
        return <Monitor className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Real-Time Directory • Any Device & Any Browser</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              <span>Learners & Users Directory</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                {totalCount} Total
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live records of all registered participants, authenticated learners, and cross-platform visitors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Synced {lastRefreshed.toLocaleTimeString()}
              </span>
            )}

            <button
              id="refresh-learners-btn"
              onClick={onRefresh}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              title="Fetch latest learners from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              id="export-learners-csv-btn"
              onClick={() => exportLearnersCsv(filteredUsers)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors flex items-center gap-2 shadow-sm"
              title="Download entire directory as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Total Learners</span>
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 mt-1 font-['Space_Grotesk']">
              {totalCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across all browsers
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Completed Assessment</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 font-['Space_Grotesk']">
              {completedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {completionRate}% completion rate
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Masterclass RSVPs</span>
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-violet-400 mt-1 font-['Space_Grotesk']">
              {webinarCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Live event attendees
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Mobile vs Desktop</span>
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 mt-1 font-['Space_Grotesk']">
              {mobileCount} <span className="text-sm font-normal text-slate-400">/ {desktopCount}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {mobileCount} mobile • {desktopCount} desktop
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="learners-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search learners by name, email, domain, or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-800/80 p-1 border border-slate-700/60 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Assessed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('not_started')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'not_started'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registered Only ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('webinar')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'webinar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RSVP'd ({webinarCount})
            </button>
          </div>

          <div className="inline-flex rounded-lg bg-slate-800/80 p-1 border border-slate-700/60 text-xs">
            <button
              onClick={() => setDeviceFilter('all')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                deviceFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="All Devices"
            >
              All Dev
            </button>
            <button
              onClick={() => setDeviceFilter('Mobile')}
              className={`px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                deviceFilter === 'Mobile' ? 'bg-slate-700 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Devices Only"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setDeviceFilter('Desktop')}
              className={`px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                deviceFilter === 'Desktop' ? 'bg-slate-700 text-slate-200' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop Browsers Only"
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Learners List / Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No learners match your search</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Try adjusting your search keywords or filter toggles. Learners can log in from any phone, tablet, or browser to appear here immediately.
          </p>
          {(searchTerm || statusFilter !== 'all' || deviceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDeviceFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 border border-slate-700 transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Learner Profile</th>
                  <th className="py-3.5 px-4">Contact & Role</th>
                  <th className="py-3.5 px-4">Device & Browser</th>
                  <th className="py-3.5 px-4">Assessment Status</th>
                  <th className="py-3.5 px-4">Masterclass RSVP</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredUsers.map((learner) => {
                  const initial = (learner.displayName || learner.email || 'L').charAt(0).toUpperCase();
                  const isAssessed = learner.assessmentStatus === 'completed' || learner.latestScore !== undefined;

                  return (
                    <tr 
                      key={learner.uid} 
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Learner Profile */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {learner.photoURL ? (
                              <img
                                src={learner.photoURL}
                                alt={learner.displayName || 'Learner'}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center border border-blue-500/30 shadow-sm">
                                {initial}
                              </div>
                            )}
                            {learner.role === 'admin' && (
                              <span 
                                title="Administrator" 
                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-slate-900 flex items-center justify-center text-[9px] text-slate-950 font-black"
                              >
                                ★
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                              <span>{learner.displayName || 'Registered Learner'}</span>
                              {learner.role === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <span>UID: {learner.uid.slice(0, 14)}...</span>
                              <span className="text-slate-600">•</span>
                              <span className="capitalize">{learner.authProvider || 'google'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Role */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span className="truncate max-w-[200px]" title={learner.email || ''}>
                              {learner.email || 'No email provided'}
                            </span>
                            {learner.email && (
                              <button
                                onClick={() => handleCopyEmail(learner.email!)}
                                className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                                title="Copy Email"
                              >
                                {copiedEmail === learner.email ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {learner.participantCategory || 'Working professional'}
                            {learner.domain && <span className="text-slate-500"> • {learner.domain}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Device & Browser */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                          {renderDeviceIcon(learner.deviceType)}
                          <span className="font-medium">{learner.deviceType || 'Desktop'}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 truncate max-w-[120px]" title={learner.deviceDescription || learner.browserName || 'Web'}>
                            {learner.browserName || 'Web Browser'}
                          </span>
                        </div>
                      </td>

                      {/* Assessment Status */}
                      <td className="py-4 px-4">
                        {isAssessed ? (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed: {learner.latestScore !== undefined ? `${learner.latestScore}/100` : 'Assessed'}</span>
                            </div>
                            {learner.latestBand && (
                              <div className="text-[10px] text-slate-400 font-medium pl-1">
                                Band: <span className="text-slate-200">{learner.latestBand}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>Not Started</span>
                          </div>
                        )}
                      </td>

                      {/* Masterclass RSVP */}
                      <td className="py-4 px-4">
                        {learner.isMasterclassRegistered ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-semibold">
                            <Calendar className="w-3 h-3 text-violet-400" />
                            <span>Oct 15 (RSVP'd)</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Unregistered</span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="text-[11px] text-slate-300 font-medium">
                          {learner.lastLoginAt ? new Date(learner.lastLoginAt).toLocaleDateString() : 'Recent'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {learner.lastLoginAt ? new Date(learner.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Displaying <strong>{filteredUsers.length}</strong> of <strong>{totalCount}</strong> recorded learners.
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>All authentication sessions synchronized securely to Firestore.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
