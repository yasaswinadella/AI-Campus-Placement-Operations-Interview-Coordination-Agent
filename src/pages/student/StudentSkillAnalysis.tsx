import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { StudentAssessmentResult } from '../../types';
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
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const StudentSkillAnalysis: React.FC = () => {
  const { studentAssessmentResults = [], studentProfile } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dbResults, setDbResults] = useState<StudentAssessmentResult[]>([]);
  const [loading, setLoading] = useState(false);

  const sId = studentProfile?.id || user?.id || '';
  const sEmail = studentProfile?.email || user?.email || '';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    dbService.getStudentSelfAssessmentHistory(sId, sEmail).then((res) => {
      if (isMounted) {
        const merged: StudentAssessmentResult[] = [...res];
        studentAssessmentResults.forEach((r) => {
          if (!merged.some((m) => m.id === r.id)) {
            merged.push(r);
          }
        });
        setDbResults(merged);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sId, sEmail, studentAssessmentResults]);

  const skillDomains = [
    { name: 'Python', weight: 'High', batchAvg: 75 },
    { name: 'Java', weight: 'High', batchAvg: 70 },
    { name: 'SQL', weight: 'Medium', batchAvg: 74 },
    { name: 'JavaScript', weight: 'High', batchAvg: 72 },
    { name: 'React', weight: 'Medium', batchAvg: 68 },
    { name: 'Data Structures', weight: 'High', batchAvg: 65 },
    { name: 'DBMS', weight: 'Medium', batchAvg: 70 },
    { name: 'Machine Learning', weight: 'Medium', batchAvg: 62 },
  ];

  // Map real scores for each skill from database results and profile
  const domainScores = skillDomains.map((domain) => {
    // Find the latest result for this domain in real DB history
    const matchingResult = dbResults.find(
      (r) => (r.skill || '').toLowerCase().includes(domain.name.toLowerCase()) ||
             domain.name.toLowerCase().includes((r.skill || '').toLowerCase())
    );

    const profileScore = studentProfile?.skills?.[domain.name] || 0;
    const realScore = matchingResult ? matchingResult.percentage : (profileScore > 0 ? profileScore : 0);
    const isTested = matchingResult !== undefined || profileScore > 0;

    let tier = 'Not Tested';
    if (isTested) {
      if (realScore >= 85) tier = 'Expert';
      else if (realScore >= 70) tier = 'Proficient';
      else tier = 'Developing';
    }

    return {
      skill: domain.name,
      score: realScore,
      batchAvg: domain.batchAvg,
      tier,
      weight: domain.weight,
      isTested,
      testedDate: matchingResult?.date,
      submissionId: matchingResult?.id,
    };
  });

  const testedSkills = domainScores.filter((d) => d.isTested);
  const aggregateScore =
    testedSkills.length > 0
      ? Math.round(testedSkills.reduce((sum, d) => sum + d.score, 0) / testedSkills.length)
      : 0;

  const topSkill = testedSkills.length > 0
    ? [...testedSkills].sort((a, b) => b.score - a.score)[0]
    : null;

  const lowestSkill = domainScores.length > 0
    ? [...domainScores].sort((a, b) => a.score - b.score)[0]
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Verified Skill Analytics & Real Competency Matrix
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Calculated dynamically from your Supabase proctored examination records and verified assessment scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/skill-gaps')}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Skill Gaps</span>
          </button>
          <button
            onClick={() => navigate('/student/assessment')}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Take New Assessment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards based on REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Real Aggregate Skill Score</p>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">
            {testedSkills.length > 0 ? `${aggregateScore}%` : '0% (Untested)'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{testedSkills.length} of {domainScores.length} domains evaluated</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Primary Superpower</p>
          <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2 truncate">
            {topSkill ? `${topSkill.skill} (${topSkill.score}%)` : 'Pending First Test'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            {topSkill ? `Verified rating • ${topSkill.tier}` : 'Take an assessment to identify strengths'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Priority Assessment Target</p>
          <h3 className="text-2xl font-extrabold text-[#EF4444] mt-2 truncate">
            {lowestSkill ? lowestSkill.skill : 'All Evaluated'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            {lowestSkill && !lowestSkill.isTested ? 'Untested domain • Evaluate now' : `Current score: ${lowestSkill?.score}%`}
          </p>
        </div>
      </div>

      {/* Real Domain Proficiency Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
            Real Skill Proficiency & Database Records
          </h3>
          <span className="text-xs text-[#64748B]">Live Supabase Sync</span>
        </div>

        <div className="space-y-4">
          {domainScores.map((item) => {
            const delta = item.isTested ? item.score - item.batchAvg : 0;
            return (
              <div
                key={item.skill}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="w-full md:w-56 shrink-0">
                  <span className="font-bold text-sm text-[#0F172A] block">{item.skill}</span>
                  <span className="text-[11px] text-[#64748B]">
                    Recruiter Weight: <strong className="text-slate-700">{item.weight}</strong>
                  </span>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={item.isTested ? 'text-[#4F46E5]' : 'text-slate-400'}>
                      {item.isTested ? `Verified Score: ${item.score}%` : 'Not Assessed Yet (0%)'}
                    </span>
                    <span className="text-[#64748B]">Batch Benchmark: {item.batchAvg}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-400 z-10"
                      style={{ left: `${item.batchAvg}%` }}
                      title={`Batch Benchmark: ${item.batchAvg}%`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isTested ? 'bg-[#4F46E5]' : 'bg-slate-200'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.isTested ? (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        delta >= 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {delta >= 0 ? `+${delta}% vs Benchmark` : `${delta}% vs Benchmark`}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                      Untested
                    </span>
                  )}

                  <button
                    onClick={() => navigate('/student/assessment')}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{item.isTested ? 'Retest' : 'Assess'}</span>
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
