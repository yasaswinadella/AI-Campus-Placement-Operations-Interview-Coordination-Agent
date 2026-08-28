import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import {
  BankQuestion,
  DifficultyLevel,
  SkillCategory,
  StudentAssessmentRequest,
  StudentProfile,
} from '../../../types';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Plus,
  Layers,
  Search,
  CheckSquare,
  Square,
  HelpCircle,
  Sliders,
  Calendar,
  User,
  GraduationCap,
} from 'lucide-react';
import { QuestionFormModal } from './QuestionFormModal';

interface SendDirectAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: StudentAssessmentRequest | null;
  targetStudent?: StudentProfile | null;
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

export const SendDirectAssessmentModal: React.FC<SendDirectAssessmentModalProps> = ({
  isOpen,
  onClose,
  request,
  targetStudent,
}) => {
  const {
    questionBank,
    sendAssessmentToRequestStudent,
    allStudents,
    addQuestionToBank,
    updateBankQuestion,
  } = useData();

  // Determine target student identity
  const student =
    targetStudent ||
    allStudents.find(
      (s) =>
        s.id === request?.studentId ||
        s.email.toLowerCase() === request?.studentEmail.toLowerCase()
    ) || {
      id: request?.studentId || 'STU-001',
      name: request?.studentName || 'Student',
      email: request?.studentEmail || 'student@email.com',
      college: request?.studentCollege || 'Apex Institute of Technology',
      branch: request?.studentBranch || 'CSE',
      cgpa: request?.studentCgpa || 8.5,
    };

  // Form states
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory>(
    (request?.requestedSkill as SkillCategory) || 'Python'
  );

  const [assessmentName, setAssessmentName] = useState(
    `${request?.requestedSkill || 'Python'} Customized Evaluation - ${student.name}`
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Mixed');
  const [totalQuestions, setTotalQuestions] = useState<number>(4);
  const [mcqCount, setMcqCount] = useState<number>(2);
  const [codingCount, setCodingCount] = useState<number>(1);
  const [descriptiveCount, setDescriptiveCount] = useState<number>(1);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Selected questions from the bank
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState<'ALL' | 'MCQ' | 'Coding' | 'Descriptive'>('ALL');

  // Add question modal state
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);

  // Auto-sync form when request changes or modal opens
  useEffect(() => {
    if (request) {
      const skill = (request.requestedSkill as SkillCategory) || 'Python';
      setSelectedSkill(skill);
      setAssessmentName(`${skill} Targeted Assessment - ${student.name}`);
    } else {
      setSelectedSkill('Python');
      setAssessmentName(`Python Assessment - ${student.name}`);
    }
  }, [request, student.name]);

  // Filter bank questions strictly by current selected skill
  const skillBankQuestions = questionBank.filter(
    (q) => q.skill.toLowerCase() === selectedSkill.toLowerCase()
  );

  // Filter approved questions
  const approvedSkillQuestions = skillBankQuestions.filter(
    (q) => q.aiStatus === 'AI Verified'
  );

  // Auto-select questions to match distribution
  const handleAutoSelectApproved = () => {
    const mcqAvailable = approvedSkillQuestions.filter((q) => q.type === 'MCQ');
    const codingAvailable = approvedSkillQuestions.filter((q) => q.type === 'Coding');
    const descAvailable = approvedSkillQuestions.filter((q) => q.type === 'Descriptive');

    const chosen: string[] = [];

    // Select MCQs
    mcqAvailable.slice(0, mcqCount).forEach((q) => chosen.push(q.id));
    // Select Coding
    codingAvailable.slice(0, codingCount).forEach((q) => chosen.push(q.id));
    // Select Descriptive
    descAvailable.slice(0, descriptiveCount).forEach((q) => chosen.push(q.id));

    setSelectedQuestionIds(chosen);
  };

  // When skill changes, auto-pick default questions if available
  useEffect(() => {
    handleAutoSelectApproved();
  }, [selectedSkill, mcqCount, codingCount, descriptiveCount]);

  if (!isOpen) return null;

  // Validation
  const sumOfDistribution = mcqCount + codingCount + descriptiveCount;
  const isDistributionValid = sumOfDistribution === totalQuestions;
  const selectedQuestionsObjects = questionBank.filter((q) =>
    selectedQuestionIds.includes(q.id)
  );

  const selectedMcqCount = selectedQuestionsObjects.filter((q) => q.type === 'MCQ').length;
  const selectedCodingCount = selectedQuestionsObjects.filter((q) => q.type === 'Coding').length;
  const selectedDescCount = selectedQuestionsObjects.filter((q) => q.type === 'Descriptive').length;

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveNewQuestion = (qData: Omit<BankQuestion, 'id' | 'aiStatus'>) => {
    if (editingQuestion) {
      updateBankQuestion(editingQuestion.id, qData);
    } else {
      const created = addQuestionToBank(qData);
      setSelectedQuestionIds((prev) => [...prev, created.id]);
    }
  };

  const handleSendToStudent = () => {
    if (!isDistributionValid) return;

    if (selectedQuestionsObjects.length === 0) {
      alert('Please select at least 1 question from the Question Bank.');
      return;
    }

    sendAssessmentToRequestStudent({
      requestId: request?.id,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentBranch: student.branch,
      studentCollege: student.college,
      skill: selectedSkill,
      assessmentName,
      difficulty,
      totalQuestions,
      mcqCount,
      codingCount,
      descriptiveCount,
      durationMinutes,
      deadline,
      selectedQuestions: selectedQuestionsObjects,
    });

    onClose();
  };

  const filteredDisplayQuestions = skillBankQuestions.filter((q) => {
    if (questionTypeFilter !== 'ALL' && q.type !== questionTypeFilter) return false;
    if (questionSearch.trim()) {
      const qText = (q.question || q.problemStatement || '').toLowerCase();
      if (!qText.includes(questionSearch.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
          {/* Modal Header */}
          <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Send Assessment to Student
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#4F46E5] text-white">
                    Direct Assignment
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Target Candidate: <strong className="text-white">{student.name}</strong> ({student.email}) • {student.branch}
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

          {/* Modal Body Scrollable */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
            {/* Target Student Identity Banner */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                  {student.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">{student.name}</h4>
                  <p className="text-[11px] text-slate-500">{student.email} • {student.college}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700">
                  Branch: <strong className="text-[#0F172A]">{student.branch}</strong>
                </div>
                <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[#4F46E5]">
                  CGPA: <strong className="text-indigo-900">{student.cgpa}</strong>
                </div>
              </div>
            </div>

            {/* Step 1: Skill Selection (The requested skill is selected by default) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <span>1. Select Assessment Skill Domain</span>
                  {request && request.requestedSkill === selectedSkill && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200">
                      Requested by Student
                    </span>
                  )}
                </label>
                <span className="text-[11px] text-slate-500">
                  {skillBankQuestions.length} Questions available in Question Bank
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = selectedSkill === skill;
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setAssessmentName(`${skill} Customized Evaluation - ${student.name}`);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Assessment Configuration & Distribution */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#4F46E5]" />
                <span>2. Assessment Configuration & Question Distribution</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Assessment Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Assessment Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assessmentName}
                    onChange={(e) => setAssessmentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                    required
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                {/* Total Questions */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Total Questions <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              {/* Distribution Counts (MCQ, Coding, Descriptive) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Question Distribution (Must sum to {totalQuestions})
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${
                        isDistributionValid
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      Sum: {sumOfDistribution} / {totalQuestions}{' '}
                      {isDistributionValid ? '✓ (Valid)' : '✗ (Mismatch)'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      MCQ Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={mcqCount}
                      onChange={(e) => setMcqCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                    />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Coding Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={codingCount}
                      onChange={(e) => setCodingCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                    />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Descriptive Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={descriptiveCount}
                      onChange={(e) => setDescriptiveCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                {!isDistributionValid && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    ⚠️ The question distribution sum ({sumOfDistribution}) does not match total questions ({totalQuestions}). Adjust the counts above before dispatching.
                  </p>
                )}
              </div>

              {/* Time Limit & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Time Limit (Minutes)</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Submission Deadline</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Question Bank Selection & AI Verification */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#4F46E5]" />
                    <span>3. Select Questions for {selectedSkill} ({selectedQuestionIds.length} Selected)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Selected: {selectedMcqCount} MCQ • {selectedCodingCount} Coding • {selectedDescCount} Descriptive
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoSelectApproved}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-xs font-bold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Auto-Select</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsAddQuestionModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Question</span>
                  </button>
                </div>
              </div>

              {/* Filter and Search */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search question text or keywords..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['ALL', 'MCQ', 'Coding', 'Descriptive'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuestionTypeFilter(t)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        questionTypeFilter === t
                          ? 'bg-white text-[#0F172A] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar p-1">
                {filteredDisplayQuestions.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">
                      No questions found matching criteria for {selectedSkill}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(null);
                        setIsAddQuestionModalOpen(true);
                      }}
                      className="mt-2 text-xs text-[#4F46E5] font-bold hover:underline"
                    >
                      + Create first question for {selectedSkill}
                    </button>
                  </div>
                ) : (
                  filteredDisplayQuestions.map((q) => {
                    const isSelected = selectedQuestionIds.includes(q.id);
                    const isApproved = q.aiStatus === 'AI Verified';

                    return (
                      <div
                        key={q.id}
                        onClick={() => isApproved && handleToggleQuestion(q.id)}
                        className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/70 border-[#4F46E5] shadow-xs'
                            : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                        } ${!isApproved ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            disabled={!isApproved}
                            className="mt-0.5 text-slate-600 shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                  q.type === 'MCQ'
                                    ? 'bg-blue-100 text-blue-800'
                                    : q.type === 'Coding'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {q.type}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {q.difficulty}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600">
                                {q.marks} Marks
                              </span>

                              {/* AI Verification Badge */}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                  q.aiStatus === 'AI Verified'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : q.aiStatus === 'Needs Review'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{q.aiStatus}</span>
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-[#0F172A] line-clamp-2">
                              {q.question || q.problemStatement}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Step 4: Summary Card Linked to Student */}
            <div className="p-4 bg-[#0F172A] text-white rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Assigned Target: {student.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span>Skill: <strong className="text-white">{selectedSkill}</strong></span>
                  <span>•</span>
                  <span>Total Questions: <strong className="text-white">{totalQuestions}</strong></span>
                  <span>•</span>
                  <span>
                    MCQ: <strong className="text-white">{mcqCount}</strong> | Coding: <strong className="text-white">{codingCount}</strong> | Descriptive: <strong className="text-white">{descriptiveCount}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendToStudent}
                  disabled={!isDistributionValid || selectedQuestionsObjects.length === 0}
                  className="px-6 py-2 bg-[#4F46E5] hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND ASSESSMENT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Question Form Modal for creating/editing questions with AI check */}
      <QuestionFormModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        onSave={handleSaveNewQuestion}
        initialQuestion={editingQuestion}
      />
    </>
  );
};
