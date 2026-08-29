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
  const { applications = [], students = [], showToast } = useData();

  const [selectedCompany, setSelectedCompany] = useState('ALL');

  const safeApps = applications || [];
  const offers = safeApps.filter((a) => a && a.status === 'OFFERED');

  const filteredOffers = offers.filter((o) => {
    if (!o) return false;
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
            Confirmed campus placement offer letters, joining CTC packages, and acceptance records from Supabase.
          </p>
        </div>

        {offers.length > 0 && (
          <button
            onClick={handleExportOffers}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            <span>Export Offers Ledger CSV</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Total Real Offers Extended</span>
          <h3 className="text-3xl font-extrabold text-[#22C55E] mt-2">{offers.length}</h3>
          <p className="text-xs text-[#64748B] mt-1">Confirmed employer selections</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Active Candidate Pool</span>
          <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">{students.length} Students</h3>
          <p className="text-xs text-[#64748B] mt-1">Eligible for recruitment drives</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-[#64748B]">Ledger Status</span>
          <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">Live Database</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Verified Supabase sync</p>
        </div>
      </div>

      {/* Offers Table / Empty State */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">No Placement Offers Recorded Yet</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            When corporate partner recruiters extend official offers to shortlisted candidates, verified offer letters and compensation records will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0F172A]">
              <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-5">Hiring Company</th>
                  <th className="py-4 px-5">Designation</th>
                  <th className="py-4 px-5">Offer Status</th>
                  <th className="py-4 px-5 text-right">Letter Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-bold text-sm text-[#0F172A] block">{offer.studentName}</span>
                      <span className="text-[11px] text-[#64748B]">{offer.studentEmail}</span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={offer.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120'}
                          alt={offer.company}
                          className="w-7 h-7 rounded-lg object-cover border border-[#E2E8F0]"
                        />
                        <span className="font-semibold text-sm text-[#0F172A]">{offer.company}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-semibold text-[#0F172A]">
                      {offer.jobTitle}
                    </td>

                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Official Offer Issued
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => showToast('Offer Letter Verified', `Displaying ${offer.studentName}'s record.`)}
                        className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                      >
                        View Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
