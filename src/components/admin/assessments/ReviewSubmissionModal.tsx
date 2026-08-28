import React, { useState } from 'react';
import { StudentAssessmentResult } from '../../../types';
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Code2,
  BookOpen,
  CheckSquare,
  Save,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: StudentAssessmentResult | null;
  onSaveReview: (resultId: string, notes: string, adjustedMarks?: { [qId: string]: number }) => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  result,
  onSaveReview,
}) => {
  const [adminNotes, setAdminNotes] = useState(result?.adminNotes || '');
  const [adjustedMarks, setAdjustedMarks] = useState<{ [qId: string]: number }>({});

  if (!isOpen || !result) return null;

  const handleMarkChange = (qId: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, val));
    setAdjustedMarks((prev) => ({ ...prev, [qId]: clamped }));
  };

  const calculateCurrentTotal = () => {
    return result.questionAnswers.reduce((sum, qa) => {
      const mark = adjustedMarks[qa.questionId] !== undefined ? adjustedMarks[qa.questionId] : qa.awardedMarks;
      return sum + mark;
    }, 0);
  };

  const currentTotal = calculateCurrentTotal();
  const currentPercentage = Math.round((currentTotal / result.totalMarks) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReview(result.id, adminNotes, adjustedMarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">Candidate Evaluation Dossier</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {result.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {result.assessmentName} • Submission ID #{result.id} • {result.date}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Candidate Profile & Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Candidate Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Candidate Profile</span>
              </div>
              <p className="text-sm font-bold text-[#0F172A]">{result.studentName}</p>
              <p className="text-xs text-slate-600 font-mono">{result.studentEmail}</p>
              <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{result.studentBranch} • {result.studentCollege}</span>
              </div>
            </div>

            {/* Score Breakdown Card */}
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Total Score</span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {result.timeTakenMinutes} mins
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-3xl font-extrabold text-[#4F46E5]">{currentTotal}</span>
                <span className="text-xs font-bold text-slate-500">/ {result.totalMarks} Marks</span>
                <span className="ml-auto text-lg font-black text-emerald-600">({currentPercentage}%)</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center pt-2 border-t border-indigo-100/80 text-[10px]">
                <div>
                  <span className="text-slate-400 block">MCQ</span>
                  <span className="font-bold text-slate-700">{result.mcqScore}/{result.mcqTotal}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Coding</span>
                  <span className="font-bold text-slate-700">{result.codingScore}/{result.codingTotal}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Descriptive</span>
                  <span className="font-bold text-slate-700">{result.descriptiveScore}/{result.descriptiveTotal}</span>
                </div>
              </div>
            </div>

            {/* AI Diagnostics */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Skill Diagnostics</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Strengths:</span>
                  <p className="text-slate-700 text-[11px] leading-tight">
                    {result.strengths?.join(', ') || 'Consistent accuracy'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Focus Areas:</span>
                  <p className="text-slate-700 text-[11px] leading-tight">
                    {result.weaknesses?.join(', ') || 'None flagged'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Question-by-Question Submissions Review */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Itemized Question Review & Grading ({result.questionAnswers?.length || 0} Questions)
            </h4>

            {result.questionAnswers?.map((qa, index) => {
              const awarded = adjustedMarks[qa.questionId] !== undefined ? adjustedMarks[qa.questionId] : qa.awardedMarks;
              return (
                <div
                  key={qa.questionId || index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
                >
                  {/* Question Header Bar */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        {qa.questionType} Question
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200/80 text-slate-700">
                        {qa.skill} • {qa.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {qa.isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <AlertCircle className="w-4 h-4" /> Needs Review / Partial
                        </span>
                      )}

                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs">
                        <span className="text-slate-500 font-semibold">Marks:</span>
                        <input
                          type="number"
                          min="0"
                          max={qa.maxMarks}
                          value={awarded}
                          onChange={(e) => handleMarkChange(qa.questionId, Number(e.target.value), qa.maxMarks)}
                          className="w-12 text-center font-bold text-[#4F46E5] bg-slate-50 rounded border border-slate-200 focus:bg-white focus:outline-none"
                        />
                        <span className="text-slate-400 font-bold">/ {qa.maxMarks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <p className="font-semibold text-[#0F172A] whitespace-pre-wrap">{qa.questionText}</p>
                    </div>

                    {/* Student Response Display */}
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                        Candidate's Response:
                      </span>
                      {qa.questionType === 'Coding' ? (
                        <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
                          {String(qa.studentAnswer || '')}
                        </pre>
                      ) : (
                        <p className="font-medium text-slate-800 whitespace-pre-wrap">
                          {String(qa.studentAnswer || '')}
                        </p>
                      )}
                    </div>

                    {/* Master Solution / Grading Key */}
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                        Verified Reference / Answer Key:
                      </span>
                      {qa.questionType === 'Coding' ? (
                        <pre className="p-2.5 bg-slate-950 text-indigo-300 rounded-lg font-mono text-[11px] overflow-x-auto">
                          {qa.correctAnswerOrSolution}
                        </pre>
                      ) : (
                        <p className="text-emerald-900 font-medium">{qa.correctAnswerOrSolution}</p>
                      )}
                      {qa.explanationOrCriteria && (
                        <p className="text-[11px] text-slate-500 italic mt-1">{qa.explanationOrCriteria}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Evaluation Notes */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#4F46E5]" />
              Placement Officer Remarks & Feedback
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Enter institutional feedback, interview recommendations, or grading justification..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500">
            Total Adjusted Score: <strong className="text-[#0F172A]">{currentTotal} / {result.totalMarks} ({currentPercentage}%)</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Finalize Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
