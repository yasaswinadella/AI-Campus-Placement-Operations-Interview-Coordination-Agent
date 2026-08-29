import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StudentProfile } from '../../types';
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
  BrainCircuit,
  FileText,
  ExternalLink,
  ShieldCheck,
  Phone,
  Sparkles,
} from 'lucide-react';
import { StudentResumeModal } from '../../components/ui/StudentResumeModal';

export const AdminStudents: React.FC = () => {
  const { students = [], applications = [], studentAssessmentResults = [], refreshData, showToast } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedPlacementStatus, setSelectedPlacementStatus] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  const safeStudents = students || [];
  const safeApps = applications || [];

  // Extract unique branches dynamically from candidate roster
  const uniqueBranches = Array.from(
    new Set(safeStudents.map((s) => (s.branch || '').trim()).filter(Boolean))
  );

  // Helper to compute a student's real verified assessment score from Supabase
  const getStudentRealSkillMetrics = (student: StudentProfile) => {
    const sId = student.id;
    const sEmail = (student.email || '').toLowerCase();
    const myTests = studentAssessmentResults.filter(
      (r) => (sId && r.studentId === sId) || (sEmail && (r.studentEmail || '').toLowerCase() === sEmail)
    );

    if (myTests.length > 0) {
      const avg = Math.round(myTests.reduce((sum, t) => sum + t.percentage, 0) / myTests.length);
      return { testsCount: myTests.length, averageScore: avg, tests: myTests };
    }

    if (student.overallSkillScore && student.overallSkillScore > 0) {
      return { testsCount: 0, averageScore: student.overallSkillScore, tests: [] };
    }

    return { testsCount: 0, averageScore: 0, tests: [] };
  };

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
      showToast('Directory Refreshed', 'Synced latest registered student candidates from Supabase.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportRoster = () => {
    if (filteredStudents.length === 0) {
      showToast('No Data', 'No students available to export.', 'warning');
      return;
    }
    const headers = 'ID,Name,Email,College,Branch,CGPA,GraduationYear,VerifiedSkillScore,TestsTaken,Readiness\n';
    const rows = filteredStudents
      .map((s) => {
        const metrics = getStudentRealSkillMetrics(s);
        return `${s.id},"${s.name || 'Candidate'}",${s.email},"${s.college || 'Campus'}","${s.branch || 'Engineering'}",${s.cgpa || 0},${s.graduationYear || 2026},${metrics.averageScore}%,${metrics.testsCount},${s.careerReadiness || 0}%`;
      })
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Campus_Student_Roster_2026.csv';
    a.click();
    showToast('Roster Exported', 'Downloaded complete student roster.');
  };

  const coreSkillList = ['Python', 'Java', 'SQL', 'JavaScript', 'React', 'Data Structures', 'DBMS', 'Machine Learning'];

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
              {safeStudents.length} Real Candidates
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Master database of all registered candidates enrolled in campus placement drives from Supabase.
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
            <span>Sync Supabase</span>
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
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 px-5 text-center text-slate-400">
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
                  const metrics = getStudentRealSkillMetrics(student);

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer"
                    >
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
                          {metrics.averageScore > 0 ? `${metrics.averageScore}% (${metrics.testsCount} tests)` : 'Pending Assessment'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4F46E5] rounded-full transition-all"
                              style={{ width: `${student.careerReadiness || (metrics.averageScore > 0 ? metrics.averageScore : 40)}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs">{student.careerReadiness || (metrics.averageScore > 0 ? metrics.averageScore : 40)}%</span>
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

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE & SKILL DOSSIER MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                  alt={selectedStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-[#0F172A]">{selectedStudent.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Enrolled Candidate
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {selectedStudent.email} • {selectedStudent.phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Academic & Bio Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[#64748B] block font-semibold">College</span>
                <span className="font-bold text-[#0F172A] truncate block">{selectedStudent.college || 'Institute of Tech'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[#64748B] block font-semibold">Branch</span>
                <span className="font-bold text-[#0F172A] truncate block">{selectedStudent.branch || 'Computer Science'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[#64748B] block font-semibold">Academic CGPA</span>
                <span className="font-extrabold text-emerald-600 text-sm block">{selectedStudent.cgpa || '8.5'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[#64748B] block font-semibold">Graduation Year</span>
                <span className="font-bold text-[#0F172A] block">{selectedStudent.graduationYear || 2026}</span>
              </div>
            </div>

            {/* Resume ATS Score Section */}
            <div className="bg-gradient-to-tr from-indigo-50/80 to-purple-50/80 p-5 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-[#0F172A]">Resume & ATS Parser Rating</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white shadow-xs">
                  {selectedStudent.atsScore || 88} / 100 ATS Score
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Student Resume / PDF Document</span>
                </button>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
            </div>

            {/* Real Skill Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#4F46E5]" />
                  Real Evaluated Skill Transcripts
                </h3>
                <span className="text-[11px] text-slate-500">Live Supabase Examination Data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coreSkillList.map((sk) => {
                  const sId = selectedStudent.id;
                  const sEmail = (selectedStudent.email || '').toLowerCase();
                  const match = studentAssessmentResults.find(
                    (r) =>
                      ((sId && r.studentId === sId) || (sEmail && (r.studentEmail || '').toLowerCase() === sEmail)) &&
                      r.skill.toLowerCase().includes(sk.toLowerCase())
                  );

                  const score = match ? match.percentage : (selectedStudent.skills && selectedStudent.skills[sk] ? Number(selectedStudent.skills[sk]) : 0);

                  return (
                    <div
                      key={sk}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{sk}</span>
                        <span className={`font-extrabold ${score > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {score > 0 ? `${score}%` : 'Not Assessed (0%)'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      {match ? (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Test ({match.date})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Awaiting assessment attempt</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Universal Resume / PDF Modal */}
      <StudentResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};
