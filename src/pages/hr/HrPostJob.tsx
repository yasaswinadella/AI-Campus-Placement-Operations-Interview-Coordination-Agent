import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Building2,
  DollarSign,
  MapPin,
  GraduationCap,
  Sparkles,
  Plus,
  Send,
  ChevronLeft,
} from 'lucide-react';

export const HrPostJob: React.FC = () => {
  const { createJob, showToast } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering & Technology');
  const [location, setLocation] = useState('Bangalore / Hyderabad, India');
  const [workplace, setWorkplace] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [type, setType] = useState<'Full-time' | 'Internship' | 'Contract'>('Full-time');
  const [salary, setSalary] = useState('18.0 - 24.0 LPA');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [skillsInput, setSkillsInput] = useState('Python, SQL, DSA, System Design, React');
  const [description, setDescription] = useState(
    'We are seeking high-performing Graduate Software Engineers to develop distributed backend microservices and modern web interfaces.'
  );
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);

  const handleAiAutoFill = (jobRole: string) => {
    setIsGeneratingWithAi(true);
    setTimeout(() => {
      const normalized = jobRole.toLowerCase();
      if (normalized.includes('data') || normalized.includes('ai') || normalized.includes('ml')) {
        setTitle(jobRole || 'Junior AI / Data Engineer');
        setDepartment('AI & Data Intelligence');
        setSalary('20.0 - 28.0 LPA');
        setMinCgpa(8.0);
        setSkillsInput('Python, Pandas, NumPy, SQL, Machine Learning, PyTorch, Cloud Data Warehousing');
        setDescription(
          'We are looking for Graduate AI & Data Engineers to build scalable data processing pipelines, train predictive algorithms, and deploy low-latency machine learning models in production.'
        );
      } else if (normalized.includes('cloud') || normalized.includes('devops') || normalized.includes('infra')) {
        setTitle(jobRole || 'Associate Cloud & DevOps Engineer');
        setDepartment('Cloud Infrastructure & Platform');
        setSalary('18.0 - 24.0 LPA');
        setMinCgpa(7.5);
        setSkillsInput('Docker, Kubernetes, AWS, Linux, Terraform, CI/CD, Python, Shell Scripting');
        setDescription(
          'Join our global infrastructure engineering team to automate cloud deployments, configure resilient Kubernetes clusters, and maintain 99.99% system availability across distributed microservices.'
        );
      } else if (normalized.includes('frontend') || normalized.includes('react') || normalized.includes('web')) {
        setTitle(jobRole || 'Frontend Software Engineer');
        setDepartment('Product Engineering');
        setSalary('16.0 - 22.0 LPA');
        setMinCgpa(7.5);
        setSkillsInput('React 18, TypeScript, Tailwind CSS, Next.js, Redux Toolkit, Web Performance, Unit Testing');
        setDescription(
          'Design and engineer responsive, high-performance web applications using modern React, TypeScript, and micro-frontends with a strong focus on accessibility and sub-second page loads.'
        );
      } else {
        setTitle(jobRole || 'Graduate Software Engineer - Full Stack');
        setDepartment('Engineering & Technology');
        setSalary('18.0 - 26.0 LPA');
        setMinCgpa(7.5);
        setSkillsInput('Python, TypeScript, React, Node.js, SQL, DSA, System Design, REST APIs');
        setDescription(
          'We are seeking high-performing Graduate Software Engineers to develop distributed backend microservices and modern web interfaces. You will architect robust databases, write clean modular code, and solve high-scale engineering challenges.'
        );
      }
      setIsGeneratingWithAi(false);
      showToast('AI Specification Generated', `Configured requisitions and skills for ${jobRole}.`);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createJob({
      title,
      company: user?.company || 'Enterprise Partner Corp',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      department,
      location,
      workplace,
      type,
      salary,
      minCgpa,
      skills,
      description,
      status: 'ACTIVE',
    });

    navigate('/hr/manage-jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/hr/manage-jobs')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Managed Positions
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Publish Campus Recruitment Opening
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Post roles to university student portals with automated AI matching criteria and CGPA cutoffs.
            </p>
          </div>
        </div>
      </div>

      {/* AI Preset Quick Generator Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white border border-indigo-500/20 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              AI Role Requisition Generator
            </span>
          </div>
          <span className="text-[11px] text-indigo-300 font-medium">Click a role to auto-complete</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'Full Stack Engineer',
            'Frontend React Engineer',
            'Backend Platform Engineer',
            'AI & Data Engineer',
            'Cloud & DevOps Engineer',
          ].map((role) => (
            <button
              key={role}
              type="button"
              disabled={isGeneratingWithAi}
              onClick={() => handleAiAutoFill(role)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <span>✨</span>
              <span>{role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Position / Job Title</label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Associate Software Engineer - Backend"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none pr-24"
              />
              <button
                type="button"
                onClick={() => handleAiAutoFill(title || 'Full Stack Engineer')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#4F46E5] hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Fill</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Hiring Organization</label>
            <input
              type="text"
              value={user?.company || 'Enterprise Partner Corp'}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500 font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Workplace Arrangement</label>
            <select
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Employment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, India"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Offered Compensation (CTC)</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 18.0 LPA"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Min. CGPA Cutoff</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={minCgpa}
              onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none font-bold text-[#4F46E5]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">
            Required Technical Competencies (Comma-separated)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Python, SQL, DSA, Docker, React"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1">Job Description & Responsibilities</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/hr/manage-jobs')}
            className="px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Publish Role Live</span>
          </button>
        </div>
      </form>
    </div>
  );
};
