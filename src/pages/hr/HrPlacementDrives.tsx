import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PlacementDrive } from '../../types';
import {
  Megaphone,
  Plus,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Trash2,
  Building2,
  GraduationCap,
  Clock,
  Briefcase,
  Search,
  Filter,
  X,
  Edit2,
} from 'lucide-react';

export const HrPlacementDrives: React.FC = () => {
  const { user } = useAuth();
  const { placementDrives, createPlacementDrive, updatePlacementDrive, deletePlacementDrive, students } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriveForRoster, setSelectedDriveForRoster] = useState<PlacementDrive | null>(null);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);

  // Form State
  const [role, setRole] = useState('');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [eligibleBranches, setEligibleBranches] = useState('Computer Science, Information Technology');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [driveDate, setDriveDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [description, setDescription] = useState('');

  // Scoped to HR's company if user is HR
  const userCompany = user?.company || '';
  const userCompanyId = user?.companyId || '';

  const companyDrives = placementDrives.filter((d) => {
    if (!userCompany) return true;
    return d.company.toLowerCase() === userCompany.toLowerCase() || (d.companyId && d.companyId === userCompanyId);
  });

  const filteredDrives = companyDrives.filter((d) => {
    const matchesSearch =
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingDrive(null);
    setRole('');
    setSalaryPackage('');
    setMinCgpa('7.5');
    setEligibleBranches('Computer Science, Information Technology');
    setMaxBacklogs('0');
    setDriveDate('');
    setRegistrationDeadline('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (drive: PlacementDrive) => {
    setEditingDrive(drive);
    setRole(drive.role);
    setSalaryPackage(drive.salaryPackage);
    setMinCgpa(drive.minCgpa.toString());
    setEligibleBranches(drive.eligibleBranches.join(', '));
    setMaxBacklogs(drive.maxBacklogs?.toString() || '0');
    setDriveDate(drive.driveDate);
    setRegistrationDeadline(drive.registrationDeadline);
    setDescription(drive.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !salaryPackage || !driveDate || !registrationDeadline) return;

    const branches = eligibleBranches.split(',').map((b) => b.trim()).filter(Boolean);

    if (editingDrive) {
      updatePlacementDrive(editingDrive.id, {
        role,
        salaryPackage,
        minCgpa: parseFloat(minCgpa) || 7.0,
        eligibleBranches: branches,
        maxBacklogs: parseInt(maxBacklogs, 10) || 0,
        driveDate,
        registrationDeadline,
        description,
      });
    } else {
      createPlacementDrive({
        company: userCompany || 'Tech Corporate Partner',
        companyId: userCompanyId || 'CMP001',
        companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
        role,
        salaryPackage,
        minCgpa: parseFloat(minCgpa) || 7.0,
        eligibleBranches: branches,
        maxBacklogs: parseInt(maxBacklogs, 10) || 0,
        minAssessmentScore: 75,
        driveDate,
        registrationDeadline,
        status: 'UPCOMING',
        description: description || `Official campus recruitment drive for ${role} positions.`,
      });
    }

    setIsModalOpen(false);
  };

  const handleStatusChange = (driveId: string, newStatus: any) => {
    updatePlacementDrive(driveId, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Company Placement Drives
            </h1>
            {userCompanyId && (
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[#4F46E5] text-xs font-mono font-bold">
                {userCompanyId}
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Create, schedule, and oversee recruitment drives and candidate registration rosters for {userCompany || 'your company'}.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Placement Drive</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drives by role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((st) => (
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

      {/* Drives List */}
      {filteredDrives.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Megaphone className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No placement drives available yet.</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Schedule a new campus placement drive to announce hiring packages and collect student registrations.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Drive</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrives.map((drive) => {
            const registeredStudents = students.filter((s) =>
              (drive.registeredStudentIds || []).includes(s.id)
            );

            return (
              <div
                key={drive.id}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={drive.companyLogo}
                        alt={drive.company}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]"
                      />
                      <div>
                        <h3 className="font-bold text-base text-[#0F172A]">{drive.role}</h3>
                        <p className="text-xs text-[#64748B]">{drive.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                        {drive.salaryPackage}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          drive.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : drive.status === 'ONGOING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : drive.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {drive.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">{drive.description}</p>

                  <div className="grid grid-cols-2 gap-2 p-3.5 bg-slate-50 rounded-xl border border-[#E2E8F0] text-xs">
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Min. CGPA Cutoff:</span>
                      <strong className="text-[#0F172A]">{drive.minCgpa} CGPA</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Drive Date:</span>
                      <strong className="text-[#4F46E5]">{drive.driveDate}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Eligible Branches:</span>
                      <strong className="text-[#0F172A] truncate block">{drive.eligibleBranches.join(', ')}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] text-[11px] block">Registration Deadline:</span>
                      <strong className="text-rose-600">{drive.registrationDeadline}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDriveForRoster(drive)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-indigo-800"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Registered ({registeredStudents.length})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <select
                      value={drive.status}
                      onChange={(e) => handleStatusChange(drive.id, e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-[#E2E8F0] rounded-lg text-[11px] font-semibold text-[#0F172A] focus:outline-none"
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleOpenEdit(drive)}
                      className="p-1.5 text-[#64748B] hover:text-[#4F46E5] hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit Drive"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deletePlacementDrive(drive.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                      title="Cancel/Delete Drive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Drive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#E2E8F0] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {editingDrive ? 'Edit Placement Drive' : 'Create Campus Placement Drive'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Announce hiring schedule and eligibility criteria for {userCompany || 'your company'}.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Job Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graduate Software Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Salary Package (CTC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18.5 LPA"
                    value={salaryPackage}
                    onChange={(e) => setSalaryPackage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Min. CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g. 7.5"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Max Backlogs Allowed</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    placeholder="0"
                    value={maxBacklogs}
                    onChange={(e) => setMaxBacklogs(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Eligible Academic Branches (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Information Technology, Electronics"
                  value={eligibleBranches}
                  onChange={(e) => setEligibleBranches(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Drive Date *</label>
                  <input
                    type="date"
                    required
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Registration Deadline *</label>
                  <input
                    type="date"
                    required
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Drive Details & Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide interview process details, rounds overview, and requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
                >
                  {editingDrive ? 'Save Changes' : 'Publish Placement Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registered Students Roster Modal */}
      {selectedDriveForRoster && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E2E8F0] shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Candidate Registration Roster</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {selectedDriveForRoster.role} • {selectedDriveForRoster.company}
                </p>
              </div>
              <button
                onClick={() => setSelectedDriveForRoster(null)}
                className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {students.filter((s) => (selectedDriveForRoster.registeredStudentIds || []).includes(s.id)).length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#0F172A]">No students registered for this drive yet.</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Candidates meeting the {selectedDriveForRoster.minCgpa} CGPA cutoff will appear here once they enroll.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {students
                  .filter((s) => (selectedDriveForRoster.registeredStudentIds || []).includes(s.id))
                  .map((student) => (
                    <div
                      key={student.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-[#E2E8F0] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#0F172A]">{student.name}</h4>
                          <p className="text-[11px] text-[#64748B]">{student.email} • {student.branch}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#4F46E5]">{student.cgpa} CGPA</span>
                        <span className="block text-[10px] text-emerald-600 font-semibold">Eligible</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setSelectedDriveForRoster(null)}
                className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
