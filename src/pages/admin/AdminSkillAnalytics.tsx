import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BrainCircuit,
  TrendingUp,
  BarChart3,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminSkillAnalytics: React.FC = () => {
  const { students } = useData();

  const domainAnalytics = [
    { skill: 'Python Programming', campusAverage: 88, marketBenchmark: 75, status: 'EXCEEDS_INDUSTRY', studentsEvaluated: 420 },
    { skill: 'Data Structures & Algorithms', campusAverage: 82, marketBenchmark: 78, status: 'EXCEEDS_INDUSTRY', studentsEvaluated: 390 },
    { skill: 'React & Frontend Architecture', campusAverage: 85, marketBenchmark: 70, status: 'EXCEEDS_INDUSTRY', studentsEvaluated: 310 },
    { skill: 'SQL & Database Optimization', campusAverage: 80, marketBenchmark: 75, status: 'ALIGNED', studentsEvaluated: 360 },
    { skill: 'Cloud & DevOps (Docker/AWS)', campusAverage: 64, marketBenchmark: 75, status: 'NEEDS_FOCUS', studentsEvaluated: 240 },
    { skill: 'System Design & Scalability', campusAverage: 68, marketBenchmark: 80, status: 'NEEDS_FOCUS', studentsEvaluated: 280 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Campus Skill Analytics & Curriculum Intelligence
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Aggregated technical competencies evaluated against Fortune 500 corporate hiring cutoffs.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Batch Average Skill Score</span>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">81.4%</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+7.2% higher than National University Average</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Primary Campus Strength</span>
          <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2">Python & Algorithms</h3>
          <p className="text-xs text-[#64748B] mt-1">88% average score across 420 candidates</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Curriculum Intervention</span>
          <h3 className="text-2xl font-extrabold text-[#EF4444] mt-2">Cloud & DevOps</h3>
          <p className="text-xs text-[#64748B] mt-1">Specialized workshop scheduled for next term</p>
        </div>
      </div>

      {/* Domain Proficiency Grid */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
          Departmental Skill vs Recruiter Requirement Benchmark
        </h3>

        <div className="space-y-5">
          {domainAnalytics.map((item) => (
            <div
              key={item.skill}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="w-full md:w-60 shrink-0">
                <span className="font-bold text-sm text-[#0F172A] block">{item.skill}</span>
                <span className="text-[11px] text-[#64748B]">{item.studentsEvaluated} students tested</span>
              </div>

              <div className="flex-1 w-full space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#4F46E5]">Campus Average: {item.campusAverage}%</span>
                  <span className="text-[#64748B]">Industry Threshold: {item.marketBenchmark}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${
                      item.status === 'EXCEEDS_INDUSTRY'
                        ? 'bg-[#22C55E]'
                        : item.status === 'ALIGNED'
                        ? 'bg-[#4F46E5]'
                        : 'bg-[#EF4444]'
                    }`}
                    style={{ width: `${item.campusAverage}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0">
                {item.status === 'EXCEEDS_INDUSTRY' ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                    Tier-1 Ready
                  </span>
                ) : item.status === 'ALIGNED' ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                    Industry Parity
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#EF4444] border border-rose-200">
                    Remediation Required
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
