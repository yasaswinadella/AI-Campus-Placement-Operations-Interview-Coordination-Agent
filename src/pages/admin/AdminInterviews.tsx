import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Interview } from '../../types';
import {
  Calendar,
  Search,
  Filter,
  Users,
  Building2,
  Briefcase,
  Clock,
  Video,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminInterviews: React.FC = () => {
  const { interviews, companies } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (interview.companyId && interview.companyId.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Upcoming') {
        matchesStatus = interview.status === 'SCHEDULED' || interview.status === 'RESCHEDULED';
      } else if (statusFilter === 'Completed') {
        matchesStatus = interview.status === 'COMPLETED';
      } else if (statusFilter === 'Cancelled') {
        matchesStatus = interview.status === 'CANCELLED';
      }
    }
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#475569] text-[11px] font-bold mb-1 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Institutional Monitoring View</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Campus Interviews Monitor
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor real-time technical rounds, HR screens, and panel assessments conducted by corporate recruiters.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate, company, or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Upcoming', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Interviews' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews Table / Cards */}
      {filteredInterviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No campus interviews scheduled yet.</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Corporate HR recruiters schedule candidate interviews directly through their portal. Active sessions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Candidate</th>
                  <th className="py-3.5 px-5">Company & Role</th>
                  <th className="py-3.5 px-5">Interview Round</th>
                  <th className="py-3.5 px-5">Schedule Date & Time</th>
                  <th className="py-3.5 px-5">Format</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs">
                {filteredInterviews.map((interview) => {
                  const companyObj = companies.find(
                    (c) =>
                      c.name.toLowerCase() === interview.company.toLowerCase() ||
                      (interview.companyId && c.companyId.toUpperCase() === interview.companyId.toUpperCase())
                  );
                  const companyId = interview.companyId || companyObj?.companyId || 'CMP001';

                  return (
                    <tr key={interview.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-[#4F46E5] font-bold flex items-center justify-center text-xs shrink-0">
                            {interview.studentName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#0F172A] block">{interview.studentName}</span>
                            <span className="text-[11px] text-[#64748B]">Applicant ID: {interview.studentId || 'STU-001'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-[#0F172A]">{interview.company}</strong>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[#4F46E5] font-mono text-[10px] font-bold">
                              {companyId}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#64748B] block mt-0.5">{interview.jobTitle}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                          {interview.round}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0F172A]">{interview.date}</span>
                          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#4F46E5]" />
                            {interview.time}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#475569] font-medium">
                          {interview.format === 'Virtual' ? (
                            <Video className="w-3.5 h-3.5 text-[#4F46E5]" />
                          ) : interview.format === 'Phone' ? (
                            <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {interview.format || 'Virtual'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            interview.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : interview.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : interview.status === 'RESCHEDULED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {interview.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedInterview(interview)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal (Admin Read-Only Monitoring View) */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E2E8F0] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Interview Details</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {selectedInterview.round} • {selectedInterview.company}
                </p>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Candidate:</span>
                  <strong className="text-[#0F172A]">{selectedInterview.studentName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Role Applied:</span>
                  <strong className="text-[#0F172A]">{selectedInterview.jobTitle}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Recruiting Partner:</span>
                  <strong className="text-[#4F46E5]">{selectedInterview.company}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Interview Panel:</span>
                  <strong className="text-[#0F172A]">{(selectedInterview.interviewers || ['Lead Evaluator']).join(', ')}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Date:</span>
                  <strong className="text-[#0F172A]">{selectedInterview.date}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Time:</span>
                  <strong className="text-[#0F172A]">{selectedInterview.time}</strong>
                </div>
              </div>

              {selectedInterview.feedback && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-800">Panel Feedback:</span>
                    {selectedInterview.rating && (
                      <span className="text-xs font-extrabold text-emerald-700">★ {selectedInterview.rating} / 5.0</span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">{selectedInterview.feedback}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setSelectedInterview(null)}
                className="px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl"
              >
                Close Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
