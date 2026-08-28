import React, { useState } from 'react';
import { BankQuestion, QuestionType, SkillCategory, DifficultyLevel, AiVerificationStatus } from '../../../types';
import {
  Search,
  Plus,
  Filter,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  CheckSquare,
  Code2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface QuestionBankTabProps {
  questionBank: BankQuestion[];
  onOpenAddModal: () => void;
  onEditQuestion: (question: BankQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onVerifyQuestion: (id: string) => void;
  onApproveQuestion: (id: string) => void;
  onRejectQuestion: (id: string) => void;
}

const AVAILABLE_SKILLS: ('All' | SkillCategory)[] = [
  'All',
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

export const QuestionBankTab: React.FC<QuestionBankTabProps> = ({
  questionBank,
  onOpenAddModal,
  onEditQuestion,
  onDeleteQuestion,
  onVerifyQuestion,
  onApproveQuestion,
  onRejectQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<'All' | SkillCategory>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | QuestionType>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | DifficultyLevel>('All');
  const [aiStatusFilter, setAiStatusFilter] = useState<'All' | AiVerificationStatus>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const filteredQuestions = questionBank.filter((q) => {
    const matchesSearch =
      !searchQuery ||
      (q.question && q.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.problemStatement && q.problemStatement.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill = skillFilter === 'All' || q.skill.toLowerCase() === skillFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || q.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    const matchesAiStatus = aiStatusFilter === 'All' || q.aiStatus === aiStatusFilter;

    return matchesSearch && matchesSkill && matchesType && matchesDifficulty && matchesAiStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Master Question Repository</h2>
          <p className="text-xs text-slate-500">
            {questionBank.length} total curated test items across multiple skill verticals.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Author Question</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompt, ID..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Skill Filter */}
          <div>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
            >
              {AVAILABLE_SKILLS.map((sk) => (
                <option key={sk} value={sk}>
                  Skill: {sk}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="All">Type: All Formats</option>
              <option value="MCQ">Type: MCQ</option>
              <option value="Coding">Type: Coding</option>
              <option value="Descriptive">Type: Descriptive</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="All">Difficulty: All</option>
              <option value="Easy">Difficulty: Easy</option>
              <option value="Medium">Difficulty: Medium</option>
              <option value="Hard">Difficulty: Hard</option>
            </select>
          </div>

          {/* AI Status Filter */}
          <div>
            <select
              value={aiStatusFilter}
              onChange={(e) => setAiStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="All">AI Status: All</option>
              <option value="AI Verified">AI Verified</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-xs font-semibold text-slate-600">
              No questions found matching the selected filters.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      {q.id}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                        q.type === 'MCQ'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : q.type === 'Coding'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {q.type === 'MCQ' && <CheckSquare className="w-3.5 h-3.5" />}
                      {q.type === 'Coding' && <Code2 className="w-3.5 h-3.5" />}
                      {q.type === 'Descriptive' && <BookOpen className="w-3.5 h-3.5" />}
                      <span>{q.type}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {q.skill}
                    </span>

                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                        q.difficulty === 'Easy'
                          ? 'text-emerald-700 bg-emerald-50'
                          : q.difficulty === 'Medium'
                          ? 'text-indigo-700 bg-indigo-50'
                          : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {q.difficulty}
                    </span>

                    <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      {q.marks} pts
                    </span>

                    {/* AI Verification Badge */}
                    <div className="relative group">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 cursor-help ${
                          q.aiStatus === 'AI Verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : q.aiStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{q.aiStatus}</span>
                      </span>

                      {/* AI Feedback Popover */}
                      {q.aiFeedback && (
                        <div className="hidden group-hover:block absolute z-20 left-0 top-full mt-1.5 w-72 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl border border-slate-700 pointer-events-none">
                          <p className="font-bold text-indigo-300 mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Verification Log
                          </p>
                          <p className="text-slate-300 leading-tight">{q.aiFeedback}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onVerifyQuestion(q.id)}
                      className="px-2.5 py-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors"
                      title="Run AI Quality Verification"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>AI Verify</span>
                    </button>

                    {q.aiStatus !== 'AI Verified' && (
                      <button
                        onClick={() => onApproveQuestion(q.id)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors"
                        title="Approve Question"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    {q.aiStatus !== 'Rejected' && (
                      <button
                        onClick={() => onRejectQuestion(q.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors"
                        title="Reject Question"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onEditQuestion(q)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      title="Edit Question"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors ml-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Summary Body */}
                <div className="px-4 pb-4">
                  <p className="text-xs font-semibold text-[#0F172A] leading-relaxed">
                    {q.type === 'Coding' ? q.problemStatement : q.question}
                  </p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs animate-in fade-in duration-150">
                    {/* MCQ Options */}
                    {q.type === 'MCQ' && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Options Matrix:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            { key: 'A', text: q.optionA },
                            { key: 'B', text: q.optionB },
                            { key: 'C', text: q.optionC },
                            { key: 'D', text: q.optionD },
                          ].map((opt) => (
                            <div
                              key={opt.key}
                              className={`p-2 rounded-xl border flex items-center gap-2 ${
                                q.correctAnswer === opt.key
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                  q.correctAnswer === opt.key
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span>{opt.text}</span>
                              {q.correctAnswer === opt.key && (
                                <span className="ml-auto text-[10px] font-extrabold text-emerald-600 uppercase">
                                  Correct Key
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200">
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Coding Details */}
                    {q.type === 'Coding' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-400 block font-bold">Input Format:</span>
                            <span>{q.inputFormat || 'Standard parameters'}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-400 block font-bold">Output Format:</span>
                            <span>{q.outputFormat || 'Expected return value'}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-400 block font-bold">Constraints:</span>
                            <span>{q.constraints || 'Standard memory/time constraints'}</span>
                          </div>
                        </div>

                        {q.testCases && q.testCases.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Automated Test Cases ({q.testCases.length}):
                            </span>
                            <div className="space-y-1.5">
                              {q.testCases.map((tc, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] flex items-center justify-between"
                                >
                                  <span>
                                    Input: <strong className="text-slate-800">{tc.input}</strong> → Output:{' '}
                                    <strong className="text-emerald-700">{tc.expectedOutput}</strong>
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                    {tc.isHidden ? 'Hidden' : 'Sample'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.expectedSolution && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              Reference Solution:
                            </span>
                            <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                              {q.expectedSolution}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Descriptive Details */}
                    {q.type === 'Descriptive' && (
                      <div className="space-y-2">
                        {q.expectedAnswer && (
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Required Technical Concepts:
                            </span>
                            <p className="text-slate-800 font-medium whitespace-pre-wrap">{q.expectedAnswer}</p>
                          </div>
                        )}
                        {q.evaluationCriteria && (
                          <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                            <span className="text-[10px] font-bold text-indigo-700 uppercase block">
                              Grading Criteria:
                            </span>
                            <p className="text-indigo-950 font-medium">{q.evaluationCriteria}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
