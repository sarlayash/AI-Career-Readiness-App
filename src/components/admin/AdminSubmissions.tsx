import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Download, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AssessmentSubmission } from '../../types/assessment';
import { ASSESSMENT_QUESTIONS } from '../../config/questions';
import { DIMENSIONS } from '../../config/defaultConfigs';
import { ReportView } from '../ReportView';

interface AdminSubmissionsProps {
  submissions: AssessmentSubmission[];
}

export const AdminSubmissions: React.FC<AdminSubmissionsProps> = ({ submissions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmission | null>(null);
  const [modalTab, setModalTab] = useState<'report' | 'responses' | 'raw'>('report');
  const itemsPerPage = 10;

  const filtered = submissions.filter((s) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = s.userName?.toLowerCase().includes(term);
    const emailMatch = s.userEmail?.toLowerCase().includes(term);
    const domainMatch = s.profile?.currentDomain?.toLowerCase().includes(term);
    const bandMatch = s.readinessBand?.toLowerCase().includes(term);
    return nameMatch || emailMatch || domainMatch || bandMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pagedSubmissions = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (score >= 70) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 50) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (score >= 30) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  const exportSingleSubmission = (sub: AssessmentSubmission) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sub, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `submission_${sub.submissionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or domain..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <strong>{filtered.length}</strong> matching records
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4 font-semibold">Participant</th>
                <th className="py-3 px-4 font-semibold">Domain & Category</th>
                <th className="py-3 px-4 font-semibold">Experience</th>
                <th className="py-3 px-4 font-semibold">Readiness Score</th>
                <th className="py-3 px-4 font-semibold">Band</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {pagedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                pagedSubmissions.map((sub) => {
                  const dateFormatted = sub.submittedAt
                    ? new Date(sub.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A';

                  return (
                    <tr 
                      key={sub.submissionId}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">
                          {sub.userName || 'Anonymous'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          {sub.userEmail}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">
                          {sub.profile?.currentDomain || 'General'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sub.profile?.participantCategory}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {sub.profile?.experienceLevel || 'N/A'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold font-['Space_Grotesk'] text-slate-100 text-sm">
                          {sub.overallScore}
                        </span>
                        <span className="text-[10px] text-slate-400"> / 100</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getScoreBadge(sub.overallScore)}`}>
                          {sub.readinessBand}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {dateFormatted}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`inspect-sub-${sub.submissionId}-btn`}
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setModalTab('report');
                            }}
                            title="Inspect Details"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => exportSingleSubmission(sub)}
                            title="Export Record JSON"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-slate-800/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Inspection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Submission Audit: {selectedSubmission.userName}
                </h3>
                <p className="text-xs text-slate-400">
                  ID: {selectedSubmission.submissionId} • {selectedSubmission.userEmail}
                </p>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-900 text-xs">
              <button
                onClick={() => setModalTab('report')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  modalTab === 'report'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Report View
              </button>
              <button
                onClick={() => setModalTab('responses')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  modalTab === 'responses'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Question Breakdown ({Object.keys(selectedSubmission.responses || {}).length})
              </button>
              <button
                onClick={() => setModalTab('raw')}
                className={`pb-2.5 px-2 font-semibold border-b-2 transition-colors ${
                  modalTab === 'raw'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw Record JSON
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {modalTab === 'report' && (
                <div className="space-y-4">
                  <ReportView submission={selectedSubmission} />
                </div>
              )}

              {modalTab === 'responses' && (
                <div className="space-y-3">
                  {ASSESSMENT_QUESTIONS.map((q, idx) => {
                    const selectedOptId = selectedSubmission.responses?.[q.id];
                    const selectedOpt = q.options.find((o) => o.id === selectedOptId);
                    return (
                      <div
                        key={q.id}
                        className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-medium text-slate-400">
                            Q{idx + 1}. [{q.dimension}]
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                            Points: {selectedOpt?.score ?? 0}
                          </span>
                        </div>

                        <p className="text-slate-200 font-medium">{q.questionText}</p>

                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/40 text-slate-300">
                          <strong className="text-blue-400">Selected: </strong>
                          {selectedOpt ? selectedOpt.text : <span className="text-red-400">No answer recorded</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {modalTab === 'raw' && (
                <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                  {JSON.stringify(selectedSubmission, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
