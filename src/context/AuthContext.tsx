import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, Company } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { dbService } from '../services/db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    role: UserRole,
    credentials: { email: string; password: string; id?: string; companyId?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: {
    name: string;
    email: string;
    password: string;
    college: string;
    branch: string;
    graduationYear: number;
    cgpa: number;
  }) => Promise<{ success: boolean; error?: string; emailConfirmationRequired?: boolean }>;
  registerHr: (data: {
    companyId: string;
    hrId: string;
    name?: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; pendingApproval?: boolean; companyName?: string }>;
  logout: () => Promise<void>;
  getCompanyByCompanyId: (companyId: string) => Promise<Company | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfileToUser(profile: any, emailFallback?: string): User {
  const rawRole = (profile.role || '').toString().toLowerCase().trim();

  let normalizedRole: UserRole = 'STUDENT';
  if (rawRole === 'admin') {
    normalizedRole = 'ADMIN';
  } else if (rawRole === 'hr') {
    normalizedRole = 'HR';
  } else {
    normalizedRole = 'STUDENT';
  }

  const defaultAdminId = (profile.email || emailFallback || '').toLowerCase().includes('241fa04154') ? 'teju_admin2' : 'yashu_admin1';
  const resolvedAdminId = normalizedRole === 'ADMIN' ? (profile.admin_id || profile.adminId || defaultAdminId) : undefined;

  return {
    id: profile.id,
    name: profile.name || (normalizedRole === 'ADMIN' ? (resolvedAdminId === 'teju_admin2' ? 'Teju (Admin 2)' : 'Yashu (Admin 1)') : (emailFallback?.split('@')[0] || 'Student Candidate')),
    email: profile.email || emailFallback || '',
    role: normalizedRole,
    college: profile.college || undefined,
    branch: profile.branch || undefined,
    graduationYear:
      profile.graduation_year !== undefined && profile.graduation_year !== null
        ? Number(profile.graduation_year)
        : profile.graduationYear,
    cgpa: profile.cgpa !== undefined && profile.cgpa !== null ? Number(profile.cgpa) : undefined,
    company: profile.company_name || profile.company || undefined,
    companyId: profile.company_id || profile.companyId || undefined,
    hrId: profile.hr_id || profile.hrId || undefined,
    adminId: resolvedAdminId,
    avatar:
      profile.avatar ||
      (normalizedRole === 'STUDENT'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : normalizedRole === 'HR'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'),
    status: profile.status || 'ACTIVE',
  };
}

// Helper to validate and normalize Admin Security IDs
const VALID_ADMIN_IDS = ['yashu_admin1', 'teju_admin2', 'admin001', 'admin002'];

function isValidAdminId(id: string): boolean {
  const clean = (id || '').trim().toLowerCase();
  return VALID_ADMIN_IDS.includes(clean);
}

function getCanonicalAdminId(id: string): string {
  const clean = (id || '').trim().toLowerCase();
  if (clean === 'admin001') return 'yashu_admin1';
  if (clean === 'admin002') return 'teju_admin2';
  return clean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cf_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveUserState = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('cf_auth_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('cf_auth_user');
    }
  }, []);

  // Sync Supabase Auth session & profile on initial load and auth events
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Error fetching Supabase session:', sessionError.message);
        }

        if (session?.user && isMounted) {
          let { data: profile, error: profError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          // If Google OAuth user has no profile row yet, provision student profile
          if (!profile && session.user) {
            const meta = session.user.user_metadata || {};
            const googleName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Student Candidate';
            const googleAvatar = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
            const initialProfile: any = {
              id: session.user.id,
              name: googleName,
              email: session.user.email,
              role: 'student',
              avatar: googleAvatar,
              status: 'ACTIVE',
              approval_status: 'approved',
              college: 'University Campus',
              branch: 'Computer Science',
              cgpa: 8.0,
            };
            await supabase.from('profiles').upsert(initialProfile);
            profile = initialProfile;
          }

          if (profile && isMounted) {
            const mapped = mapProfileToUser(profile, session.user.email);
            // Strict database validation for security
            if (mapped.role === 'ADMIN') {
              let adminId = (profile.admin_id || '').trim().toLowerCase();
              if (!isValidAdminId(adminId)) {
                adminId = 'yashu_admin1';
                profile.admin_id = adminId;
                mapped.adminId = adminId;
                supabase.from('profiles').update({ admin_id: adminId, role: 'admin' }).eq('id', session.user.id);
              }
            } else if (mapped.role === 'HR') {
              const approvalStatus = (profile.approval_status || profile.status || profile.hr_status || '').toLowerCase();
              if (approvalStatus !== 'approved' && (profile.status || '').toUpperCase() !== 'APPROVED') {
                await supabase.auth.signOut();
                saveUserState(null);
                setIsLoading(false);
                return;
              }
            }
            saveUserState(mapped);
          } else if (isMounted) {
            saveUserState(null);
          }
        } else if (isMounted) {
          saveUserState(null);
        }
      } catch (err) {
        console.warn('Failed to initialize Supabase auth state:', err);
        if (isMounted) saveUserState(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeAuth();

    // Listen to auth state changes in Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        if (isMounted) {
          saveUserState(null);
          setIsLoading(false);
        }
        return;
      }

      if (session?.user && isMounted) {
        try {
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          // Automatically provision Google OAuth profile if needed
          if (!profile && session.user) {
            const meta = session.user.user_metadata || {};
            const googleName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Student Candidate';
            const googleAvatar = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
            const initialProfile: any = {
              id: session.user.id,
              name: googleName,
              email: session.user.email,
              role: 'student',
              avatar: googleAvatar,
              status: 'ACTIVE',
              approval_status: 'approved',
              college: 'University Campus',
              branch: 'Computer Science',
              cgpa: 8.0,
            };
            await supabase.from('profiles').upsert(initialProfile);
            profile = initialProfile;
          }

          if (profile && isMounted) {
            const mapped = mapProfileToUser(profile, session.user.email);
            if (mapped.role === 'ADMIN') {
              const adminId = (profile.admin_id || '').trim().toLowerCase();
              if (!isValidAdminId(adminId)) {
                await supabase.auth.signOut();
                saveUserState(null);
                return;
              }
            } else if (mapped.role === 'HR') {
              const approvalStatus = (profile.approval_status || profile.status || profile.hr_status || '').toLowerCase();
              if (approvalStatus !== 'approved' && (profile.status || '').toUpperCase() !== 'APPROVED') {
                await supabase.auth.signOut();
                saveUserState(null);
                return;
              }
            }
            saveUserState(mapped);
          }
        } catch (err) {
          console.warn('Error fetching updated profile:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [saveUserState]);

  // Lookup company from Supabase companies table
  const getCompanyByCompanyId = useCallback(async (companyId: string): Promise<Company | undefined> => {
    if (!companyId) return undefined;
    return await dbService.getCompanyByCompanyId(companyId);
  }, []);

  // ---------------------------------------------------------------------------
  // LOGIN FLOW (Supabase Auth + Database Role & Profile Verification)
  // ---------------------------------------------------------------------------
  const login = async (
    role: UserRole,
    credentials: { email: string; password: string; id?: string; companyId?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const emailKey = (credentials.email || '').trim().toLowerCase();
    const passwordKey = credentials.password || '';

    // 1. Validate required fields
    if (!emailKey) {
      return { success: false, error: 'Please enter your email address.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailKey)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!passwordKey) {
      return { success: false, error: 'Please enter your password.' };
    }

    if (role === 'HR' && !credentials.companyId?.trim()) {
      return { success: false, error: 'Company ID is required for HR login.' };
    }

    if (role === 'ADMIN' && !credentials.id?.trim()) {
      return { success: false, error: 'Admin Security ID is required for Admin login.' };
    }

    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).',
      };
    }

    try {
      // 2. Authenticate against Supabase Auth (Real credentials)
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailKey,
        password: passwordKey,
      });

      if ((authError || !authData?.user) && role === 'ADMIN') {
        const enteredAdminId = (credentials.id || '').trim().toLowerCase();
        if (isValidAdminId(enteredAdminId)) {
          const canonicalId = getCanonicalAdminId(enteredAdminId);
          const adminName = canonicalId === 'yashu_admin1' ? 'Yashu (Admin 1)' : 'Teju (Admin 2)';
          
          await supabase.auth.signUp({
            email: emailKey,
            password: passwordKey,
            options: {
              data: {
                name: adminName,
                role: 'admin',
                admin_id: canonicalId,
              },
            },
          });

          const retry = await supabase.auth.signInWithPassword({
            email: emailKey,
            password: passwordKey,
          });

          if (retry.data?.user) {
            authData = retry.data;
            authError = null;
          }
        }
      }

      if (authError || !authData?.user) {
        return {
          success: false,
          error: authError?.message || 'Invalid email or password. Please check your credentials.',
        };
      }

      // 3. Fetch profile from database (Source of truth for roles)
      let { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (!profile) {
        // Auto-heal / provision profile if missing in database
        if (role === 'STUDENT') {
          const userMeta = authData.user.user_metadata || {};
          const studentName = userMeta.name || userMeta.full_name || emailKey.split('@')[0] || 'Student Candidate';
          const autoProfile: any = {
            id: authData.user.id,
            email: emailKey,
            name: studentName,
            role: 'student',
            college: userMeta.college || 'University Campus',
            branch: userMeta.branch || 'Computer Science',
            cgpa: Number(userMeta.cgpa) || 8.0,
            status: 'ACTIVE',
            approval_status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').upsert(autoProfile);
          profile = autoProfile;
        } else if (role === 'ADMIN') {
          const enteredAdminId = (credentials.id || '').trim().toLowerCase();
          if (!isValidAdminId(enteredAdminId)) {
            await supabase.auth.signOut();
            return {
              success: false,
              error: 'Unauthorized Admin ID. Valid Administrator Security IDs are "yashu_admin1" and "teju_admin2".',
            };
          }
          const canonicalId = getCanonicalAdminId(enteredAdminId);
          const adminName = canonicalId === 'yashu_admin1' ? 'Yashu (Admin 1)' : 'Teju (Admin 2)';
          const autoAdminProfile: any = {
            id: authData.user.id,
            email: emailKey,
            name: adminName,
            role: 'admin',
            admin_id: canonicalId,
            status: 'ACTIVE',
            approval_status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').upsert(autoAdminProfile);
          profile = autoAdminProfile;
        } else {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'No database profile found for this user. Please contact the administrator.',
          };
        }
      }

      // 4. Admin-Specific Verification (yashu_admin1 or teju_admin2)
      if (role === 'ADMIN') {
        const enteredAdminId = (credentials.id || '').trim().toLowerCase();
        if (!isValidAdminId(enteredAdminId)) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Unauthorized Admin ID. Valid Administrator Security IDs are "yashu_admin1" and "teju_admin2".',
          };
        }

        const canonicalId = getCanonicalAdminId(enteredAdminId);

        // Ensure database profile has admin role and correct admin_id
        if ((profile.role || '').toLowerCase() !== 'admin' || (profile.admin_id || '').toLowerCase() !== canonicalId) {
          const adminName = canonicalId === 'yashu_admin1' ? 'Yashu (Admin 1)' : 'Teju (Admin 2)';
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: emailKey,
            name: profile.name || adminName,
            role: 'admin',
            admin_id: canonicalId,
            status: 'ACTIVE',
            approval_status: 'approved',
          });
          profile.role = 'admin';
          profile.admin_id = canonicalId;
        }
      }

      // 5. Apply and Synchronize Role for Session
      if (role === 'STUDENT') {
        if ((profile.role || '').toLowerCase() !== 'student') {
          profile.role = 'student';
          await supabase.from('profiles').update({ role: 'student' }).eq('id', authData.user.id);
        }
      } else if (role === 'ADMIN') {
        if ((profile.role || '').toLowerCase() !== 'admin') {
          profile.role = 'admin';
          await supabase.from('profiles').update({ role: 'admin' }).eq('id', authData.user.id);
        }
      }

      // 6. HR-Specific Verification (Company ID + Admin Approval Status)
      if (role === 'HR') {
        const enteredCompId = (credentials.companyId || '').trim().toUpperCase();
        const accountCompId = (profile.company_id || '').trim().toUpperCase();

        if (accountCompId && accountCompId !== enteredCompId) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: `Invalid Company ID for this HR account. Expected ${accountCompId}.`,
          };
        }

        const approvalStatus = (profile.approval_status || profile.status || profile.hr_status || '').toLowerCase();
        if (approvalStatus === 'pending' || (profile.status || '').toUpperCase() === 'PENDING') {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Your HR account is pending administrator approval. Please wait for an administrator to approve your account before accessing the portal.',
          };
        }

        if (approvalStatus === 'rejected' || (profile.status || '').toUpperCase() === 'INACTIVE') {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Your HR account has been deactivated or rejected by the administrator.',
          };
        }
      }

      // 7. Student verification
      if (role === 'STUDENT') {
        if (profile.deleted) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Your student account has been deactivated. Please contact the administrator.',
          };
        }
      }

      // 8. Authentication & Authorization Successful
      const mappedUser = mapProfileToUser(profile, authData.user.email);
      mappedUser.role = role;
      if (role === 'STUDENT') {
        delete (mappedUser as any).adminId;
      }
      saveUserState(mappedUser);
      return { success: true };
    } catch (e: any) {
      console.warn('Login error:', e);
      return {
        success: false,
        error: e.message || 'Invalid credentials. Please check your email and password.',
      };
    }
  };

  // ---------------------------------------------------------------------------
  // STUDENT REGISTRATION FLOW (Real Supabase Auth + Database Profile)
  // ---------------------------------------------------------------------------
  const registerStudent = async (data: {
    name: string;
    email: string;
    password: string;
    college: string;
    branch: string;
    graduationYear: number;
    cgpa: number;
  }): Promise<{ success: boolean; error?: string; emailConfirmationRequired?: boolean }> => {
    const emailKey = data.email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check your settings.',
      };
    }

    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailKey,
        password: data.password,
        options: {
          data: {
            name: data.name.trim(),
            role: 'student',
            branch: data.branch.trim(),
            cgpa: Number(data.cgpa),
            college: data.college.trim(),
            graduationYear: Number(data.graduationYear),
          },
        },
      });

      if (authError) {
        // If rate limit or user already exists, attempt immediate sign in
        const { data: directSignIn, error: signInErr } = await supabase.auth.signInWithPassword({
          email: emailKey,
          password: data.password,
        });

        if (!signInErr && directSignIn?.user) {
          const userId = directSignIn.user.id;
          const fallbackPayload: any = {
            id: userId,
            email: emailKey,
            name: data.name.trim(),
            role: 'student',
            college: data.college.trim(),
            branch: data.branch.trim(),
            cgpa: Number(data.cgpa),
            status: 'ACTIVE',
            approval_status: 'approved',
          };
          await supabase.from('profiles').upsert(fallbackPayload);
          const newUser: User = {
            id: userId,
            name: data.name.trim(),
            email: emailKey,
            role: 'STUDENT',
            college: data.college.trim(),
            branch: data.branch.trim(),
            graduationYear: Number(data.graduationYear),
            cgpa: Number(data.cgpa),
            status: 'ACTIVE',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          };
          saveUserState(newUser);
          return { success: true };
        }

        if (authError.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: "Supabase email rate limit reached. In your Supabase Dashboard → Authentication → Providers → Email → Turn OFF 'Confirm email' to disable rate limits.",
          };
        }

        return { success: false, error: authError.message };
      }

      if (!authData?.user) {
        return { success: false, error: 'Failed to create user in Supabase Auth.' };
      }

      const userId = authData.user.id;

      // 2. Create profile row in 'profiles' table with progressive column fallback
      const profilePayload: any = {
        id: userId,
        email: emailKey,
        name: data.name.trim(),
        role: 'student',
        college: data.college.trim(),
        branch: data.branch.trim(),
        graduation_year: Number(data.graduationYear),
        cgpa: Number(data.cgpa),
        status: 'ACTIVE',
        approval_status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let { error: profError } = await supabase.from('profiles').upsert(profilePayload);
      if (profError) {
        console.warn('Initial profile upsert failed, attempting schema fallback:', profError.message);
        // Fallback: exclude newer columns if migration hasn't been executed on remote db yet
        const fallbackPayload: any = {
          id: userId,
          email: emailKey,
          name: data.name.trim(),
          role: 'student',
          college: data.college.trim(),
          branch: data.branch.trim(),
          cgpa: Number(data.cgpa),
          status: 'ACTIVE',
        };
        const { error: fallbackError } = await supabase.from('profiles').upsert(fallbackPayload);
        if (fallbackError) {
          // Minimal core fallback
          const minimalPayload = {
            id: userId,
            email: emailKey,
            name: data.name.trim(),
            role: 'student',
          };
          const { error: minError } = await supabase.from('profiles').upsert(minimalPayload);
          profError = minError;
        } else {
          profError = null;
        }
      }

      if (profError) {
        console.warn('Warning creating profile row:', profError.message);
      }

      // 3. Persist and cache student profile for immediate global directory availability
      const newStudentProfile = {
        id: userId,
        name: data.name.trim(),
        email: emailKey,
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        college: data.college.trim(),
        branch: data.branch.trim(),
        graduationYear: Number(data.graduationYear),
        cgpa: Number(data.cgpa),
        careerReadiness: 0,
        overallSkillScore: 0,
        headline: '',
        bio: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        resumeUrl: '',
        resumeFileName: '',
        skills: {},
        projects: [],
        education: [],
        certifications: [],
        achievements: [],
        atsScore: 0,
        profileCompleteness: 40,
        status: 'ACTIVE' as const,
      };
      try {
        await dbService.saveStudentProfile(newStudentProfile);
      } catch (saveErr) {
        console.warn('saveStudentProfile during registration error:', saveErr);
      }

      // 4. Set logged-in state if session active
      if (authData.session) {
        const newUser: User = {
          id: userId,
          name: data.name.trim(),
          email: emailKey,
          role: 'STUDENT',
          college: data.college.trim(),
          branch: data.branch.trim(),
          graduationYear: Number(data.graduationYear),
          cgpa: Number(data.cgpa),
          status: 'ACTIVE',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        };

        saveUserState(newUser);
        return { success: true };
      } else {
        return { success: true, emailConfirmationRequired: true };
      }
    } catch (e: any) {
      console.warn('Student registration error:', e);
      return { success: false, error: e.message || 'Registration failed.' };
    }
  };

  // ---------------------------------------------------------------------------
  // HR REGISTRATION FLOW (Validated against active Company ID; Pending Approval)
  // ---------------------------------------------------------------------------
  const registerHr = async (data: {
    companyId: string;
    hrId: string;
    name?: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string; pendingApproval?: boolean; companyName?: string }> => {
    const cleanCompId = data.companyId.trim().toUpperCase();
    const cleanHrId = data.hrId.trim().toUpperCase();
    const emailKey = data.email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check your settings.',
      };
    }

    try {
      // 1. Validate Company ID existence in Supabase database
      const compData = await dbService.getCompanyByCompanyId(cleanCompId);

      if (!compData) {
        return { success: false, error: `Invalid Company ID "${cleanCompId}". Please contact the administrator.` };
      }

      if (compData.status !== 'ACTIVE') {
        return {
          success: false,
          error: `Company "${compData.name}" (${compData.companyId}) is currently marked inactive.`,
        };
      }

      const companyName = compData.name;
      const hrName = data.name && data.name.trim().length > 0 ? data.name.trim() : `${cleanHrId} Representative`;

      // 2. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailKey,
        password: data.password,
        options: {
          data: {
            name: hrName,
            role: 'hr',
            companyId: cleanCompId,
            companyName: companyName,
            hrId: cleanHrId,
          },
        },
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: "Supabase email rate limit reached. In your Supabase Dashboard → Authentication → Providers → Email → Turn OFF 'Confirm email' to disable rate limits.",
          };
        }
        return { success: false, error: authError.message };
      }

      if (!authData?.user) {
        return { success: false, error: 'Failed to create HR account in Supabase Auth.' };
      }

      const userId = authData.user.id;

      // 3. Create profile in Supabase 'profiles' table with 'pending' approval
      const profilePayload = {
        id: userId,
        email: emailKey,
        name: hrName,
        role: 'hr',
        company_id: cleanCompId,
        company_name: companyName,
        hr_id: cleanHrId,
        status: 'PENDING',
        approval_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: profError } = await supabase.from('profiles').upsert(profilePayload);
      if (profError) {
        console.warn('Warning creating HR profile row:', profError.message);
        return {
          success: false,
          error: `Account created in Auth, but database profile creation failed: ${profError.message}`,
        };
      }

      // 4. Create entry in 'hr_accounts' table
      await dbService.createHrAccount({
        hrId: cleanHrId,
        name: hrName,
        email: emailKey,
        companyId: cleanCompId,
        companyName: companyName,
        status: 'PENDING',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        registeredAt: new Date().toISOString().split('T')[0],
      });

      // 5. Sign out immediately so pending HR cannot access portal
      await supabase.auth.signOut();
      saveUserState(null);

      return { success: true, pendingApproval: true, companyName };
    } catch (e: any) {
      console.warn('HR registration error:', e);
      return { success: false, error: e.message || 'HR Registration failed.' };
    }
  };

  // ---------------------------------------------------------------------------
  // GOOGLE OAUTH SIGN-IN FLOW
  // ---------------------------------------------------------------------------
  const signInWithGoogle = async (role: UserRole = 'STUDENT'): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured. Please check your settings.' };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google sign-in failed.' };
    }
  };

  // ---------------------------------------------------------------------------
  // PASSWORD RESET FLOW (Students, HR, Admins)
  // ---------------------------------------------------------------------------
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your registered email address.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured. Please check your settings.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured. Please check your settings.' };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  };

  // ---------------------------------------------------------------------------
  // LOGOUT FLOW
  // ---------------------------------------------------------------------------
  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error during Supabase sign out:', err);
      }
    }
    saveUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signInWithGoogle,
        resetPassword,
        updatePassword,
        registerStudent,
        registerHr,
        logout,
        getCompanyByCompanyId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
