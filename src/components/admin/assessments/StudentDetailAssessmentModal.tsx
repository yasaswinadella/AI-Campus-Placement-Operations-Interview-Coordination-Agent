import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { StudentAssessmentRequest, StudentProfile } from '../../../types';
import {
  X,
  Send,
  User,
  GraduationCap,
  Mail,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { SendDirectAssessmentModal } from './SendDirectAssessmentModal';

interface StudentDetailAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: StudentAssessmentRequest | null;
  studentId?: string;
}

export const StudentDetailAssessmentModal: React.FC<StudentDetailAssessmentModalProps> = ({
  isOpen,
  onClose,
  request,
  studentId,
}) => {
  const {
    allStudents,
    studentProfile,
    studentAssessmentResults,
    studentAssignments,
    studentAssessmentRequests,
  } = useData();

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  if (!isOpen) return null;

  // Resolve target student
  const targetId = request?.studentId || studentId || studentProfile.id;
  const student =
    allStudents.find((s) => s.id === targetId) ||
    (targetId === studentProfile.id ? studentProfile : null) || {
      id: targetId,
      name: request?.studentName || 'Student Candidate',
      email: request?.studentEmail || 'student@university.edu',
      college: request?.studentCollege || 'Apex Institute of Technology',
      branch: request?.studentBranch || 'Computer Science & Engineering',
      cgpa: request?.studentCgpa || 8.6,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      skills: {
        Python: 78,
        DSA: 82,
        React: 75,
        SQL: 80,
      },
    };

  // Find all previous results for this student
  const studentResults = studentAssessmentResults.filter(
    (r) =>
      r.studentId === student.id ||
      r.studentEmail.toLowerCase() === student.email.toLowerCase()
  );

  // Find all assignments for this student
  const studentAssignmentsList = studentAssignments.filter(
    (a) =>
      a.studentId === student.id ||
      a.studentEmail.toLowerCase() === student.email.toLowerCase()
  );

  // Find all assessment requests by this student
  const studentRequestsList = studentAssessmentRequests.filter(
    (req) =>
      req.studentId === student.id ||
      req.studentEmail.toLowerCase() === student.email.toLowerCase()
  );

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Student Profile & Assessment Records
                </h2>
                <p className="text-xs text-slate-400">
                  Comprehensive performance history and assessment evaluations
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
            {/* Student Bio Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-xl shadow-xs">
                  {student.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0F172A]">{student.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Candidate
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{student.email}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{student.branch} • {student.college}</span>
                  </p>
                </div>
              </div>

              {/* Action and CGPA */}
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Cumulative CGPA:</span>
                  <span className="text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                    {student.cgpa || 8.5} / 10.0
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Assessment</span>
                </button>
              </div>
            </div>

            {/* Current Request Context if opened from a request */}
            {request && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                    <span>Current Requested Assessment: <strong>{request.requestedSkill}</strong></span>
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      request.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : request.status === 'Assessment Sent'
                        ? 'bg-blue-100 text-blue-800'
                        : request.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Status: {request.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-indigo-100">
                  <strong className="text-slate-900">Reason: </strong>
                  {request.reason}
                </p>
                <p className="text-[11px] text-slate-500">
                  Requested on: {request.requestDate}
                </p>
              </div>
            )}

            {/* Current Skill Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#4F46E5]" />
                <span>Verified Skill Benchmarks</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {student.skills && Object.keys(student.skills).length > 0 ? (
                  Object.entries(student.skills).map(([skill, score]) => (
                    <div
                      key={skill}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700">{skill}</span>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-extrabold text-[#0F172A]">
                          {score as number}%
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            (score as number) >= 80
                              ? 'text-emerald-600'
                              : (score as number) >= 60
                              ? 'text-indigo-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {(score as number) >= 80
                            ? 'Proficient'
                            : (score as number) >= 60
                            ? 'Intermediate'
                            : 'Basic'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 col-span-4">No verified skills recorded yet.</p>
                )}
              </div>
            </div>

            {/* Previous Assessment Results */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
                <span>Completed Assessment History ({studentResults.length})</span>
              </h4>

              {studentResults.length === 0 ? (
                <div className="p-5 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">
                    No completed assessments on record for this student yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {studentResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-[#0F172A]">
                            {result.assessmentName}
                          </h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                            {result.skill}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Submitted: {result.submittedAt} • Time Spent: {result.timeSpentMinutes} mins • Total Questions: {result.questionAnswers.length}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-[#0F172A]">
                            {result.obtainedMarks} / {result.totalMarks} marks
                          </div>
                          <div
                            className={`text-xs font-bold ${
                              result.percentage >= 70
                                ? 'text-emerald-600'
                                : result.percentage >= 50
                                ? 'text-indigo-600'
                                : 'text-rose-600'
                            }`}
                          >
                            Score: {result.percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assessment Requests History */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#4F46E5]" />
                <span>Assessment Requests History ({studentRequestsList.length})</span>
              </h4>

              {studentRequestsList.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">No previous requests found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {studentRequestsList.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#0F172A]">{req.requestedSkill}</span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{req.reason}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400">{req.requestDate}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            req.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'Assessment Sent'
                              ? 'bg-blue-100 text-blue-800'
                              : req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => setIsSendModalOpen(true)}
              className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Assessment to {student.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Direct Assessment Modal */}
      <SendDirectAssessmentModal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          onClose();
        }}
        request={request}
        targetStudent={student as any}
      />
    </>
  );
};
