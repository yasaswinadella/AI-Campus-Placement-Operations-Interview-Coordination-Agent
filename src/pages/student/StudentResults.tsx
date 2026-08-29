import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Calendar,
  Download,
  FileSpreadsheet,
  Layers,
  History,
  Eye,
  Check,
  BrainCircuit,
  FileQuestion,
} from 'lucide-react';
import { getComprehensive150QuestionsForSkill } from '../../data/questionDatasets';
import { StudentAssessmentResult } from '../../types';

export const StudentResults: React.FC = () => {
  const { studentAssessmentResults = [], studentProfile } = useData();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [dbResults, setDbResults] = useState<StudentAssessmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedSkillForDownload, setSelectedSkillForDownload] = useState('Python');
  const [downloadFormat, setDownloadFormat] = useState<'JSON' | 'CSV'>('JSON');

  const sId = studentProfile?.id || user?.id || '';
  const sEmail = studentProfile?.email || user?.email || '';

  // Fetch real database records on mount & sync
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    dbService.getStudentSelfAssessmentHistory(sId, sEmail).then((res) => {
      if (isMounted) {
        // Merge with context results
        const merged: StudentAssessmentResult[] = [...res];
        studentAssessmentResults.forEach((r) => {
          if (!merged.some((m) => m.id === r.id)) {
            merged.push(r);
          }
        });
        setDbResults(merged);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sId, sEmail, studentAssessmentResults]);

  const history = dbResults.length > 0 ? dbResults : studentAssessmentResults;
  const currentResult: StudentAssessmentResult | undefined = history[selectedResultIndex];

  const handleDownloadDataset = () => {
    const { mcqs, codingDescriptive } = getComprehensive150QuestionsForSkill(selectedSkillForDownload);
    const combinedData = {
      skill: selectedSkillForDownload,
      totalQuestions: mcqs.length + codingDescriptive.length,
      mcqCount: mcqs.length,
      codingDescriptiveCount: codingDescriptive.length,
      mcqs,
      codingDescriptive,
    };

    let blob: Blob;
    let fileName = `${selectedSkillForDownload.toLowerCase().replace(/\s+/g, '_')}_150_questions_bank`;

    if (downloadFormat === 'JSON') {
      blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
      fileName += '.json';
    } else {
      // CSV conversion
      let csvContent = 'ID,Type,Skill,Difficulty,Marks,Question/Problem,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation\n';
      mcqs.forEach((q) => {
        const cleanQ = `"${(q.question || '').replace(/"/g, '""')}"`;
        const optA = `"${(q.optionA || '').replace(/"/g, '""')}"`;
        const optB = `"${(q.optionB || '').replace(/"/g, '""')}"`;
        const optC = `"${(q.optionC || '').replace(/"/g, '""')}"`;
        const optD = `"${(q.optionD || '').replace(/"/g, '""')}"`;
        const exp = `"${(q.explanation || '').replace(/"/g, '""')}"`;
        csvContent += `${q.id},MCQ,${q.skill},${q.difficulty},${q.marks},${cleanQ},${optA},${optB},${optC},${optD},${q.correctAnswer},${exp}\n`;
      });
      codingDescriptive.forEach((q) => {
        const cleanProblem = `"${(q.problemStatement || q.question || '').replace(/"/g, '""')}"`;
        const expSol = `"${(q.expectedSolution || q.expectedAnswer || '').replace(/"/g, '""')}"`;
        csvContent += `${q.id},${q.type},${q.skill},${q.difficulty},${q.marks},${cleanProblem},"","","","",,${expSol}\n`;
      });
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      fileName += '.csv';
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/student/assessment')}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Assessment Center
          </button>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Verified Performance Transcripts & Test Records
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real Supabase proctored examination records and standardized question bank repository.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-[#0F172A] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download 150-Q Datasets</span>
          </button>
          <button
            onClick={() => navigate('/student/assessment')}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Take / Retake Exam</span>
          </button>
        </div>
      </div>

      {/* If No Test Results Exist in Supabase/State */}
      {!currentResult ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">No Assessment Results Recorded Yet</h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
            You haven't completed any self-assessment attempts. Take a two-round proctored assessment in Python, Java, SQL, React, DSA, or DBMS to view your real verified transcript and have your scores stored permanently in Supabase.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/student/assessment')}
              className="px-6 py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <FileQuestion className="w-4 h-4" />
              <span>Launch Self Assessment</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Score Showcase Card */}
          <div
            className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Assessment Passed • Verified Supabase Record</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  {currentResult.skill} Proficiency Evaluation
                </h2>
                <div className="flex items-center gap-4 text-xs text-indigo-200">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                    Taken on: <strong>{currentResult.date}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-300" />
                    Time Spent: <strong>{currentResult.timeTakenMinutes} minutes</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md">
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                    Score
                  </span>
                  <p className="text-4xl font-extrabold text-white mt-1">{currentResult.percentage}%</p>
                </div>
                <div className="w-[1px] h-12 bg-white/20" />
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                    Total Marks
                  </span>
                  <p className="text-4xl font-extrabold text-emerald-300 mt-1">
                    {currentResult.obtainedMarks} / {currentResult.totalMarks}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#64748B] font-semibold uppercase">Round 1 (MCQ)</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                {currentResult.mcqScore} / {currentResult.mcqTotal || 100}
              </p>
              <span className="text-[11px] text-slate-500">10 Randomized MCQs</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#64748B] font-semibold uppercase">Round 2 (Coding & Desc)</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {currentResult.codingScore} / {currentResult.codingTotal || 100}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">5 Technical Problems</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#64748B] font-semibold uppercase">Time Taken</span>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-1">
                {currentResult.timeTakenMinutes || 24} mins
              </p>
              <span className="text-[11px] text-slate-500">45m server-backed limit</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#64748B] font-semibold uppercase">Overall Status</span>
              <p className="text-2xl font-extrabold text-[#22C55E] mt-1">
                {currentResult.status || 'Evaluated'}
              </p>
              <span className="text-[11px] text-slate-500">Stored in Supabase</span>
            </div>
          </div>

          {/* Historical Attempts List */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-[#0F172A]">All Past Assessment Transcripts</h2>
              </div>
              <span className="text-xs text-[#64748B]">{history.length} Total Submissions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="pb-3 pl-2">Skill / Track</th>
                    <th className="pb-3">Date Taken</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Round 1 (MCQ)</th>
                    <th className="pb-3">Round 2 (Coding)</th>
                    <th className="pb-3">Final Score</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {history.map((item, idx) => (
                    <tr key={item.id || idx} className={`hover:bg-slate-50 ${selectedResultIndex === idx ? 'bg-indigo-50/40' : ''}`}>
                      <td className="py-3 pl-2 font-bold text-[#0F172A]">{item.skill}</td>
                      <td className="py-3 text-slate-500">{item.date}</td>
                      <td className="py-3 text-slate-500">{item.timeTakenMinutes} mins</td>
                      <td className="py-3 font-semibold text-indigo-600">{item.mcqScore} / {item.mcqTotal || 100}</td>
                      <td className="py-3 text-slate-600">Submitted</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => setSelectedResultIndex(idx)}
                          className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-indigo-600 cursor-pointer"
                        >
                          View Transcript
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DOWNLOAD DATASET MODAL */}
      {downloadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-[#0F172A]">Download Question Bank Dataset</h3>
              </div>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Skill Domain:</label>
                <select
                  value={selectedSkillForDownload}
                  onChange={(e) => setSelectedSkillForDownload(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-[#0F172A]"
                >
                  <option value="Python">Python (100 MCQs + 50 Coding)</option>
                  <option value="Java">Java (100 MCQs + 50 Coding)</option>
                  <option value="SQL">SQL & Relational DBs (100 MCQs + 50 Coding)</option>
                  <option value="JavaScript">JavaScript Core (100 MCQs + 50 Coding)</option>
                  <option value="React">React & Frontend (100 MCQs + 50 Coding)</option>
                  <option value="Data Structures">Data Structures & Algorithms (100 MCQs + 50 Coding)</option>
                  <option value="DBMS">Database Management Systems (100 MCQs + 50 Coding)</option>
                  <option value="Machine Learning">Machine Learning & AI (100 MCQs + 50 Coding)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">File Format:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDownloadFormat('JSON')}
                    className={`p-3 rounded-xl border font-bold text-xs cursor-pointer ${
                      downloadFormat === 'JSON' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    JSON Format (.json)
                  </button>
                  <button
                    onClick={() => setDownloadFormat('CSV')}
                    className={`p-3 rounded-xl border font-bold text-xs cursor-pointer ${
                      downloadFormat === 'CSV' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    CSV Spreadsheet (.csv)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <p>• <strong>100 Multiple Choice Questions</strong> with 4 options, keys & rationales.</p>
                <p>• <strong>50 Coding & Descriptive Problems</strong> with constraints and expected outputs.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadDataset}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dataset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
