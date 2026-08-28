import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  BarChart3,
  BrainCircuit,
  TrendingDown,
  Sparkles,
  Compass,
  Briefcase,
  ShieldCheck,
  Send,
  Calendar,
  RotateCcw,
  LineChart,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Users,
  UserSearch,
  Filter,
  Award,
  GraduationCap,
  Megaphone,
  Binary,
  Settings,
  Layers,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentPrimaryNav = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Assignments', path: '/student/assignments', icon: FileCheck2 },
    { label: 'Self Assessment', path: '/student/assessment', icon: BrainCircuit },
    { label: 'Jobs', path: '/student/jobs', icon: Briefcase },
    { label: 'Applications', path: '/student/applications', icon: Layers },
    { label: 'Interviews', path: '/student/interview', icon: Calendar },
    { label: 'Profile', path: '/student/profile-resume', icon: UserCheck },
  ];

  const studentQuickLinks = [
    { label: 'Assigned Tests', path: '/student/assignments', icon: FileCheck2 },
    { label: 'Test Results', path: '/student/results', icon: BarChart3 },
    { label: 'Retest Center', path: '/student/retest', icon: RotateCcw },
    { label: 'Skill Analysis', path: '/student/skill-analysis', icon: BrainCircuit },
    { label: 'Skill Gaps', path: '/student/skill-gaps', icon: TrendingDown },
    { label: 'AI Job Suggestions', path: '/student/ai-job-suggestions', icon: Sparkles },
    { label: 'Career Paths', path: '/student/career-paths', icon: Compass },
    { label: 'Job Eligibility', path: '/student/job-eligibility', icon: ShieldCheck },
    { label: 'Submit Application', path: '/student/apply', icon: Send },
    { label: 'Growth Progress', path: '/student/progress', icon: LineChart },
  ];

  const hrPrimaryNav = [
    { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
    { label: 'Post Job', path: '/hr/post-job', icon: FileSpreadsheet },
    { label: 'Manage Postings', path: '/hr/manage-jobs', icon: Briefcase },
    { label: 'Applicants Pool', path: '/hr/applicants', icon: Users },
    { label: 'Placement Drives', path: '/hr/placement-drives', icon: Megaphone },
    { label: 'Shortlisted Talent', path: '/hr/shortlisted-pool', icon: Filter },
    { label: 'Interview Suite', path: '/hr/interview-management', icon: Calendar },
  ];

  const hrQuickLinks = [
    { label: 'Candidate Dossier', path: '/hr/applicant-detail', icon: UserSearch },
    { label: 'Schedule Interview', path: '/hr/schedule-interview', icon: Calendar },
    { label: 'Placement Drives', path: '/hr/placement-drives', icon: Megaphone },
    { label: 'Hiring & Offers', path: '/hr/hiring', icon: Award },
  ];

  const adminPrimaryNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Student Directory', path: '/admin/students', icon: GraduationCap },
    { label: 'Partner Companies', path: '/admin/companies', icon: Building2 },
    { label: 'Placement Drives', path: '/admin/placement-drives', icon: Megaphone },
    { label: 'Campus Interviews', path: '/admin/interviews', icon: Calendar },
    { label: 'Assessments', path: '/admin/assessments', icon: FileCheck2 },
    { label: 'Offers Ledger', path: '/admin/offers', icon: Award },
  ];

  const adminQuickLinks = [
    { label: 'Skill Analytics', path: '/admin/skill-analytics', icon: BarChart3 },
    { label: 'Accreditation Reports', path: '/admin/reports', icon: LineChart },
    { label: 'Candidate Matching', path: '/admin/candidate-matching', icon: Binary },
    { label: 'All Applications', path: '/admin/applications', icon: Layers },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  const primaryNav =
    user?.role === 'STUDENT'
      ? studentPrimaryNav
      : user?.role === 'HR'
      ? hrPrimaryNav
      : adminPrimaryNav;

  const quickLinks =
    user?.role === 'STUDENT'
      ? studentQuickLinks
      : user?.role === 'HR'
      ? hrQuickLinks
      : adminQuickLinks;

  const portalLabel =
    user?.role === 'STUDENT'
      ? 'Student Portal'
      : user?.role === 'HR'
      ? 'Recruiter Portal'
      : 'Placement Admin';

  const userSubtext =
    user?.role === 'STUDENT'
      ? 'B.Tech CSE - 2024'
      : user?.role === 'HR'
      ? 'Tech Recruitment'
      : 'Placement Director';

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0F172A] z-50 flex flex-col select-none border-r border-[#1E293B] shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1E293B] flex items-center space-x-3 bg-[#0F172A]">
        <div className="w-8 h-8 bg-[#4F46E5] rounded flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          C
        </div>
        <span className="text-white font-bold text-lg tracking-tight truncate">CareerFlow</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-2">
          <p className="text-[#64748B] text-[10px] uppercase font-bold tracking-widest">{portalLabel}</p>
        </div>

        <div className="space-y-0.5 mb-4">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-${item.path.replace(/\//g, '-')}`}
                className={({ isActive: isLinkActive }) => {
                  const active = isActive || isLinkActive;
                  return `flex items-center px-6 py-2.5 text-sm transition-colors ${
                    active
                      ? 'text-white bg-[#1E293B] font-medium'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                  }`;
                }}
              >
                <Icon className="w-4 h-4 mr-3 opacity-80 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Quick Links Section */}
        <div className="px-4 mt-4 mb-2 border-t border-[#1E293B] pt-4">
          <p className="text-[#64748B] text-[10px] uppercase font-bold tracking-widest">Quick Links</p>
        </div>

        <div className="space-y-0.5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-quick-${item.path.replace(/\//g, '-')}`}
                className={({ isActive: isLinkActive }) => {
                  const active = isActive || isLinkActive;
                  return `flex items-center px-6 py-2 text-xs transition-colors ${
                    active
                      ? 'text-white bg-[#1E293B]/70 font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50'
                  }`;
                }}
              >
                <Icon className="w-3.5 h-3.5 mr-2.5 opacity-60 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0F172A] shrink-0">
        <div className="flex items-center space-x-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-[#1E293B]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-xs text-white font-semibold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CF'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Sarah Mitchell'}</p>
            <p className="text-[10px] text-[#64748B] truncate">{userSubtext}</p>
          </div>
          <button
            onClick={handleLogout}
            id="sidebar-logout-btn"
            title="Sign Out"
            className="text-[#64748B] hover:text-[#EF4444] p-1 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

