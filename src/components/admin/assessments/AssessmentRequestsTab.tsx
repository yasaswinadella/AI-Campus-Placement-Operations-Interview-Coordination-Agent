import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { AssessmentRequestStatus, SkillCategory, StudentAssessmentRequest } from '../../../types';
import {
  Search,
  Filter,
  Eye,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  GraduationCap,
  Building,
  Calendar,
  AlertCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { StudentDetailAssessmentModal } from './StudentDetailAssessmentModal';
import { SendDirectAssessmentModal } from './SendDirectAssessmentModal';

export const AssessmentRequestsTab: React.FC = () => {
  const { studentAssessmentRequests, reviewAssessmentRequest, dispatchAiAssessmentDirectly } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [skillFilter, setSkillFilter] = useState<string>('ALL');

  // Modal states
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<StudentAssessmentRequest | null>(null);
  const [selectedRequestForSend, setSelectedRequestForSend] = useState<StudentAssessmentRequest | null>(null);

  // Metrics
  const totalCount = studentAssessmentRequests.length;
  const pendingCount = studentAssessmentRequests.filter((r) => r.status === 'Pending').length;
  const sentCount = studentAssessmentRequests.filter((r) => r.status === 'Assessment Sent' || r.status === 'Approved').length;
  const rejectedCount = studentAssessmentRequests.filter((r) => r.status === 'Rejected').length;

  // Filtered requests
  const filteredRequests = studentAssessmentRequests.filter((req) => {
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (skillFilter !== 'ALL' && req.requestedSkill !== skillFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (req.studentName || '').toLowerCase().includes(q);
      const matchEmail = (req.studentEmail || '').toLowerCase().includes(q);
      const matchCollege = (req.studentCollege || '').toLowerCase().includes(q);
      const matchSkill = (req.requestedSkill || '').toLowerCase().includes(q);
      const matchReason = (req.reason || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCollege && !matchSkill && !matchReason) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Requests
            </p>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Pending Review
            </p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Assessments Sent
            </p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{sentCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4F46E5]">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              Declined
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{rejectedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, skill, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#4F46E5]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assessment Sent">Assessment Sent</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Skill:</span>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden text-xs"
            >
              <option value="ALL">All Skills</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="DSA">DSA</option>
              <option value="SQL">SQL</option>
              <option value="DBMS">DBMS</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Communication">Communication</option>
              <option value="HTML/CSS">HTML/CSS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">College</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Requested Skill</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Request Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A]">No assessment requests found</h4>
                      <p className="text-xs text-slate-500">
                        When students request skill evaluations or tests from their portal, they will appear here for your review and assessment dispatch.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isPending = req.status === 'Pending';
                  const isSent = req.status === 'Assessment Sent';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                            {req.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-[#0F172A] block">{req.studentName}</span>
                            <span className="text-[10px] text-slate-400">CGPA: {req.studentCgpa || 8.4}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {req.studentEmail}
                      </td>

                      {/* College */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {req.studentCollege}
                      </td>

                      {/* Branch */}
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">
                        {req.studentBranch}
                      </td>

                      {/* Requested Skill */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-50 text-[#4F46E5] border border-indigo-100 whitespace-nowrap">
                          {req.requestedSkill}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-600 truncate" title={req.reason}>
                          {req.reason}
                        </p>
                      </td>

                      {/* Request Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {req.requestDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold inline-flex items-center gap-1 border ${
                            req.status === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : req.status === 'Assessment Sent'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : req.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {req.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {req.status === 'Assessment Sent' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                          {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {req.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{req.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequestForDetail(req)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={async () => {
                                  await dispatchAiAssessmentDirectly(req.requestedSkill, req.studentId);
                                  reviewAssessmentRequest(
                                    req.id,
                                    'Approved',
                                    '⚡ AI Automatically Dispatched 50-Question Benchmark Assessment'
                                  );
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 text-[11px] active:scale-95"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>⚡ AI Dispatch 50-Q Test</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedRequestForSend(req)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1 text-[11px]"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Custom</span>
                              </button>
                            </>
                          )}
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

      {/* Modals */}
      {selectedRequestForDetail && (
        <StudentDetailAssessmentModal
          isOpen={!!selectedRequestForDetail}
          onClose={() => setSelectedRequestForDetail(null)}
          request={selectedRequestForDetail}
        />
      )}

      {selectedRequestForSend && (
        <SendDirectAssessmentModal
          isOpen={!!selectedRequestForSend}
          onClose={() => setSelectedRequestForSend(null)}
          request={selectedRequestForSend}
        />
      )}
    </div>
  );
};
