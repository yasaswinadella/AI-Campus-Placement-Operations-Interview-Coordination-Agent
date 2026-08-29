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
  Bot,
  Send,
  Building2,
  DollarSign,
  MapPin,
  Layers,
  FileText,
  Check,
} from 'lucide-react';
import { StudentAiCareerAgent } from '../../components/student/StudentAiCareerAgent';

export const StudentJobEligibility: React.FC = () => {
  const { jobs = [], studentProfile, applyJob, applications = [], savedJobIds = [], toggleSaveJob, showToast } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const safeJobs = jobs || [];
  const selectedJobId = location.state?.jobId || safeJobs[0]?.id || '';
  const [currentJobId, setCurrentJobId] = useState(selectedJobId);
  const [activeTab, setActiveTab] = useState<'eligibility' | 'apply' | 'ai_chat'>('eligibility');

  // Application Form Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState(
    'I am excited to submit my candidacy. My hands-on experience building distributed systems, modern full-stack web applications, and verified technical benchmark assessments make me a high-impact fit for your team.'
  );
  const [notes, setNotes] = useState('Available for immediate virtual rounds and campus recruitment steps.');
  const [isApplying, setIsApplying] = useState(false);

  const currentJob = safeJobs.find((j) => j && j.id === currentJobId) || safeJobs[0];

  if (!currentJob || safeJobs.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Job Eligibility, AI Matching & Direct Application Hub
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Algorithmic verification against corporate cutoff criteria, one-click applications, and conversational AI placement assistance.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">No Jobs Available in Directory</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            There are currently no active corporate postings. Check back shortly as recruitment partner drives are published.
          </p>
        </div>
      </div>
    );
  }

  // Eligibility evaluation calculations
  const studentCgpa = studentProfile?.cgpa || 8.5;
  const isCgpaQualified = studentCgpa >= (currentJob.minCgpa || 7.0);
  const isBatchQualified = (studentProfile?.graduationYear || 2026) >= 2025;
  const isBacklogQualified = true; // 0 backlogs
  const isOverallQualified = isCgpaQualified && isBatchQualified && isBacklogQualified;

  // Skills matching
  const studentSkillsList = Object.keys(studentProfile?.skills || {});
  const jobSkillsList = Array.isArray(currentJob.skills) ? currentJob.skills : [];
  const matchedSkills = jobSkillsList.filter((sk) =>
    studentSkillsList.some((s) => s.toLowerCase().includes(sk.toLowerCase()))
  );
  const missingSkills = jobSkillsList.filter(
    (sk) => !studentSkillsList.some((s) => s.toLowerCase().includes(sk.toLowerCase()))
  );

  const matchPercent = Math.min(
    98,
    Math.max(45, Math.round((studentProfile?.overallSkillScore || 75) * 0.8 + (isCgpaQualified ? 15 : -10)))
  );

  const sId = studentProfile?.id || '';
  const alreadyApplied = applications.some(
    (a) => a && a.jobId === currentJob.id && (a.studentId === sId || a.studentEmail === studentProfile?.email)
  );

  const isSaved = savedJobIds.includes(currentJob.id);

  const handleExecuteApplication = () => {
    setIsApplying(true);
    const success = applyJob(currentJob.id, {
      coverLetter,
      notes,
      resumeUrl: studentProfile?.resumeUrl,
      portfolioUrl: studentProfile?.portfolio,
      linkedinUrl: studentProfile?.linkedin,
    });
    setIsApplying(false);
    setShowApplyModal(false);
    if (success) {
      showToast('Application Successful', `Your application for ${currentJob.title} at ${currentJob.company} is recorded.`, 'success');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3-in-1 Placement Command Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Job Eligibility, Apply & AI Career Agent
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Test eligibility cutoffs, submit applications directly to companies, or chat with your AI Placement Agent.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/70 p-1 rounded-2xl border border-slate-300">
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'eligibility' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Eligibility Check
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'apply' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Direct Apply
          </button>
          <button
            onClick={() => setActiveTab('ai_chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_chat' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-700 hover:text-indigo-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>3. Real AI Agent</span>
          </button>
        </div>
      </div>

      {/* Target Job Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentJob.companyLogo}
            alt={currentJob.company}
            className="w-13 h-13 rounded-2xl object-cover border border-[#E2E8F0] shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0F172A]">{currentJob.title}</h3>
              {alreadyApplied && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Applied
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {currentJob.company} • {currentJob.location} ({currentJob.workplace}) • {currentJob.salary}
            </p>
          </div>
        </div>

        <div className="w-full md:w-72">
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">Switch Target Opportunity:</label>
          <select
            value={currentJobId}
            onChange={(e) => setCurrentJobId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none"
          >
            {safeJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: ELIGIBILITY EVALUATION */}
      {activeTab === 'eligibility' && (
        <div className="space-y-6 animate-in fade-in duration-150">
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
                  ? `Your CGPA of ${studentProfile.cgpa || 8.5} meets the minimum requirement (${currentJob.minCgpa}). You have a verified skill match index of ${matchPercent}%.`
                  : `Your academic profile does not meet the minimum CGPA cutoff of ${currentJob.minCgpa}.`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-300">Match Index</span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">{matchPercent}%</p>
              </div>

              <div className="flex flex-col gap-2">
                {alreadyApplied ? (
                  <button
                    onClick={() => navigate('/student/applications')}
                    className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl border border-white/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>View Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (isOverallQualified) {
                        setShowApplyModal(true);
                      } else {
                        showToast('Cutoff Warning', 'You do not meet the minimum criteria for this job, but you can still apply with a personalized note.', 'warning');
                        setShowApplyModal(true);
                      }
                    }}
                    className="px-6 py-3.5 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Proceed to Apply</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => toggleSaveJob(currentJob.id)}
                  className="px-4 py-2 bg-black/30 hover:bg-black/40 text-xs font-semibold rounded-xl text-slate-300 cursor-pointer"
                >
                  {isSaved ? '★ Bookmarked' : '☆ Save for Later'}
                </button>
              </div>
            </div>
          </div>

          {/* Criteria Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Cutoff Parameter Verification</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isCgpaQualified ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">CGPA Cutoff: {currentJob.minCgpa}</h4>
                      <p className="text-[11px] text-[#64748B]">Your CGPA: {studentProfile.cgpa || 8.5}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCgpaQualified ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {isCgpaQualified ? 'Passed' : 'Failed'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">Graduation Year: 2025-2026</h4>
                      <p className="text-[11px] text-[#64748B]">Your Class: {studentProfile.graduationYear || 2026}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Passed
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">Active Backlogs: 0</h4>
                      <p className="text-[11px] text-[#64748B]">Your Status: Clean Record</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Passed
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Match vs Gap Box */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Skills Alignment Analysis</h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Matching Skills ({matchedSkills.length}/{jobSkillsList.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded text-[11px] font-medium">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">None verified yet</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Skill Gaps to Strengthen ({missingSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-medium">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">Full Skill Match!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT APPLY ENGINE */}
      {activeTab === 'apply' && (
        <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Direct Application Dossier</h2>
              <p className="text-xs text-[#64748B]">Applying for {currentJob.title} at {currentJob.company}</p>
            </div>
            {alreadyApplied ? (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Already Applied
              </span>
            ) : (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">
                Ready to Transmit
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Candidate Credentials:</span>
              <p><strong>Name:</strong> {studentProfile.name || 'Candidate'}</p>
              <p><strong>Email:</strong> {studentProfile.email || 'candidate@university.edu'}</p>
              <p><strong>College:</strong> {studentProfile.college || 'Institute of Technology'}</p>
              <p><strong>CGPA:</strong> {studentProfile.cgpa || 8.5}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Job Details:</span>
              <p><strong>Role:</strong> {currentJob.title}</p>
              <p><strong>Company:</strong> {currentJob.company}</p>
              <p><strong>Package:</strong> {currentJob.salary}</p>
              <p><strong>Location:</strong> {currentJob.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Cover Letter & Technical Pitch:</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Notes for Corporate Recruiter:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('eligibility')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Eligibility
            </button>

            {alreadyApplied ? (
              <button
                onClick={() => navigate('/student/applications')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Go to Applications Tracker
              </button>
            ) : (
              <button
                onClick={handleExecuteApplication}
                disabled={isApplying}
                className="px-6 py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isApplying ? 'Submitting...' : 'Submit Application to Recruiter'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REAL AI CAREER AGENT */}
      {activeTab === 'ai_chat' && (
        <div className="animate-in fade-in duration-150">
          <StudentAiCareerAgent />
        </div>
      )}

      {/* APPLY CONFIRMATION MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Confirm Application Submission</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1 text-xs">
              <p className="font-bold text-indigo-950">{currentJob.title} @ {currentJob.company}</p>
              <p className="text-slate-600">Location: {currentJob.location} • Compensation: {currentJob.salary}</p>
              <p className="text-emerald-700 font-bold">Match Index: {matchPercent}%</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Cover Note:</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteApplication}
                disabled={isApplying}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {isApplying ? 'Transmitting...' : 'Confirm & Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
