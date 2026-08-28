import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CreateJobModal } from '../../components/ui/CreateJobModal';
import { ScheduleInterviewModal } from '../../components/ui/ScheduleInterviewModal';
import {
  Briefcase,
  Users,
  Calendar,
  Award,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Video,
} from 'lucide-react';

export const HrDashboard: React.FC = () => {
  const { jobs, applications, interviews, students } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const safeJobs = jobs || [];
  const safeApps = applications || [];
  const safeInterviews = interviews || [];

  const activeJobs = safeJobs.filter((j) => j && j.status === 'ACTIVE');
  const shortlistedApps = safeApps.filter((a) => a && a.status === 'SHORTLISTED');
  const scheduledInterviews = safeInterviews.filter((i) => i && i.status === 'SCHEDULED');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Talent Acquisition Engine</span>
              {user?.companyId && (
                <span className="ml-1 px-2 py-0.5 rounded bg-white/20 text-white font-mono text-[11px]">
                  ID: {user.companyId}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Corporate HR Control Center
            </h1>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              Welcome, <strong className="text-white">{user?.name || 'Recruitment Lead'}</strong> (<span className="text-emerald-300 font-semibold">{user?.company || 'Enterprise Partner'}</span> • <span className="font-mono text-white/90">{user?.companyId || 'CMP001'}</span>). You have <strong className="text-white">{applications.length} candidate applications</strong> and <strong className="text-white">{scheduledInterviews.length} scheduled interviews</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateJobOpen(true)}
              className="px-5 py-3 rounded-xl bg-white text-[#4F46E5] font-bold text-xs shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Round</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          id="hr-stat-active-jobs"
          title="Active Job Postings"
          value={activeJobs.length}
          subtitle="4 campus drives open"
          icon={Briefcase}
          iconBgColor="bg-indigo-50"
          iconColor="text-[#4F46E5]"
        />
        <StatCard
          id="hr-stat-applicants"
          title="Total Candidate Pool"
          value={applications.length}
          subtitle="Across 2026 CS/IT Batch"
          change="+18 today"
          isPositive={true}
          icon={Users}
          iconBgColor="bg-emerald-50"
          iconColor="text-[#22C55E]"
        />
        <StatCard
          id="hr-stat-shortlisted"
          title="Shortlisted Talent"
          value={shortlistedApps.length}
          subtitle="CGPA > 8.0 & Skill > 85%"
          icon={Award}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          id="hr-stat-interviews"
          title="Interviews In Progress"
          value={scheduledInterviews.length}
          subtitle="Next session at 2:00 PM"
          icon={Calendar}
          iconBgColor="bg-blue-50"
          iconColor="text-[#3B82F6]"
        />
      </div>

      {/* Main Grid: Live Candidate Submissions & Interview Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Applicants Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Recent Candidate Applications</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Top-ranked applicants based on verified skill tests</p>
              </div>
              <button
                onClick={() => navigate('/hr/applicants')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                View all ({applications.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-[#E2E8F0] hover:bg-slate-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] font-bold text-sm flex items-center justify-center border border-indigo-100">
                      {app.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A]">{app.studentName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                          {app.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Applied for <strong className="text-[#0F172A]">{app.jobTitle}</strong> • {app.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <StatusBadge status={app.status} size="sm" />
                    <button
                      onClick={() => navigate('/hr/applicant-detail', { state: { applicationId: app.id } })}
                      className="px-3 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      Review Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Interview Schedule */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#0F172A]">Upcoming Interview Queue</h3>
              <button
                onClick={() => navigate('/hr/interview-management')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {scheduledInterviews.slice(0, 3).map((intv) => (
                <div key={intv.id} className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">{intv.studentName}</span>
                    <span className="text-[10px] font-bold bg-indigo-50 text-[#4F46E5] px-2 py-0.5 rounded">
                      {intv.round}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">{intv.jobTitle}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {intv.time} • {intv.date}
                    </span>
                    <a
                      href={intv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
                    >
                      <span>Join Call</span>
                      <Video className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateJobModal isOpen={isCreateJobOpen} onClose={() => setIsCreateJobOpen(false)} />
      <ScheduleInterviewModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
};
