import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  RefreshCw,
  Users,
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { students = [], applications = [], refreshData, showToast } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedPlacementStatus, setSelectedPlacementStatus] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const safeStudents = students || [];
  const safeApps = applications || [];

  // Extract unique branches dynamically from candidate roster
  const uniqueBranches = Array.from(
    new Set(safeStudents.map((s) => (s.branch || '').trim()).filter(Boolean))
  );

  const filteredStudents = safeStudents.filter((student) => {
    if (!student) return false;
    const isPlaced = safeApps.some((a) => a && a.studentId === student.id && a.status === 'OFFERED');
    const sName = (student.name || '').toLowerCase();
    const sEmail = (student.email || '').toLowerCase();
    const sBranch = (student.branch || '').toLowerCase();
    const sCollege = (student.college || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || sName.includes(q) || sEmail.includes(q) || sBranch.includes(q) || sCollege.includes(q);
    const matchesBranch = selectedBranch === 'ALL' || (student.branch || '').toLowerCase().includes(selectedBranch.toLowerCase());
    const matchesStatus =
      selectedPlacementStatus === 'ALL' ||
      (selectedPlacementStatus === 'PLACED' && isPlaced) ||
      (selectedPlacementStatus === 'UNPLACED' && !isPlaced);

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      showToast('Directory Refreshed', 'Synced latest registered student candidates.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportRoster = () => {
    if (filteredStudents.length === 0) {
      showToast('No Data', 'No students available to export.', 'warning');
      return;
    }
    const headers = 'ID,Name,Email,College,Branch,CGPA,GraduationYear,SkillScore,Readiness\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `${s.id},"${s.name || 'Candidate'}",${s.email},"${s.college || 'Campus'}","${s.branch || 'Engineering'}",${s.cgpa || 0},${s.graduationYear || 2026},${s.overallSkillScore || 0},${s.careerReadiness || 0}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Campus_Student_Roster_2026.csv';
    a.click();
    showToast('Roster Exported', 'Downloaded complete student roster.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Enrolled Student Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-xs font-bold">
              {safeStudents.length} Registered
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Master database of all registered candidates enrolled in campus placement drives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
            title="Refresh candidate roster"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#64748B] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportRoster}
            className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export Roster CSV</span>
          </button>
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
            placeholder="Search by student name, email, college, or branch..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
          >
            <option value="ALL">All Academic Branches ({safeStudents.length})</option>
            {uniqueBranches.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>

          <select
            value={selectedPlacementStatus}
            onChange={(e) => setSelectedPlacementStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
          >
            <option value="ALL">All Placement Statuses</option>
            <option value="PLACED">Placed (Offer Extended)</option>
            <option value="UNPLACED">Seeking Placement</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Student Candidate</th>
                <th className="py-4 px-5">Department & Batch</th>
                <th className="py-4 px-5">CGPA Score</th>
                <th className="py-4 px-5">Verified Skill Score</th>
                <th className="py-4 px-5">Career Readiness</th>
                <th className="py-4 px-5">Placement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 px-5 text-center text-slate-400">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-sm text-[#0F172A]">No registered students found</p>
                    <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                      {searchQuery || selectedBranch !== 'ALL' || selectedPlacementStatus !== 'ALL'
                        ? 'No candidates match your current search and filter criteria. Try clearing the filter.'
                        : 'Students who register through the Student Portal will automatically appear in this live directory.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isPlaced = safeApps.some((a) => a && a.studentId === student.id && a.status === 'OFFERED');
                  const candidateName = student.name || 'Candidate';
                  const initialLetter = candidateName.charAt(0).toUpperCase() || 'S';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={candidateName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] font-bold text-xs flex items-center justify-center border border-indigo-100 shrink-0">
                            {initialLetter}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#0F172A]">{candidateName}</p>
                            <p className="text-[11px] text-[#64748B]">{student.email}</p>
                            {student.college ? (
                              <p className="text-[10px] text-slate-400">{student.college}</p>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-semibold text-[#0F172A] block">{student.branch || 'General Engineering'}</span>
                        <span className="text-[11px] text-[#64748B]">Class of {student.graduationYear || 2026}</span>
                      </td>

                      <td className="py-4 px-5 font-bold text-[#4F46E5]">
                        {student.cgpa ? `${student.cgpa} CGPA` : 'N/A'}
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-emerald-600">
                          {student.overallSkillScore ? `${student.overallSkillScore}%` : 'Pending Assessment'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4F46E5] rounded-full transition-all"
                              style={{ width: `${student.careerReadiness || 0}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs">{student.careerReadiness || 0}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {isPlaced ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Placed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            In Pipeline
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
