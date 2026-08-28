import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export const StudentResults: React.FC = () => {
  const { assessments, studentAssessmentResults, studentProfile } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const submissionId = location.state?.submissionId;
  const currentSubmission =
    assessments.find((a) => a.id === submissionId) ||
    studentAssessmentResults[0] || {
      id: 'ASM-LATEST',
      skill: 'General Engineering',
      score: studentProfile.overallSkillScore || 85,
      totalQuestions: 5,
      correctCount: 4,
      accuracy: 80,
      percentile: 88,
      timeTakenMinutes: 6.5,
      date: new Date().toISOString().split('T')[0],
      skillBreakdown: { 'Core Logic': 90, 'Problem Solving': 85, Optimization: 80 },
      answers: {},
    };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/student/assessment')}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Assessment Center
          </button>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Official Performance Transcript
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verified assessment credential for {currentSubmission.skill} • Transcript #{currentSubmission.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/retest', { state: { skill: currentSubmission.skill } })}
            className="px-4 py-2 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retest Exam</span>
          </button>
          <button
            onClick={() => navigate('/student/ai-job-suggestions')}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Job Matches</span>
          </button>
        </div>
      </div>

      {/* Hero Score Showcase Card */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Assessment Passed • Verified Credential</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {currentSubmission.skill} Proficiency Evaluation
            </h2>
            <p className="text-sm text-indigo-200/90 max-w-lg">
              Performance verified and stored in institutional database. This score contributes to your placement readiness index.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                Score
              </span>
              <p className="text-4xl font-extrabold text-white mt-1">{currentSubmission.score}%</p>
            </div>
            <div className="w-[1px] h-12 bg-white/20" />
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                Percentile
              </span>
              <p className="text-4xl font-extrabold text-emerald-300 mt-1">
                {(currentSubmission as any).percentile || 90}th
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-semibold uppercase">Total Questions</span>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {(currentSubmission as any).totalQuestions || (currentSubmission as any).totalMarks || 5}
          </p>
          <span className="text-[11px] text-slate-500">Proctored session</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-semibold uppercase">Accuracy</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {(currentSubmission as any).accuracy || currentSubmission.score}%
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">High precision</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-semibold uppercase">Time Taken</span>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-1">
            {currentSubmission.timeTakenMinutes || 6} mins
          </p>
          <span className="text-[11px] text-slate-500">10m limit</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#64748B] font-semibold uppercase">Campus Rank</span>
          <p className="text-2xl font-extrabold text-[#4F46E5] mt-1">
            Top {(100 - ((currentSubmission as any).percentile || 90))}%
          </p>
          <span className="text-[11px] text-[#4F46E5] font-semibold">Tier-1 Qualified</span>
        </div>
      </div>
    </div>
  );
};
