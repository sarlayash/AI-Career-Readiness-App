import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { 
  CAREER_GOALS, 
  DEFAULT_SCORE_BANDS, 
  DOMAINS, 
  EDUCATION_LEVELS, 
  EXPERIENCE_LEVELS, 
  PARTICIPANT_CATEGORIES 
} from '../../config/defaultConfigs';

export interface FilterState {
  dateRange: 'all' | 'today' | '7d' | '30d' | 'custom';
  customStartDate: string;
  customEndDate: string;
  category: string;
  education: string;
  experience: string;
  domain: string;
  careerGoal: string;
  readinessBand: string;
  dataType: 'all' | 'production' | 'sample';
}

export const DEFAULT_FILTERS: FilterState = {
  dateRange: 'all',
  customStartDate: '',
  customEndDate: '',
  category: 'all',
  education: 'all',
  experience: 'all',
  domain: 'all',
  careerGoal: 'all',
  readinessBand: 'all',
  dataType: 'all'
};

interface AdminFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  activeCount: number;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  activeCount
}) => {
  const update = (key: keyof FilterState, val: string) => {
    onFilterChange({ ...filters, [key]: val });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Audience & Time Filters</span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono">
              {activeCount} active
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs">
        {/* Date Range */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Time Horizon</label>
          <select
            value={filters.dateRange}
            onChange={(e) => update('dateRange', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {PARTICIPANT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Domain */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Domain</label>
          <select
            value={filters.domain}
            onChange={(e) => update('domain', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Domains</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) => update('experience', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Career Goal */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Primary Goal</label>
          <select
            value={filters.careerGoal}
            onChange={(e) => update('careerGoal', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Goals</option>
            {CAREER_GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Readiness Band */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Readiness Band</label>
          <select
            value={filters.readinessBand}
            onChange={(e) => update('readinessBand', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Bands</option>
            {DEFAULT_SCORE_BANDS.map((b) => (
              <option key={b.label} value={b.label}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Data Source / Dev Records */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Data Source</label>
          <select
            value={filters.dataType}
            onChange={(e) => update('dataType', e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Submissions</option>
            <option value="production">Production Only</option>
            <option value="sample">Dev Sample Data</option>
          </select>
        </div>
      </div>

      {/* Custom Date Inputs if selected */}
      {filters.dateRange === 'custom' && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-3 text-xs">
          <div>
            <label className="text-slate-400 mr-2">From:</label>
            <input
              type="date"
              value={filters.customStartDate}
              onChange={(e) => update('customStartDate', e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-400 mr-2">To:</label>
            <input
              type="date"
              value={filters.customEndDate}
              onChange={(e) => update('customEndDate', e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
