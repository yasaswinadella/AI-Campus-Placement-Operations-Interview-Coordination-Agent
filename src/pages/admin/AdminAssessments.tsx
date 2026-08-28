import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BankQuestion, StudentAssessmentResult, RetestRequest } from '../../types';
import {
  FileCheck2,
  BrainCircuit,
  Plus,
  Send,
  Sparkles,
  BookOpen,
  Users,
  Award,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

import { AssessmentRequestsTab } from '../../components/admin/assessments/AssessmentRequestsTab';
import { CreateAssessmentTab } from '../../components/admin/assessments/CreateAssessmentTab';
import { QuestionBankTab } from '../../components/admin/assessments/QuestionBankTab';
import { SentAssignmentsTab } from '../../components/admin/assessments/SentAssignmentsTab';
import { StudentResultsTab } from '../../components/admin/assessments/StudentResultsTab';
import { RetestRequestsTab } from '../../components/admin/assessments/RetestRequestsTab';
import { QuestionFormModal } from '../../components/admin/assessments/QuestionFormModal';
import { SendAssignmentModal } from '../../components/admin/assessments/SendAssignmentModal';
import { ReviewSubmissionModal } from '../../components/admin/assessments/ReviewSubmissionModal';
import { RetestDecisionModal } from '../../components/admin/assessments/RetestDecisionModal';

export const AdminAssessments: React.FC = () => {
  const {
    questionBank,
    assessmentsList,
    studentAssignments,
    studentAssessmentResults,
    retestRequests,
    studentAssessmentRequests,
    allStudents,
    addQuestionToBank,
    updateBankQuestion,
    deleteBankQuestion,
    verifyQuestionWithAi,
    approveQuestion,
    rejectQuestion,
    createAssessment,
    sendAssignment,
    handleRetestDecision,
    updateStudentResultReview,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'requests' | 'create' | 'bank' | 'assignments' | 'results' | 'retests'
  >('requests');

  // Modal States
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [preselectedAssessmentId, setPreselectedAssessmentId] = useState<string | undefined>(undefined);

  const [selectedResultForReview, setSelectedResultForReview] = useState<StudentAssessmentResult | null>(null);
  const [selectedRetestForDecision, setSelectedRetestForDecision] = useState<RetestRequest | null>(null);

  // Question modal actions
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: BankQuestion) => {
    setEditingQuestion(q);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (data: Omit<BankQuestion, 'id' | 'aiStatus'>) => {
    if (editingQuestion) {
      updateBankQuestion(editingQuestion.id, data);
    } else {
      addQuestionToBank(data);
    }
  };

  const handleOpenSendAssignment = (assessmentId?: string) => {
    setPreselectedAssessmentId(assessmentId);
    setIsSendModalOpen(true);
  };

  const pendingRequestsCount = (studentAssessmentRequests || []).filter((r) => r && r.status === 'Pending').length;
  const pendingRetestsCount = (retestRequests || []).filter((r) => r && r.status === 'Pending').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Institutional Skill Assessments & Retest System
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Review student assessment requests, author standardized technical benchmarks, manage the question repository, dispatch tests, and process retests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenSendAssignment()}
            className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Assignment</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (6 Tabs) */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {[
          {
            id: 'requests',
            label: 'Assessment Requests',
            icon: Sparkles,
            count: studentAssessmentRequests.length,
            badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : undefined,
          },
          { id: 'create', label: 'Create Assessment', icon: Plus, count: assessmentsList.length },
          { id: 'bank', label: 'Question Bank', icon: BookOpen, count: questionBank.length },
          { id: 'assignments', label: 'Sent Assignments', icon: Send, count: studentAssignments.length },
          { id: 'results', label: 'Student Results', icon: Award, count: studentAssessmentResults.length },
          {
            id: 'retests',
            label: 'Retest Requests',
            icon: RotateCcw,
            badge: pendingRetestsCount > 0 ? `${pendingRetestsCount} Pending` : undefined,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold text-white animate-pulse ${
                    tab.id === 'requests' ? 'bg-[#4F46E5]' : 'bg-amber-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      {activeTab === 'requests' && <AssessmentRequestsTab />}
      {activeTab === 'create' && (
        <CreateAssessmentTab
          questionBank={questionBank}
          onCreateAssessment={createAssessment}
          onOpenAddQuestion={handleOpenAddQuestion}
          onVerifyQuestion={verifyQuestionWithAi}
        />
      )}

      {activeTab === 'bank' && (
        <QuestionBankTab
          questionBank={questionBank}
          onOpenAddModal={handleOpenAddQuestion}
          onEditQuestion={handleOpenEditQuestion}
          onDeleteQuestion={deleteBankQuestion}
          onVerifyQuestion={verifyQuestionWithAi}
          onApproveQuestion={approveQuestion}
          onRejectQuestion={rejectQuestion}
        />
      )}

      {activeTab === 'assignments' && (
        <SentAssignmentsTab
          assignments={studentAssignments}
          onOpenSendModal={() => handleOpenSendAssignment()}
        />
      )}

      {activeTab === 'results' && (
        <StudentResultsTab
          results={studentAssessmentResults}
          onReviewSubmission={(res) => setSelectedResultForReview(res)}
        />
      )}

      {activeTab === 'retests' && (
        <RetestRequestsTab
          retestRequests={retestRequests}
          onOpenDecisionModal={(req) => setSelectedRetestForDecision(req)}
        />
      )}

      {/* MODALS */}
      {isQuestionModalOpen && (
        <QuestionFormModal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSave={handleSaveQuestion}
          initialQuestion={editingQuestion}
        />
      )}

      {isSendModalOpen && (
        <SendAssignmentModal
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
          assessments={assessmentsList}
          students={allStudents}
          onSend={sendAssignment}
          preselectedAssessmentId={preselectedAssessmentId}
        />
      )}

      {selectedResultForReview && (
        <ReviewSubmissionModal
          isOpen={!!selectedResultForReview}
          onClose={() => setSelectedResultForReview(null)}
          result={selectedResultForReview}
          onSaveReview={updateStudentResultReview}
        />
      )}

      {selectedRetestForDecision && (
        <RetestDecisionModal
          isOpen={!!selectedRetestForDecision}
          onClose={() => setSelectedRetestForDecision(null)}
          request={selectedRetestForDecision}
          questionBank={questionBank}
          onDecision={handleRetestDecision}
        />
      )}
    </div>
  );
};
