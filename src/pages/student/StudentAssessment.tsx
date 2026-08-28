import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Award,
  HelpCircle,
} from 'lucide-react';

import { get50QuestionsForSkill } from '../../data/questionDatasets';

export const StudentAssessment: React.FC = () => {
  const { studentProfile, submitAssessmentTest, questionBank, assessmentsList, studentAssignments } = useData();
  const navigate = useNavigate();

  const [selectedSkill, setSelectedSkill] = useState('Python');
  const [inTestMode, setInTestMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600); // 60 minutes for 50 questions

  // Find questions from Supabase Question Bank or 50-Question benchmark dataset
  const bankMatches = questionBank.filter(
    (q) => q.type === 'MCQ' && (q.skill.toLowerCase().includes(selectedSkill.toLowerCase()) || selectedSkill === 'General')
  );

  const fallback50 = get50QuestionsForSkill(selectedSkill);
  const selectedSource = bankMatches.length >= 20 ? bankMatches : fallback50;

  const questions = selectedSource.map((q) => ({
    id: q.id,
    skill: q.skill,
    question: q.question || 'Evaluate the optimal implementation for this scenario:',
    options: [q.optionA || 'Option A', q.optionB || 'Option B', q.optionC || 'Option C', q.optionD || 'Option D'],
    correctAnswer:
      q.correctAnswer === 'A' || q.correctAnswer === 0
        ? 0
        : q.correctAnswer === 'B' || q.correctAnswer === 1
        ? 1
        : q.correctAnswer === 'C' || q.correctAnswer === 2
        ? 2
        : 3,
    explanation: q.explanation || 'Verified algorithmic correctness.',
  }));

  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (inTestMode && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (inTestMode && timeLeftSeconds <= 0) {
      handleFinalSubmit();
    }
    return () => clearInterval(interval);
  }, [inTestMode, timeLeftSeconds]);

  const handleStartTest = (skillName: string) => {
    setSelectedSkill(skillName);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(600);
    setInTestMode(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (currentQ) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
    }
  };

  const handleFinalSubmit = () => {
    const timeSpent = Math.max(1, Math.round((3600 - timeLeftSeconds) / 60));
    const submission = submitAssessmentTest(selectedSkill, answers, timeSpent);
    setInTestMode(false);
    navigate('/student/results', { state: { submissionId: submission.id } });
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  if (inTestMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Active Test Header Bar */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-[#4F46E5] flex items-center justify-center border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{selectedSkill} Proctored Assessment</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SUPABASE VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400">Answer all questions before the countdown timer expires.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-mono text-base font-bold text-white">{formatTimer(timeLeftSeconds)}</span>
            </div>
            <button
              onClick={handleFinalSubmit}
              className="px-5 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Submit Test ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>

        {/* Question Progress Dots */}
        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Questions:</span>
            <div className="flex gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentQuestionIndex === idx
                      ? 'bg-[#4F46E5] text-white ring-2 ring-[#4F46E5]/30 shadow-xs'
                      : answers[q.id] !== undefined
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-semibold text-[#64748B]">
            {answeredCount} of {questions.length} answered
          </span>
        </div>

        {/* Active Question Card */}
        {currentQ && (
          <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="flex items-center justify-between text-xs text-[#64748B] border-b border-slate-100 pb-3">
              <span className="font-bold text-[#4F46E5] uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold">{currentQ.skill}</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#4F46E5] bg-indigo-50/60 text-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  className="px-6 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <span>Complete Assessment</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Skill Assessment Center
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Take skill assessments to qualify for high-package placement drives.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/assignments')}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Assigned Tests ({studentAssignments.length})</span>
        </button>
      </div>

      {/* Available Domains Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { skill: 'Python', icon: BookOpen, desc: 'Object-oriented programming, data structures, and core library functions.', rating: studentProfile.skills['Python'] || 0 },
          { skill: 'DSA', icon: Sparkles, desc: 'Algorithms, trees, graphs, sorting, searching, and dynamic programming.', rating: studentProfile.skills['DSA'] || 0 },
          { skill: 'SQL', icon: FileCheck2, desc: 'Relational query design, indexing, joins, aggregate functions, and normalization.', rating: studentProfile.skills['SQL'] || 0 },
          { skill: 'React', icon: Award, desc: 'Component lifecycles, state hooks, performance optimization, and DOM manipulation.', rating: studentProfile.skills['React'] || 0 },
          { skill: 'Java', icon: ShieldCheck, desc: 'Enterprise JVM architecture, multithreading, collections, and design patterns.', rating: studentProfile.skills['Java'] || 0 },
          { skill: 'DBMS', icon: RotateCcw, desc: 'ACID properties, database concurrency, transaction isolation, and storage engines.', rating: studentProfile.skills['DBMS'] || 0 },
        ].map((item) => (
          <div
            key={item.skill}
            className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                {item.rating > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.rating}% Score
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">{item.skill} Assessment</h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{item.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">10 mins • 5 MCQs</span>
              <button
                onClick={() => handleStartTest(item.skill)}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>{item.rating > 0 ? 'Retake Exam' : 'Start Exam'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
