import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Job } from '../../types';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Building2,
  DollarSign,
  MapPin,
  GraduationCap,
  Calendar,
  Sparkles,
  Users,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Upload,
  Layers,
} from 'lucide-react';

export const AdminJobs: React.FC = () => {
  const { jobs, companies, createJob, updateJobStatus, deleteJob, applications, showToast } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Form State for Uploading New Job
  const [companyName, setCompanyName] = useState('Google');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering & Technology');
  const [location, setLocation] = useState('Bangalore / Hyderabad, India');
  const [workplace, setWorkplace] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [type, setType] = useState<'Full-time' | 'Internship' | 'Contract'>('Full-time');
  const [salary, setSalary] = useState('22.0 - 32.0 LPA');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [skillsInput, setSkillsInput] = useState('Python, SQL, React, DSA, System Design');
  const [description, setDescription] = useState(
    'We are seeking high-performing Graduate Software Engineers to develop distributed backend microservices and modern web interfaces.'
  );
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // AI Auto-Fill Job Role Presets
  const handleAiAutoFill = (role: string) => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const normalized = role.toLowerCase();
      if (normalized.includes('ai') || normalized.includes('data') || normalized.includes('ml')) {
        setTitle('Junior AI / Data Engineer');
        setDepartment('AI & Data Intelligence');
        setSalary('24.0 - 35.0 LPA');
        setMinCgpa(8.0);
        setSkillsInput('Python, PyTorch, SQL, Machine Learning, Data Structures, Cloud Warehousing');
        setDescription(
          'Build scalable data processing pipelines, train predictive algorithms, and deploy low-latency machine learning models in production.'
        );
      } else if (normalized.includes('cloud') || normalized.includes('devops')) {
        setTitle('Associate Cloud & DevOps Engineer');
        setDepartment('Cloud Infrastructure');
        setSalary('20.0 - 28.0 LPA');
        setMinCgpa(7.5);
        setSkillsInput('Docker, Kubernetes, AWS, Linux, Terraform, CI/CD, Python, Shell');
        setDescription(
          'Automate cloud deployments, configure resilient Kubernetes clusters, and maintain 99.99% system availability across microservices.'
        );
      } else if (normalized.includes('frontend') || normalized.includes('react')) {
        setTitle('Frontend Software Engineer');
        setDepartment('Product Engineering');
        setSalary('18.0 - 26.0 LPA');
        setMinCgpa(7.5);
        setSkillsInput('React, TypeScript, Tailwind CSS, Next.js, Redux, Web Performance');
        setDescription(
          'Design and engineer responsive, high-performance web applications using modern React, TypeScript, and micro-frontends.'
        );
      } else {
        setTitle(role || 'Graduate Software Engineer - Full Stack');
        setDepartment('Engineering & Technology');
        setSalary('22.0 - 30.0 LPA');
        setMinCgpa(7.5);
        setSkillsInput('Python, TypeScript, React, Node.js, SQL, DSA, System Design');
        setDescription(
          'Develop distributed backend microservices and modern web interfaces. Architect robust databases and write clean modular code.'
        );
      }
      setIsGeneratingAi(false);
      showToast('AI Autofill Ready', `Loaded job requisitions for ${role}.`, 'info');
    }, 400);
  };

  const handleCompanyChange = (selected: string) => {
    setCompanyName(selected);
    if (selected === 'Google') {
      setCompanyLogo('https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120');
    } else if (selected === 'Microsoft') {
      setCompanyLogo('https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120');
    } else {
      const found = companies.find((c) => c.name.toLowerCase() === selected.toLowerCase());
      if (found?.logo) setCompanyLogo(found.logo);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Error', 'Job title is required.', 'danger');
      return;
    }

    const finalCompany = companyName === 'CUSTOM' ? (customCompanyName || 'Partner Company') : companyName;
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createJob({
      title,
      company: finalCompany,
      companyLogo,
      department,
      location,
      workplace,
      type,
      salary,
      minCgpa,
      skills,
      description,
      deadline,
      status: 'ACTIVE',
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
    });

    setIsPostModalOpen(false);
    // Reset basic fields
    setTitle('');
    showToast('Job Published', `"${title}" is now visible to all students in the Job Directory.`, 'success');
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const activeCount = jobs.filter((j) => j.status === 'ACTIVE').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Recruitment Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Campus Job Directory & Postings
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Upload new corporate openings, configure eligibility cutoffs, and monitor student application flow.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Campus Job</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>Total Campus Postings</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-2">{jobs.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Visible to all students</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>Active Openings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{activeCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Accepting applications</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>Partner Companies</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600 mt-2">{companies.length}</div>
          <span className="text-[11px] text-purple-500 font-medium">Verified recruiters</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>Total Applications</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-2">{applications.length}</div>
          <span className="text-[11px] text-blue-500 font-medium">Student submissions</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, or required skill..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none font-medium"
          >
            <option value="ALL">All Status ({filteredJobs.length})</option>
            <option value="ACTIVE">Active Only</option>
            <option value="CLOSED">Closed Only</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Role & Company</th>
                <th className="py-4 px-5">Department & Type</th>
                <th className="py-4 px-5">CTC & Cutoff</th>
                <th className="py-4 px-5">Required Skills</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No campus jobs found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={j.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100'}
                          alt={j.company}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#0F172A]">{j.title}</p>
                          <p className="text-[11px] text-[#64748B]">{j.company} • {j.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-semibold text-[#0F172A] block">{j.department}</span>
                      <span className="text-[11px] text-[#64748B]">{j.workplace} • {j.type}</span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-emerald-600 block">{j.salary}</span>
                      <span className="text-[11px] text-[#64748B]">Min {j.minCgpa} CGPA</span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {j.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 bg-indigo-50 text-[#4F46E5] font-medium text-[10px] rounded"
                          >
                            {sk}
                          </span>
                        ))}
                        {j.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                            +{j.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <button
                        onClick={() => updateJobStatus(j.id, j.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE')}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          j.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {j.status}
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => deleteJob(j.id)}
                          title="Delete Job"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload New Job Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Upload New Campus Job Opening</h2>
                  <p className="text-xs text-slate-300">
                    Instantly syncs to the Student Jobs Directory and Eligibility Engine.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              {/* AI Auto-Fill Presets */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4F46E5]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Fast-Fill Role Templates:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['SDE-I Backend', 'AI / ML Engineer', 'DevOps & Cloud', 'Frontend React'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleAiAutoFill(role)}
                      disabled={isGeneratingAi}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-[#4F46E5] text-[11px] font-bold rounded-lg border border-indigo-200 transition-all shadow-2xs cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Partner Employer *
                  </label>
                  <select
                    value={companyName}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none font-semibold"
                  >
                    <option value="Google">Google (Active Partner)</option>
                    <option value="Microsoft">Microsoft (Active Partner)</option>
                    {companies
                      .filter((c) => c.name !== 'Google' && c.name !== 'Microsoft')
                      .map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    <option value="CUSTOM">+ Enter Custom Company</option>
                  </select>
                </div>

                {companyName === 'CUSTOM' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">
                      Custom Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Job Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Software Development Engineer - I"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Department / Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering & Technology"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Workplace, Type, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Workplace Mode</label>
                  <select
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none font-medium"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Position Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none font-medium"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore, India"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Salary, Min CGPA, Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Salary / CTC Package *</label>
                  <input
                    type="text"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 24.0 - 32.0 LPA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Min CGPA Cutoff *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none font-bold text-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Required Competency Skills (Comma Separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Python, SQL, DSA, System Design, React"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none font-medium"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Job Description & Key Responsibilities *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Job to Student Directory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
