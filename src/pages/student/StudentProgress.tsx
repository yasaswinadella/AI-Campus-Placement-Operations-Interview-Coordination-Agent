import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { StudentAssessmentResult } from '../../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Target,
  ArrowRight,
  BrainCircuit,
  Layers,
  FileCheck,
  FileQuestion,
  UserCheck,
} from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const { studentProfile, studentAssessmentResults = [], applications = [], interviews = [] } = useData();
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

  const history = dbResults.length > 0 ? dbResults : studentAssessmentResults;

  // Real Metric Calculations
  const testsCount = history.length;
  const averageScore = testsCount > 0 ? Math.round(history.reduce((sum, r) => sum + r.percentage, 0) / testsCount) : 0;
  const highestScore = testsCount > 0 ? Math.max(...history.map((r) => r.percentage)) : 0;
  const appsCount = applications.length;

  // Dynamic Milestones Evaluated from Real Supabase State
  const milestones = [
    {
      title: 'Student Academic Profile Setup',
      done: Boolean(studentProfile?.name && studentProfile?.cgpa),
      detail: studentProfile?.cgpa ? `CGPA: ${studentProfile.cgpa} • ${studentProfile.branch || 'Engineering'}` : 'Incomplete',
    },
    {
      title: 'Resume & Portfolio Linked',
      done: Boolean(studentProfile?.resumeUrl || studentProfile?.portfolio),
      detail: studentProfile?.resumeUrl ? 'Verified Document on File' : 'Pending Upload',
    },
    {
      title: 'First Proctored Self-Assessment Completed',
      done: testsCount > 0,
      detail: testsCount > 0 ? `${testsCount} Assessment(s) Recorded in Database` : '0 Tests Taken',
    },
    {
      title: 'Excellence Benchmark (Score >= 80%)',
      done: highestScore >= 80,
      detail: highestScore >= 80 ? `Top Score: ${highestScore}%` : (testsCount > 0 ? `Current Top: ${highestScore}%` : 'Pending Assessment'),
    },
    {
      title: 'Placement Applications Transmitted',
      done: appsCount > 0,
      detail: appsCount > 0 ? `${appsCount} Corporate Application(s) Active` : '0 Applications Submitted',
    },
    {
      title: 'Interview Round Scheduled',
      done: interviews.length > 0,
      detail: interviews.length > 0 ? `${interviews.length} Scheduled Session(s)` : 'Awaiting Shortlist',
    },
  ];

  const clearedCount = milestones.filter((m) => m.done).length;
  const progressPercent = Math.round((clearedCount / milestones.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Real Career Growth & Placement Pathway Analytics
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Live progression metrics computed dynamically from your database records, test transcripts, and job applications.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/assessment')}
          className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Take New Assessment</span>
        </button>
      </div>

      {/* Hero Stat Cards based on Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Real Tests Taken</p>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">{testsCount}</h3>
          <p className="text-xs text-[#64748B] mt-1">Proctored examination attempts</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Average Verified Score</p>
          <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {testsCount > 0 ? `${averageScore}%` : '0%'}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {testsCount > 0 ? `Highest: ${highestScore}%` : 'Take tests to compute average'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Active Applications</p>
          <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">{appsCount}</h3>
          <p className="text-xs text-[#64748B] mt-1">Transmitted to corporate portals</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <p className="text-xs font-semibold uppercase text-[#64748B]">Pathway Readiness</p>
          <h3 className="text-3xl font-extrabold text-[#22C55E] mt-2">{progressPercent}%</h3>
          <p className="text-xs text-[#64748B] mt-1">{clearedCount} of {milestones.length} milestones cleared</p>
        </div>
      </div>

      {/* Real Chronological Assessment Growth Timeline */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Real Assessment Performance Trajectory</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Chronological record of verified tests evaluated in database</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600">{history.length} Total Submissions</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <FileQuestion className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-semibold">No assessment transcripts recorded yet.</p>
            <button
              onClick={() => navigate('/student/assessment')}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Take Your First Test
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((res, idx) => (
              <div
                key={res.id || idx}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0F172A]">{res.skill} Self Assessment</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {res.status || 'Evaluated'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Date: {res.date} • Duration: {res.timeTakenMinutes} mins • MCQ: {res.mcqScore}/100
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B]">Score</span>
                    <p className="text-base font-extrabold text-[#4F46E5]">{res.percentage}%</p>
                  </div>
                  <button
                    onClick={() => navigate('/student/results')}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-indigo-600 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    View Transcript
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placement Preparation Checklist from Real Data */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F172A]">Placement Readiness Milestones</h3>

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
                <div>
                  <span className={`text-xs font-bold ${m.done ? 'text-[#0F172A]' : 'text-slate-500'}`}>
                    {m.title}
                  </span>
                  <p className="text-[11px] text-[#64748B]">{m.detail}</p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  m.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {m.done ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
