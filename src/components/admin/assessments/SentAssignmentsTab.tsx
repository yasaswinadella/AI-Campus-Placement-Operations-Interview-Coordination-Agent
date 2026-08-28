import React, { useState } from 'react';
import { StudentAssignment } from '../../../types';
import { Search, Send, Users, Calendar, Clock, CheckCircle2, AlertCircle, FileCheck2, Filter } from 'lucide-react';

interface SentAssignmentsTabProps {
  assignments: StudentAssignment[];
  onOpenSendModal: () => void;
}

export const SentAssignmentsTab: React.FC<SentAssignmentsTabProps> = ({
  assignments,
  onOpenSendModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'In Progress' | 'Completed' | 'Overdue'>('All');

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.assessmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skill.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Dispatched Candidate Assignments</h2>
          <p className="text-xs text-slate-500">
            Monitor active tests, candidate progress, deadlines, and completion records.
          </p>
        </div>

        <button
          onClick={onOpenSendModal}
          className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch New Assessment</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Dispatched', count: assignments.length, color: 'text-indigo-600' },
          {
            label: 'Completed',
            count: assignments.filter((a) => a.status === 'Completed').length,
            color: 'text-emerald-600',
          },
          {
            label: 'In Progress / Pending',
            count: assignments.filter((a) => a.status === 'New' || a.status === 'In Progress').length,
            color: 'text-amber-600',
          },
          {
            label: 'Overdue',
            count: assignments.filter((a) => a.status === 'Overdue').length,
            color: 'text-rose-600',
          },
        ].map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">{item.label}</span>
            <p className={`text-2xl font-extrabold mt-1 ${item.color}`}>{item.count}</p>
          </div>
        ))}
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, assessment..."
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
              <option value="New">Status: New</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Completed">Status: Completed</option>
              <option value="Overdue">Status: Overdue</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Assignment ID</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Assessment Name</th>
                <th className="py-3.5 px-4">Skill Domain</th>
                <th className="py-3.5 px-4">Questions</th>
                <th className="py-3.5 px-4">Time & Deadline</th>
                <th className="py-3.5 px-4">Status & Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No dispatched assignments found.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-[11px]">
                      {asg.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{asg.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{asg.studentEmail}</div>
                      <div className="text-[10px] text-slate-400">
                        {asg.studentBranch} • {asg.studentCollege}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{asg.assessmentName}</span>
                      <span className="text-[10px] text-slate-400">{asg.totalMarks} Total Marks</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                        {asg.skill} ({asg.difficulty})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-700">{asg.totalQuestions} Qs</span>
                      <span className="text-[10px] text-slate-500 block">
                        ({asg.mcqCount} MCQ • {asg.codingCount} Code • {asg.descriptiveCount} Desc)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{asg.timeLimit} mins</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Due: {asg.deadline}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            asg.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : asg.status === 'In Progress'
                              ? 'bg-indigo-100 text-indigo-800'
                              : asg.status === 'Overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asg.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {asg.status}
                        </span>

                        {asg.percentage !== undefined && (
                          <span className="text-xs font-black text-emerald-600">
                            {asg.percentage}% ({asg.score} pts)
                          </span>
                        )}
                      </div>
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
