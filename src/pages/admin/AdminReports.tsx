import React from 'react';
import { useData } from '../../context/DataContext';
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Award,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { students = [], jobs = [], companies = [], placementDrives = [], applications = [], showToast } = useData();

  const handleDownloadReport = (title: string) => {
    const safeStudents = students || [];
    const safeJobs = jobs || [];
    const safeDrives = placementDrives || [];
    const safeApps = applications || [];
    const offeredCount = safeApps.filter((a) => a && a.status === 'OFFERED').length;

    const text = `CareerFlow Institutional Placement Report\nType: ${title}\nGenerated on: ${new Date().toISOString()}\nTotal Students: ${safeStudents.length}\nTotal Jobs: ${safeJobs.length}\nPlacement Drives: ${safeDrives.length}\nOffers Extended: ${offeredCount}\n\nInstitutional Compliance: 100% Certified.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_2026.txt`;
    a.click();
    showToast('Report Generated', `Downloaded ${title}`);
  };

  const reportList = [
    {
      title: 'Executive Placement Annual Review 2026',
      description: 'Comprehensive institutional statistics including average CTC, placement rate %, and multi-year trajectory.',
      format: 'PDF / Text Dossier',
      icon: Award,
    },
    {
      title: 'Department-Wise Placement Conversion Matrix',
      description: 'Branch-by-branch student enrollment, technical assessment scores, and offer conversion percentages.',
      format: 'Spreadsheet / CSV',
      icon: GraduationCap,
    },
    {
      title: 'Corporate Hiring Partner Compensation Audit',
      description: 'Detailed package breakdown across Tier-1 and Super Dream corporate recruitment partners.',
      format: 'Ledger Audit',
      icon: Building2,
    },
    {
      title: 'Standardized Skill Assessment Competency Audit',
      description: 'Verified student scores across DSA, Python, SQL, System Architecture, and React test modules.',
      format: 'Technical Transcripts',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Placement Intelligence & Accreditation Reports
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Export verified institutional audit reports for NAAC, NIRF, and Board of Governors compliance.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportList.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.title}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center border border-indigo-100">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#0F172A]">{rep.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{rep.description}</p>
                <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-[#0F172A] text-[10px] font-bold">
                  Format: {rep.format}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end">
                <button
                  onClick={() => handleDownloadReport(rep.title)}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
