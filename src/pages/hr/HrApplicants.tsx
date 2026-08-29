import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ScheduleInterviewModal } from '../../components/ui/ScheduleInterviewModal';
import { ApplicationStatus, JobApplication } from '../../types';
import {
  Users,
  Search,
  Filter,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Building2,
  Sparkles,
  Trash2,
  GraduationCap,
  Mail,
  ExternalLink,
  BrainCircuit,
  Percent,
  X,
} from 'lucide-react';

export const HrApplicants: React.FC = () => {
  const { applications, jobs, students, studentAssessmentResults, updateApplicationStatus, showToast } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const initialJobId = location.state?.jobId || 'ALL';
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<any>(null);

  // Unified Student Dossier State
  const [selectedDossierApp, setSelectedDossierApp] = useState<JobApplication | null>(() => {
    const targetId = location.state?.selectedAppId || location.state?.applicationId;
    if (targetId) {
      return applications.find((a) => a.id === targetId) || null;
    }
    return null;
  });

  React.useEffect(() => {
    const targetId = location.state?.selectedAppId || location.state?.applicationId;
    if (targetId) {
      const match = applications.find((a) => a.id === targetId);
      if (match) setSelectedDossierApp(match);
    }
  }, [location.state, applications]);

  // Deleted applicants state
  const [deletedAppIds, setDeletedAppIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cf_deleted_hr_applications') || '[]');
    } catch {
      return [];
    }
  });

  const handleDeleteApplication = (app: JobApplication) => {
    const updated = [...deletedAppIds, app.id];
    setDeletedAppIds(updated);
    localStorage.setItem('cf_deleted_hr_applications', JSON.stringify(updated));
    showToast('Applicant Removed', `Removed ${app.studentName}'s application for ${app.jobTitle}.`, 'info');
  };

  const filteredApplications = applications.filter((app) => {
    if (deletedAppIds.includes(app.id)) return false;
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.studentCollege || app.college || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.studentEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesStatus && matchesSearch;
  });

  const handleOpenSchedule = (app: any) => {
    setSelectedAppForSchedule(app);
    setIsScheduleOpen(true);
  };

  // Find candidate for selected dossier
  const dossierStudent = selectedDossierApp
    ? students.find(
        (s) =>
          s.id === selectedDossierApp.studentId ||
          s.email.toLowerCase() === (selectedDossierApp.studentEmail || '').toLowerCase()
      ) || {
        id: selectedDossierApp.studentId,
        name: selectedDossierApp.studentName,
        email: selectedDossierApp.studentEmail || 'candidate@university.edu',
        college: selectedDossierApp.studentCollege || selectedDossierApp.college || 'University Campus',
        branch: selectedDossierApp.studentBranch || 'Computer Science',
        cgpa: selectedDossierApp.studentCgpa || selectedDossierApp.cgpa || 8.0,
        graduationYear: 2026,
        overallSkillScore: selectedDossierApp.matchScore || 85,
        careerReadiness: 90,
        skills: {
          Python: 88,
          Java: 82,
          SQL: 90,
          JavaScript: 85,
          React: 80,
          'Data Structures': 85,
          DBMS: 88,
          'Machine Learning': 78,
        },
        atsScore: 86,
        resumeUrl: selectedDossierApp.resumeUrl || '',
      }
    : null;

  // Student test results for dossier
  const candidateTestResults = selectedDossierApp
    ? studentAssessmentResults.filter(
        (r) =>
          r.studentId === selectedDossierApp.studentId ||
          r.studentEmail?.toLowerCase() === (selectedDossierApp.studentEmail || '').toLowerCase()
      )
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Evaluation Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Application Pool & Student Dossier
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review verified transcripts, test analytics, ATS resume scores, and manage talent pipeline.
          </p>
        </div>

        <button
          onClick={() => navigate('/hr/shortlisted-pool')}
          className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-[#4F46E5]" />
          <span>View Shortlisted Talent Pool</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants by name, college, email, or role..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none max-w-xs font-medium"
          >
            <option value="ALL">All Job Openings ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none font-medium"
          >
            <option value="ALL">All Stages ({filteredApplications.length})</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-5">Candidate Name</th>
                <th className="py-4 px-5">Applied Position</th>
                <th className="py-4 px-5">Academic & CGPA</th>
                <th className="py-4 px-5">AI Match Index</th>
                <th className="py-4 px-5">Stage Status</th>
                <th className="py-4 px-5 text-right">Pipeline Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No applications found matching your filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] font-bold text-xs flex items-center justify-center border border-indigo-100 shrink-0">
                          {app.studentName.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedDossierApp(app)}
                            className="font-bold text-sm text-[#0F172A] hover:text-[#4F46E5] text-left hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{app.studentName}</span>
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <p className="text-[11px] text-[#64748B]">{app.studentCollege || app.college || 'Campus Student'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-semibold text-[#0F172A]">
                      {app.jobTitle}
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-[#4F46E5]">{app.studentCgpa || app.cgpa || 8.0} CGPA</span>
                      <span className="text-[11px] text-[#64748B] block">Batch of 2026</span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                        {app.matchScore || 85}% Match
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Dossier Review Button */}
                        <button
                          onClick={() => setSelectedDossierApp(app)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>

                        {/* Shortlist Action */}
                        {app.status === 'APPLIED' && (
                          <button
                            onClick={() => {
                              updateApplicationStatus(app.id, 'SHORTLISTED');
                              showToast('Candidate Shortlisted', `${app.studentName} moved to Shortlisted.`);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Shortlist
                          </button>
                        )}

                        {/* Schedule Interview */}
                        {app.status === 'SHORTLISTED' && (
                          <button
                            onClick={() => handleOpenSchedule(app)}
                            className="px-2.5 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule</span>
                          </button>
                        )}

                        {/* Delete / Bin Option */}
                        <button
                          onClick={() => handleDeleteApplication(app)}
                          title="Remove candidate from pool"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Interactive Student Dossier Modal */}
      {selectedDossierApp && dossierStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white font-black text-2xl flex items-center justify-center border border-white/20">
                  {dossierStudent.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{dossierStudent.name}</h2>
                    <StatusBadge status={selectedDossierApp.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {dossierStudent.email} • {dossierStudent.college}
                  </p>
                  <p className="text-xs font-semibold text-indigo-300">
                    {dossierStudent.branch} • Applied for {selectedDossierApp.jobTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDossierApp(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Score Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-700">CGPA</span>
                  <div className="text-xl font-extrabold text-indigo-950 mt-0.5">
                    {dossierStudent.cgpa || 8.0}
                  </div>
                  <span className="text-[10px] text-indigo-600">Batch {dossierStudent.graduationYear || 2026}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Skill Competency</span>
                  <div className="text-xl font-extrabold text-emerald-950 mt-0.5">
                    {dossierStudent.overallSkillScore || selectedDossierApp.matchScore || 85}%
                  </div>
                  <span className="text-[10px] text-emerald-600">Verified Skills</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-purple-700">ATS Resume Rating</span>
                  <div className="text-xl font-extrabold text-purple-950 mt-0.5">
                    {dossierStudent.atsScore || 88}/100
                  </div>
                  <span className="text-[10px] text-purple-600">Parser Score</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-blue-700">AI Job Match</span>
                  <div className="text-xl font-extrabold text-blue-950 mt-0.5">
                    {selectedDossierApp.matchScore || 85}%
                  </div>
                  <span className="text-[10px] text-blue-600">Role Fit</span>
                </div>
              </div>

              {/* Verified Skill Matrix */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  <span>Individual Skill Proficiency Matrix</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Python', 'Java', 'SQL', 'JavaScript', 'React', 'Data Structures', 'DBMS', 'Machine Learning'].map((sk) => {
                    const testScore = candidateTestResults.find((r) => r.skill?.toLowerCase() === sk.toLowerCase())?.score;
                    const val = testScore !== undefined ? testScore : (dossierStudent.skills?.[sk] || 80);
                    return (
                      <div key={sk} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-800 text-[11px] truncate">{sk}</span>
                          <span className="font-bold text-indigo-600 text-[11px]">{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              val >= 80 ? 'bg-emerald-500' : val >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Assessment Attempts */}
              {candidateTestResults.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Live Verified Test Attempts</span>
                  </h3>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {candidateTestResults.map((res, i) => (
                      <div key={res.id || i} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{res.skill} Self-Assessment</span>
                          <span className="text-[10px] text-slate-500 ml-2">({res.date || 'Recent'})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {res.score}% ({res.correctAnswers || 0}/{res.totalQuestions || 10})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Document Link */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Official Candidate Resume Document</div>
                    <div className="text-[11px] text-slate-500">Verified PDF attached to application #{selectedDossierApp.id}</div>
                  </div>
                </div>
                <a
                  href={selectedDossierApp.resumeUrl || dossierStudent.resumeUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDeleteApplication(selectedDossierApp)}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Application</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedDossierApp.status === 'APPLIED' && (
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedDossierApp.id, 'SHORTLISTED');
                      showToast('Shortlisted', `${dossierStudent.name} shortlisted for ${selectedDossierApp.jobTitle}.`);
                      setSelectedDossierApp({ ...selectedDossierApp, status: 'SHORTLISTED' });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Shortlist Candidate
                  </button>
                )}

                <button
                  onClick={() => {
                    handleOpenSchedule(selectedDossierApp);
                    setSelectedDossierApp(null);
                  }}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Interview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedAppForSchedule && (
        <ScheduleInterviewModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedAppForSchedule(null);
          }}
          defaultStudentId={selectedAppForSchedule.studentId}
          defaultJobId={selectedAppForSchedule.jobId}
        />
      )}
    </div>
  );
};
