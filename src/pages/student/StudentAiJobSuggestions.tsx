import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Sparkles,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  DollarSign,
  Building2,
  ExternalLink,
} from 'lucide-react';

export const StudentAiJobSuggestions: React.FC = () => {
  const { aiJobSuggestions, savedJobIds, toggleSaveJob } = useData();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Neural Matching Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            AI Job & Internship Recommendations
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ranked by multi-vector semantic cosine similarity across your verified test scores, projects, and CGPA.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/jobs')}
          className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors"
        >
          Browse Full Job Directory
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {aiJobSuggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A]">No Matching Jobs Found Yet</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              As corporate partners post verified job requisitions into the database, recommendations matching your skills and CGPA will appear here.
            </p>
          </div>
        ) : (
          aiJobSuggestions.map((item) => {
            const isSaved = savedJobIds.includes(item.jobId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.companyLogo}
                      alt={item.company}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-lg font-bold text-[#0F172A]">{item.role}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                          {item.matchScore}% Match Index
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#64748B] mt-1">
                        {item.company} • {item.location} ({item.workplace}) • {item.salary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveJob(item.jobId)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                      }`}
                    >
                      {isSaved ? 'Bookmarked' : 'Save Job'}
                    </button>
                    <button
                      onClick={() => navigate('/student/apply', { state: { jobId: item.jobId } })}
                      className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Explanation Box */}
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">AI Match Rationale</h4>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{item.aiExplanation}</p>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Matching Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 bg-emerald-100/60 text-emerald-900 rounded text-[11px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mb-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Bonus Skills to Strengthen:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.missingSkills.length > 0 ? (
                        item.missingSkills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 bg-amber-100/60 text-amber-900 rounded text-[11px] font-medium"
                          >
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">None - Complete match!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
