import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  BrainCircuit,
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const StudentSkillAnalysis: React.FC = () => {
  const { studentProfile } = useData();
  const navigate = useNavigate();

  const domainScores = [
    { skill: 'Python', score: studentProfile.skills['Python'] || 94, batchAvg: 76, tier: 'Expert', weight: 'High' },
    { skill: 'Data Structures & Algorithms', score: studentProfile.skills['DSA'] || 88, batchAvg: 68, tier: 'Proficient', weight: 'High' },
    { skill: 'React & Web Architecture', score: studentProfile.skills['React'] || 90, batchAvg: 72, tier: 'Expert', weight: 'Medium' },
    { skill: 'SQL & Query Optimization', score: studentProfile.skills['SQL'] || 82, batchAvg: 74, tier: 'Proficient', weight: 'Medium' },
    { skill: 'Database Management (DBMS)', score: studentProfile.skills['DBMS'] || 78, batchAvg: 65, tier: 'Proficient', weight: 'Medium' },
    { skill: 'Java & OOP Design', score: studentProfile.skills['Java'] || 80, batchAvg: 70, tier: 'Proficient', weight: 'Medium' },
    { skill: 'Quantitative Aptitude', score: studentProfile.skills['Aptitude'] || 85, batchAvg: 75, tier: 'Proficient', weight: 'Low' },
    { skill: 'Behavioral & Communication', score: studentProfile.skills['Communication'] || 90, batchAvg: 80, tier: 'Expert', weight: 'High' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Skill Analytics & Performance Benchmarking
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Comparative analysis evaluated against 1,200+ candidates in the 2026 campus placement drive.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/skill-gaps')}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          <span>View Skill Gaps & Roadmap</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Aggregate Skill Score</p>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">{studentProfile.overallSkillScore}%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% higher than batch average (68%)</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Primary Superpower</p>
          <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2">Python & Algorithms</h3>
          <p className="text-xs text-[#64748B] mt-1">94% score • 98th percentile rank</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Focus Recommendation</p>
          <h3 className="text-2xl font-extrabold text-[#EF4444] mt-2">DBMS Indexing</h3>
          <p className="text-xs text-[#64748B] mt-1">Recommended target: 85% for Tier-1 offers</p>
        </div>
      </div>

      {/* Domain Proficiency Deep Dive Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
        <h3 className="text-base font-bold text-[#0F172A] mb-5 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
          Detailed Domain Competency & Peer Comparison
        </h3>

        <div className="space-y-4">
          {domainScores.map((item) => {
            const delta = item.score - item.batchAvg;
            return (
              <div
                key={item.skill}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="w-full md:w-56 shrink-0">
                  <span className="font-bold text-sm text-[#0F172A] block">{item.skill}</span>
                  <span className="text-[11px] text-[#64748B]">Recruiter Weight: {item.weight}</span>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#4F46E5]">Your Score: {item.score}%</span>
                    <span className="text-[#64748B]">Batch Average: {item.batchAvg}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                    {/* Batch avg marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-400 z-10"
                      style={{ left: `${item.batchAvg}%` }}
                      title={`Batch Average: ${item.batchAvg}%`}
                    />
                    <div
                      className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                    +{delta}% vs Peer Group
                  </span>
                  <button
                    onClick={() => navigate('/student/assessment')}
                    className="p-2 text-[#64748B] hover:text-[#4F46E5] hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Retest Skill"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
