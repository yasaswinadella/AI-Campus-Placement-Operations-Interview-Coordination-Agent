import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Send,
  FileText,
  CheckCircle2,
  Building2,
  Briefcase,
  Upload,
  Link as LinkIcon,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

export const StudentApply: React.FC = () => {
  const { jobs = [], studentProfile, applyJob, applications = [] } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const safeJobs = jobs || [];
  const safeApps = applications || [];

  const defaultJob = {
    id: 'JOB-101',
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

  const defaultJobId = location.state?.jobId || safeJobs[0]?.id || 'JOB-101';
  const [jobId, setJobId] = useState(defaultJobId);
  const [coverLetter, setCoverLetter] = useState(
    'I am excited to submit my candidacy for this position. My hands-on experience building distributed systems, full-stack React web apps, and algorithmic pipelines makes me a strong fit for your team.'
  );
  const [resumeFileName, setResumeFileName] = useState(studentProfile?.resumeFileName || 'Student_Resume_2026.pdf');
  const [portfolioUrl, setPortfolioUrl] = useState(studentProfile?.portfolio || 'https://github.com/student');
  const [linkedinUrl, setLinkedinUrl] = useState(studentProfile?.linkedin || 'https://linkedin.com/in/student');
  const [notes, setNotes] = useState('Available for immediate virtual technical rounds and campus interviews.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentJob = safeJobs.find((j) => j && j.id === jobId) || safeJobs[0] || defaultJob;
  const sId = studentProfile?.id || '';
  const alreadyApplied = safeApps.some((a) => a && a.jobId === jobId && (a.studentId === sId || !sId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = applyJob(jobId, {
      coverLetter,
      portfolioUrl,
      linkedinUrl,
      notes,
    });

    setIsSubmitting(false);

    if (success) {
      navigate('/student/applications');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/student/jobs')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </button>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Submit Placement Application
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Your verified skill transcript and academic credentials will be attached automatically.
        </p>
      </div>

      {/* Target Role Selector Banner */}
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

        <div className="w-full sm:w-60">
          <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Applying For:</label>
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
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

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        {/* Pre-filled Verified Candidate Info Banner */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A]">{studentProfile.name}</span>
              <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">
                CGPA {studentProfile.cgpa}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {studentProfile.branch} • {studentProfile.college}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Verified Skill Score</span>
            <span className="text-sm font-extrabold text-[#4F46E5]">{studentProfile.overallSkillScore}%</span>
          </div>
        </div>

        {/* Attached Resume Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Attached Resume (PDF)</label>
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <FileText className="w-6 h-6 text-[#4F46E5]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0F172A] truncate">{resumeFileName}</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified by ATS Analyzer (92/100)</span>
              </p>
            </div>
            <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] transition-colors">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setResumeFileName(e.target.files[0].name);
                }}
              />
              Replace
            </label>
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Candidate Statement / Cover Letter
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none transition-all leading-relaxed"
          />
        </div>

        {/* Portfolio & LinkedIn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Portfolio URL</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">LinkedIn Profile</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Additional Recruiter Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            {alreadyApplied ? '⚠️ You have already applied for this job' : 'Application will be transmitted to HR pool'}
          </span>

          <button
            type="submit"
            disabled={isSubmitting || alreadyApplied}
            className="px-6 py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Transmitting...' : alreadyApplied ? 'Already Submitted' : 'Submit Application'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
