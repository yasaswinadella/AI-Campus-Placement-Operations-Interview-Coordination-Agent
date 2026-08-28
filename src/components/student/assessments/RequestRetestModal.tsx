import React, { useState } from 'react';
import { StudentAssessmentResult, SkillCategory } from '../../../types';
import { X, RotateCcw, AlertCircle, Sparkles, Send } from 'lucide-react';

interface RequestRetestModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedResults: StudentAssessmentResult[];
  preselectedResultId?: string;
  onRequestRetest: (data: {
    assessmentId: string;
    skill: SkillCategory;
    previousScore: number;
    reason: string;
  }) => void;
}

export const RequestRetestModal: React.FC<RequestRetestModalProps> = ({
  isOpen,
  onClose,
  completedResults,
  preselectedResultId,
  onRequestRetest,
}) => {
  const [selectedResultId, setSelectedResultId] = useState(
    preselectedResultId || (completedResults[0]?.id || '')
  );
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const currentResult = completedResults.find((r) => r.id === selectedResultId) || completedResults[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResult || !reason.trim()) return;

    onRequestRetest({
      assessmentId: currentResult.assessmentId || 'ass-01',
      skill: currentResult.skill,
      previousScore: currentResult.percentage,
      reason: reason.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Request Competency Retest</h3>
              <p className="text-xs text-slate-500">
                Submit an application to placement officers for re-attempting a skill benchmark.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Completed Assessment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Prior Assessment Record
            </label>
            <select
              value={selectedResultId}
              onChange={(e) => setSelectedResultId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              required
            >
              {completedResults.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.assessmentName} ({r.skill} • Prior Score: {r.percentage}%)
                </option>
              ))}
            </select>
          </div>

          {/* Current Score Summary */}
          {currentResult && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Domain Skill:</span>
                <span className="font-bold text-[#0F172A]">{currentResult.skill}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Previous Score:</span>
                <span className="font-extrabold text-amber-600">
                  {currentResult.obtainedMarks} / {currentResult.totalMarks} ({currentResult.percentage}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Original Attempt Date:</span>
                <span className="text-slate-700 font-mono">{currentResult.date}</span>
              </div>
            </div>
          )}

          {/* Reason / Justification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason / Improvement Plan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the technical concepts you have revised, projects built, or reasons justifying a second attempt..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {/* Institutional Note */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
            <Sparkles className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight">
              Retests are reviewed by placement officers. Upon approval, a fresh or calibrated assessment will appear in your Active Assignments.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Retest Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
