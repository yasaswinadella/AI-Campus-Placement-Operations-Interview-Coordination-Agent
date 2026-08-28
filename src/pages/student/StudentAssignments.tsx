import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StudentAssignment, StudentAssessmentResult, StudentAssessmentRequest } from '../../types';
import {
  FileCheck2,
  Clock,
  Calendar,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Search,
  Eye,
  CheckSquare,
  Code2,
  BookOpen,
  Send,
  Plus,
  XCircle,
} from 'lucide-react';
import { TakeAssessmentModal } from '../../components/student/assessments/TakeAssessmentModal';
import { RequestRetestModal } from '../../components/student/assessments/RequestRetestModal';
import { RequestAssessmentModal } from '../../components/student/assessments/RequestAssessmentModal';
import { ReviewSubmissionModal } from '../../components/admin/assessments/ReviewSubmissionModal';
import { STANDARDIZED_50Q_ASSESSMENTS, get50QuestionsForSkill } from '../../data/questionDatasets';

export const StudentAssignments: React.FC = () => {
  const {
    studentProfile,
    studentAssignments,
    assessmentsList,
    studentAssessmentResults,
    retestRequests,
    studentAssessmentRequests,
    submitStudentAssessmentAnswers,
    dispatchAiAssessmentDirectly,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'requests' | 'completed' | 'retests'>('pending');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Modal states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeAssignmentForTest, setActiveAssignmentForTest] = useState<StudentAssignment | null>(null);
  const [isRetestModalOpen, setIsRetestModalOpen] = useState(false);
  const [preselectedResultId, setPreselectedResultId] = useState<string | undefined>(undefined);
  const [viewingResult, setViewingResult] = useState<StudentAssessmentResult | null>(null);

  // Filter assignments for this candidate
  const myAssignments = studentAssignments.filter(
    (a) =>
      a.studentId === studentProfile.id ||
      a.studentEmail.toLowerCase() === studentProfile.email.toLowerCase() ||
      !a.studentId // fallback
  );

  const myPendingAssignments = myAssignments.filter(
    (a) => a.status === 'New' || a.status === 'In Progress'
  );

  const myCompletedAssignments = myAssignments.filter((a) => a.status === 'Completed');

  const myRequests = studentAssessmentRequests.filter(
    (req) =>
      req.studentId === studentProfile.id ||
      req.studentEmail.toLowerCase() === studentProfile.email.toLowerCase()
  );

  const myResults = studentAssessmentResults.filter(
    (r) =>
      r.studentId === studentProfile.id ||
      r.studentEmail.toLowerCase() === studentProfile.email.toLowerCase()
  );

  const myRetests = retestRequests.filter(
    (req) =>
      req.studentId === studentProfile.id ||
      req.studentEmail.toLowerCase() === studentProfile.email.toLowerCase()
  );

  const handleStartAssessment = (asg: StudentAssignment) => {
    setActiveAssignmentForTest(asg);
  };

  const handleOpenRetest = (resultId?: string) => {
    setPreselectedResultId(resultId);
    setIsRetestModalOpen(true);
  };

  // Find corresponding assessment definition with 50-question fallback
  const currentExamDefinition = assessmentsList.find(
    (a) => a.id === activeAssignmentForTest?.assessmentId
  ) || STANDARDIZED_50Q_ASSESSMENTS.find(
    (a) => a.skill.toLowerCase() === (activeAssignmentForTest?.skill || '').toLowerCase()
  ) || {
    id: activeAssignmentForTest?.assessmentId || 'ASST-50Q',
    name: activeAssignmentForTest?.assessmentName || '50-Question Standardized Placement Benchmark',
    skill: activeAssignmentForTest?.skill || 'React',
    difficulty: ((activeAssignmentForTest?.difficulty as any) || 'Mixed'),
    totalQuestions: 50,
    mcqCount: 50,
    codingCount: 0,
    descriptiveCount: 0,
    totalMarks: 100,
    durationMinutes: activeAssignmentForTest?.timeLimit || 60,
    questions: get50QuestionsForSkill(activeAssignmentForTest?.skill || 'React'),
    status: 'PUBLISHED' as const,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            My Assigned Skill Assessments (50-Question Benchmarks)
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Request evaluations, launch 50-question AI benchmarks, complete tests, view scores, and apply for retests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Request / Launch Test</span>
          </button>

          <button
            onClick={() => handleOpenRetest()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Apply for Retest</span>
          </button>
        </div>
      </div>

      {/* AI 50-Question Benchmark Quick Dispatcher */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border border-indigo-500/20 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>⚡ AI 50-Question Instant Benchmark Dispatcher</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Instant 50-Question Placement Examinations
            </h2>
            <p className="text-xs text-slate-300">
              Pick your target domain below to immediately generate and launch your personalized 50-question benchmark with real-time scoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Full-Stack (50 Qs)', skill: 'React', icon: '🌐' },
              { name: 'DSA & Logic (50 Qs)', skill: 'DSA', icon: '⚡' },
              { name: 'Core CS (50 Qs)', skill: 'DBMS', icon: '🗄️' },
              { name: 'Aptitude (50 Qs)', skill: 'Aptitude', icon: '📊' },
              { name: 'Python (50 Qs)', skill: 'Python', icon: '🐍' },
            ].map((btn) => (
              <button
                key={btn.skill}
                disabled={isGeneratingAi}
                onClick={async () => {
                  setIsGeneratingAi(true);
                  try {
                    const asgn = await dispatchAiAssessmentDirectly(btn.skill);
                    if (asgn) {
                      setActiveAssignmentForTest(asgn);
                    }
                  } finally {
                    setIsGeneratingAi(false);
                  }
                }}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-1.5 active:scale-95 shadow-xs"
              >
                <span>{btn.icon}</span>
                <span>{btn.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Pending Assessments</span>
            <p className="text-2xl font-extrabold text-[#4F46E5] mt-1">{myPendingAssignments.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Skill Requests</span>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{myRequests.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Completed Tests</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{myCompletedAssignments.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Retest Requests</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{myRetests.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active & Due ({myPendingAssignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'requests'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>My Requests ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'completed'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Evaluated Results ({myCompletedAssignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('retests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'retests'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retest Status ({myRetests.length})</span>
        </button>
      </div>

      {/* Tab: Pending Assignments */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {myPendingAssignments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">All Assigned Assessments Completed!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  You have completed all tests dispatched by the placement office. You can request a custom assessment for any skill (e.g., Python, React, DSA) or apply for retests.
                </p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request New Assessment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPendingAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                        {asg.skill}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {asg.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">{asg.assessmentName}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {asg.instructions || 'Standard proctored technical evaluation.'}
                      </p>
                    </div>

                    {/* Breakdown Matrix */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">Duration</span>
                        <span className="font-bold text-slate-800 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {asg.timeLimit} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">Questions</span>
                        <span className="font-bold text-slate-800">{asg.totalQuestions} Qs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">Due Date</span>
                        <span className="font-bold text-amber-700">{asg.deadline}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Includes:</span>
                      <span className="font-bold text-slate-700">{asg.mcqCount} MCQs</span> •
                      <span className="font-bold text-slate-700">{asg.codingCount} Coding</span> •
                      <span className="font-bold text-slate-700">{asg.descriptiveCount} Descriptive</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartAssessment(asg)}
                    className="w-full py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Proctored Assessment</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: My Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                My Assessment Requests
              </h3>
              <p className="text-[11px] text-slate-500">
                Track pending approvals and dispatched customized exams
              </p>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request New Skill</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-2">
                <p>You haven't submitted any skill assessment requests yet.</p>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="text-[#4F46E5] font-bold hover:underline"
                >
                  Click here to request your first evaluation
                </button>
              </div>
            ) : (
              myRequests.map((req) => {
                // Find matching assignment if sent
                const matchingAssignment = myAssignments.find(
                  (a) =>
                    a.id === req.assignedAssignmentId ||
                    (a.skill === req.requestedSkill && a.status !== 'Completed')
                );

                return (
                  <div key={req.id} className="p-5 space-y-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                          {req.requestedSkill}
                        </span>
                        <span className="text-xs text-slate-500">
                          Requested on {req.requestDate}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold inline-flex items-center gap-1 border ${
                          req.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : req.status === 'Assessment Sent'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {req.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {req.status === 'Assessment Sent' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                        {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {req.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-slate-900">Reason: </strong>
                      {req.reason}
                    </p>

                    {req.status === 'Assessment Sent' && matchingAssignment && (
                      <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between">
                        <div className="text-xs text-emerald-900">
                          🎉 <strong>Assessment Dispatched!</strong> Your {req.requestedSkill} test is ready to take.
                        </div>
                        <button
                          onClick={() => handleStartAssessment(matchingAssignment)}
                          className="px-3 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start Assessment Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab: Completed Results */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {myCompletedAssignments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">No completed assessments yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCompletedAssignments.map((asg) => {
                const matchResult = myResults.find(
                  (r) => r.assessmentId === asg.assessmentId || r.assessmentName === asg.assessmentName
                );
                return (
                  <div
                    key={asg.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {asg.skill}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">{asg.assessmentName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Completed on {asg.completedAt || 'Recently'}</p>
                    </div>

                    {/* Score Ribbon */}
                    <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                          Final Score
                        </span>
                        <p className="text-xl font-black text-[#4F46E5]">
                          {asg.score ?? matchResult?.obtainedMarks ?? 0} / {asg.totalMarks} pts
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-600">
                          {asg.percentage ?? matchResult?.percentage ?? 0}%
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      {matchResult && (
                        <button
                          onClick={() => setViewingResult(matchResult)}
                          className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detailed Transcript</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenRetest(matchResult?.id)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Retest</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Retest Status */}
      {activeTab === 'retests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              My Retest Applications & Placement Decisions
            </h3>
            <button
              onClick={() => handleOpenRetest()}
              className="px-3 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Retest Application</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myRetests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active or past retest applications found.
              </div>
            ) : (
              myRetests.map((req) => (
                <div key={req.id} className="p-4 space-y-2 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{req.skill} Assessment</span>
                      <span className="text-xs text-amber-600 font-semibold">(Prior: {req.previousScore}%)</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                      <span>{req.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    "{req.reason}"
                  </p>

                  {req.adminDecision && (
                    <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-950 flex items-center justify-between">
                      <span>
                        Officer Decision: <strong>{req.adminDecision.decision}</strong> ({req.adminDecision.questionStrategy || 'Standard'} Mode)
                      </span>
                      <span className="text-[10px] text-slate-500">{req.adminDecision.decisionDate}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {isRequestModalOpen && (
        <RequestAssessmentModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      )}

      {activeAssignmentForTest && (
        <TakeAssessmentModal
          isOpen={!!activeAssignmentForTest}
          onClose={() => setActiveAssignmentForTest(null)}
          assignment={activeAssignmentForTest}
          assessment={currentExamDefinition}
          onSubmitAssessment={submitStudentAssessmentAnswers}
        />
      )}

      {isRetestModalOpen && (
        <RequestRetestModal
          isOpen={isRetestModalOpen}
          onClose={() => setIsRetestModalOpen(false)}
          completedResults={myResults}
          preselectedResultId={preselectedResultId}
          onRequestRetest={requestRetest}
        />
      )}

      {viewingResult && (
        <ReviewSubmissionModal
          isOpen={!!viewingResult}
          onClose={() => setViewingResult(null)}
          result={viewingResult}
          onSaveReview={() => {}}
        />
      )}
    </div>
  );
};
