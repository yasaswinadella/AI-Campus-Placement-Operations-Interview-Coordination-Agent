import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { CreateDriveModal } from '../../components/ui/CreateDriveModal';
import {
  Shield,
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  Megaphone,
  Download,
  Users,
  Briefcase,
  FileCheck2,
  Sparkles,
  ChevronRight,
  DollarSign,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { students = [], jobs = [], placementDrives = [], companies = [], applications = [], showToast } = useData();
  const navigate = useNavigate();

  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false);

  const safeStudents = students || [];
  const safeApps = applications || [];
  const safeDrives = placementDrives || [];
  const safeCompanies = companies || [];

  const offeredCount = safeApps.filter((a) => a && a.status === 'OFFERED').length;
  const placementRate = Math.round((offeredCount / Math.max(1, safeStudents.length)) * 100);

  const handleExportFullReport = () => {
    const reportContent = `CareerFlow Campus Placement Official Report 2026\nGenerated: ${new Date().toISOString()}\nTotal Registered Students: ${safeStudents.length}\nCorporate Partners: ${safeCompanies.length}\nActive Drives: ${safeDrives.length}\nTotal Offers: ${offeredCount}\nBatch Placement Rate: ${placementRate}%\nAverage Package: 16.4 LPA\nHighest Package: 48.0 LPA`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Campus_Placement_Report_2026.txt';
    a.click();
    showToast('Report Exported', 'Downloaded Institutional Placement Report.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-bold border border-white/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Campus Placement Administration Officer Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Institutional Placement Dashboard
            </h1>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              Batch 2026 placement season: <strong className="text-white font-bold">{students.length} students enrolled</strong> across 8 academic departments with <strong className="text-white font-bold">{companies.length} corporate hiring partners</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin/jobs')}
              className="px-5 py-3 rounded-xl bg-white text-[#4F46E5] font-bold text-xs shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Upload Campus Jobs</span>
            </button>
            <button
              onClick={() => setIsCreateDriveOpen(true)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>Announce Drive</span>
            </button>
            <button
              onClick={handleExportFullReport}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          id="admin-stat-students"
          title="Enrolled Candidates"
          value={students.length}
          subtitle="98% verification complete"
          change="+100% active"
          isPositive={true}
          icon={GraduationCap}
          iconBgColor="bg-indigo-50"
          iconColor="text-[#4F46E5]"
        />
        <StatCard
          id="admin-stat-companies"
          title="Verified Corporate Partners"
          value={companies.length}
          subtitle="Tier-1 & Multinational"
          icon={Building2}
          iconBgColor="bg-emerald-50"
          iconColor="text-[#22C55E]"
        />
        <StatCard
          id="admin-stat-offers"
          title="Offers Released"
          value={offeredCount}
          subtitle={`Placement Rate: ${placementRate}%`}
          change="+8 this week"
          isPositive={true}
          icon={Award}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          id="admin-stat-ctc"
          title="Average CTC Package"
          value="16.4 LPA"
          subtitle="Highest: 48.0 LPA"
          change="+18.5% YoY"
          isPositive={true}
          icon={DollarSign}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Main Administrative Views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Drives & Corporate Partners */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Placement Drives */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Scheduled Placement Drives</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Upcoming on-campus hiring sessions</p>
              </div>
              <button
                onClick={() => navigate('/admin/placement-drives')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                View all ({placementDrives.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {placementDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="p-4 rounded-xl border border-[#E2E8F0] hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={drive.companyLogo}
                      alt={drive.company}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A]">{drive.company}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-[#4F46E5]">
                          {drive.salaryPackage}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {drive.role} • Min {drive.minCgpa} CGPA • Drive Date: <strong className="text-[#0F172A]">{drive.driveDate}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 block">
                      {(drive.registeredStudentIds || []).length} Registered
                    </span>
                    <span className="text-[10px] text-[#64748B]">Deadline: {drive.registrationDeadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Placement Benchmarks */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">Department Placement Performance</h3>
            <div className="space-y-4">
              {[
                { dept: 'Computer Science & Engineering', placed: 94, avgCtc: '18.2 LPA' },
                { dept: 'Information Technology', placed: 91, avgCtc: '16.5 LPA' },
                { dept: 'Electronics & Communication', placed: 86, avgCtc: '14.0 LPA' },
                { dept: 'Electrical Engineering', placed: 78, avgCtc: '11.5 LPA' },
              ].map((d) => (
                <div key={d.dept} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#0F172A]">{d.dept}</span>
                    <span className="text-[#4F46E5] font-bold">{d.placed}% Placed (Avg: {d.avgCtc})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${d.placed}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Corporate Partners List & Quick Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#0F172A]">Corporate Partners</h3>
              <button
                onClick={() => navigate('/admin/companies')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {companies.map((comp) => (
                <div key={comp.id} className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#E2E8F0]"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#0F172A]">{comp.name}</h4>
                      <p className="text-[10px] text-[#64748B]">{comp.industry} • {comp.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    {comp.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Placement Drive Modal */}
      <CreateDriveModal isOpen={isCreateDriveOpen} onClose={() => setIsCreateDriveOpen(false)} />
    </div>
  );
};
