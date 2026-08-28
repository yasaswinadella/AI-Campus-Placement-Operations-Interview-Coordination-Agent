import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Save,
  Award,
  BookOpen,
  Briefcase,
} from 'lucide-react';

export const StudentProfileResume: React.FC = () => {
  const { studentProfile, updateStudentProfile, showToast } = useData();

  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [college, setCollege] = useState(studentProfile.college);
  const [branch, setBranch] = useState(studentProfile.branch);
  const [cgpa, setCgpa] = useState(studentProfile.cgpa);
  const [gradYear, setGradYear] = useState(studentProfile.graduationYear);
  const [bio, setBio] = useState(studentProfile.bio);
  const [portfolio, setPortfolio] = useState(studentProfile.portfolio);
  const [linkedin, setLinkedin] = useState(studentProfile.linkedin);
  const [github, setGithub] = useState(studentProfile.github);
  const [resumeFileName, setResumeFileName] = useState(studentProfile.resumeFileName || 'John_Doe_Resume_2026.pdf');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      email,
      college,
      branch,
      cgpa,
      graduationYear: gradYear,
      bio,
      portfolio,
      linkedin,
      github,
      resumeFileName,
    });
    showToast('Profile Updated', 'Your student academic credentials and resume were updated.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Academic Profile & ATS Resume Studio
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Keep your collegiate portfolio, verified transcript records, and ATS-optimized resume in sync.
        </p>
      </div>

      {/* ATS Resume Analyzer Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Neural Scanner: Excellent Score</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Resume ATS Compatibility: 92 / 100</h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Your resume exhibits high keyword density for Python, Distributed Systems, SQL, and React with quantified bullet impacts.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
            <FileText className="w-10 h-10 text-indigo-300" />
            <div>
              <p className="text-xs font-bold text-white">{resumeFileName}</p>
              <p className="text-[11px] text-slate-300">Verified PDF • 248 KB</p>
            </div>
            <label className="cursor-pointer px-4 py-2 bg-[#4F46E5] hover:bg-indigo-600 rounded-xl text-xs font-bold text-white transition-all shadow-md">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setResumeFileName(e.target.files[0].name);
                    showToast('Resume Replaced', `Uploaded ${e.target.files[0].name}`);
                  }
                }}
              />
              Upload New PDF
            </label>
          </div>
        </div>

        {/* ATS Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Keyword Density: 96%</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Action Verbs & Impact Metrics</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Clean Single-Column Parsing</span>
          </div>
        </div>
      </div>

      {/* Main Profile Editor Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-4">
          Personal & Academic Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">College Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Academic Department / Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Cumulative CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={cgpa}
              onChange={(e) => setCgpa(parseFloat(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none font-bold text-[#4F46E5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Graduation Class Year</label>
            <input
              type="number"
              value={gradYear}
              onChange={(e) => setGradYear(parseInt(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Collegiate Institution / University</label>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Professional Bio / Summary</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Links & Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Portfolio Site</label>
            <input
              type="url"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">GitHub Profile</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Save Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Academic Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
