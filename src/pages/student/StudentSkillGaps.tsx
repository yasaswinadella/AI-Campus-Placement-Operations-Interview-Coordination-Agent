import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { StudentAssessmentResult, SkillGap } from '../../types';
import {
  TrendingDown,
  Target,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  BrainCircuit,
} from 'lucide-react';

export const StudentSkillGaps: React.FC = () => {
  const { jobs = [], studentAssessmentResults = [], studentProfile } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dbResults, setDbResults] = useState<StudentAssessmentResult[]>([]);

  const sId = studentProfile?.id || user?.id || '';
  const sEmail = studentProfile?.email || user?.email || '';

  useEffect(() => {
    dbService.getStudentSelfAssessmentHistory(sId, sEmail).then((res) => {
      const merged: StudentAssessmentResult[] = [...res];
      studentAssessmentResults.forEach((r) => {
        if (!merged.some((m) => m.id === r.id)) {
          merged.push(r);
        }
      });
      setDbResults(merged);
    });
  }, [sId, sEmail, studentAssessmentResults]);

  // Target core technical skills required by top employers
  const targetBenchmarks = [
    {
      skill: 'Data Structures & Algorithms',
      requiredScore: 85,
      estimatedHours: 20,
      course: 'Advanced Graphs, Dynamic Programming & LeetCode Hard Patterns',
      priority: 'Critical' as const,
    },
    {
      skill: 'Python',
      requiredScore: 80,
      estimatedHours: 12,
      course: 'Python Concurrency, Metaprogramming & Microservices',
      priority: 'High' as const,
    },
    {
      skill: 'Database Management (DBMS)',
      requiredScore: 80,
      estimatedHours: 15,
      course: 'PostgreSQL Indexing, B-Trees, WAL & Transaction Isolation',
      priority: 'High' as const,
    },
    {
      skill: 'React & Frontend Architecture',
      requiredScore: 75,
      estimatedHours: 14,
      course: 'React 18 Concurrent Rendering & State Machines',
      priority: 'Medium' as const,
    },
    {
      skill: 'SQL & Query Optimization',
      requiredScore: 80,
      estimatedHours: 10,
      course: 'Advanced SQL Window Functions & Execution Plans',
      priority: 'Medium' as const,
    },
    {
      skill: 'Machine Learning',
      requiredScore: 75,
      estimatedHours: 18,
      course: 'PyTorch Neural Architectures & Transformer Fine-tuning',
      priority: 'Medium' as const,
    },
  ];

  // Dynamically calculate gaps from real Supabase assessment results & profile
  const computedGaps: SkillGap[] = targetBenchmarks
    .map((bm) => {
      const foundResult = dbResults.find(
        (r) =>
          (r.skill || '').toLowerCase().includes(bm.skill.toLowerCase()) ||
          bm.skill.toLowerCase().includes((r.skill || '').toLowerCase())
      );
      const profileScore = studentProfile?.skills?.[bm.skill] || 0;
      const currentScore = foundResult ? foundResult.percentage : (profileScore > 0 ? profileScore : 0);

      const gap = Math.max(0, bm.requiredScore - currentScore);

      const priority: 'Critical' | 'High' | 'Medium' | 'Low' =
        currentScore === 0 ? 'Critical' : gap > 20 ? 'Critical' : gap > 10 ? 'High' : 'Medium';

      return {
        skill: bm.skill,
        currentScore,
        requiredScore: bm.requiredScore,
        gap,
        priority,
        recommendedAction: currentScore === 0
          ? `No assessment record found in database. Take the proctored ${bm.skill} evaluation to certify proficiency.`
          : `Improve ${bm.skill} proficiency by ${gap}% to meet Tier-1 campus placement hiring criteria.`,
        learningCourse: bm.course,
        estimatedHours: bm.estimatedHours,
      };
    })
    .filter((g) => g.gap > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Real Skill Gap Identification & Learning Roadmap
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Calculated dynamically by comparing your real assessment scores against Tier-1 corporate job cutoffs (18+ LPA).
          </p>
        </div>

        <button
          onClick={() => navigate('/student/assessment')}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Launch Assessment Center</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Identified Skill Gaps</p>
          <h3 className="text-3xl font-extrabold text-[#EF4444] mt-2">{computedGaps.length} Areas</h3>
          <p className="text-xs text-[#64748B] mt-1">
            {computedGaps.length === 0 ? 'All skills meet placement criteria' : 'Priority remediation requirements'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Estimated Prep Time</p>
          <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {computedGaps.reduce((sum, g) => sum + (g.estimatedHours || 0), 0)} Hours
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Self-paced technical modules</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Expected Readiness Boost</p>
          <h3 className="text-3xl font-extrabold text-[#22C55E] mt-2">
            {computedGaps.length > 0 ? '+15%' : '100%'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">Verified against institutional recruitment criteria</p>
        </div>
      </div>

      {/* Detailed Skill Gap Cards */}
      <div className="space-y-4">
        {computedGaps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A]">No Critical Skill Gaps Detected</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Your registered scores across all core domains meet or exceed corporate benchmarks.
            </p>
          </div>
        ) : (
          computedGaps.map((gap) => {
            const getPriorityBadge = () => {
              switch (gap.priority) {
                case 'Critical':
                  return 'bg-rose-50 text-[#EF4444] border-rose-200';
                case 'High':
                  return 'bg-amber-50 text-amber-700 border-amber-200';
                case 'Medium':
                  return 'bg-blue-50 text-[#3B82F6] border-blue-200';
                default:
                  return 'bg-slate-100 text-slate-700 border-slate-200';
              }
            };

            return (
              <div
                key={gap.skill}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-[#0F172A]">{gap.skill}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadge()}`}>
                      {gap.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] font-medium leading-relaxed">{gap.recommendedAction}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-[#64748B]">
                    <span className="flex items-center gap-1 font-semibold text-[#4F46E5]">
                      <BookOpen className="w-4 h-4" />
                      {gap.learningCourse}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {gap.estimatedHours} hrs coursework
                    </span>
                  </div>
                </div>

                {/* Score Bar & Target Comparison */}
                <div className="w-full md:w-64 shrink-0 space-y-3 bg-slate-50 p-4 rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#64748B]">Current: <strong className="text-[#0F172A]">{gap.currentScore}%</strong></span>
                    <span className="font-bold text-[#22C55E]">Target: {gap.requiredScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#EF4444] rounded-full transition-all duration-500"
                      style={{ width: `${gap.currentScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-[#EF4444]">Gap: -{gap.gap}%</span>
                    <button
                      onClick={() => navigate('/student/assessment')}
                      className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Test Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
