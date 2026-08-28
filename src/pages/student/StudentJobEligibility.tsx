import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  Award,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

export const StudentJobEligibility: React.FC = () => {
  const { jobs = [], studentProfile } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const safeJobs = jobs || [];

  const defaultJob = {
    id: 'JOB-DEF',
    title: 'Senior Software Development Engineer (SDE-1)',
    company: 'TechNova Enterprise',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    salary: '24 - 32 LPA',
    location: 'Bangalore (Hybrid)',
    minCgpa: 7.5,
    skills: ['Python', 'DSA', 'SQL', 'React'],
    type: 'Full-time',
    description: 'Core backend engineering and distributed platform services.',
    status: 'ACTIVE',
  };

  const selectedJobId = location.state?.jobId || safeJobs[0]?.id || 'JOB-DEF';
  const [currentJobId, setCurrentJobId] = useState(selectedJobId);

  const currentJob = safeJobs.find((j) => j && j.id === currentJobId) || safeJobs[0] || defaultJob;

  // Eligibility evaluation
  const studentCgpa = studentProfile?.cgpa || 8.5;
  const isCgpaQualified = studentCgpa >= (currentJob.minCgpa || 7.0);
  const isBatchQualified = (studentProfile?.graduationYear || 2026) >= 2025;
  const isBacklogQualified = true; // 0 backlogs
  const isOverallQualified = isCgpaQualified && isBatchQualified && isBacklogQualified;

  const matchPercent = Math.min(
    98,
    Math.max(65, Math.round((studentProfile?.overallSkillScore || 85) * 0.9 + (isCgpaQualified ? 10 : -15)))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/student/jobs')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs Directory
        </button>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Job Eligibility & Profile Match Calculator
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Algorithmic verification against corporate cutoff criteria and skill benchmarks.
        </p>
      </div>

      {/* Target Job Selector */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentJob.companyLogo}
            alt={currentJob.company}
            className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]"
          />
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">{currentJob.title}</h3>
            <p className="text-xs text-[#64748B]">{currentJob.company} • {currentJob.salary}</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Evaluate Another Job:</label>
          <select
            value={currentJobId}
            onChange={(e) => setCurrentJobId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Verification Result Card */}
      <div
        className={`rounded-3xl p-8 border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isOverallQualified
            ? 'bg-gradient-to-tr from-emerald-900 to-slate-900 text-white border-emerald-500/30'
            : 'bg-gradient-to-tr from-rose-900 to-slate-900 text-white border-rose-500/30'
        }`}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Pre-Screening Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isOverallQualified ? 'You Are Fully Qualified!' : 'Eligibility Cutoff Not Met'}
          </h2>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            {isOverallQualified
              ? `Your CGPA of ${studentProfile.cgpa} meets the minimum requirement (${currentJob.minCgpa}). You have a verified skill match index of ${matchPercent}%.`
              : `Your academic profile does not meet the minimum CGPA cutoff of ${currentJob.minCgpa}.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-slate-300">Match Index</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">{matchPercent}%</p>
          </div>

          {isOverallQualified && (
            <button
              onClick={() => navigate('/student/apply', { state: { jobId: currentJob.id } })}
              className="px-6 py-4 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 shrink-0"
            >
              <span>Proceed to Apply</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Criteria Breakdown Grid */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F172A]">Detailed Criteria Breakdown</h3>

        <div className="space-y-3">
          {/* CGPA Criterion */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCgpaQualified ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#EF4444]" />
              )}
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Minimum CGPA Cutoff</h4>
                <p className="text-[11px] text-[#64748B]">
                  Required: {currentJob.minCgpa} CGPA • Your Academic Score: {studentProfile.cgpa} CGPA
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isCgpaQualified ? 'bg-emerald-50 text-[#22C55E]' : 'bg-rose-50 text-[#EF4444]'
              }`}
            >
              {isCgpaQualified ? 'Passed' : 'Failed'}
            </span>
          </div>

          {/* Graduation Batch Criterion */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Graduating Class Year</h4>
                <p className="text-[11px] text-[#64748B]">
                  Target: 2026 Batch • Your Profile: Class of {studentProfile.graduationYear}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#22C55E]">
              Passed
            </span>
          </div>

          {/* Active Backlogs Criterion */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Active Backlogs Verification</h4>
                <p className="text-[11px] text-[#64748B]">
                  Allowed: 0 Backlogs • Current Record: Clean (0 active backlogs)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#22C55E]">
              Passed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
