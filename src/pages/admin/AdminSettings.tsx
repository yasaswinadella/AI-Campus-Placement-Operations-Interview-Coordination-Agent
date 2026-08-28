import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  Save,
  Building2,
  Sparkles,
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileCheck2,
  GraduationCap,
  Briefcase,
  Calendar,
  Layers,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast, recycleBinItems, restoreRecord, permanentDeleteRecord } = useData();

  const [activeTab, setActiveTab] = useState<'policies' | 'recycleBin'>('policies');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [maxApps, setMaxApps] = useState(8);
  const [allowMultipleOffers, setAllowMultipleOffers] = useState(true);
  const [enableAiProctoring, setEnableAiProctoring] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [institutionName, setInstitutionName] = useState('National Institute of Technology & Engineering');

  const totalDeleted =
    recycleBinItems.companies.length +
    recycleBinItems.students.length +
    recycleBinItems.jobs.length +
    recycleBinItems.applications.length +
    recycleBinItems.interviews.length +
    recycleBinItems.placementDrives.length +
    recycleBinItems.assessments.length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Institutional placement policies and proctoring rules updated.', 'success');
  };

  const handleRestore = async (type: any, id: string, name: string) => {
    await restoreRecord(type, id);
    showToast('Item Restored', `${name} has been recovered successfully.`, 'success');
  };

  const handlePermanentDelete = async (type: any, id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      await permanentDeleteRecord(type, id);
      showToast('Purged', `${name} has been permanently deleted.`, 'warning');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          System Administration & Governance
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Configure campus-wide placement rules, proctoring thresholds, and recover soft-deleted items from the institutional recycle bin.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'policies'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Placement Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('recycleBin')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'recycleBin'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-slate-100'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Recycle Bin ({totalDeleted})</span>
        </button>
      </div>

      {activeTab === 'policies' ? (
        /* Form Card */
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="space-y-4 pb-6 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#4F46E5]" />
              Institution Identity
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">University / Institute Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pb-6 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#4F46E5]" />
              Placement Cutoff & Application Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Default Minimum CGPA Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none font-bold text-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Max Simultaneous Applications per Candidate</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={maxApps}
                  onChange={(e) => setMaxApps(parseInt(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultipleOffers}
                  onChange={(e) => setAllowMultipleOffers(e.target.checked)}
                  className="w-4 h-4 text-[#4F46E5] rounded focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#0F172A]">
                  Allow 'Super Dream' (20+ LPA) upgrade after student accepts standard offer
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAiProctoring}
                  onChange={(e) => setEnableAiProctoring(e.target.checked)}
                  className="w-4 h-4 text-[#4F46E5] rounded focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#0F172A]">
                  Enable automated AI video proctoring & tab-switch telemetry on skill assessments
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#4F46E5] rounded focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#0F172A]">
                  Dispatch immediate email notifications to candidates for drive announcements
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Institutional Policies</span>
            </button>
          </div>
        </form>
      ) : (
        /* Recycle Bin Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                Soft-Deleted Records & Recovery
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Items placed here are soft-deleted from normal listings. You can restore them or permanently purge them.
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-[#0F172A]">
              {totalDeleted} Items
            </span>
          </div>

          {totalDeleted === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#0F172A]">Recycle Bin is Empty</h4>
              <p className="text-xs text-[#64748B] mt-1">
                No soft-deleted companies, students, jobs, applications, interviews, or drives exist.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Companies */}
              {recycleBinItems.companies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#4F46E5]" />
                    <span>Companies ({recycleBinItems.companies.length})</span>
                  </h4>
                  <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
                    {recycleBinItems.companies.map((c) => (
                      <div key={c.id} className="p-3.5 bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#0F172A]">{c.name}</strong>
                          <span className="text-[#64748B] ml-2 font-mono">({c.companyId})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore('company', c.id, c.name)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#22C55E] border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete('company', c.id, c.name)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {recycleBinItems.jobs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#4F46E5]" />
                    <span>Jobs ({recycleBinItems.jobs.length})</span>
                  </h4>
                  <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
                    {recycleBinItems.jobs.map((j) => (
                      <div key={j.id} className="p-3.5 bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#0F172A]">{j.title}</strong>
                          <span className="text-[#64748B] ml-2">• {j.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore('job', j.id, j.title)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#22C55E] border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete('job', j.id, j.title)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement Drives */}
              {recycleBinItems.placementDrives.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#4F46E5]" />
                    <span>Placement Drives ({recycleBinItems.placementDrives.length})</span>
                  </h4>
                  <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
                    {recycleBinItems.placementDrives.map((d) => (
                      <div key={d.id} className="p-3.5 bg-slate-50 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#0F172A]">{d.role}</strong>
                          <span className="text-[#64748B] ml-2">• {d.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore('drive', d.id, `${d.company} Drive`)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#22C55E] border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete('drive', d.id, `${d.company} Drive`)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
