import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Navbar } from '../common/Navbar';
import { ToastContainer } from '../ui/ToastContainer';
import { useAuth } from '../../context/AuthContext';
import { StudentAiCareerAgent } from '../student/StudentAiCareerAgent';
import { Bot, Sparkles, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const { user } = useAuth();

  const isStudent = user?.role === 'STUDENT';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex antialiased relative">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Workspace Area offset by Sidebar width */}
      <div className="pl-64 flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300">
        <Navbar onSearch={(q) => setSearchQuery(q)} />
        
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet context={{ searchQuery }} />
        </main>

        <footer className="h-12 bg-white border-t border-[#E2E8F0] flex items-center justify-between px-8 text-[11px] text-[#64748B] shrink-0 font-medium mt-auto">
          <div>© 2026 CareerFlow Placement Management System. v2.2.0-live</div>
          <div className="flex items-center space-x-5">
            <Link to="/student/career-paths" className="hover:text-[#4F46E5] transition-colors">Career Paths</Link>
            <Link to="/student/skill-analysis" className="hover:text-[#4F46E5] transition-colors">Skill Hub</Link>
            <span className="text-[#E2E8F0]">|</span>
            <span className="flex items-center gap-1.5">
              System Status: <span className="inline-flex items-center gap-1 font-semibold text-[#22C55E]"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> Online</span>
            </span>
          </div>
        </footer>
      </div>

      {/* Floating Student AI Career Agent Trigger & Popup Drawer (Student Portal Only) */}
      {isStudent && (
        <div className="fixed bottom-6 right-6 z-50">
          {!isAiAgentOpen ? (
            <button
              onClick={() => setIsAiAgentOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-slate-900 hover:from-indigo-700 hover:to-slate-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 border border-indigo-400/30 cursor-pointer group"
              title="Open AI Career Agent"
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
              </div>
              <span className="text-xs font-bold tracking-tight pr-1">AI Career Agent</span>
            </button>
          ) : (
            <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[460px] sm:h-[620px] bg-black/40 sm:bg-transparent flex items-end sm:items-auto justify-center z-50 p-2 sm:p-0">
              <div className="w-full h-full max-h-[92vh] sm:max-h-none flex flex-col animate-in slide-in-from-bottom-5 duration-200">
                <StudentAiCareerAgent onClose={() => setIsAiAgentOpen(false)} isModal={true} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Persistent global toast message stack */}
      <ToastContainer />
    </div>
  );
};


