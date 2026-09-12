import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  BookOpen, 
  Compass, 
  Sliders, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AssessmentConfig, LearningConfig, WebinarConfig } from '../../types/assessment';
import { updateAssessmentConfig, updateLearningConfig, updateWebinarConfig } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

interface AdminConfigurationProps {
  initialConfig: AssessmentConfig;
  initialWebinar: WebinarConfig | null;
  initialLearning: LearningConfig | null;
  onConfigSaved: () => void;
}

export const AdminConfiguration: React.FC<AdminConfigurationProps> = ({
  initialConfig,
  initialWebinar,
  initialLearning,
  onConfigSaved
}) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AssessmentConfig>(initialConfig);
  const [webinar, setWebinar] = useState<WebinarConfig>(
    initialWebinar || {
      id: 'webinar_default',
      title: 'AI Careers & Workplace Transformation',
      date: 'Next Saturday',
      time: '6:00 PM IST',
      speaker: 'Kapil Narula & Industry Leaders',
      partner: 'AI Career Initiative',
      description: 'Join our interactive live masterclass on turning AI literacy into actionable career leverage.',
      registrationUrl: 'https://meet.google.com',
      ctaEnabled: true
    }
  );
  const [learning, setLearning] = useState<LearningConfig>(
    initialLearning || {
      id: 'learning_default',
      title: 'Curated 30-Day Learning Pathway',
      description: 'Structured self-paced modules to help you bridge your lowest-scoring dimension.',
      learningUrl: 'https://cloud.google.com/learn',
      ctaLabel: 'Explore Guided Curriculum',
      ctaEnabled: true
    }
  );

  const [activeTab, setActiveTab] = useState<'assessment' | 'webinar' | 'learning' | 'branding'>('assessment');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateAssessmentConfig(config);
      await updateWebinarConfig(webinar);
      await updateLearningConfig(learning);

      setSuccessMsg('All configurations updated and persisted to Firestore successfully.');
      onConfigSaved();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Config save error:', err);
      setErrorMsg(err?.message || 'Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            Portal & Workflow Configuration
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify live assessment policies, score bands, webinar banners, and curriculum CTAs.
          </p>
        </div>

        <button
          id="save-configs-btn"
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('assessment')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'assessment'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Assessment Policies
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('webinar')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'webinar'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Webinar CTA Banner
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('learning')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'learning'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Learning Pathway CTA
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'branding'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Portal Branding
        </button>
      </div>

      {/* TAB 1: Assessment Policies */}
      {activeTab === 'assessment' && (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Active Assessment Version
              </label>
              <input
                type="text"
                value={config.assessmentVersion}
                onChange={(e) => setConfig({ ...config, assessmentVersion: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimated Duration (Display)
              </label>
              <input
                type="text"
                value={config.estimatedDuration}
                onChange={(e) => setConfig({ ...config, estimatedDuration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.retakesEnabled}
                  onChange={(e) => setConfig({ ...config, retakesEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-200">
                  Allow Participants to Retake Assessment
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Assessment Description / Intro
            </label>
            <textarea
              rows={3}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* TAB 2: Webinar CTA */}
      {activeTab === 'webinar' && (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={webinar.ctaEnabled}
                onChange={(e) => setWebinar({ ...webinar, ctaEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-200">
                Enable Webinar Spotlight Banner on Landing Page
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Webinar Title
              </label>
              <input
                type="text"
                value={webinar.title}
                onChange={(e) => setWebinar({ ...webinar, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Speaker / Host
              </label>
              <input
                type="text"
                value={webinar.speaker}
                onChange={(e) => setWebinar({ ...webinar, speaker: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Date
              </label>
              <input
                type="text"
                value={webinar.date}
                onChange={(e) => setWebinar({ ...webinar, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Time
              </label>
              <input
                type="text"
                value={webinar.time}
                onChange={(e) => setWebinar({ ...webinar, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Registration / Meeting URL
              </label>
              <input
                type="url"
                value={webinar.registrationUrl}
                onChange={(e) => setWebinar({ ...webinar, registrationUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={webinar.description}
                onChange={(e) => setWebinar({ ...webinar, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Learning Pathway CTA */}
      {activeTab === 'learning' && (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={learning.ctaEnabled}
                onChange={(e) => setLearning({ ...learning, ctaEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600"
              />
              <span className="text-xs font-semibold text-slate-200">
                Enable Learning Pathway Banner on Landing Page
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={learning.title}
                onChange={(e) => setLearning({ ...learning, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                CTA Button Label
              </label>
              <input
                type="text"
                value={learning.ctaLabel}
                onChange={(e) => setLearning({ ...learning, ctaLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Curriculum / Course URL
              </label>
              <input
                type="url"
                value={learning.learningUrl}
                onChange={(e) => setLearning({ ...learning, learningUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={learning.description}
                onChange={(e) => setLearning({ ...learning, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Branding */}
      {activeTab === 'branding' && (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Name
              </label>
              <input
                type="text"
                value="AI Career Readiness Self-Assessment Portal"
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Administrative Lead Contact
              </label>
              <input
                type="text"
                value="kapilnarula27july@gmail.com"
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Footer Narrative
              </label>
              <textarea
                rows={2}
                value="An initiative designed to help learners understand, adapt, and grow in the intelligent workplace."
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
