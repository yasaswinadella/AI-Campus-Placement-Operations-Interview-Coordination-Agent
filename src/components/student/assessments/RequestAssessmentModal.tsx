import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { SkillCategory } from '../../../types';
import { X, Send, Sparkles, AlertCircle, CheckCircle2, HelpCircle, Zap, ShieldCheck } from 'lucide-react';

interface RequestAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSkill?: SkillCategory;
  onAssessmentStarted?: () => void;
}

const AVAILABLE_SKILLS: SkillCategory[] = [
  'Python',
  'Java',
  'JavaScript',
  'React',
  'DSA',
  'SQL',
  'DBMS',
  'Aptitude',
  'Communication',
  'HTML/CSS',
];

export const RequestAssessmentModal: React.FC<RequestAssessmentModalProps> = ({
  isOpen,
  onClose,
  defaultSkill = 'Python',
  onAssessmentStarted,
}) => {
  const { requestStudentAssessment, dispatchAiAssessmentDirectly } = useData();

  const [selectedSkill, setSelectedSkill] = useState<SkillCategory>(defaultSkill);
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState<'ai_instant' | 'admin_request'>('ai_instant');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'ai_instant') {
        const asgn = await dispatchAiAssessmentDirectly(selectedSkill, undefined, difficulty);
        if (asgn) {
          onClose();
          if (onAssessmentStarted) onAssessmentStarted();
        } else {
          setError('Failed to generate AI assessment. Please try again.');
        }
      } else {
        if (!reason.trim()) {
          setError('Please provide a brief reason for requesting an administrator-issued assessment.');
          setIsSubmitting(false);
          return;
        }
        await requestStudentAssessment({
          requestedSkill: selectedSkill,
          reason: reason.trim(),
        });
        setReason('');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process assessment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Request & Launch 50-Question Assessment</h2>
              <p className="text-xs text-slate-400">
                Instant AI assessment generation or institutional placement department review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Dispatch Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('ai_instant')}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  mode === 'ai_instant'
                    ? 'bg-indigo-50/80 border-[#4F46E5] ring-2 ring-[#4F46E5]/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#0F172A]">AI Instant Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Auto-compiles 50 questions & assigns immediately to your dashboard.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('admin_request')}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  mode === 'admin_request'
                    ? 'bg-indigo-50/80 border-[#4F46E5] ring-2 ring-[#4F46E5]/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#0F172A]">Placement Admin Review</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Submit request to campus placement cell for official approval.
                </p>
              </button>
            </div>
          </div>

          {/* Skill Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Select Assessment Domain <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkill === skill;
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSelectedSkill(skill)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F46E5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty (For AI Instant) */}
          {mode === 'ai_instant' && (
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                Target Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      difficulty === lvl
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reason for Request (If Admin Mode) */}
          {mode === 'admin_request' && (
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                Reason for Request <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., I have completed coursework in Python/DSA and want to qualify for campus recruitment drives..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all resize-none"
                required
              />
            </div>
          )}

          {/* Summary Box */}
          <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">
                {mode === 'ai_instant'
                  ? '⚡ 50 Standardized Placement Questions • 60 Minutes • 100 Marks'
                  : '📋 Admin Placement Review Queue'}
              </p>
              <p className="text-[11px] text-indigo-800">
                {mode === 'ai_instant'
                  ? `AI will assemble 50 validated questions for ${selectedSkill} and add it to your assignments list immediately.`
                  : `Your request will be routed to the admin team to review and dispatch a standardized test.`}
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (mode === 'admin_request' && !reason.trim())}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {mode === 'ai_instant' ? <Zap className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : mode === 'ai_instant'
                  ? 'Generate & Assign 50-Q Test'
                  : 'Submit Request'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
