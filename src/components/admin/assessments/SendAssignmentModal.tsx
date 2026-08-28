import React, { useState } from 'react';
import { Assessment, AssignmentTargetType, StudentProfile } from '../../../types';
import { X, Send, Users, User, GraduationCap, Building2, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface SendAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessments: Assessment[];
  students: StudentProfile[];
  onSend: (data: {
    assessmentId: string;
    targetType: AssignmentTargetType;
    targetIds?: string[];
    branch?: string;
    college?: string;
    timeLimitMinutes: number;
    deadline: string;
    instructions?: string;
  }) => void;
  preselectedAssessmentId?: string;
}

export const SendAssignmentModal: React.FC<SendAssignmentModalProps> = ({
  isOpen,
  onClose,
  assessments,
  students,
  onSend,
  preselectedAssessmentId,
}) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    preselectedAssessmentId || (assessments[0]?.id || '')
  );
  const [targetType, setTargetType] = useState<AssignmentTargetType>('ALL_STUDENTS');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedCollege, setSelectedCollege] = useState('Apex Institute of Technology');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [instructions, setInstructions] = useState(
    'Please complete this proctored skill assessment in one continuous session without switching tabs.'
  );

  if (!isOpen) return null;

  const currentAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];

  // Distinct branches & colleges from student directory
  const availableBranches = Array.from(new Set(students.map((s) => s.branch).filter(Boolean)));
  const availableColleges = Array.from(new Set(students.map((s) => s.college).filter(Boolean)));

  const handleStudentCheckbox = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const getRecipientCount = () => {
    if (targetType === 'SPECIFIC_STUDENT') return selectedStudentId ? 1 : 0;
    if (targetType === 'MULTIPLE_STUDENTS') return selectedStudentIds.length;
    if (targetType === 'ALL_STUDENTS') return students.length;
    if (targetType === 'BRANCH') return students.filter((s) => s.branch.toLowerCase().includes(selectedBranch.toLowerCase())).length;
    if (targetType === 'COLLEGE') return students.filter((s) => s.college.toLowerCase().includes(selectedCollege.toLowerCase())).length;
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetIds: string[] = [];
    if (targetType === 'SPECIFIC_STUDENT' && selectedStudentId) {
      targetIds = [selectedStudentId];
    } else if (targetType === 'MULTIPLE_STUDENTS') {
      targetIds = selectedStudentIds;
    }

    onSend({
      assessmentId: selectedAssessmentId,
      targetType,
      targetIds,
      branch: selectedBranch,
      college: selectedCollege,
      timeLimitMinutes: Number(timeLimit) || 30,
      deadline,
      instructions,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Send Skill Assessment</h3>
              <p className="text-xs text-slate-500">
                Dispatch structured tests directly to individual students or candidate cohorts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Assessment Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Assessment
            </label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => {
                setSelectedAssessmentId(e.target.value);
                const match = assessments.find((a) => a.id === e.target.value);
                if (match) setTimeLimit(match.durationMinutes);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              required
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.skill} • {a.difficulty} • {a.totalQuestions} Questions • {a.totalMarks} Marks)
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Target Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recipient Target Group
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { type: 'ALL_STUDENTS', label: 'All Students', icon: Users },
                { type: 'SPECIFIC_STUDENT', label: 'Single Student', icon: User },
                { type: 'MULTIPLE_STUDENTS', label: 'Pick Students', icon: Users },
                { type: 'BRANCH', label: 'By Branch', icon: GraduationCap },
                { type: 'COLLEGE', label: 'By College', icon: Building2 },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = targetType === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setTargetType(item.type as AssignmentTargetType)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-[#4F46E5] bg-indigo-50/80 text-[#4F46E5] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Target Inputs */}
          {targetType === 'SPECIFIC_STUDENT' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Candidate</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email}) — {s.branch} ({s.college})
                  </option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'MULTIPLE_STUDENTS' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Check Candidates ({selectedStudentIds.length} selected)
              </label>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-1.5 divide-y divide-slate-100">
                {students.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2.5 p-1.5 hover:bg-white rounded-lg cursor-pointer text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(s.id)}
                      onChange={() => handleStudentCheckbox(s.id)}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800">{s.name}</span>
                    <span className="text-slate-400 text-[11px] font-mono">({s.branch})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {targetType === 'BRANCH' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Target Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              >
                {availableBranches.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'COLLEGE' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Target College</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              >
                {availableColleges.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time Limit & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Submission Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Candidate Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Summary Banner */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Target Recipient Count:
            </span>
            <span className="text-xs font-extrabold text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
              {getRecipientCount()} Candidate(s)
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={getRecipientCount() === 0}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
