import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ScheduleInterviewModal } from '../../components/ui/ScheduleInterviewModal';
import {
  User,
  GraduationCap,
  Award,
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Send,
  Link as LinkIcon,
  ChevronLeft,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const HrApplicantDetail: React.FC = () => {
  const { applications, students, updateApplicationStatus, showToast } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const applicationId = location.state?.applicationId || applications[0]?.id;
  const currentApp = applications.find((a) => a.id === applicationId) || applications[0];
  const candidate = students.find((s) => s.id === currentApp.studentId) || students[0];

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState(
    'Candidate demonstrates high technical aptitude in Python, System Architecture, and React. Verified 98th percentile score in campus assessments.'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/hr/applicants')}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All Applicants
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">{candidate.name}</h1>
            <StatusBadge status={currentApp.status} />
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Application #{currentApp.id} • Applied for <strong className="text-[#0F172A]">{currentApp.jobTitle}</strong> on {currentApp.appliedDate}
          </p>
        </div>

        {/* Evaluation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentApp.status === 'APPLIED' && (
            <button
              onClick={() => {
                updateApplicationStatus(currentApp.id, 'SHORTLISTED');
                showToast('Shortlisted', `${candidate.name} shortlisted for ${currentApp.jobTitle}.`);
              }}
              className="px-4 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Shortlist Candidate</span>
            </button>
          )}

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>

          {currentApp.status !== 'OFFERED' && (
            <button
              onClick={() => {
                updateApplicationStatus(currentApp.id, 'OFFERED');
                showToast('Offer Extended', `Official campus offer extended to ${candidate.name}!`);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Extend Job Offer</span>
            </button>
          )}

          {currentApp.status !== 'REJECTED' && (
            <button
              onClick={() => {
                updateApplicationStatus(currentApp.id, 'REJECTED');
                showToast('Application Closed', `${candidate.name}'s application updated.`);
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {/* Candidate Overview Hero */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#4F46E5] font-extrabold text-2xl flex items-center justify-center border border-indigo-100 shrink-0">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">{candidate.name}</h2>
              <p className="text-xs text-[#64748B] mt-0.5">{candidate.email} • {candidate.college}</p>
              <p className="text-xs font-semibold text-[#4F46E5] mt-1">
                {candidate.branch} • Class of {candidate.graduationYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0]">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">CGPA</span>
              <p className="text-2xl font-extrabold text-[#4F46E5] mt-0.5">{candidate.cgpa}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Skill Index</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{candidate.overallSkillScore}%</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Match</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-0.5">{currentApp.matchScore}%</p>
            </div>
          </div>
        </div>

        {/* Verified Skill Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            Verified Technical Assessment Transcripts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(candidate.skills).map(([skill, score]) => (
              <div key={skill} className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                  <span>{skill}</span>
                  <span className="text-[#4F46E5] font-bold">{score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statement of Purpose / Cover Letter */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-[#0F172A]">Candidate Cover Letter / Bio</h3>
          <p className="text-xs text-[#64748B] bg-slate-50 p-4 rounded-xl border border-[#E2E8F0] leading-relaxed">
            {currentApp.coverLetter || candidate.bio || 'Candidate profile attached with full portfolio and verified academic transcript.'}
          </p>
        </div>

        {/* AI Candidate Intelligence & Interview Questions */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white border border-indigo-500/20 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">AI Candidate Neural Assessment & Interview Questions</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              {currentApp.matchScore >= 80 ? 'Highly Recommended for Technical Round' : 'Qualified Candidate'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="font-bold text-indigo-300 text-[11px] block">🎯 Key Strengths & Signal</span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                <li>Strong academic consistency with {candidate.cgpa} CGPA in {candidate.branch}.</li>
                <li>Proven capability in algorithmic logic & modern software frameworks.</li>
                <li>High career readiness score ({candidate.careerReadiness || 85}%) based on benchmark tests.</li>
              </ul>
            </div>

            <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="font-bold text-indigo-300 text-[11px] block">💡 Recommended Interview Questions for {currentApp.jobTitle}</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>1. <em>"How would you architect a high-throughput cache for this {currentApp.jobTitle} stack?"</em></li>
                <li>2. <em>"Walk me through a complex algorithmic bug you encountered and resolved."</em></li>
                <li>3. <em>"Explain your approach to database concurrency and transaction isolation."</em></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Internal Recruiter Notes */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-[#0F172A]">Internal Recruitment Evaluation Notes</h3>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultStudentId={candidate.id}
        defaultJobId={currentApp.jobId}
      />
    </div>
  );
};
