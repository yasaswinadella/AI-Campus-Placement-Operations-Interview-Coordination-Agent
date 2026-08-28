import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole, Company } from '../../types';
import {
  Briefcase,
  GraduationCap,
  Shield,
  Lock,
  Mail,
  UserCheck,
  Building,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building2,
  Loader2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signInWithGoogle, resetPassword, updatePassword, registerStudent, registerHr, getCompanyByCompanyId } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<UserRole>('STUDENT');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Forgot Password & Reset Password state
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Update Password state (if user opens reset link with ?reset=true)
  const [isUpdatePasswordMode, setIsUpdatePasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);

  // Detect ?reset=true in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
      setIsUpdatePasswordMode(true);
    }
  }, []);

  // Login form fields (clean, empty defaults)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(''); // Admin Security ID
  const [loginCompanyId, setLoginCompanyId] = useState(''); // HR Company ID
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleGoogleSignIn = () => {
    setError(null);
    setIsGoogleModalOpen(true);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(false);
    const clean = forgotEmail.trim();
    if (!clean) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    setForgotLoading(true);
    const res = await resetPassword(clean);
    setForgotLoading(false);
    if (res.success) {
      setForgotSuccess(true);
      showToast('Reset Link Sent', `Password reset instructions sent to ${clean}.`, 'success');
    } else {
      setForgotError(res.error || 'Failed to send password reset email.');
    }
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setUpdatePasswordLoading(true);
    const res = await updatePassword(newPassword);
    setUpdatePasswordLoading(false);
    if (res.success) {
      showToast('Password Updated', 'Your password has been reset successfully. Please sign in.', 'success');
      setIsUpdatePasswordMode(false);
      setIsForgotPasswordMode(false);
      setPassword('');
      navigate('/login', { replace: true });
    } else {
      setError(res.error || 'Failed to update password.');
    }
  };

  // Student Register form fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regBranch, setRegBranch] = useState('');
  const [regGradYear, setRegGradYear] = useState<number>(new Date().getFullYear());
  const [regCgpa, setRegCgpa] = useState<number>(8.0);

  // HR Registration specific fields
  const [regCompanyId, setRegCompanyId] = useState('');
  const [regHrId, setRegHrId] = useState('');
  const [matchedCompany, setMatchedCompany] = useState<Company | null | undefined>(undefined);
  const [isVerifyingCompany, setIsVerifyingCompany] = useState(false);

  // Real-time Supabase validation for Company ID in HR Registration
  useEffect(() => {
    if (!regCompanyId.trim()) {
      setMatchedCompany(undefined);
      return;
    }

    const timer = setTimeout(async () => {
      setIsVerifyingCompany(true);
      try {
        const comp = await getCompanyByCompanyId(regCompanyId.trim().toUpperCase());
        setMatchedCompany(comp || null);
      } catch {
        setMatchedCompany(null);
      } finally {
        setIsVerifyingCompany(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [regCompanyId, getCompanyByCompanyId]);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setError(null);
    setEmail('');
    setPassword('');
    setRoleId('');
    setLoginCompanyId('');
    setIsRegisterMode(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Check required fields
    if (activeTab === 'HR' && !loginCompanyId.trim()) {
      setError('Company ID is required for HR login.');
      return;
    }

    if (activeTab === 'ADMIN' && !roleId.trim()) {
      setError('Admin ID is required for Admin login.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    // 2. Validate email format
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // 3. Authenticate with Supabase
      const result = await login(activeTab, {
        email: trimmedEmail,
        password,
        id: roleId.trim(),
        companyId: activeTab === 'HR' ? loginCompanyId.trim() : undefined,
      });

      setLoading(false);

      if (result.success) {
        showToast('Welcome back!', `Logged in successfully as ${activeTab}.`);
        if (activeTab === 'STUDENT') navigate('/student/dashboard');
        else if (activeTab === 'HR') navigate('/hr/dashboard');
        else if (activeTab === 'ADMIN') navigate('/admin/dashboard');
      } else {
        // DO NOT redirect the user. Stay on Login page and show error.
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'STUDENT') {
        const res = await registerStudent({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          college: regCollege.trim(),
          branch: regBranch.trim(),
          graduationYear: Number(regGradYear),
          cgpa: Number(regCgpa),
        });

        setLoading(false);
        if (res.success) {
          if (res.emailConfirmationRequired) {
            showToast('Registration Submitted', 'Account created! Please check your email to verify your address.', 'info');
            setIsRegisterMode(false);
            setEmail(regEmail.trim());
          } else {
            showToast('Registration Complete', 'Student account created and authenticated.', 'success');
            navigate('/student/dashboard');
          }
        } else {
          setError(res.error || 'Registration failed.');
        }
      } else if (activeTab === 'HR') {
        if (!regCompanyId.trim()) {
          setLoading(false);
          setError('Company ID is required for HR registration.');
          return;
        }

        if (!regHrId.trim()) {
          setLoading(false);
          setError('HR ID is required.');
          return;
        }

        const res = await registerHr({
          companyId: regCompanyId.trim().toUpperCase(),
          hrId: regHrId.trim().toUpperCase(),
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
        });

        setLoading(false);
        if (res.success) {
          showToast(
            'HR Registration Submitted',
            `Registered for ${res.companyName || regCompanyId.toUpperCase()}. Your account is pending administrator approval before you can access the HR Portal.`,
            'info'
          );
          setIsRegisterMode(false);
          setEmail(regEmail.trim());
          setLoginCompanyId(regCompanyId.trim().toUpperCase());
        } else {
          setError(res.error || 'HR Registration failed. Please check Company ID or contact administrator.');
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Registration failed due to a server error.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden antialiased">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#4F46E5]/20 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-900/30 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-indigo-400 text-white shadow-xl shadow-indigo-500/25 mb-2.5">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">CareerFlow</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-sm mx-auto">
          AI-Powered Campus Placement & Partner HR Management
        </p>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200">
          <button
            type="button"
            id="tab-student"
            onClick={() => handleTabChange('STUDENT')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STUDENT'
                ? 'bg-white text-[#4F46E5] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>STUDENT</span>
          </button>
          <button
            type="button"
            id="tab-hr"
            onClick={() => handleTabChange('HR')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'HR'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>HR PORTAL</span>
          </button>
          <button
            type="button"
            id="tab-admin"
            onClick={() => handleTabChange('ADMIN')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>ADMIN</span>
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {/* ------------------------------------------------------------- */}
          {/* 1. UPDATE PASSWORD VIEW (Triggered via email reset link)      */}
          {/* ------------------------------------------------------------- */}
          {isUpdatePasswordMode ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Set New Password</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter a new, secure password for your verified account.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatePasswordLoading}
                  className="w-full mt-2 py-3 px-4 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {updatePasswordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsUpdatePasswordMode(false)}
                  className="w-full text-xs font-semibold text-slate-500 hover:text-slate-700 py-1.5"
                >
                  Cancel and return to Sign In
                </button>
              </form>
            </div>
          ) : isForgotPasswordMode ? (
            /* ------------------------------------------------------------- */
            /* 2. FORGOT PASSWORD VIEW                                       */
            /* ------------------------------------------------------------- */
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Reset Password</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter your registered {activeTab === 'HR' ? 'HR work' : 'student'} email to receive a password reset link.
                </p>
              </div>

              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{forgotError}</span>
                </div>
              )}

              {forgotSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Password Reset Link Sent!</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed">
                    We've transmitted password reset instructions to <span className="font-semibold text-emerald-950">{forgotEmail}</span>. Please inspect your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setForgotSuccess(false);
                    }}
                    className="w-full mt-3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      {activeTab === 'HR' ? 'HR Work Email Address *' : 'Registered Email Address *'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder={activeTab === 'HR' ? 'hr@company.com' : 'student@university.edu'}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className={`w-full mt-2 py-3 px-4 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer ${
                      activeTab === 'HR'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                        : 'bg-[#4F46E5] hover:bg-indigo-700 shadow-indigo-500/25'
                    }`}
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setForgotError(null);
                    }}
                    className="w-full text-xs font-semibold text-slate-500 hover:text-slate-700 py-1.5 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* 3. STANDARD LOGIN & REGISTER VIEW                             */
            /* ------------------------------------------------------------- */
            <>
              {/* Header Title */}
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  {isRegisterMode
                    ? activeTab === 'HR'
                      ? 'HR Representative Registration'
                      : 'Student Account Registration'
                    : activeTab === 'HR'
                    ? 'Partner HR Portal Sign In'
                    : `${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Portal Login`}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isRegisterMode
                    ? activeTab === 'HR'
                      ? 'Enter your verified Company ID to register an HR account'
                      : 'Fill in your details to create your verified student account'
                    : 'Enter your credentials to access your designated workspace'}
                </p>
              </div>

              {/* Error Message Box */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {!isRegisterMode ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* Student Login: Continue with Google Button */}
                  {activeTab === 'STUDENT' && (
                    <div>
                      <button
                        type="button"
                        id="google-signin-btn"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </button>

                      <div className="relative flex items-center justify-center my-3.5">
                        <div className="w-full border-t border-slate-200" />
                        <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          or continue with email
                        </span>
                        <div className="w-full border-t border-slate-200" />
                      </div>
                    </div>
                  )}

                  {/* HR Login: Company ID */}
                  {activeTab === 'HR' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company ID</label>
                      <div className="relative">
                        <Building className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="login-company-id"
                          type="text"
                          value={loginCompanyId}
                          onChange={(e) => setLoginCompanyId(e.target.value)}
                          placeholder="e.g. CMP001"
                          required
                          className="w-full pl-8 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] uppercase font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Admin Login: Admin Security ID */}
                  {activeTab === 'ADMIN' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Admin Security ID</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="login-admin-id"
                          type="text"
                          value={roleId}
                          onChange={(e) => setRoleId(e.target.value)}
                          placeholder="Enter Admin ID"
                          required
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-[#0F172A] font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      {activeTab === 'HR' ? 'HR Work Email' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={activeTab === 'HR' ? 'hr@company.com' : 'user@university.edu'}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password with Forgot Password link */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#0F172A]">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(true);
                          setForgotEmail(email.trim());
                          setForgotSuccess(false);
                          setForgotError(null);
                        }}
                        className={`text-[11px] font-semibold hover:underline cursor-pointer ${
                          activeTab === 'HR' ? 'text-emerald-700' : 'text-[#4F46E5]'
                        }`}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="login-submit-btn"
                    disabled={loading}
                    className={`w-full mt-2 py-3 px-4 text-white font-semibold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer ${
                      activeTab === 'HR'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                        : activeTab === 'ADMIN'
                        ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                        : 'bg-[#4F46E5] hover:bg-indigo-700 shadow-indigo-500/25'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to {activeTab === 'HR' ? 'HR Portal' : activeTab}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Admin Quick Fill Credentials */}
                  {activeTab === 'ADMIN' && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                        Administrator Access Profiles
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRoleId('yashu_admin1');
                            setEmail('yasaswinadella.1800@gmail.com');
                            setPassword('admin123');
                          }}
                          className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-left transition-colors cursor-pointer"
                        >
                          <div className="font-bold text-xs text-purple-900">Admin 1 (Yashu)</div>
                          <div className="text-[10px] text-purple-700 font-mono">yashu_admin1</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRoleId('teju_admin2');
                            setEmail('241fa04154@gmail.com');
                            setPassword('tejasai');
                          }}
                          className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-left transition-colors cursor-pointer"
                        >
                          <div className="font-bold text-xs text-indigo-900">Admin 2 (Teju)</div>
                          <div className="text-[10px] text-indigo-700 font-mono">teju_admin2</div>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeTab === 'HR' ? (
                <>
                  {/* Company ID Input with Live Status */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#0F172A]">Company ID *</label>
                      <span className="text-[10px] text-slate-500">Provided by Placement Admin</span>
                    </div>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-company-id"
                        type="text"
                        value={regCompanyId}
                        onChange={(e) => setRegCompanyId(e.target.value.toUpperCase())}
                        placeholder="e.g. CMP001"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Live Company ID Feedback */}
                    {regCompanyId.trim() && (
                      <div className="mt-1.5">
                        {isVerifyingCompany ? (
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                            <span>Verifying Company ID with database...</span>
                          </div>
                        ) : matchedCompany ? (
                          matchedCompany.status === 'ACTIVE' ? (
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <div>
                                <span className="font-semibold">Linked: {matchedCompany.name}</span>
                                <span className="text-emerald-600 ml-1">({matchedCompany.companyId} • Active Partner)</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{matchedCompany.name} is currently inactive. Contact Administrator.</span>
                            </div>
                          )
                        ) : (
                          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-700 flex items-center gap-2">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Invalid Company ID. Please contact the administrator.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">HR ID *</label>
                      <div className="relative">
                        <UserCheck className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="reg-hr-id"
                          type="text"
                          value={regHrId}
                          onChange={(e) => setRegHrId(e.target.value.toUpperCase())}
                          placeholder="HR001"
                          required
                          className="w-full pl-8 pr-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Full Name</label>
                      <input
                        id="reg-hr-name"
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">HR Work Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-hr-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="recruiter@company.com"
                        required
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Password *</label>
                      <input
                        id="reg-hr-password"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Confirm Password *</label>
                      <input
                        id="reg-hr-confirm-password"
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Student Registration */
                <>
                  <div>
                    <button
                      type="button"
                      id="google-register-btn"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="relative flex items-center justify-center my-3">
                      <div className="w-full border-t border-slate-200" />
                      <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        or register with email
                      </span>
                      <div className="w-full border-t border-slate-200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">College Email Address *</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex.m@university.edu"
                      required
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Password *</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">Branch *</label>
                      <input
                        type="text"
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        placeholder="Computer Science"
                        required
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">CGPA *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={regCgpa}
                        onChange={(e) => setRegCgpa(parseFloat(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">College *</label>
                    <input
                      type="text"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      required
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                id="reg-submit-btn"
                disabled={loading}
                className={`w-full mt-3 py-3 px-4 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 ${
                  activeTab === 'HR'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                    : 'bg-[#4F46E5] hover:bg-indigo-700 shadow-indigo-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <span>{activeTab === 'HR' ? 'Complete HR Registration' : 'Register Student Account'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Sign In and Registration */}
          {activeTab !== 'ADMIN' && !isForgotPasswordMode && !isUpdatePasswordMode && (
            <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
              <button
                type="button"
                id="toggle-auth-mode-btn"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError(null);
                }}
                className={`text-xs font-semibold hover:underline ${
                  activeTab === 'HR' ? 'text-emerald-700' : 'text-[#4F46E5]'
                }`}
              >
                {isRegisterMode
                  ? 'Already have an account? Sign in'
                  : activeTab === 'HR'
                  ? 'Need to register an HR account with Company ID? Click here'
                  : 'Need a new student account? Register here'}
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Google Sign-In Helper Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">Student Google Sign-In</h3>
                  <p className="text-xs text-slate-500">Sign in with your Google Account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice on 1-Click Google OAuth</span>
              </div>
              <p className="leading-relaxed">
                Direct 1-click Google OAuth redirect requires toggling <strong>Google Provider = ON</strong> in the Supabase Project Dashboard with a Google Cloud Client ID.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                You can log in or register directly using your <strong>Google Email (@gmail.com)</strong> and password with zero extra setup:
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsGoogleModalOpen(false);
                  setIsRegisterMode(false);
                  setEmail('');
                  const emailInput = document.getElementById('login-email');
                  if (emailInput) emailInput.focus();
                }}
                className="w-full py-3 px-4 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In with Email / Gmail</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsGoogleModalOpen(false);
                  setIsRegisterMode(true);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Create New Student Account with Gmail
              </button>

              <button
                type="button"
                onClick={async () => {
                  setIsGoogleModalOpen(false);
                  await signInWithGoogle('STUDENT');
                }}
                className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-slate-600 py-1"
              >
                Try Direct Browser OAuth Redirect anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Footer Notice */}
      <div className="mt-6 text-center text-xs text-slate-500 flex items-center gap-2 relative z-10">
        <Lock className="w-3.5 h-3.5" />
        <span>Enterprise Role-Based Access Control • 256-Bit SSL Encryption</span>
      </div>
    </div>
  );
};
