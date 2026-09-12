import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from '../../config/questions';
import { DIMENSIONS } from '../../config/defaultConfigs';
import { AssessmentSubmission, DimensionId } from '../../types/assessment';
import { BarChart3, CheckCircle2, ChevronDown, Filter } from 'lucide-react';

interface AdminQuestionAnalyticsProps {
  submissions: AssessmentSubmission[];
}

export const AdminQuestionAnalytics: React.FC<AdminQuestionAnalyticsProps> = ({
  submissions
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const count = submissions.length;

  if (count === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
        No submission responses available to analyze questions.
      </div>
    );
  }

  const filteredQuestions = ASSESSMENT_QUESTIONS.filter((q) => {
    if (selectedDimension === 'all') return true;
    return q.dimension === selectedDimension;
  });

  return (
    <div className="space-y-6">
      {/* Dimension Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Question-Level Frequency & Analytics
          </h3>
          <p className="text-xs text-slate-400">
            Granular breakdown of option distributions and difficulty index per item.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-400">Filter Dimension:</label>
          <select
            value={selectedDimension}
            onChange={(e) => setSelectedDimension(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Dimensions (26)</option>
            {DIMENSIONS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Cards Grid */}
      <div className="space-y-4">
        {filteredQuestions.map((question, qIdx) => {
          // Calculate counts for each option
          const optionCounts: Record<string, number> = {};
          question.options.forEach((opt) => { optionCounts[opt.id] = 0; });

          let answeredCount = 0;
          let totalScoreEarned = 0;

          submissions.forEach((sub) => {
            const answer = sub.responses?.[question.id];
            if (answer && optionCounts[answer] !== undefined) {
              optionCounts[answer]++;
              answeredCount++;
              const optObj = question.options.find((o) => o.id === answer);
              totalScoreEarned += optObj?.score ?? 0;
            }
          });

          // Most selected option
          let mostSelectedId = question.options[0]?.id;
          let highestCount = -1;
          Object.entries(optionCounts).forEach(([id, c]) => {
            if (c > highestCount) {
              highestCount = c;
              mostSelectedId = id;
            }
          });
          const mostSelectedOpt = question.options.find((o) => o.id === mostSelectedId);

          const avgPoints = answeredCount > 0 
            ? (totalScoreEarned / answeredCount).toFixed(2) 
            : '0.00';

          return (
            <div
              key={question.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Q{qIdx + 1} • {question.id}
                  </span>
                  <span className="text-xs text-slate-400">
                    Dimension: <strong className="text-slate-200">{question.dimension}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">
                    Responses: <strong className="text-slate-200">{answeredCount} / {count}</strong>
                  </span>
                  <span className="text-slate-400">
                    Avg Points: <strong className="text-emerald-400">{avgPoints}</strong> / {question.options[question.options.length - 1]?.score || 3}
                  </span>
                </div>
              </div>

              {/* Question Prompt */}
              <p className="text-sm font-medium text-slate-100">
                {question.questionText}
              </p>

              {/* Options Breakdown */}
              <div className="space-y-2 pt-1">
                {question.options.map((opt, optIdx) => {
                  const optCount = optionCounts[opt.id] || 0;
                  const percent = answeredCount > 0 
                    ? Math.round((optCount / answeredCount) * 100) 
                    : 0;
                  const isTop = opt.id === mostSelectedId;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs transition-colors ${
                        isTop
                          ? 'bg-blue-950/20 border-blue-500/30'
                          : 'bg-slate-800/40 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-slate-200 font-medium">
                          <strong className="text-blue-400">{String.fromCharCode(65 + optIdx)}.</strong> {opt.text}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-slate-400">
                            {optCount} ({percent}%)
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                            {opt.score} pts
                          </span>
                        </div>
                      </div>

                      {/* Percentage Bar */}
                      <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isTop ? 'bg-blue-500' : 'bg-slate-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary pill */}
              <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Modal response: <strong>Option {mostSelectedOpt?.id}</strong> ({Math.round(((optionCounts[mostSelectedId] || 0) / Math.max(1, answeredCount)) * 100)}% of cohort)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
