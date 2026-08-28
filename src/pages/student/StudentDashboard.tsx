import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  FileCheck2,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { studentProfile, applications, interviews, aiJobSuggestions } = useData();
  const navigate = useNavigate();

  const sId = studentProfile?.id || '';
  const safeApps = applications || [];
  const safeInterviews = interviews || [];

  const activeApplications = safeApps.filter((a) => a && (a.studentId === sId || !sId));
  const upcomingInterviews = safeInterviews.filter(
    (i) => i && (i.studentId === sId || !sId) && i.status === 'SCHEDULED'
  );
  const shortlistedCount = activeApplications.filter((a) => a && (a.status === 'SHORTLISTED' || a.status === 'SELECTED' || a.status === 'OFFERED')).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">Total Applications</p>
          <h3 className="text-2xl font-bold mt-1 text-[#0F172A]">{activeApplications.length}</h3>
          <p className="text-[#22C55E] text-[10px] font-bold mt-2">↑ 4 from last week</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">Active Interviews</p>
          <h3 className="text-2xl font-bold mt-1 text-[#3B82F6]">{upcomingInterviews.length}</h3>
          <p className="text-[#64748B] text-[10px] font-medium mt-2">
            {upcomingInterviews[0] ? `Next: ${upcomingInterviews[0].company} (${upcomingInterviews[0].date})` : 'Next: Oracle (Tomorrow)'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">Shortlisted</p>
          <h3 className="text-2xl font-bold mt-1 text-[#22C55E]">{shortlistedCount}</h3>
          <p className="text-[#64748B] text-[10px] font-medium mt-2">
            {activeApplications.length > 0 ? `${Math.round((shortlistedCount / activeApplications.length) * 100)}% Conversion rate` : '33.3% Conversion rate'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">Average Skill Score</p>
          <h3 className="text-2xl font-bold mt-1 text-[#4F46E5]">{studentProfile.overallSkillScore * 10 || 785}</h3>
          <p className="text-[#64748B] text-[10px] font-medium mt-2">Top 10% of campus</p>
        </div>
      </div>

      {/* Main 2-Column Split: Recent Applications + Upcoming Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <h4 className="font-bold text-sm text-[#0F172A]">Recent Applications</h4>
            <button
              onClick={() => navigate('/student/applications')}
              className="text-[#4F46E5] text-xs font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-6 py-2.5 text-[10px] uppercase font-bold text-[#64748B]">Company</th>
                  <th className="px-6 py-2.5 text-[10px] uppercase font-bold text-[#64748B]">Role</th>
                  <th className="px-6 py-2.5 text-[10px] uppercase font-bold text-[#64748B]">Status</th>
                  <th className="px-6 py-2.5 text-[10px] uppercase font-bold text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#F1F5F9]">
                {activeApplications.slice(0, 4).map((app) => (
                  <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-[#0F172A]">{app.company}</td>
                    <td className="px-6 py-3.5 text-[#64748B]">{app.role}</td>
                    <td className="px-6 py-3.5">
                      {app.status === 'INTERVIEW' ? (
                        <span className="bg-[#DBEAFE] text-[#1E40AF] px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                          INTERVIEWING
                        </span>
                      ) : app.status === 'SHORTLISTED' || app.status === 'SELECTED' || app.status === 'OFFERED' ? (
                        <span className="bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                          SHORTLISTED
                        </span>
                      ) : (
                        <span className="bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                          APPLIED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => navigate('/student/applications')}
                        className="text-[#4F46E5] font-bold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Assessment Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-[#E2E8F0]">
            <h4 className="font-bold text-sm text-[#0F172A]">Upcoming Assessment</h4>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-[#F5F3FF] rounded-full flex items-center justify-center text-[#4F46E5] mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <p className="text-xs font-bold text-[#0F172A]">Python Advanced & System Architecture</p>
            <p className="text-[10px] text-[#64748B] mt-1">Scheduled for Today, 4:00 PM • 30 mins</p>
            <button
              onClick={() => navigate('/student/assessment')}
              className="w-full mt-4 bg-[#0F172A] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-black transition-colors shadow-sm"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>

      {/* AI Career Path Suggestion Hero Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg text-white">
        <div>
          <h4 className="text-white font-bold text-lg">AI Career Path Suggestion</h4>
          <p className="text-[#C7D2FE] text-xs mt-1 max-w-xl">
            Based on your verified assessment scores in React (90%) and SQL (88%), we recommend focusing on Full-Stack and Cloud Architecture roles.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-[#4F46E5] text-white text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              Recommended: Cloud Engineer
            </span>
            <span className="bg-white/10 text-white text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              Match Score: 94%
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/student/skill-analysis')}
          className="bg-white text-[#1E1B4B] px-6 py-2.5 rounded-lg text-sm font-bold shadow-xl hover:bg-[#F8FAFC] transition-all shrink-0 hover:scale-105 active:scale-95"
        >
          Analyze Skills
        </button>
      </div>

      {/* Verified Skills Matrix & AI Suggested Openings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Proficiency Matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#4F46E5]" />
                Skill Proficiency Matrix
              </h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                Evaluated benchmarks across technical domains
              </p>
            </div>
            <button
              onClick={() => navigate('/student/skill-analysis')}
              className="text-xs font-semibold text-[#4F46E5] hover:underline"
            >
              Deep Analysis
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(studentProfile.skills).map(([skill, rawScore]) => {
              const score = Number(rawScore);
              return (
                <div
                  key={skill}
                  className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                    <span>{skill}</span>
                    <span className="text-[#4F46E5] font-bold">{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 85
                          ? 'bg-[#22C55E]'
                          : score >= 75
                          ? 'bg-[#4F46E5]'
                          : score >= 60
                          ? 'bg-[#3B82F6]'
                          : 'bg-[#EF4444]'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-2 font-medium">
                    {score >= 85 ? 'Expert Tier' : score >= 75 ? 'Proficient' : 'Developing'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Job Matches List */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                Top AI Job Matches
              </h4>
              <button
                onClick={() => navigate('/student/ai-job-suggestions')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {aiJobSuggestions.slice(0, 2).map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#4F46E5]/40 hover:bg-[#F8FAFC] transition-all group cursor-pointer"
                  onClick={() => navigate('/student/jobs')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                      {job.role}
                    </span>
                    <span className="text-[10px] font-bold text-[#22C55E] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      {job.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{job.company} • {job.salary}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/student/jobs')}
            className="w-full mt-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore All Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

