import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ScheduleInterviewModal } from '../../components/ui/ScheduleInterviewModal';
import {
  Award,
  Users,
  Search,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  Mail,
  GraduationCap,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export const HrShortlistedPool: React.FC = () => {
  const { students, applications, showToast } = useData();
  const navigate = useNavigate();

  const [minCgpaFilter, setMinCgpaFilter] = useState(8.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedStudentForSchedule, setSelectedStudentForSchedule] = useState<any>(null);

  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cf_deleted_shortlisted_students') || '[]');
    } catch {
      return [];
    }
  });

  const handleDeleteCandidate = (studentId: string, studentName: string) => {
    const updated = [...deletedIds, studentId];
    setDeletedIds(updated);
    localStorage.setItem('cf_deleted_shortlisted_students', JSON.stringify(updated));
    showToast('Candidate Removed', `${studentName} was removed from the shortlisted pool.`, 'info');
  };

  // Shortlisted students with CGPA >= minCgpaFilter
  const shortlistedTalent = students.filter(
    (s) =>
      !deletedIds.includes(s.id) &&
      s.cgpa >= minCgpaFilter &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branch.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportCsv = () => {
    const headers = 'ID,Name,Email,College,Branch,CGPA,GraduationYear,SkillScore,Readiness\n';
    const rows = shortlistedTalent
      .map(
        (s) =>
          `${s.id},"${s.name}",${s.email},"${s.college}","${s.branch}",${s.cgpa},${s.graduationYear},${s.overallSkillScore},${s.careerReadiness}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerFlow_Shortlisted_Pool_2026.csv`;
    a.click();
    showToast('Export Successful', 'Shortlisted talent pool exported to CSV.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Caliber Candidate Pool</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Verified Shortlisted Talent Pool
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Pre-evaluated candidates with verified skill mastery and academic cutoff clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            <span>Export Pool CSV</span>
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
            placeholder="Search candidate by name or branch..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#64748B]">Min CGPA Filter:</label>
          <select
            value={minCgpaFilter}
            onChange={(e) => setMinCgpaFilter(parseFloat(e.target.value))}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none font-bold text-[#4F46E5]"
          >
            <option value={7.5}>&gt;= 7.5 CGPA</option>
            <option value={8.0}>&gt;= 8.0 CGPA</option>
            <option value={8.5}>&gt;= 8.5 CGPA</option>
            <option value={9.0}>&gt;= 9.0 CGPA</option>
          </select>
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shortlistedTalent.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] font-extrabold text-base flex items-center justify-center border border-indigo-100">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0F172A]">{candidate.name}</h3>
                    <p className="text-xs text-[#64748B]">{candidate.branch}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                  {candidate.cgpa} CGPA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B]">Skill Index</span>
                  <p className="font-extrabold text-[#4F46E5] mt-0.5">{candidate.overallSkillScore}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B]">Readiness</span>
                  <p className="font-extrabold text-emerald-600 mt-0.5">{candidate.careerReadiness}%</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {Object.keys(candidate.skills).slice(0, 4).map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                  >
                    {sk}: {candidate.skills[sk]}%
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedStudentForSchedule(candidate);
                  setIsScheduleOpen(true);
                }}
                className="flex-1 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>
              <button
                onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                title="Delete candidate from shortlist"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedStudentForSchedule && (
        <ScheduleInterviewModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedStudentForSchedule(null);
          }}
          defaultStudentId={selectedStudentForSchedule.id}
        />
      )}
    </div>
  );
};
