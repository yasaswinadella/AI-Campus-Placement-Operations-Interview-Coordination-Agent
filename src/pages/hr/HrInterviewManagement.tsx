import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ScheduleInterviewModal } from '../../components/ui/ScheduleInterviewModal';
import {
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ExternalLink,
} from 'lucide-react';

export const HrInterviewManagement: React.FC = () => {
  const { interviews, updateInterviewStatus } = useData();
  const navigate = useNavigate();

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInterviews = interviews.filter((i) => {
    if (statusFilter === 'ALL') return true;
    return i.status === statusFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Campus Interview Command & Logistics
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Coordinate virtual technical rounds, panel evaluations, and candidate status updates.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? `All Sessions (${interviews.length})` : st}
          </button>
        ))}
      </div>

      {/* Interviews Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Candidate</th>
                <th className="py-4 px-5">Applied Position</th>
                <th className="py-4 px-5">Round Format</th>
                <th className="py-4 px-5">Date & Time</th>
                <th className="py-4 px-5">Panel Lead</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredInterviews.map((intv) => (
                <tr key={intv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-bold text-sm text-[#0F172A] block">{intv.studentName}</span>
                    <span className="text-[11px] text-[#64748B] font-mono">{intv.id}</span>
                  </td>

                  <td className="py-4 px-5 font-semibold text-[#0F172A]">
                    {intv.jobTitle}
                  </td>

                  <td className="py-4 px-5">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {intv.round}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <span className="font-bold text-[#0F172A] block">{intv.date}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">{intv.time} IST</span>
                  </td>

                  <td className="py-4 px-5 text-[#64748B]">
                    {intv.interviewerName}
                  </td>

                  <td className="py-4 px-5">
                    <StatusBadge status={intv.status} size="sm" />
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={intv.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#4F46E5] text-white hover:bg-indigo-700 rounded-lg transition-colors"
                        title="Launch Meeting"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </a>

                      {intv.status === 'SCHEDULED' && (
                        <button
                          onClick={() => updateInterviewStatus(intv.id, 'COMPLETED')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ScheduleInterviewModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
};
