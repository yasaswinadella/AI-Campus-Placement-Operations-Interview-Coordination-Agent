import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Award,
  DollarSign,
  Download,
  Building2,
  GraduationCap,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminOffers: React.FC = () => {
  const { applications, students, showToast } = useData();

  const [selectedCompany, setSelectedCompany] = useState('ALL');

  const offers = applications.filter((a) => a.status === 'OFFERED');

  const filteredOffers = offers.filter((o) => {
    if (selectedCompany === 'ALL') return true;
    return o.company === selectedCompany;
  });

  const handleExportOffers = () => {
    const headers = 'ApplicationID,CandidateName,Company,Role,AppliedDate\n';
    const rows = filteredOffers
      .map((o) => `${o.id},"${o.studentName}","${o.company}","${o.jobTitle}",${o.appliedDate}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Campus_Offers_Ledger_2026.csv';
    a.click();
    showToast('Offers Exported', 'Downloaded verified offers ledger.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Official Placement Offers & Compensation Ledger
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Confirmed campus placement offer letters, joining CTC packages, and acceptance records.
          </p>
        </div>

        <button
          onClick={handleExportOffers}
          className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-[#64748B]" />
          <span>Export Offers Ledger CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Total Offers Extended</span>
          <h3 className="text-3xl font-extrabold text-[#22C55E] mt-2">{offers.length} Offers</h3>
          <p className="text-xs text-[#64748B] mt-1">Across 12 recruiting organizations</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Highest Compensation</span>
          <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">48.0 LPA</h3>
          <p className="text-xs text-[#64748B] mt-1">TechNova Systems • Distributed Platform SDE</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Average Batch CTC</span>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">16.4 LPA</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">+18.5% YoY Growth</p>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Candidate</th>
                <th className="py-4 px-5">Hiring Company</th>
                <th className="py-4 px-5">Designation</th>
                <th className="py-4 px-5">Offered Package (CTC)</th>
                <th className="py-4 px-5">Offer Status</th>
                <th className="py-4 px-5 text-right">Letter Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-bold text-sm text-[#0F172A] block">{offer.studentName}</span>
                    <span className="text-[11px] text-[#64748B]">{offer.college}</span>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={offer.companyLogo}
                        alt={offer.company}
                        className="w-7 h-7 rounded-lg object-cover border border-[#E2E8F0]"
                      />
                      <span className="font-semibold text-sm text-[#0F172A]">{offer.company}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-semibold text-[#0F172A]">
                    {offer.jobTitle}
                  </td>

                  <td className="py-4 px-5 font-bold text-emerald-600">
                    18.5 LPA Fixed
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accepted by Candidate
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => showToast('Offer Letter Verified', `Displaying ${offer.studentName}'s letter.`)}
                      className="text-xs font-semibold text-[#4F46E5] hover:underline"
                    >
                      View Letter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
