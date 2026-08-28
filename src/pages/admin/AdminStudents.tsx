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
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { students, applications, showToast } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedPlacementStatus, setSelectedPlacementStatus] = useState('ALL');

  const safeStudents = students || [];
  const safeApps = applications || [];

  const filteredStudents = safeStudents.filter((student) => {
    if (!student) return false;
    const isPlaced = safeApps.some((a) => a && a.studentId === student.id && a.status === 'OFFERED');
    const sName = (student.name || '').toLowerCase();
    const sEmail = (student.email || '').toLowerCase();
    const sBranch = (student.branch || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = sName.includes(q) || sEmail.includes(q) || sBranch.includes(q);
    const matchesBranch = selectedBranch === 'ALL' || (student.branch || '').includes(selectedBranch);
    const matchesStatus =
      selectedPlacementStatus === 'ALL' ||
      (selectedPlacementStatus === 'PLACED' && isPlaced) ||
      (selectedPlacementStatus === 'UNPLACED' && !isPlaced);

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleExportRoster = () => {
    const headers = 'ID,Name,Email,College,Branch,CGPA,GraduationYear,SkillScore,Readiness\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `${s.id},"${s.name}",${s.email},"${s.college}","${s.branch}",${s.cgpa},${s.graduationYear},${s.overallSkillScore},${s.careerReadiness}`
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
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Enrolled Student Directory & Academic Records
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Master database of all undergraduate candidates enrolled in campus placement drives.
          </p>
        </div>

        <button
          onClick={handleExportRoster}
          className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-[#64748B]" />
          <span>Export Student Roster CSV</span>
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
            placeholder="Search by student name, roll number, or department..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
          >
            <option value="ALL">All Academic Branches</option>
            <option value="Computer Science">Computer Science & Engg</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics & Comm</option>
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
              {filteredStudents.map((student) => {
                const isPlaced = applications.some((a) => a.studentId === student.id && a.status === 'OFFERED');

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] font-bold text-xs flex items-center justify-center border border-indigo-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#0F172A]">{student.name}</p>
                          <p className="text-[11px] text-[#64748B]">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-semibold text-[#0F172A] block">{student.branch}</span>
                      <span className="text-[11px] text-[#64748B]">Class of {student.graduationYear}</span>
                    </td>

                    <td className="py-4 px-5 font-bold text-[#4F46E5]">
                      {student.cgpa} CGPA
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-emerald-600">{student.overallSkillScore}%</span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4F46E5] rounded-full"
                            style={{ width: `${student.careerReadiness}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs">{student.careerReadiness}%</span>
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
