import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ScheduleInterviewModal } from '../../components/ui/ScheduleInterviewModal';
import { ApplicationStatus } from '../../types';
import {
  Users,
  Search,
  Filter,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react';

export const HrApplicants: React.FC = () => {
  const { applications, jobs, updateApplicationStatus, showToast } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const initialJobId = location.state?.jobId || 'ALL';
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<any>(null);

  const filteredApplications = applications.filter((app) => {
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.college.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesStatus && matchesSearch;
  });

  const handleOpenSchedule = (app: any) => {
    setSelectedAppForSchedule(app);
    setIsScheduleOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Applicant Tracking & Evaluation Matrix
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Review verified transcripts, ATS resume scores, and manage talent pipeline stages.
          </p>
        </div>

        <button
          onClick={() => navigate('/hr/shortlisted-pool')}
          className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-[#4F46E5]" />
          <span>View Shortlisted Talent Pool</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name, college, or role..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none max-w-xs"
          >
            <option value="ALL">All Job Openings ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
          >
            <option value="ALL">All Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Candidate Name</th>
                <th className="py-4 px-5">Applied Position</th>
                <th className="py-4 px-5">Academic & CGPA</th>
                <th className="py-4 px-5">AI Match Index</th>
                <th className="py-4 px-5">Stage Status</th>
                <th className="py-4 px-5 text-right">Pipeline Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] font-bold text-xs flex items-center justify-center border border-indigo-100">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0F172A]">{app.studentName}</p>
                        <p className="text-[11px] text-[#64748B]">{app.college}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-semibold text-[#0F172A]">
                    {app.jobTitle}
                  </td>

                  <td className="py-4 px-5">
                    <span className="font-bold text-[#4F46E5]">{app.cgpa} CGPA</span>
                    <span className="text-[11px] text-[#64748B] block">Batch of 2026</span>
                  </td>

                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                      {app.matchScore}% Match
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <StatusBadge status={app.status} size="sm" />
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.status === 'APPLIED' && (
                        <button
                          onClick={() => {
                            updateApplicationStatus(app.id, 'SHORTLISTED');
                            showToast('Candidate Shortlisted', `${app.studentName} moved to Shortlisted.`);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors"
                        >
                          Shortlist
                        </button>
                      )}

                      {app.status === 'SHORTLISTED' && (
                        <button
                          onClick={() => handleOpenSchedule(app)}
                          className="px-2.5 py-1 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule</span>
                        </button>
                      )}

                      <button
                        onClick={() => navigate('/hr/applicant-detail', { state: { applicationId: app.id } })}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {selectedAppForSchedule && (
        <ScheduleInterviewModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedAppForSchedule(null);
          }}
          defaultStudentId={selectedAppForSchedule.studentId}
          defaultJobId={selectedAppForSchedule.jobId}
        />
      )}
    </div>
  );
};
