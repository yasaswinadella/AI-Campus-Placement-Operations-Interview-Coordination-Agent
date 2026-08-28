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
    'We are looking for high-performing Graduate Software Engineers to join our core distributed platform engineering team. You will build highly scalable APIs, microservices, and reactive user interfaces.'
  );

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
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Publish Campus Recruitment Opening
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Post roles to university student portals with automated AI matching criteria and CGPA cutoffs.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Position / Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Associate Software Engineer - Backend"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
            />
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
