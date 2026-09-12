import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, FileText, User, RefreshCw } from 'lucide-react';
import { getAdminAuditLogs } from '../../services/firebase';
import { AdminAuditLog } from '../../types/assessment';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Append-Only Security Audit Trail
          </h3>
          <p className="text-xs text-slate-400">
            Immutable log of all administrative entries, updates, and data exports.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading audit events...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No audit logs recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-slate-800/30 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-medium">
                      {log.adminEmail}
                    </span>
                  </div>
                  {log.details && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
