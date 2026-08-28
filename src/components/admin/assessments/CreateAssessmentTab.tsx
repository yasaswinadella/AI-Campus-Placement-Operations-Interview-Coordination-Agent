import React, { useState, useEffect } from 'react';
import { Assessment, BankQuestion, SkillCategory, DifficultyLevel } from '../../../types';
import {
  FileCheck2,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  CheckSquare,
  Code2,
  BookOpen,
  Filter,
  Check,
  Zap,
} from 'lucide-react';

interface CreateAssessmentTabProps {
  questionBank: BankQuestion[];
  onCreateAssessment: (assessmentData: Omit<Assessment, 'id' | 'createdAt'>) => void;
  onOpenAddQuestion: () => void;
  onVerifyQuestion: (questionId: string) => void;
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

export const CreateAssessmentTab: React.FC<CreateAssessmentTabProps> = ({
  questionBank,
  onCreateAssessment,
  onOpenAddQuestion,
  onVerifyQuestion,
}) => {
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<SkillCategory>('Python');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [totalQuestions, setTotalQuestions] = useState<number>(4);
  const [mcqCount, setMcqCount] = useState<number>(2);
  const [codingCount, setCodingCount] = useState<number>(1);
  const [descriptiveCount, setDescriptiveCount] = useState<number>(1);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);

  // Set default name when skill changes
  useEffect(() => {
    setName(`${skill} Standard Competency Assessment`);
  }, [skill]);

  // Questions for this skill
  const skillQuestions = questionBank.filter(
    (q) => q.skill.toLowerCase() === skill.toLowerCase()
  );

  const filteredSkillQuestions = skillQuestions.filter(
    (q) =>
      !questionSearch ||
      (q.question && q.question.toLowerCase().includes(questionSearch.toLowerCase())) ||
      (q.problemStatement && q.problemStatement.toLowerCase().includes(questionSearch.toLowerCase()))
  );

  const currentDistributionSum = Number(mcqCount) + Number(codingCount) + Number(descriptiveCount);
  const isDistributionValid = currentDistributionSum === Number(totalQuestions);

  // Toggle question selection
  const handleToggleQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((item) => item !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  // Auto-Select Approved Questions matching distribution
  const handleAutoSelect = () => {
    const verified = skillQuestions.filter((q) => q.aiStatus === 'AI Verified');
    const availableMcqs = verified.filter((q) => q.type === 'MCQ');
    const availableCoding = verified.filter((q) => q.type === 'Coding');
    const availableDescriptive = verified.filter((q) => q.type === 'Descriptive');

    const picked: string[] = [
      ...availableMcqs.slice(0, mcqCount).map((q) => q.id),
      ...availableCoding.slice(0, codingCount).map((q) => q.id),
      ...availableDescriptive.slice(0, descriptiveCount).map((q) => q.id),
    ];

    // If verified not enough, pick from remaining
    if (picked.length < totalQuestions) {
      const remaining = skillQuestions
        .filter((q) => !picked.includes(q.id))
        .slice(0, totalQuestions - picked.length);
      picked.push(...remaining.map((q) => q.id));
    }

    setSelectedQuestionIds(picked);
  };

  const handleVerifyAllSelected = async () => {
    setIsVerifyingAll(true);
    for (const id of selectedQuestionIds) {
      await onVerifyQuestion(id);
    }
    setIsVerifyingAll(false);
  };

  // Compute selected question counts & marks
  const selectedQuestions = questionBank.filter((q) => selectedQuestionIds.includes(q.id));
  const selectedMcqCount = selectedQuestions.filter((q) => q.type === 'MCQ').length;
  const selectedCodingCount = selectedQuestions.filter((q) => q.type === 'Coding').length;
  const selectedDescriptiveCount = selectedQuestions.filter((q) => q.type === 'Descriptive').length;
  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0) || 30;

  const hasUnverified = selectedQuestions.some((q) => q.aiStatus !== 'AI Verified');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDistributionValid) return;
    if (selectedQuestions.length === 0) return;

    onCreateAssessment({
      name,
      skill,
      difficulty,
      totalQuestions: selectedQuestions.length,
      mcqCount: selectedMcqCount,
      codingCount: selectedCodingCount,
      descriptiveCount: selectedDescriptiveCount,
      durationMinutes: Number(durationMinutes) || 30,
      totalMarks,
      questions: selectedQuestions,
    });

    // Reset form
    setName(`${skill} Advanced Placement Test`);
    setSelectedQuestionIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI-Assisted Assessment Builder</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Design & Calibrate Technical Evaluations
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Configure skill domains, question distribution across MCQs, coding challenges, and descriptive scenarios.
            Ensure AI verification on question items before publishing.
          </p>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        {/* Core Configuration Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#4F46E5]" />
            1. Assessment Specification & Target Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Assessment Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assessment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Python Full Stack Assessment"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            {/* Target Skill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Skill Domain
              </label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value as SkillCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              >
                {AVAILABLE_SKILLS.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          {/* Question Distribution Matrix */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Question Type Distribution
              </span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isDistributionValid
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {isDistributionValid ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>
                  Sum: {currentDistributionSum} / Total: {totalQuestions}{' '}
                  {isDistributionValid ? '(Valid)' : '(Mismatch)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* Total Questions */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Total Questions
                </span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-full text-center py-1 font-black text-lg text-[#4F46E5] bg-slate-50 rounded-lg border border-slate-200"
                  required
                />
              </div>

              {/* MCQ Count */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 flex items-center justify-center gap-1">
                  <CheckSquare className="w-3 h-3 text-indigo-500" /> MCQs
                </span>
                <input
                  type="number"
                  min="0"
                  max={totalQuestions}
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Number(e.target.value))}
                  className="w-full text-center py-1 font-bold text-sm text-slate-800 bg-slate-50 rounded-lg border border-slate-200"
                />
              </div>

              {/* Coding Count */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 flex items-center justify-center gap-1">
                  <Code2 className="w-3 h-3 text-emerald-500" /> Coding
                </span>
                <input
                  type="number"
                  min="0"
                  max={totalQuestions}
                  value={codingCount}
                  onChange={(e) => setCodingCount(Number(e.target.value))}
                  className="w-full text-center py-1 font-bold text-sm text-slate-800 bg-slate-50 rounded-lg border border-slate-200"
                />
              </div>

              {/* Descriptive Count */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1 flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3 text-amber-500" /> Descriptive
                </span>
                <input
                  type="number"
                  min="0"
                  max={totalQuestions}
                  value={descriptiveCount}
                  onChange={(e) => setDescriptiveCount(Number(e.target.value))}
                  className="w-full text-center py-1 font-bold text-sm text-slate-800 bg-slate-50 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            {!isDistributionValid && (
              <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                The sum of MCQ ({mcqCount}) + Coding ({codingCount}) + Descriptive ({descriptiveCount}) equals{' '}
                {currentDistributionSum}, which must equal the Total Questions ({totalQuestions}).
              </p>
            )}
          </div>
        </div>

        {/* Question Bank Selection Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                2. Select Questions from Bank ({skill} Domain)
              </h3>
              <p className="text-xs text-slate-500">
                {selectedQuestionIds.length} of {totalQuestions} questions selected (MCQ:{' '}
                {selectedMcqCount}/{mcqCount}, Code: {selectedCodingCount}/{codingCount}, Desc:{' '}
                {selectedDescriptiveCount}/{descriptiveCount})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoSelect}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Auto-Select</span>
              </button>

              {hasUnverified && (
                <button
                  type="button"
                  disabled={isVerifyingAll}
                  onClick={handleVerifyAllSelected}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isVerifyingAll ? 'Verifying...' : 'AI Verify Selected'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenAddQuestion}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Author New</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          {filteredSkillQuestions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
              <p className="text-xs font-semibold text-slate-600">
                No questions found in question bank for {skill}.
              </p>
              <button
                type="button"
                onClick={onOpenAddQuestion}
                className="px-3.5 py-1.5 bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Create Question for {skill}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {filteredSkillQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#4F46E5] bg-indigo-50/40 ring-1 ring-[#4F46E5]/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#4F46E5] text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {q.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.type === 'MCQ'
                                ? 'bg-indigo-100 text-indigo-700'
                                : q.type === 'Coding'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {q.type}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {q.difficulty} • {q.marks} Marks
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              q.aiStatus === 'AI Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : q.aiStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            {q.aiStatus}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                          {q.type === 'Coding' ? q.problemStatement : q.question}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {q.aiStatus !== 'AI Verified' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onVerifyQuestion(q.id);
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Final Publishing Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Duration</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                />
                <span className="text-xs text-slate-500 font-semibold">mins</span>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Marks</span>
              <span className="text-lg font-black text-[#4F46E5]">{totalMarks} pts</span>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Selected</span>
              <span className="text-sm font-bold text-slate-800">
                {selectedQuestions.length} Questions
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isDistributionValid || selectedQuestions.length === 0}
            className="px-6 py-3 bg-[#4F46E5] hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Assessment ({selectedQuestions.length} Qs)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
