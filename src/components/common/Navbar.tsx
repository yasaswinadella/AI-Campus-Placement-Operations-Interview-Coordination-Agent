import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronDown,
  X,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, logout, switchRoleQuick } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (url?: string, notifId?: string) => {
    if (notifId) markNotificationAsRead(notifId);
    setShowNotifications(false);
    if (url) navigate(url);
  };

  const getRoleBadge = () => {
    if (user?.role === 'STUDENT') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <GraduationCap className="w-3.5 h-3.5" />
          Student
        </span>
      );
    }
    if (user?.role === 'HR') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Briefcase className="w-3.5 h-3.5" />
          HR Lead
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <Shield className="w-3.5 h-3.5" />
        Administrator
      </span>
    );
  };

  return (
    <header className="sticky top-0 right-0 left-0 h-16 bg-white border-b border-[#E2E8F0] z-40 flex items-center justify-between px-6 lg:px-8 shrink-0">
      {/* Title & Readiness / Metric Indicator */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg lg:text-xl font-bold text-[#0F172A] tracking-tight">
          {user?.role === 'STUDENT' ? 'Student Dashboard' : user?.role === 'HR' ? 'Recruiter Dashboard' : 'Placement Administration'}
        </h1>
        {user?.role === 'STUDENT' && (
          <div className="hidden md:flex bg-[#F1F5F9] px-3 py-1 rounded-full items-center space-x-2 border border-[#E2E8F0]/80">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Readiness</span>
            <div className="w-20 lg:w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: '88%' }}></div>
            </div>
            <span className="text-xs font-bold text-[#4F46E5]">88%</span>
          </div>
        )}
      </div>

      {/* Center Search & Actions */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search jobs, companies, skills..."
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-9 pr-8 py-1.5 text-sm w-56 md:w-64 lg:w-72 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-[#0F172A] placeholder-[#94A3B8] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (onSearch) onSearch('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Role Switcher */}
        <div className="relative">
          <button
            id="role-switch-btn"
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white text-xs font-semibold text-[#0F172A] transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Switch Role</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Impersonate Role
              </div>
              <button
                onClick={() => {
                  switchRoleQuick('STUDENT');
                  setShowRoleSwitcher(false);
                  navigate('/student/dashboard');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  user?.role === 'STUDENT' ? 'bg-[#F1F5F9] text-[#4F46E5] font-semibold' : 'text-[#0F172A] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student (Sarah)</span>
                </div>
                {user?.role === 'STUDENT' && <CheckCircle className="w-3.5 h-3.5 text-[#4F46E5]" />}
              </button>
              <button
                onClick={() => {
                  switchRoleQuick('HR');
                  setShowRoleSwitcher(false);
                  navigate('/hr/dashboard');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  user?.role === 'HR' ? 'bg-[#F1F5F9] text-[#166534] font-semibold' : 'text-[#0F172A] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>HR Lead (TechNova)</span>
                </div>
                {user?.role === 'HR' && <CheckCircle className="w-3.5 h-3.5 text-[#166534]" />}
              </button>
              <button
                onClick={() => {
                  switchRoleQuick('ADMIN');
                  setShowRoleSwitcher(false);
                  navigate('/admin/dashboard');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  user?.role === 'ADMIN' ? 'bg-[#F1F5F9] text-[#7E22CE] font-semibold' : 'text-[#0F172A] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin (Placement)</span>
                </div>
                {user?.role === 'ADMIN' && <CheckCircle className="w-3.5 h-3.5 text-[#7E22CE]" />}
              </button>
            </div>
          )}
        </div>

        {/* Primary Role Action CTA Button */}
        {user?.role === 'STUDENT' && (
          <button
            onClick={() => navigate('/student/apply')}
            className="hidden md:inline-flex bg-[#4F46E5] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#4338CA] transition-colors shadow-sm"
          >
            Apply Now
          </button>
        )}
        {user?.role === 'HR' && (
          <button
            onClick={() => navigate('/hr/post-job')}
            className="hidden md:inline-flex bg-[#4F46E5] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#4338CA] transition-colors shadow-sm"
          >
            Post Job
          </button>
        )}
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/admin/placement-drives')}
            className="hidden md:inline-flex bg-[#4F46E5] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#4338CA] transition-colors shadow-sm"
          >
            Create Drive
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="navbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-[#64748B] hover:text-[#4F46E5] transition-colors rounded-lg hover:bg-[#F8FAFC]"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase text-[#0F172A] tracking-wider">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#4F46E5] font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[#64748B] text-xs">No notifications yet.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.actionUrl, notif.id)}
                      className={`p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-[#4F46E5]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-[#0F172A] truncate">{notif.title}</p>
                          <span className="text-[10px] text-[#64748B] shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Details */}
        <div className="relative pl-2">
          <button
            id="navbar-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] shadow-xs object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-xs text-white font-bold">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CF'}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0F172A] transition-colors" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-[#E2E8F0] mb-1">
                <p className="text-xs font-bold text-[#0F172A]">{user?.name}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                <div className="mt-2">{getRoleBadge()}</div>
              </div>

              {user?.role === 'STUDENT' && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/student/profile-resume');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Profile & Resume</span>
                </button>
              )}

              {user?.role === 'HR' && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/hr/company-profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Company Profile</span>
                </button>
              )}

              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Platform Settings</span>
                </button>
              )}

              <div className="border-t border-[#E2E8F0] my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#EF4444] hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
