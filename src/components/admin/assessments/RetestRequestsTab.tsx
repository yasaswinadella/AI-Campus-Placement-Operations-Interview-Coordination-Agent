import React, { useState } from 'react';
import { RetestRequest } from '../../../types';
import { RotateCcw, CheckCircle2, XCircle, Clock, Search, Filter, Sparkles, MessageSquare } from 'lucide-react';

interface RetestRequestsTabProps {
  retestRequests: RetestRequest[];
  onOpenDecisionModal: (request: RetestRequest) => void;
}

export const RetestRequestsTab: React.FC<RetestRequestsTabProps> = ({
  retestRequests,
  onOpenDecisionModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filteredRequests = retestRequests.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = retestRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = retestRequests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = retestRequests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Candidate Retest Applications</h2>
          <p className="text-xs text-slate-500">
            Manage re-evaluation permissions and configure targeted retest assessments (Same vs New Questions).
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Pending Decisions</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Approved Retests</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Declined Requests</span>
            <p className="text-2xl font-extrabold text-slate-600 mt-1">{rejectedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, skill, reason..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Status: Pending</option>
              <option value="Approved">Status: Approved</option>
              <option value="Rejected">Status: Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Skill Domain</th>
                <th className="py-3.5 px-4">Prior Score</th>
                <th className="py-3.5 px-4">Candidate Justification</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status / Strategy</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No retest requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-[11px]">
                      {req.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{req.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.studentEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{req.skill}</span>
                      <span className="text-[10px] text-slate-400">{req.assessmentName}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-amber-600 text-xs">{req.previousScore}%</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 italic text-[11px] line-clamp-2">"{req.reason}"</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{req.date}</td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                          {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                          <span>{req.status}</span>
                        </span>

                        {req.adminDecision?.questionStrategy && (
                          <span className="block text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            {req.adminDecision.questionStrategy}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'Pending' ? (
                        <button
                          onClick={() => onOpenDecisionModal(req)}
                          className="px-3 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          Decide
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenDecisionModal(req)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
