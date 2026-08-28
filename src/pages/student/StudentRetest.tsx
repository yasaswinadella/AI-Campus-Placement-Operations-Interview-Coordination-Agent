import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

export const StudentRetest: React.FC = () => {
  const { studentProfile } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const defaultSkill = location.state?.skill || 'Python';
  const [selectedSkill, setSelectedSkill] = useState(defaultSkill);

  const skillsList = [
    { name: 'Python', currentScore: studentProfile.skills['Python'] || 94, attemptsLeft: 2, cooldown: 'Active Now' },
    { name: 'DSA', currentScore: studentProfile.skills['DSA'] || 88, attemptsLeft: 3, cooldown: 'Active Now' },
    { name: 'SQL', currentScore: studentProfile.skills['SQL'] || 82, attemptsLeft: 2, cooldown: 'Active Now' },
    { name: 'React', currentScore: studentProfile.skills['React'] || 90, attemptsLeft: 3, cooldown: 'Active Now' },
    { name: 'DBMS', currentScore: studentProfile.skills['DBMS'] || 78, attemptsLeft: 1, cooldown: 'Active Now' },
    { name: 'Java', currentScore: studentProfile.skills['Java'] || 80, attemptsLeft: 2, cooldown: 'Active Now' },
  ];

  const currentSkillInfo = skillsList.find((s) => s.name === selectedSkill) || skillsList[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Competency Retest & Score Elevation Center
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Improve your verified benchmark scores to unlock higher tier placement shortlists and corporate drives.
        </p>
      </div>

      {/* Hero Notice */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Highest Score Retention Policy</span>
        </div>
        <h2 className="text-xl font-bold text-white">Retake with Confidence</h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          CareerFlow's system automatically retains your highest verified score across all attempts. Your previous score will never be overwritten if you score lower.
        </p>
      </div>

      {/* Skill Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skillsList.map((sk) => {
          const isSelected = sk.name === selectedSkill;
          return (
            <div
              key={sk.name}
              onClick={() => setSelectedSkill(sk.name)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#4F46E5] bg-indigo-50/40 ring-2 ring-[#4F46E5]/20 shadow-sm'
                  : 'border-[#E2E8F0] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#0F172A]">{sk.name}</h3>
                <span className="text-xs font-bold text-[#4F46E5]">{sk.currentScore}%</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-2 font-medium">{sk.attemptsLeft} attempts remaining</p>
              <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                <span className="text-emerald-600 font-semibold">{sk.cooldown}</span>
                <span className="text-[#4F46E5] font-bold">Select</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Retest Session Card */}
      <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#4F46E5]" />
            <h3 className="text-lg font-bold text-[#0F172A]">{selectedSkill} Retest Session</h3>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Standard 10-minute proctored session with randomized question bank.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/assessment')}
          className="px-6 py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 shrink-0"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Launch {selectedSkill} Retest</span>
        </button>
      </div>
    </div>
  );
};
