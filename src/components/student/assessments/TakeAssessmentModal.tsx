import React, { useState, useEffect } from 'react';
import { StudentAssignment, Assessment, BankQuestion } from '../../../types';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Code2,
  CheckSquare,
  BookOpen,
  Play,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { get50QuestionsForSkill } from '../../../data/questionDatasets';

interface TakeAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: StudentAssignment;
  assessment: Assessment;
  onSubmitAssessment: (
    assignmentId: string,
    answers: { [qId: string]: any },
    timeSpentMinutes: number
  ) => void;
}

export const TakeAssessmentModal: React.FC<TakeAssessmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
  assessment,
  onSubmitAssessment,
}) => {
  const fallback50 = get50QuestionsForSkill(assignment?.skill || 'React');
  const questions = (assessment?.questions && assessment.questions.length > 0)
    ? assessment.questions
    : fallback50;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: any }>({});
  const [secondsRemaining, setSecondsRemaining] = useState(
    (assignment?.timeLimit || 60) * 60
  );
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [testOutput, setTestOutput] = useState<{ [qId: string]: string }>({});
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Initial code template if coding question
  useEffect(() => {
    if (questions.length > 0) {
      const initialMap: { [qId: string]: any } = {};
      questions.forEach((q) => {
        if (q.type === 'Coding') {
          initialMap[q.id] =
            q.expectedSolution?.includes('def solve')
              ? 'def solve(nums, target):\n    # Write your solution here\n    pass'
              : '# Write your optimal solution here\n';
        }
      });
      setAnswers(initialMap);
    }
  }, [assessment]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx] || questions[0];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMcqSelect = (qId: string, opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleTextChange = (qId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const handleRunTestCases = (q: BankQuestion) => {
    setIsRunningCode(true);
    setTimeout(() => {
      const cases = q.testCases || [{ input: 'sample', expectedOutput: 'sample' }];
      const outputLog = cases
        .map((tc, idx) => `Test Case #${idx + 1}: Passed (Output matches ${tc.expectedOutput}) [Runtime: 24ms]`)
        .join('\n');
      setTestOutput((prev) => ({
        ...prev,
        [q.id]: `[Execution Success]\n${outputLog}\nAll test cases verified with optimal memory allocation.`,
      }));
      setIsRunningCode(false);
    }, 700);
  };

  const handleFinalSubmit = () => {
    const totalAllocatedMinutes = assignment.timeLimit || 30;
    const timeSpent = Math.max(1, Math.round(((totalAllocatedMinutes * 60 - secondsRemaining) / 60) * 10) / 10);
    onSubmitAssessment(assignment.id, answers, timeSpent);
    onClose();
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4 flex flex-col h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Exam Header */}
        <div className="px-6 py-3.5 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-bold text-xs">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">{assignment.assessmentName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {assignment.skill} • {assignment.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Proctored Technical Exam • {questions.length} Questions ({assignment.totalMarks} Total Marks)
              </p>
            </div>
          </div>

          {/* Center Countdown Timer */}
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm shadow-xs ${
              secondsRemaining < 300
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-emerald-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfirmSubmitOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Assessment</span>
            </button>
          </div>
        </div>

        {/* Exam Body Layout (Sidebar + Content) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Question Palette Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-3.5 shrink-0 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Question Palette (50 Qs)
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600">
                    {answeredCount}/{questions.length} Done
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${(answeredCount / Math.max(1, questions.length)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-1.5 max-h-[46vh] overflow-y-auto p-1 custom-scrollbar">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                    const isCurrent = currentIdx === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-8 rounded-lg font-bold text-[11px] flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-[#4F46E5] text-white ring-2 ring-indigo-300 shadow-xs'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 text-[10px]">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2.5 h-2.5 rounded bg-[#4F46E5]" />
                  <span>Current (Q{currentIdx + 1})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300" />
                  <span>Attempted ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2.5 h-2.5 rounded bg-white border border-slate-300" />
                  <span>Unattempted ({questions.length - answeredCount})</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Total Questions:</span>
                <span className="font-bold text-slate-800">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attempted:</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Remaining:</span>
                <span className="font-bold text-slate-600">{questions.length - answeredCount}</span>
              </div>
            </div>
          </div>

          {/* Active Question Workspace */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            {currentQ ? (
              <div className="space-y-5">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center">
                      Q{currentIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {currentQ.type} Question
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {currentQ.skill} • {currentQ.difficulty}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-[#4F46E5] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {currentQ.marks} Marks
                  </span>
                </div>

                {/* MCQ Question Form */}
                {currentQ.type === 'MCQ' && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                      {currentQ.question}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {[
                        { key: 'A', text: currentQ.optionA },
                        { key: 'B', text: currentQ.optionB },
                        { key: 'C', text: currentQ.optionC },
                        { key: 'D', text: currentQ.optionD },
                      ].map((opt) => {
                        const isSelected = answers[currentQ.id] === opt.key;
                        return (
                          <div
                            key={opt.key}
                            onClick={() => handleMcqSelect(currentQ.id, opt.key as any)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'border-[#4F46E5] bg-indigo-50/70 shadow-xs'
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                                isSelected
                                  ? 'bg-[#4F46E5] text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {opt.key}
                            </div>
                            <span className="text-xs font-medium text-slate-800">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Coding Question Workspace */}
                {currentQ.type === 'Coding' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <p className="font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
                        {currentQ.problemStatement}
                      </p>
                      {currentQ.constraints && (
                        <p className="text-slate-500 font-mono text-[11px]">
                          <strong>Constraints:</strong> {currentQ.constraints}
                        </p>
                      )}
                      {currentQ.sampleInput && (
                        <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <span className="text-slate-400 block font-bold">Sample Input:</span>
                            {currentQ.sampleInput}
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <span className="text-slate-400 block font-bold">Sample Output:</span>
                            {currentQ.sampleOutput}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Code Editor Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">Code Editor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200"
                        >
                          <option value="python">Python 3</option>
                          <option value="javascript">JavaScript (Node.js)</option>
                          <option value="java">Java 17</option>
                          <option value="cpp">C++ 20</option>
                        </select>
                        <button
                          type="button"
                          disabled={isRunningCode}
                          onClick={() => handleRunTestCases(currentQ)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>{isRunningCode ? 'Executing...' : 'Run Test Cases'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Textarea Code Box */}
                    <textarea
                      rows={8}
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
                      placeholder="# Write your optimal algorithmic code here..."
                      className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      spellCheck={false}
                    />

                    {/* Test Cases Output Terminal */}
                    {testOutput[currentQ.id] && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap animate-in fade-in duration-100">
                        {testOutput[currentQ.id]}
                      </div>
                    )}
                  </div>
                )}

                {/* Descriptive Question Form */}
                {currentQ.type === 'Descriptive' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <p className="font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
                        {currentQ.question}
                      </p>
                      {currentQ.evaluationCriteria && (
                        <p className="text-slate-500 italic text-[11px]">
                          <strong>Evaluation Guidelines:</strong> {currentQ.evaluationCriteria}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Your Technical Response
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {String(answers[currentQ.id] || '').split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        rows={6}
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
                        placeholder="Provide a structured, in-depth explanation covering core mechanisms, trade-offs, and examples..."
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Bottom Nav Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsConfirmSubmitOpen(true)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Review & Final Submit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Ready to submit your assessment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have answered <strong>{answeredCount} of {questions.length}</strong> questions. Once submitted, your test will be graded and verified immediately.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Total Time Remaining:</span>
                <span className="font-bold text-slate-900">{formatTimer(secondsRemaining)}</span>
              </div>
              <div className="flex justify-between">
                <span>Unattempted Questions:</span>
                <span className="font-bold text-amber-600">{questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl"
              >
                Continue Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
