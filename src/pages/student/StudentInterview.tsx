import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const StudentInterview: React.FC = () => {
  const { interviews, studentProfile } = useData();
  const navigate = useNavigate();

  const myInterviews = interviews.filter((i) => i.studentId === studentProfile.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Campus Placement Interview Sessions
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Confirmed video conference links, executive panel briefs, and AI interview prep checklists.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/applications')}
          className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors"
        >
          View All Applications
        </button>
      </div>

      {/* Scheduled Interviews List */}
      <div className="space-y-6">
        {myInterviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A]">No Interviews Scheduled</h3>
            <p className="text-xs text-[#64748B] mt-1 mb-4">
              When recruiters shortlist your profile, video call links will appear here.
            </p>
            <button
              onClick={() => navigate('/student/jobs')}
              className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-xl"
            >
              Explore Job Openings
            </button>
          </div>
        ) : (
          myInterviews.map((intv) => (
            <div
              key={intv.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#0F172A]">{intv.company}</h3>
                    <StatusBadge status={intv.status} />
                  </div>
                  <p className="text-xs font-semibold text-[#64748B]">
                    {intv.jobTitle} • <strong className="text-[#4F46E5]">{intv.round}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={intv.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Google Meet / Zoom</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Timing & Panel Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-[#4F46E5]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold">Interview Date</span>
                    <p className="text-xs font-bold text-[#0F172A] mt-0.5">{intv.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-[#22C55E]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold">Session Slot</span>
                    <p className="text-xs font-bold text-[#0F172A] mt-0.5">{intv.time} (IST)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold">Interviewer Panel</span>
                    <p className="text-xs font-bold text-[#0F172A] mt-0.5">{intv.interviewerName}</p>
                  </div>
                </div>
              </div>

              {/* Instructions & Notes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                  Instructions & Preparation Advice
                </h4>
                <p className="text-xs text-[#64748B] bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100/60 leading-relaxed">
                  {intv.notes ||
                    'Please have your camera turned on, code editor prepared with TypeScript / Python environment, and be ready to explain the architecture of your recent capstone projects.'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Interview Tips Box */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#4F46E5]" />
          Key Interview Success Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#0F172A]">1. Think Out Loud</h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Recruiters evaluate your problem-solving decomposition method, time complexity estimation, and edge case handling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#0F172A]">2. Star Method for Behavioral</h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Structure situational questions into Situation, Task, Action, and Result to demonstrate ownership.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#0F172A]">3. Ask Strategic Questions</h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Inquire about engineering culture, deployment cadence, and tech debt management at the end of the round.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
