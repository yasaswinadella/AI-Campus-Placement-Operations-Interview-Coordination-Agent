import React, { useState } from 'react';
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
  RotateCcw,
  ShieldCheck,
  Filter,
  Layers,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { StudentAiCareerAgent } from '../../components/student/StudentAiCareerAgent';

export const StudentAiJobSuggestions: React.FC = () => {
  const { aiJobSuggestions = [], savedJobIds = [], toggleSaveJob, jobs = [], studentProfile, showToast, refreshData } = useData();
  const navigate = useNavigate();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [workplaceFilter, setWorkplaceFilter] = useState('ALL');
  const [showAiChat, setShowAiChat] = useState(false);

  const filteredSuggestions = aiJobSuggestions.filter((item) => {
    const matchesScore = item.matchScore >= minMatchFilter;
    const matchesWorkplace = workplaceFilter === 'ALL' || (item.workplace || '').toLowerCase() === workplaceFilter.toLowerCase();
    return matchesScore && matchesWorkplace;
  });

  const handleReAnalyze = async () => {
    setIsAnalyzing(true);
    await refreshData();
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast('AI Neural Re-Analysis Complete', 'Updated compatibility scores based on your latest Supabase profile and jobs.', 'success');
    }, 600);
  };

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAiChat(!showAiChat)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
              showAiChat ? 'bg-indigo-600 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{showAiChat ? 'Show Job Matches' : '🤖 Open AI Career Agent'}</span>
          </button>
          <button
            onClick={handleReAnalyze}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-indigo-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Neural Profile...' : '⚡ Re-Run AI Matching'}</span>
          </button>
          <button
            onClick={() => navigate('/student/jobs')}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-xl shadow-xs transition-colors"
          >
            Browse Directory ({jobs.length})
          </button>
        </div>
      </div>

      {/* AI Career Agent View Mode */}
      {showAiChat && (
        <div className="p-1">
          <StudentAiCareerAgent onClose={() => setShowAiChat(false)} />
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs font-bold text-[#0F172A]">Filter Recommendations:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-[#64748B] font-medium">Min Match:</label>
            <select
              value={minMatchFilter}
              onChange={(e) => setMinMatchFilter(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none"
            >
              <option value={0}>All Matches</option>
              <option value={90}>90%+ High Match</option>
              <option value={80}>80%+ Strong Match</option>
              <option value={70}>70%+ Moderate Match</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-[#64748B] font-medium">Workplace:</label>
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none"
            >
              <option value="ALL">All Environments</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] shadow-xs">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A]">No Matching Jobs in this Filter</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Try adjusting your minimum match filter or workplace preference above.
            </p>
          </div>
        ) : (
          filteredSuggestions.map((item) => {
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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                            item.matchScore >= 90
                              ? 'bg-emerald-50 text-[#22C55E] border-emerald-200'
                              : item.matchScore >= 80
                              ? 'bg-indigo-50 text-[#4F46E5] border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.matchScore}% Match Index
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#64748B] mt-1">
                        {item.company} • {item.location} ({item.workplace}) • {item.salary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => toggleSaveJob(item.jobId)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                      }`}
                    >
                      {isSaved ? 'Bookmarked' : 'Save Job'}
                    </button>
                    <button
                      onClick={() => navigate('/student/job-eligibility', { state: { jobId: item.jobId } })}
                      className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Eligibility</span>
                    </button>
                    <button
                      onClick={() => navigate('/student/apply', { state: { jobId: item.jobId } })}
                      className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
