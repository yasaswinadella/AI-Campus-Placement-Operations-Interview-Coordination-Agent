import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Company, HrAccount, HrAccountStatus } from '../../types';
import {
  Building2,
  Plus,
  Trash2,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Search,
  Filter,
  Users,
  Eye,
  Edit2,
  Power,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const AdminCompanies: React.FC = () => {
  const {
    companies,
    hrAccounts,
    addCompany,
    updateCompany,
    toggleCompanyStatus,
    deleteCompany,
    generateNextCompanyId,
    approveHrAccount,
    toggleHrStatus,
    removeHrAccount,
    addHrAccount,
    showToast,
  } = useData();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Company Details Modal / Profile View
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Add Company Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customCompId, setCustomCompId] = useState('');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80');
  const [industry, setIndustry] = useState('Enterprise Cloud & Software');
  const [location, setLocation] = useState('Bangalore / Hyderabad, India');
  const [website, setWebsite] = useState('https://example.com');
  const [contactEmail, setContactEmail] = useState('campus-hiring@example.com');
  const [tier, setTier] = useState<'Tier-1' | 'Tier-2' | 'Super Dream'>('Super Dream');
  const [description, setDescription] = useState('');

  // Add HR Account directly Modal
  const [isAddHrOpen, setIsAddHrOpen] = useState(false);
  const [newHrId, setNewHrId] = useState('');
  const [newHrName, setNewHrName] = useState('');
  const [newHrEmail, setNewHrEmail] = useState('');
  const [newHrPassword, setNewHrPassword] = useState('HR123');

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.companyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [companies, searchQuery, statusFilter, tierFilter]);

  // Handle open add modal
  const handleOpenAddModal = () => {
    const nextId = generateNextCompanyId();
    setCustomCompId(nextId);
    setName('');
    setDescription('');
    setIsAddOpen(true);
  };

  const handleAddCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addCompany({
      companyId: customCompId.trim().toUpperCase(),
      name: name.trim(),
      logo: logo.trim() || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      industry,
      location,
      website,
      contactEmail,
      tier,
      description: description.trim() || `${name} campus recruitment partner.`,
    });

    if (result.success) {
      showToast('Partner Added', `Company ${name} registered with ID ${result.companyId}.`, 'success');
      setIsAddOpen(false);
    } else {
      showToast('Registration Error', result.error || 'Failed to add company.', 'danger');
    }
  };

  const copyToClipboard = (text: string, label = 'Company ID') => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard', `${label} (${text}) copied.`, 'info');
  };

  // Get HRs for a specific company
  const getCompanyHrs = (compId: string) => {
    return hrAccounts.filter(
      (h) => (h.companyId || '').toUpperCase() === (compId || '').toUpperCase()
    );
  };

  // Handle adding HR directly
  const handleAddHrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    const res = await addHrAccount({
      hrId: newHrId.trim().toUpperCase(),
      name: newHrName.trim(),
      email: newHrEmail.trim().toLowerCase(),
      companyId: selectedCompany.companyId,
      companyName: selectedCompany.name,
      status: 'APPROVED',
    });

    if (res.success) {
      showToast('HR Account Created', `Added ${newHrName} (${newHrId}) for ${selectedCompany.name}.`, 'success');
      setIsAddHrOpen(false);
      setNewHrId('');
      setNewHrName('');
      setNewHrEmail('');
    } else {
      showToast('HR Creation Failed', res.error || 'Failed to create HR account.', 'danger');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Partner Companies & HR Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              {companies.length} Registered
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Manage partner organizations, generate non-duplicating unique Company IDs (e.g. CMP001), and oversee verified HR representative accounts.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          id="btn-add-partner-company"
          className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner Company</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Partners</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{companies.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Admin-authorized organizations</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Companies</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {companies.filter((c) => c.status === 'ACTIVE').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Permitted for HR registration</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">HR Accounts</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-1">{hrAccounts.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Linked company representatives</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Super Dream Tier</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {companies.filter((c) => c.tier === 'Super Dream').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Premium recruiting tier (20+ LPA)</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID (CMP001), industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Tiers</option>
            <option value="Super Dream">Super Dream</option>
            <option value="Tier-1">Tier-1</option>
            <option value="Tier-2">Tier-2</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((comp) => {
          const linkedHrs = getCompanyHrs(comp.companyId);
          return (
            <div
              key={comp.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md ${
                comp.status === 'INACTIVE'
                  ? 'border-rose-200 bg-rose-50/20 opacity-90'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header with ID Badge */}
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 leading-tight">{comp.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{comp.industry}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                        comp.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {comp.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                      {comp.tier}
                    </span>
                  </div>
                </div>

                {/* Company ID Banner */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company ID:</span>
                    <span className="text-xs font-mono font-black text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100 shadow-2xs">
                      {comp.companyId}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(comp.companyId, 'Company ID')}
                    className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                    title="Copy Company ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Contact & Location */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{comp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{comp.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4F46E5] hover:underline truncate"
                    >
                      {comp.website}
                    </a>
                  </div>
                </div>

                {/* HR Accounts Count Tag */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold">{linkedHrs.length} Registered HR{linkedHrs.length !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">
                    {comp.activeJobsCount || 0} Open Jobs
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCompany(comp)}
                  className="flex-1 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details & HRs</span>
                </button>

                <button
                  onClick={() => toggleCompanyStatus(comp.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    comp.status === 'ACTIVE'
                      ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                  title={comp.status === 'ACTIVE' ? 'Deactivate Company' : 'Activate Company'}
                >
                  <Power className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove ${comp.name} (${comp.companyId})?`)) {
                      deleteCompany(comp.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove Partner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No partner companies found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new corporate hiring partner.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-xl hover:bg-indigo-700"
          >
            Add New Partner
          </button>
        </div>
      )}

      {/* Detailed Company & HR Profile Modal */}
      {selectedCompany && (
        <Modal
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
          title={`${selectedCompany.name} — Corporate Partner Profile`}
          subtitle={`Company ID: ${selectedCompany.companyId} • Partner Status: ${selectedCompany.status}`}
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Top Company Header Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedCompany.logo}
                  alt={selectedCompany.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedCompany.name}</h2>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        selectedCompany.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedCompany.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{selectedCompany.industry}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedCompany.location}</p>
                </div>
              </div>

              {/* Company ID Card in Modal */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unique Company ID</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {selectedCompany.companyId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedCompany.companyId, 'Company ID')}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                    title="Copy Company ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500">Tier Rating</span>
                <p className="font-bold text-indigo-700 mt-0.5">{selectedCompany.tier}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500">Official Website</span>
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-900 hover:text-indigo-600 block truncate mt-0.5"
                >
                  {selectedCompany.website.replace('https://', '')}
                </a>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500">Hiring Contact</span>
                <p className="font-bold text-slate-900 truncate mt-0.5">{selectedCompany.contactEmail}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500">Active Openings</span>
                <p className="font-bold text-emerald-600 mt-0.5">{selectedCompany.activeJobsCount || 0} Positions</p>
              </div>
            </div>

            {selectedCompany.description && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Company Overview</span>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedCompany.description}</p>
              </div>
            )}

            {/* Linked HR Accounts Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Linked HR Accounts ({getCompanyHrs(selectedCompany.companyId).length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    HR representatives registered with Company ID <span className="font-mono font-bold text-indigo-600">{selectedCompany.companyId}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    const compHrs = getCompanyHrs(selectedCompany.companyId);
                    setNewHrId(`HR${(compHrs.length + 1).toString().padStart(3, '0')}`);
                    setIsAddHrOpen(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add HR Account</span>
                </button>
              </div>

              {/* HR Accounts List */}
              <div className="space-y-2.5">
                {getCompanyHrs(selectedCompany.companyId).map((hr) => (
                  <div
                    key={hr.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={hr.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                        alt={hr.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{hr.name}</h4>
                          <span className="font-mono text-[10px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                            {hr.hrId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{hr.email}</p>
                        {hr.registeredAt && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> Registered on {hr.registeredAt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          hr.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : hr.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {hr.status}
                      </span>

                      {hr.status === 'PENDING' && (
                        <button
                          onClick={() => approveHrAccount(hr.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => toggleHrStatus(hr.id)}
                        className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          hr.status === 'APPROVED'
                            ? 'border-slate-200 hover:bg-amber-50 hover:text-amber-700 text-slate-600'
                            : 'border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600'
                        }`}
                        title={hr.status === 'APPROVED' ? 'Deactivate HR' : 'Activate HR'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Remove HR account ${hr.name} (${hr.hrId})?`)) {
                            removeHrAccount(hr.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove HR Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {getCompanyHrs(selectedCompany.companyId).length === 0 && (
                  <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                    <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-700">No HR accounts linked yet</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      HR reps can self-register using Company ID <span className="font-mono font-bold">{selectedCompany.companyId}</span> on the portal, or you can add them manually.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => toggleCompanyStatus(selectedCompany.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  selectedCompany.status === 'ACTIVE'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{selectedCompany.status === 'ACTIVE' ? 'Deactivate Company' : 'Activate Company'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Company Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Partner Company"
        subtitle="Generates a unique Company ID for enterprise identification and secure HR onboarding."
      >
        <form onSubmit={handleAddCompanySubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Unique Company ID Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#0F172A]">Company ID (Unique Identifier) *</label>
              <span className="text-[10px] text-indigo-600 font-medium">Auto-generated non-duplicating ID</span>
            </div>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customCompId}
                onChange={(e) => setCustomCompId(e.target.value.toUpperCase())}
                placeholder="CMP001"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 font-mono font-bold uppercase rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              HR accounts will require this exact ID to register and manage company jobs.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google / Microsoft / Cisco Systems"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Industry Domain</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Hiring Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Super Dream">Super Dream (20+ LPA)</option>
                <option value="Tier-1">Tier-1 (12 - 20 LPA)</option>
                <option value="Tier-2">Tier-2 (6 - 12 LPA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Office Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Campus Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Official Website URL</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
              required
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of recruitment operations..."
              rows={2}
              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-add-company-btn"
              className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Register Partner & Assign ID
            </button>
          </div>
        </form>
      </Modal>

      {/* Add HR Account Modal (From Profile View) */}
      {isAddHrOpen && selectedCompany && (
        <Modal
          isOpen={isAddHrOpen}
          onClose={() => setIsAddHrOpen(false)}
          title={`Add HR Account for ${selectedCompany.name}`}
          subtitle={`Directly provisioning an HR representative account linked to Company ID: ${selectedCompany.companyId}`}
        >
          <form onSubmit={handleAddHrSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Target Company:</span>
              <span className="font-bold text-indigo-700 font-mono">
                {selectedCompany.name} ({selectedCompany.companyId})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">HR ID *</label>
                <input
                  type="text"
                  value={newHrId}
                  onChange={(e) => setNewHrId(e.target.value.toUpperCase())}
                  placeholder="HR001"
                  required
                  className="w-full px-3 py-2 bg-slate-50 font-mono font-bold uppercase rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Representative Name *</label>
                <input
                  type="text"
                  value={newHrName}
                  onChange={(e) => setNewHrName(e.target.value)}
                  placeholder="Rachel Green"
                  required
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">HR Email Address *</label>
              <input
                type="email"
                value={newHrEmail}
                onChange={(e) => setNewHrEmail(e.target.value)}
                placeholder="rachel.g@company.com"
                required
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Initial Password *</label>
              <input
                type="text"
                value={newHrPassword}
                onChange={(e) => setNewHrPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs font-mono text-[#0F172A] focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddHrOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Create HR Account
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
