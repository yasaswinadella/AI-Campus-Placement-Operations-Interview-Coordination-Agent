import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CreateJobModal } from '../../components/ui/CreateJobModal';
import {
  Briefcase,
  Users,
  Plus,
  Trash2,
  Edit,
  Eye,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react';

export const HrManageJobs: React.FC = () => {
  const { jobs, applications, deleteJob, updateJobStatus } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter jobs: Admin-posted jobs ONLY update student and are NOT shown in HR manage jobs
  const hrJobs = (jobs || []).filter((job) => {
    if (job.postedByRole === 'ADMIN') return false;
    if (user?.companyId && job.companyId && job.companyId.toUpperCase() === user.companyId.toUpperCase()) {
      return true;
    }
    if (user?.company && job.company && job.company.toLowerCase() === user.company.toLowerCase()) {
      return true;
    }
    if (user?.hrId && job.postedByHrId === user.hrId) {
      return true;
    }
    return job.postedByRole === 'HR';
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Manage Corporate Job Postings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Track active recruitment pipelines, applicant volumes, and toggle hiring statuses for <strong className="text-[#0F172A]">{user?.company || 'Corporate Partner'}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Position</span>
        </button>
      </div>

      {/* Jobs Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Role / Position</th>
                <th className="py-4 px-5">Department & Type</th>
                <th className="py-4 px-5">CTC Package</th>
                <th className="py-4 px-5">Cutoff</th>
                <th className="py-4 px-5">Applicants</th>
                <th className="py-4 px-5">Hiring Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {hrJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-800">No corporate positions posted yet</p>
                    <p className="text-xs text-slate-500 mt-0.5">Click "Post New Position" above to publish your company's campus recruitment drive.</p>
                  </td>
                </tr>
              ) : (
                hrJobs.map((job) => {
                const jobApps = applications.filter((a) => a.jobId === job.id);

                return (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0]"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#0F172A]">{job.title}</p>
                          <p className="text-[11px] text-[#64748B]">{job.company} • {job.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-semibold text-[#0F172A] block">{job.department}</span>
                      <span className="text-[11px] text-[#64748B]">{job.type} ({job.workplace})</span>
                    </td>

                    <td className="py-4 px-5 font-bold text-emerald-600">
                      {job.salary}
                    </td>

                    <td className="py-4 px-5 font-semibold text-[#4F46E5]">
                      {job.minCgpa} CGPA
                    </td>

                    <td className="py-4 px-5">
                      <button
                        onClick={() => navigate('/hr/applicants', { state: { jobId: job.id } })}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-[#4F46E5] font-bold text-xs hover:bg-indigo-100 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{jobApps.length} Candidates</span>
                      </button>
                    </td>

                    <td className="py-4 px-5">
                      <button
                        onClick={() => updateJobStatus(job.id, job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE')}
                        className="transition-transform active:scale-95"
                      >
                        <StatusBadge status={job.status} size="sm" />
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate('/hr/applicants', { state: { jobId: job.id } })}
                          className="p-1.5 text-[#64748B] hover:text-[#4F46E5] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Applicants"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CreateJobModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
