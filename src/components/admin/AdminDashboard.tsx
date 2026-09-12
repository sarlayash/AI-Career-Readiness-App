import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  HelpCircle, 
  Settings, 
  FileText, 
  Download, 
  RefreshCw, 
  LogOut, 
  Lock, 
  Database,
  Layers,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllSubmissions, getAssessmentConfig, logAdminAction } from '../../services/firebase';
import { AssessmentConfig, AssessmentSubmission, LearningConfig, WebinarConfig } from '../../types/assessment';
import { AdminFilters, DEFAULT_FILTERS, FilterState } from './AdminFilters';
import { AdminOverview } from './AdminOverview';
import { AdminCharts } from './AdminCharts';
import { AdminSubmissions } from './AdminSubmissions';
import { AdminQuestionAnalytics } from './AdminQuestionAnalytics';
import { AdminConfiguration } from './AdminConfiguration';
import { AdminAuditLogs } from './AdminAuditLogs';
import { SampleDataModal } from './SampleDataModal';
import { exportAggregatedCsv, exportDetailedCsv } from '../../services/exportCsv';
import { AdminWebinarRegistrations } from './AdminWebinarRegistrations';

interface AdminDashboardProps {
  onOpenAdminLogin: () => void;
  config: AssessmentConfig;
  webinarConfig: WebinarConfig | null;
  learningConfig: LearningConfig | null;
  onRefreshConfig: () => void;
  onOpenEmailHub?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenAdminLogin,
  config,
  webinarConfig,
  learningConfig,
  onRefreshConfig,
  onOpenEmailHub
}) => {
  const { user, isAdmin, adminSessionActive, logoutAdminSession } = useAuth();

  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'submissions' | 'registrations' | 'questions' | 'config' | 'audit'>('overview');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [exportWarningModal, setExportWarningModal] = useState<boolean>(false);

  // Fetch all submissions from Firestore
  const fetchSubmissionsData = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load admin submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissionsData();
    }
  }, [isAdmin]);

  // If not admin: show access restricted screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-100 mb-2">
            Restricted Administration Area
          </h2>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            You do not have permission to access this dashboard. Administrative rights require authorized program staff credentials.
          </p>

          <button
            id="admin-login-prompt-btn"
            onClick={onOpenAdminLogin}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter Staff Credentials</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter calculation
  const filteredSubmissions = submissions.filter((sub) => {
    // 1. Data Type (sample vs production)
    if (filters.dataType === 'production' && sub.isSampleData) return false;
    if (filters.dataType === 'sample' && !sub.isSampleData) return false;

    // 2. Date Range
    if (filters.dateRange !== 'all') {
      const subTime = new Date(sub.submittedAt).getTime();
      const now = Date.now();
      if (filters.dateRange === 'today') {
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        if (subTime < startOfDay) return false;
      } else if (filters.dateRange === '7d') {
        if (subTime < now - 7 * 24 * 3600 * 1000) return false;
      } else if (filters.dateRange === '30d') {
        if (subTime < now - 30 * 24 * 3600 * 1000) return false;
      } else if (filters.dateRange === 'custom') {
        if (filters.customStartDate && subTime < new Date(filters.customStartDate).getTime()) return false;
        if (filters.customEndDate && subTime > new Date(filters.customEndDate).setHours(23, 59, 59, 999)) return false;
      }
    }

    // 3. Category
    if (filters.category !== 'all' && sub.profile?.participantCategory !== filters.category) return false;

    // 4. Domain
    if (filters.domain !== 'all' && sub.profile?.currentDomain !== filters.domain) return false;

    // 5. Education
    if (filters.education !== 'all' && sub.profile?.educationLevel !== filters.education) return false;

    // 6. Experience
    if (filters.experience !== 'all' && sub.profile?.experienceLevel !== filters.experience) return false;

    // 7. Career Goal
    if (filters.careerGoal !== 'all' && sub.profile?.primaryCareerGoal !== filters.careerGoal) return false;

    // 8. Readiness Band
    if (filters.readinessBand !== 'all' && sub.readinessBand !== filters.readinessBand) return false;

    return true;
  });

  // Calculate active filter count
  let activeFilterCount = 0;
  if (filters.dateRange !== 'all') activeFilterCount++;
  if (filters.category !== 'all') activeFilterCount++;
  if (filters.education !== 'all') activeFilterCount++;
  if (filters.experience !== 'all') activeFilterCount++;
  if (filters.domain !== 'all') activeFilterCount++;
  if (filters.careerGoal !== 'all') activeFilterCount++;
  if (filters.readinessBand !== 'all') activeFilterCount++;
  if (filters.dataType !== 'all') activeFilterCount++;

  const sampleCount = submissions.filter((s) => s.isSampleData).length;

  const handleExportAggregate = () => {
    exportAggregatedCsv(filteredSubmissions);
    logAdminAction(
      user?.uid || 'KAPILADMIN',
      user?.email || 'admin@portal.internal',
      'EXPORT_AGGREGATE_CSV',
      { recordCount: filteredSubmissions.length }
    );
  };

  const handleConfirmDetailedExport = () => {
    setExportWarningModal(false);
    exportDetailedCsv(filteredSubmissions);
    logAdminAction(
      user?.uid || 'KAPILADMIN',
      user?.email || 'admin@portal.internal',
      'EXPORT_DETAILED_CSV_WITH_PII',
      { recordCount: filteredSubmissions.length }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              AI Career Readiness Executive Portal
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Authenticated as <strong>{user?.email || (adminSessionActive ? 'KAPILADMIN (Staff Session)' : 'Administrator')}</strong> • Last synchronized at {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button
            id="admin-refresh-btn"
            onClick={fetchSubmissionsData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            id="admin-sample-modal-btn"
            onClick={() => setIsSampleModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Dev Samples ({sampleCount})</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              id="admin-export-aggregate-btn"
              onClick={handleExportAggregate}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary CSV</span>
            </button>

            <button
              id="admin-export-detailed-btn"
              onClick={() => setExportWarningModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export all rows with participant details"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full CSV</span>
            </button>
          </div>

          {adminSessionActive && (
            <button
              id="admin-logout-session-btn"
              onClick={logoutAdminSession}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-xs">
        <button
          id="admin-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Executive Overview
        </button>

        <button
          id="admin-tab-charts"
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'charts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Visual Analytics (13 Charts)</span>
        </button>

        <button
          id="admin-tab-submissions"
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Participant Submissions ({filteredSubmissions.length})</span>
        </button>

        <button
          id="admin-tab-registrations"
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'registrations'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Masterclass & Push Reminders</span>
        </button>

        <button
          id="admin-tab-questions"
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Question Frequency</span>
        </button>

        <button
          id="admin-tab-config"
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'config'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Portal Config & CTAs</span>
        </button>

        <button
          id="admin-tab-audit"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* Global Filter Bar (shown on overview, charts, submissions, and questions tabs) */}
      {['overview', 'charts', 'submissions', 'questions'].includes(activeTab) && (
        <AdminFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          activeCount={activeFilterCount}
        />
      )}

      {/* Active Tab View Rendering */}
      {activeTab === 'overview' && (
        <AdminOverview
          submissions={filteredSubmissions}
          allSubmissionsCount={submissions.length}
        />
      )}

      {activeTab === 'charts' && (
        <AdminCharts submissions={filteredSubmissions} />
      )}

      {activeTab === 'submissions' && (
        <AdminSubmissions submissions={filteredSubmissions} />
      )}

      {activeTab === 'registrations' && (
        <AdminWebinarRegistrations onOpenEmailHub={onOpenEmailHub} />
      )}

      {activeTab === 'questions' && (
        <AdminQuestionAnalytics submissions={filteredSubmissions} />
      )}

      {activeTab === 'config' && (
        <AdminConfiguration
          initialConfig={config}
          initialWebinar={webinarConfig}
          initialLearning={learningConfig}
          onConfigSaved={onRefreshConfig}
        />
      )}

      {activeTab === 'audit' && (
        <AdminAuditLogs />
      )}

      {/* Sample Data Generator Modal */}
      <SampleDataModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        config={config}
        onRefreshData={fetchSubmissionsData}
        sampleCount={sampleCount}
      />

      {/* Detailed CSV Export Personal Information Warning Modal */}
      {exportWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-100">
                Personal Information Export Notice
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This detailed export contains <strong>{filteredSubmissions.length}</strong> submission records including participant names, Google email addresses, and specific question responses.
            </p>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 text-[11px] text-slate-400">
              By proceeding, you certify that you are authorized to handle this personal data in compliance with relevant data privacy regulations and security policies.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 text-xs">
              <button
                onClick={() => setExportWarningModal(false)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                id="confirm-detailed-csv-btn"
                onClick={handleConfirmDetailedExport}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Confirm & Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
