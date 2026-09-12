import { AssessmentSubmission } from '../types/assessment';

export type CsvExportMode = 'detailed' | 'anonymized';

/**
 * Generates and downloads a CSV file representing the filtered assessment records.
 */
export function exportSubmissionsToCsv(
  submissions: AssessmentSubmission[],
  mode: CsvExportMode = 'detailed'
): void {
  if (!submissions || submissions.length === 0) {
    throw new Error('No records available to export.');
  }

  const headers = mode === 'detailed'
    ? [
        'Submission ID',
        'Submitted Date',
        'Participant Name',
        'Participant Email',
        'Category',
        'Education Level',
        'Experience Level',
        'Current Domain',
        'Primary Career Goal',
        'AI Literacy (0-100)',
        'Tool Fluency (0-100)',
        'Domain Application (0-100)',
        'Career Adaptability (0-100)',
        'Evidence of Work (0-100)',
        'Overall Score',
        'Readiness Band',
        'Source',
        'Data Type'
      ]
    : [
        'Record Index',
        'Submitted Date',
        'Category',
        'Education Level',
        'Experience Level',
        'Current Domain',
        'Primary Career Goal',
        'AI Literacy (0-100)',
        'Tool Fluency (0-100)',
        'Domain Application (0-100)',
        'Career Adaptability (0-100)',
        'Evidence of Work (0-100)',
        'Overall Score',
        'Readiness Band',
        'Source',
        'Data Type'
      ];

  const rows = submissions.map((sub, idx) => {
    const p = sub.profile || ({} as any);
    const scores = sub.dimensionScores || ({} as any);
    const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toISOString().split('T')[0] : '';
    const dataType = sub.isSampleData ? 'Sample / Dev Record' : 'Production Record';

    if (mode === 'detailed') {
      return [
        sub.submissionId,
        dateStr,
        sub.userName || p.fullName || 'Anonymous',
        sub.userEmail || p.email || 'N/A',
        p.participantCategory || 'Unspecified',
        p.educationLevel || 'Unspecified',
        p.experienceLevel || 'Unspecified',
        p.currentDomain || 'Unspecified',
        p.primaryCareerGoal || 'Unspecified',
        scores.ai_literacy?.score ?? 0,
        scores.tool_fluency?.score ?? 0,
        scores.domain_application?.score ?? 0,
        scores.career_adaptability?.score ?? 0,
        scores.evidence_of_work?.score ?? 0,
        sub.overallScore ?? 0,
        sub.readinessBand || '',
        sub.source || 'portal',
        dataType
      ];
    } else {
      return [
        `REC-${idx + 1}`,
        dateStr,
        p.participantCategory || 'Unspecified',
        p.educationLevel || 'Unspecified',
        p.experienceLevel || 'Unspecified',
        p.currentDomain || 'Unspecified',
        p.primaryCareerGoal || 'Unspecified',
        scores.ai_literacy?.score ?? 0,
        scores.tool_fluency?.score ?? 0,
        scores.domain_application?.score ?? 0,
        scores.career_adaptability?.score ?? 0,
        scores.evidence_of_work?.score ?? 0,
        sub.overallScore ?? 0,
        sub.readinessBand || '',
        sub.source || 'portal',
        dataType
      ];
    }
  });

  const escapeCsv = (val: any) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `ai_career_readiness_${mode}_export_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAggregatedCsv(submissions: AssessmentSubmission[]): void {
  exportSubmissionsToCsv(submissions, 'anonymized');
}

export function exportDetailedCsv(submissions: AssessmentSubmission[]): void {
  exportSubmissionsToCsv(submissions, 'detailed');
}
