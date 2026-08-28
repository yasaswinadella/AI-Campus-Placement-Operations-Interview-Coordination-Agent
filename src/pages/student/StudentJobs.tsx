import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Job, PlacementDrive } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Building2,
  Megaphone,
  Sparkles,
} from 'lucide-react';

export const StudentJobs: React.FC = () => {
  const { jobs, placementDrives, registerForPlacementDrive, savedJobIds, toggleSaveJob, studentProfile } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ALL' | 'SAVED' | 'CAMPUS_DRIVES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'SAVED' && !savedJobIds.includes(j.id)) return false;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesWorkplace = selectedWorkplace === 'ALL' || j.workplace === selectedWorkplace;
    const matchesType = selectedType === 'ALL' || j.type === selectedType;
    return matchesSearch && matchesWorkplace && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Campus Placement & Verified Jobs Portal
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Browse corporate vacancies and registered campus recruitment drives for 2026 graduates.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-[#E2E8F0] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ALL' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All Positions ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('SAVED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SAVED' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Bookmarked ({savedJobIds.length})
          </button>
          <button
            onClick={() => setActiveTab('CAMPUS_DRIVES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'CAMPUS_DRIVES' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Campus Drives ({placementDrives.length})
          </button>
        </div>
      </div>

      {/* Campus Placement Drives View */}
      {activeTab === 'CAMPUS_DRIVES' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-[#4F46E5]" />
              <p className="text-xs text-indigo-900 font-medium">
                Official institutional placement drives managed directly by verified corporate partners.
              </p>
            </div>
          </div>

          {placementDrives.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0F172A]">No Placement Drives Announced Yet</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Campus recruitment drives posted by corporate partners will appear here with cutoff eligibility criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {placementDrives.map((drive) => {
                const isRegistered = (drive.registeredStudentIds || []).includes(studentProfile.id);
                const isEligible = studentProfile.cgpa >= drive.minCgpa;

                return (
                  <div
                    key={drive.id}
                    className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={drive.companyLogo}
                            alt={drive.company}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]"
                          />
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A]">{drive.role}</h3>
                            <p className="text-xs text-[#64748B] font-semibold">{drive.company}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-[#4F46E5] font-extrabold rounded-full text-xs border border-indigo-100">
                          {drive.salaryPackage}
                        </span>
                      </div>

                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">{drive.description}</p>

                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] text-xs">
                        <div>
                          <span className="text-[#64748B] text-[11px] block">Min. CGPA Cutoff:</span>
                          <strong className="text-[#0F172A]">{drive.minCgpa} CGPA</strong>
                        </div>
                        <div>
                          <span className="text-[#64748B] text-[11px] block">Drive Date:</span>
                          <strong className="text-[#4F46E5]">{drive.driveDate}</strong>
                        </div>
                        <div>
                          <span className="text-[#64748B] text-[11px] block">Eligible Branches:</span>
                          <strong className="text-[#0F172A]">{drive.eligibleBranches.join(', ')}</strong>
                        </div>
                        <div>
                          <span className="text-[#64748B] text-[11px] block">Deadline:</span>
                          <strong className="text-rose-600">{drive.registrationDeadline}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                      <div className="text-xs">
                        {isEligible ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            You are eligible
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">
                            CGPA Cutoff requires {drive.minCgpa}
                          </span>
                        )}
                      </div>

                      <button
                        disabled={isRegistered || !isEligible}
                        onClick={() => registerForPlacementDrive(drive.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isRegistered
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : !isEligible
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-[#4F46E5] hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isRegistered ? 'Registered' : 'Register for Drive'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Standard Jobs View */}
      {activeTab !== 'CAMPUS_DRIVES' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, company, or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
              >
                <option value="ALL">All Workplace Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
              >
                <option value="ALL">All Employment Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0F172A]">No Matching Jobs Found</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                {activeTab === 'SAVED'
                  ? "You haven't bookmarked any jobs yet. Bookmark jobs to track them here."
                  : 'No corporate vacancies currently match your search criteria. Check back soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                const isEligible = studentProfile.cgpa >= job.minCgpa;

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A] hover:text-[#4F46E5] transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-xs text-[#64748B] font-semibold">{job.company}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-2 rounded-xl border transition-colors ${
                            isSaved
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                          }`}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                          <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                          {job.location} ({job.workplace})
                        </span>
                        <span className="flex items-center gap-1 font-bold text-emerald-600">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          {job.salary}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                      <button
                        onClick={() => navigate('/student/job-eligibility', { state: { jobId: job.id } })}
                        className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Check Match</span>
                      </button>

                      <button
                        onClick={() => navigate('/student/apply', { state: { jobId: job.id } })}
                        className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
