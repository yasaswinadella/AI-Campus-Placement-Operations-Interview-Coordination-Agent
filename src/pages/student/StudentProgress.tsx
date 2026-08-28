import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Target,
  ArrowRight,
} from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const { studentProfile, assessments } = useData();
  const navigate = useNavigate();

  const semesterGrowth = [
    { sem: 'Semester 5 (Fall 2024)', score: 68, readiness: 62, milestone: 'Fundamentals & Data Structures' },
    { sem: 'Semester 6 (Spring 2025)', score: 78, readiness: 74, milestone: 'Full Stack & Database Design' },
    { sem: 'Semester 7 (Fall 2025)', score: 86, readiness: 84, milestone: 'System Design & Distributed Cloud' },
    { sem: 'Semester 8 (Current 2026)', score: studentProfile.overallSkillScore, readiness: studentProfile.careerReadiness, milestone: 'Campus Placement Season' },
  ];

  const milestones = [
    { title: 'Core Assessment Profile Verified', done: true, date: 'Completed Aug 2026' },
    { title: 'Resume ATS Score > 90/100', done: true, date: 'Completed Aug 2026' },
    { title: 'DSA Benchmark >= 85%', done: true, date: 'Completed Aug 2026' },
    { title: 'Attend Mock Technical Interview', done: true, date: 'Completed Aug 2026' },
    { title: 'Register for Tier-1 Placement Drives', done: true, date: 'Active' },
    { title: 'Clear Final Campus Round & Accept Offer', done: false, date: 'Pending Final Drive' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Placement Readiness & Growth Analytics
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Tracking your skill acceleration curve and academic readiness across 4 collegiate terms.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/assessment')}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors"
        >
          Take New Assessment
        </button>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Readiness Growth</p>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">+{studentProfile.careerReadiness - 62}%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Accelerated over past 3 semesters</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Current Career Readiness</p>
          <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">{studentProfile.careerReadiness}%</h3>
          <p className="text-xs text-[#64748B] mt-1">Top 8% in 2026 Batch</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Milestones Cleared</p>
          <h3 className="text-3xl font-extrabold text-[#22C55E] mt-2">5 of 6</h3>
          <p className="text-xs text-[#64748B] mt-1">83% Pathway Completion</p>
        </div>
      </div>

      {/* Semester Growth Progression */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#0F172A]">Semester Skill Trajectory</h3>

        <div className="space-y-4">
          {semesterGrowth.map((sem, idx) => (
            <div
              key={sem.sem}
              className="p-5 rounded-2xl border border-[#E2E8F0] bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#4F46E5] uppercase">{sem.sem}</span>
                <h4 className="text-sm font-bold text-[#0F172A]">{sem.milestone}</h4>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Skill Score</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">{sem.score}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Readiness Index</span>
                  <span className="text-sm font-extrabold text-[#22C55E]">{sem.readiness}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placement Preparation Checklist */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F172A]">Placement Readiness Checklist</h3>

        <div className="space-y-3">
          {milestones.map((m) => (
            <div
              key={m.title}
              className="p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    m.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold ${m.done ? 'text-[#0F172A]' : 'text-slate-500'}`}>
                  {m.title}
                </span>
              </div>
              <span className="text-xs text-[#64748B] font-medium">{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
