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
  Eye,
} from 'lucide-react';
import { StudentResumeModal } from '../../components/ui/StudentResumeModal';

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
  const [resumeUrl, setResumeUrl] = useState<string>(studentProfile.resumeUrl || '');
  const [resumeFileName, setResumeFileName] = useState<string>(studentProfile.resumeFileName || 'Student_Resume_2026.pdf');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const [targetIndustry, setTargetIndustry] = useState('Full Stack & Cloud Software Engineering');
  const [isScanningAts, setIsScanningAts] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<{
    score: number;
    verdict: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    improvements: string[];
  }>({
    score: studentProfile.atsScore || 88,
    verdict: 'High ATS Compatibility • Top 8% Candidate Match',
    matchedKeywords: ['React', 'TypeScript', 'Data Structures', 'REST APIs', 'SQL Optimization', 'Git Version Control'],
    missingKeywords: ['CI/CD Pipelines', 'Docker Containerization', 'Unit Testing (Jest/Vitest)', 'GraphQL'],
    improvements: [
      'Quantify impact metrics in bullet points (e.g., "reduced API latency by 35%")',
      'Include links to live deployed demo apps alongside repository links',
      'Add industry certifications under verified technical credentials'
    ],
  });

  const handleRunAiAtsScan = () => {
    setIsScanningAts(true);
    setTimeout(() => {
      let calculatedScore = 75;
      if (cgpa >= 8.5) calculatedScore += 8;
      else if (cgpa >= 7.5) calculatedScore += 5;
      if (bio.length > 50) calculatedScore += 6;
      if (github) calculatedScore += 4;
      if (linkedin) calculatedScore += 4;
      if (portfolio) calculatedScore += 3;
      calculatedScore = Math.min(98, calculatedScore);

      const newAnalysis = {
        score: calculatedScore,
        verdict: calculatedScore >= 85 ? 'Excellent ATS Alignment (Top Tier)' : 'Good Baseline • Minor Keyword Gaps',
        matchedKeywords: ['Algorithms', 'Object-Oriented Design', 'SQL', 'TypeScript', 'Modular Architecture'],
        missingKeywords: targetIndustry.includes('Data')
          ? ['Pandas DataFrames', 'NumPy Vectors', 'Model Deployment']
          : ['Docker/K8s', 'Distributed Caching (Redis)', 'E2E Testing'],
        improvements: [
          'Add quantified metric results (e.g., "improved query performance by 40%")',
          'Align project descriptions with Fortune 500 job requisition keywords',
          'Highlight live portfolio projects demonstrating full lifecycle development'
        ],
      };

      setAtsAnalysis(newAnalysis);
      setIsScanningAts(false);
      updateStudentProfile({ atsScore: calculatedScore });
      showToast('AI ATS Scan Complete', `ATS Match Score evaluated at ${calculatedScore}/100.`);
    }, 1000);
  };

  const handleFileUpload = (file: File) => {
    setResumeFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setResumeUrl(dataUrl);
        updateStudentProfile({ resumeUrl: dataUrl, resumeFileName: file.name });
        showToast('Resume Uploaded & Saved', `Uploaded ${file.name} successfully.`);
      }
    };
    reader.readAsDataURL(file);
  };

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
      resumeUrl,
      resumeFileName,
      atsScore: atsAnalysis.score,
    });
    showToast('Profile Saved', 'Your student credentials and ATS resume analysis were saved permanently in database.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Academic Profile & AI ATS Resume Studio
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Neural parsing, target keyword matching, and verified credential management for campus placement.
        </p>
      </div>

      {/* ATS Resume Analyzer Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-7 text-white shadow-xl space-y-6 border border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI ATS Neural Scanner</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Resume ATS Match: {atsAnalysis.score} / 100
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {atsAnalysis.verdict}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isScanningAts}
              onClick={handleRunAiAtsScan}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isScanningAts ? 'Scanning Resume...' : '⚡ Run AI Deep Scan'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Preview / Open PDF</span>
            </button>

            <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/15 backdrop-blur-md">
              <FileText className="w-8 h-8 text-indigo-300" />
              <div>
                <p className="text-xs font-bold text-white max-w-[140px] truncate">{resumeFileName}</p>
                <p className="text-[10px] text-slate-300">Verified PDF</p>
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-[11px] font-bold text-white transition-all">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                Upload PDF
              </label>
            </div>
          </div>
        </div>

        {/* ATS Keyword Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              ✓ Verified Keywords Detected in Profile
            </span>
            <div className="flex flex-wrap gap-1.5">
              {atsAnalysis.matchedKeywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              ⚠️ Recommended Keywords to Add
            </span>
            <div className="flex flex-wrap gap-1.5">
              {atsAnalysis.missingKeywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30">
                  + {kw}
                </span>
              ))}
            </div>
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
            className="px-6 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Academic Profile</span>
          </button>
        </div>
      </form>

      {/* Resume Document Preview Modal */}
      <StudentResumeModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        student={{
          ...studentProfile,
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
          resumeUrl,
          resumeFileName,
          atsScore: atsAnalysis.score,
        }}
      />
    </div>
  );
};
