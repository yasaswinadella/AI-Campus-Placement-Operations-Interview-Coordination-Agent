import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Navbar } from '../common/Navbar';
import { ToastContainer } from '../ui/ToastContainer';

export const AppLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex antialiased">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Workspace Area offset by Sidebar width */}
      <div className="pl-64 flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300">
        <Navbar onSearch={(q) => setSearchQuery(q)} />
        
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet context={{ searchQuery }} />
        </main>

        <footer className="h-12 bg-white border-t border-[#E2E8F0] flex items-center justify-between px-8 text-[11px] text-[#64748B] shrink-0 font-medium mt-auto">
          <div>© 2024 CareerFlow Placement Management System. v2.1.0-stable</div>
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

      {/* Persistent global toast message stack */}
      <ToastContainer />
    </div>
  );
};

