import React, { useState } from 'react';
import { StudentAssessmentResult, SkillCategory } from '../../../types';
import { Search, Award, CheckCircle2, Clock, Eye, Sparkles, Filter, Download } from 'lucide-react';

interface StudentResultsTabProps {
  results: StudentAssessmentResult[];
  onReviewSubmission: (result: StudentAssessmentResult) => void;
}

export const StudentResultsTab: React.FC<StudentResultsTabProps> = ({
  results,
  onReviewSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('All');

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assessmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill = skillFilter === 'All' || r.skill.toLowerCase() === skillFilter.toLowerCase();
    return matchesSearch && matchesSkill;
  });

  const availableSkills = Array.from(new Set(results.map((r) => r.skill)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Candidate Test Evaluations & Transcripts</h2>
          <p className="text-xs text-slate-500">
            Review detailed algorithmic solutions, MCQ responses, and descriptive question evaluations.
          </p>
        </div>
      </div>

      {/* Results Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, submission ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="All">All Domains</option>
              {availableSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Submission ID</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Assessment</th>
                <th className="py-3.5 px-4">Skill Domain</th>
                <th className="py-3.5 px-4">Overall Score</th>
                <th className="py-3.5 px-4">Sectional Breakdown</th>
                <th className="py-3.5 px-4">Time Spent</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No evaluated submissions found.
                  </td>
                </tr>
              ) : (
                filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4F46E5] text-[11px]">
                      {res.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{res.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{res.studentEmail}</div>
                      <div className="text-[10px] text-slate-400">
                        {res.studentBranch} • {res.studentCollege}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{res.assessmentName}</span>
                      <span className="text-[10px] text-slate-400">{res.date}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                        {res.skill}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold text-[#4F46E5]">
                          {res.obtainedMarks} / {res.totalMarks}
                        </span>
                        <span
                          className={`text-xs font-black ${
                            res.percentage >= 80
                              ? 'text-emerald-600'
                              : res.percentage >= 60
                              ? 'text-indigo-600'
                              : 'text-amber-600'
                          }`}
                        >
                          ({res.percentage}%)
                        </span>
                      </div>
                      {res.reviewedByAdmin && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          Reviewed by Officer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[10px]">
                        <div className="text-slate-600">
                          MCQ: <strong>{res.mcqScore}/{res.mcqTotal}</strong>
                        </div>
                        <div className="text-slate-600">
                          Code: <strong>{res.codingScore}/{res.codingTotal}</strong>
                        </div>
                        <div className="text-slate-600">
                          Desc: <strong>{res.descriptiveScore}/{res.descriptiveTotal}</strong>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{res.timeTakenMinutes} mins</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onReviewSubmission(res)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-xs font-bold rounded-xl border border-indigo-200 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Submission</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
