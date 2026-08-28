import React, { useState } from 'react';
import { RetestRequest, BankQuestion, SkillCategory, DifficultyLevel } from '../../../types';
import { X, RotateCcw, CheckCircle2, XCircle, Sparkles, Layers, FileCheck2 } from 'lucide-react';

interface RetestDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RetestRequest | null;
  questionBank: BankQuestion[];
  onDecision: (
    requestId: string,
    decision: 'Approved' | 'Rejected',
    strategy?: 'Same Questions' | 'New Questions',
    newAssessmentData?: any
  ) => void;
}

export const RetestDecisionModal: React.FC<RetestDecisionModalProps> = ({
  isOpen,
  onClose,
  request,
  questionBank,
  onDecision,
}) => {
  const [decision, setDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [strategy, setStrategy] = useState<'Same Questions' | 'New Questions'>('Same Questions');
  const [retestDifficulty, setRetestDifficulty] = useState<DifficultyLevel>('Medium');
  const [mcqCount, setMcqCount] = useState<number>(2);
  const [codingCount, setCodingCount] = useState<number>(1);
  const [descriptiveCount, setDescriptiveCount] = useState<number>(1);
  const [remarks, setRemarks] = useState('');

  if (!isOpen || !request) return null;

  const totalQuestions = mcqCount + codingCount + descriptiveCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (decision === 'Rejected') {
      onDecision(request.id, 'Rejected');
      onClose();
      return;
    }

    if (strategy === 'Same Questions') {
      onDecision(request.id, 'Approved', 'Same Questions');
    } else {
      // Build new assessment data
      const skillQuestions = questionBank.filter(
        (q) => q.skill.toLowerCase() === request.skill.toLowerCase() && q.aiStatus === 'AI Verified'
      );

      const pickedMcqs = skillQuestions.filter((q) => q.type === 'MCQ').slice(0, mcqCount);
      const pickedCoding = skillQuestions.filter((q) => q.type === 'Coding').slice(0, codingCount);
      const pickedDescriptive = skillQuestions.filter((q) => q.type === 'Descriptive').slice(0, descriptiveCount);

      const allPicked = [...pickedMcqs, ...pickedCoding, ...pickedDescriptive];
      const totalMarks = allPicked.reduce((sum, q) => sum + q.marks, 0) || 30;

      const newAssessmentData = {
        name: `${request.skill} Retest Assessment (Gen-2)`,
        skill: request.skill as SkillCategory,
        difficulty: retestDifficulty,
        totalQuestions: allPicked.length || 4,
        mcqCount: pickedMcqs.length,
        codingCount: pickedCoding.length,
        descriptiveCount: pickedDescriptive.length,
        durationMinutes: 30,
        totalMarks,
        questions: allPicked.length > 0 ? allPicked : questionBank.slice(0, 4),
      };

      onDecision(request.id, 'Approved', 'New Questions', newAssessmentData);
    }

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
              <h3 className="text-base font-bold text-[#0F172A]">Review Retest Request</h3>
              <p className="text-xs text-slate-500">
                Evaluation for {request.studentName} ({request.skill})
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
          {/* Request Context Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Candidate:</span>
              <span className="font-bold text-[#0F172A]">{request.studentName} ({request.studentEmail})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Target Domain & Prior Score:</span>
              <span className="font-extrabold text-amber-600">{request.skill} ({request.previousScore}%)</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">Student's Request Justification:</span>
              <p className="italic text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                "{request.reason}"
              </p>
            </div>
          </div>

          {/* Decision Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Administrative Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  decision === 'Approved'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Approve Retest</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  decision === 'Rejected'
                    ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Decline Request</span>
              </button>
            </div>
          </div>

          {/* Strategy (if Approved) */}
          {decision === 'Approved' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Retest Question Generation Strategy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStrategy('Same Questions')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 text-left transition-all ${
                      strategy === 'Same Questions'
                        ? 'border-[#4F46E5] bg-indigo-50/80 text-[#4F46E5] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="block font-bold">Same Questions</span>
                      <span className="text-[10px] text-slate-500">Re-attempt standard baseline</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrategy('New Questions')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 text-left transition-all ${
                      strategy === 'New Questions'
                        ? 'border-[#4F46E5] bg-indigo-50/80 text-[#4F46E5] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                    <div>
                      <span className="block font-bold">New Question Set</span>
                      <span className="text-[10px] text-slate-500">Pick fresh verified bank items</span>
                    </div>
                  </button>
                </div>
              </div>

              {strategy === 'New Questions' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Difficulty Level:</label>
                    <select
                      value={retestDifficulty}
                      onChange={(e) => setRetestDifficulty(e.target.value as DifficultyLevel)}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">MCQs</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={mcqCount}
                        onChange={(e) => setMcqCount(Number(e.target.value))}
                        className="w-full text-center py-1 bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Coding</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={codingCount}
                        onChange={(e) => setCodingCount(Number(e.target.value))}
                        className="w-full text-center py-1 bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Descriptive</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={descriptiveCount}
                        onChange={(e) => setDescriptiveCount(Number(e.target.value))}
                        className="w-full text-center py-1 bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decision Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Decision Note / Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Approved for second round clearance."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
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
              className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-colors ${
                decision === 'Approved' ? 'bg-[#4F46E5] hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {decision === 'Approved' ? 'Confirm Retest Approval' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
