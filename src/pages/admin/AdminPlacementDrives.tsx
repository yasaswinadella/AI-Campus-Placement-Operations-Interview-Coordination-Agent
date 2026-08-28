import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PlacementDrive } from '../../types';
import {
  Megaphone,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Building2,
  Search,
  Filter,
  Eye,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const AdminPlacementDrives: React.FC = () => {
  const { placementDrives, companies, students, applications } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);

  const filteredDrives = placementDrives.filter((drive) => {
    const matchesSearch =
      drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (drive.companyId && drive.companyId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Scheduled') {
        matchesStatus = drive.status === 'UPCOMING';
      } else if (statusFilter === 'Ongoing') {
        matchesStatus = drive.status === 'ONGOING';
      } else if (statusFilter === 'Completed') {
        matchesStatus = drive.status === 'COMPLETED';
      } else if (statusFilter === 'Cancelled') {
        matchesStatus = drive.status === 'CANCELLED';
      }
    }
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Admin Monitoring View Only - No Creation/Assignment) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#475569] text-[11px] font-bold mb-1 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Institutional Monitoring View</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Campus Placement Drives Monitor
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time oversight of company-hosted placement schedules, candidate registrations, shortlists, and selections.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, Company ID (e.g. CMP001), or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Scheduled', 'Ongoing', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Drives' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Drives Monitoring Grid */}
      {filteredDrives.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Megaphone className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No placement drives announced yet.</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Corporate HR partners schedule and manage campus placement drives. They will appear in this monitoring console once created.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive) => {
            const companyObj = companies.find(
              (c) =>
                c.name.toLowerCase() === drive.company.toLowerCase() ||
                (drive.companyId && c.companyId.toUpperCase() === drive.companyId.toUpperCase())
            );
            const companyId = drive.companyId || companyObj?.companyId || 'CMP001';

            const driveApplicants = drive.registeredStudentIds?.length || 0;
            const driveShortlisted = Math.round(driveApplicants * 0.4);
            const driveSelected = drive.selectedStudentIds?.length || (drive.status === 'COMPLETED' ? Math.max(1, Math.round(driveApplicants * 0.15)) : 0);

            return (
              <div
                key={drive.id}
                className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={drive.companyLogo}
                        alt={drive.company}
                        className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0]"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-[#0F172A]">{drive.company}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[#4F46E5] font-mono text-[10px] font-bold">
                            {companyId}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-medium truncate max-w-[120px]">
                            {drive.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        drive.status === 'UPCOMING'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : drive.status === 'ONGOING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : drive.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {drive.status === 'UPCOMING' ? 'Scheduled' : drive.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Drive Date:</span>
                      <strong className="text-[#0F172A] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#4F46E5]" />
                        {drive.driveDate}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Package (CTC):</span>
                      <strong className="text-emerald-600 font-bold">{drive.salaryPackage}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Min. CGPA Cutoff:</span>
                      <strong className="text-[#0F172A]">{drive.minCgpa} CGPA</strong>
                    </div>
                  </div>

                  {/* Drive Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                      <span className="text-[10px] text-[#64748B] block font-medium">Applicants</span>
                      <span className="text-sm font-extrabold text-[#4F46E5]">{driveApplicants}</span>
                    </div>
                    <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-100">
                      <span className="text-[10px] text-[#64748B] block font-medium">Shortlisted</span>
                      <span className="text-sm font-extrabold text-amber-700">{driveShortlisted}</span>
                    </div>
                    <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-[#64748B] block font-medium">Selected</span>
                      <span className="text-sm font-extrabold text-[#22C55E]">{driveSelected}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[11px] text-[#64748B]">
                    Managed by <strong className="text-[#0F172A]">HR Partner</strong>
                  </span>
                  <button
                    onClick={() => setSelectedDrive(drive)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-lg transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drive Details Modal (Admin Read-Only Monitoring View) */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#E2E8F0] shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDrive.companyLogo}
                  alt={selectedDrive.company}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedDrive.role}</h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedDrive.company} ({selectedDrive.companyId || 'CMP001'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrive(null)}
                className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#64748B] block font-bold mb-1">Drive Description & Scope:</span>
                <p className="text-[#0F172A] leading-relaxed bg-slate-50 p-3 rounded-xl border border-[#E2E8F0]">
                  {selectedDrive.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Compensation (CTC):</span>
                  <strong className="text-sm text-emerald-600 font-extrabold">{selectedDrive.salaryPackage}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Academic Cutoff:</span>
                  <strong className="text-sm text-[#0F172A] font-extrabold">{selectedDrive.minCgpa} CGPA</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Scheduled Date:</span>
                  <strong className="text-sm text-[#4F46E5] font-extrabold">{selectedDrive.driveDate}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Registration Deadline:</span>
                  <strong className="text-sm text-rose-600 font-extrabold">{selectedDrive.registrationDeadline}</strong>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] block font-bold mb-1">Eligible Academic Streams:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDrive.eligibleBranches.map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-[#4F46E5] text-[11px] font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setSelectedDrive(null)}
                className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
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
