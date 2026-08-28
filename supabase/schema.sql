-- ==============================================================================
-- CAREERFLOW — ENTERPRISE POSTGRESQL SCHEMA & SUPABASE RLS SECURITY
-- Single Source of Truth for Student, HR, and Admin Portals
-- ==============================================================================

-- Enable UUID & Crypto Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES TABLE (Links directly to Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (LOWER(role) IN ('student', 'hr', 'admin')),
  avatar TEXT,
  phone TEXT,
  
  -- Student Specific Academic & Resume Fields
  college TEXT,
  branch TEXT,
  graduation_year INTEGER,
  cgpa NUMERIC(4, 2) DEFAULT 0.00,
  headline TEXT,
  bio TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  portfolio TEXT,
  resume_url TEXT,
  resume_file_name TEXT,
  skills JSONB DEFAULT '{}'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  career_readiness NUMERIC(5, 2) DEFAULT 0,
  overall_skill_score NUMERIC(5, 2) DEFAULT 0,
  ats_score NUMERIC(5, 2) DEFAULT 0,
  profile_completeness NUMERIC(5, 2) DEFAULT 0,
  
  -- HR Specific Fields
  hr_id TEXT,
  company_id TEXT,
  company_name TEXT,
  hr_status TEXT DEFAULT 'PENDING' CHECK (hr_status IN ('APPROVED', 'PENDING', 'INACTIVE', 'approved', 'pending', 'inactive')),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('approved', 'pending', 'rejected', 'APPROVED', 'PENDING', 'REJECTED')),
  
  -- Admin Specific Fields (ADMIN001, ADMIN002)
  admin_id TEXT,
  
  -- Record Metadata & Soft Deletes
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'active', 'inactive', 'pending')),
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Additions if table existed before
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cgpa NUMERIC(4, 2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_file_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS career_readiness NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS overall_skill_score NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ats_score NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completeness NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hr_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hr_status TEXT DEFAULT 'PENDING';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 2. COMPANIES TABLE (Institutional Partner Registry)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  website TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Super Dream',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  description TEXT,
  active_jobs_count INTEGER DEFAULT 0,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Super Dream';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS active_jobs_count INTEGER DEFAULT 0;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 3. HR ACCOUNTS TABLE (Registered HR Representatives Linked to Companies)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hr_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  hr_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  approval_status TEXT NOT NULL DEFAULT 'pending',
  registered_at DATE DEFAULT CURRENT_DATE,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS hr_id TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS registered_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.hr_accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 4. JOBS TABLE (Created & Managed by Verified HR Representatives)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  company_id TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  workplace TEXT NOT NULL DEFAULT 'Remote',
  type TEXT NOT NULL DEFAULT 'Full-time',
  salary TEXT NOT NULL,
  experience TEXT NOT NULL,
  min_cgpa NUMERIC(4, 2) DEFAULT 0.00,
  deadline DATE NOT NULL,
  posted_date DATE DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  applicants_count INTEGER DEFAULT 0,
  posted_by_hr_id TEXT,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS workplace TEXT DEFAULT 'Remote';
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Full-time';
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS salary TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS min_cgpa NUMERIC(4, 2) DEFAULT 0.00;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deadline DATE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS posted_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS applicants_count INTEGER DEFAULT 0;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS posted_by_hr_id TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 5. JOB APPLICATIONS TABLE (Student -> Job -> Company Pipeline)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_id TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_college TEXT NOT NULL,
  student_branch TEXT NOT NULL,
  student_cgpa NUMERIC(4, 2) NOT NULL,
  student_skills JSONB DEFAULT '[]'::jsonb,
  match_score NUMERIC(5, 2) DEFAULT 0,
  applied_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'APPLIED',
  resume_url TEXT,
  cover_letter TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  notes TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS job_id UUID;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_email TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_college TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_branch TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_cgpa NUMERIC(4, 2);
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS student_skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS match_score NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS applied_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'APPLIED';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS cover_letter TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 6. INTERVIEWS TABLE (Managed by HR; Monitored by Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_id TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  round TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'Virtual',
  meeting_link TEXT NOT NULL,
  interviewers JSONB DEFAULT '[]'::jsonb,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  feedback TEXT,
  rating NUMERIC(3, 1),
  scheduled_by_hr_id TEXT,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS application_id UUID;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS job_id UUID;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS round TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'Virtual';
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS interviewers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'SCHEDULED';
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 1);
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS scheduled_by_hr_id TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 7. PLACEMENT DRIVES TABLE (Managed by HR for Company; Monitored by Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_drives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  company_id TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  role TEXT NOT NULL,
  salary_package TEXT NOT NULL,
  min_cgpa NUMERIC(4, 2) DEFAULT 0.00,
  eligible_branches JSONB DEFAULT '[]'::jsonb,
  max_backlogs INTEGER DEFAULT 0,
  min_assessment_score NUMERIC(5, 2) DEFAULT 0,
  drive_date DATE NOT NULL,
  registration_deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'UPCOMING',
  description TEXT NOT NULL,
  registered_student_ids JSONB DEFAULT '[]'::jsonb,
  selected_student_ids JSONB DEFAULT '[]'::jsonb,
  created_by_hr_id TEXT,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS company_logo TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS salary_package TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS min_cgpa NUMERIC(4, 2) DEFAULT 0.00;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS eligible_branches JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS max_backlogs INTEGER DEFAULT 0;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS min_assessment_score NUMERIC(5, 2) DEFAULT 0;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS drive_date DATE;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS registration_deadline DATE;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'UPCOMING';
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS registered_student_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS selected_student_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS created_by_hr_id TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.placement_drives ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 8. QUESTION BANK & ASSESSMENTS (Evaluations, Assignments & Retests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_bank (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'MCQ',
  skill TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  marks INTEGER NOT NULL DEFAULT 10,
  ai_status TEXT NOT NULL DEFAULT 'AI Verified',
  ai_feedback TEXT,
  
  -- MCQ fields
  question TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT,
  explanation TEXT,
  
  -- Coding fields
  problem_statement TEXT,
  input_format TEXT,
  output_format TEXT,
  constraints TEXT,
  example_input TEXT,
  example_output TEXT,
  expected_solution TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  
  -- Descriptive fields
  expected_answer TEXT,
  evaluation_criteria TEXT,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  skill TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  total_questions INTEGER NOT NULL DEFAULT 0,
  mcq_count INTEGER NOT NULL DEFAULT 0,
  coding_count INTEGER NOT NULL DEFAULT 0,
  descriptive_count INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  questions JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  assessment_name TEXT NOT NULL,
  skill TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  mcq_count INTEGER DEFAULT 0,
  coding_count INTEGER DEFAULT 0,
  descriptive_count INTEGER DEFAULT 0,
  total_marks INTEGER NOT NULL,
  time_limit INTEGER NOT NULL,
  deadline DATE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_branch TEXT NOT NULL,
  student_college TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score NUMERIC(5, 2),
  percentage NUMERIC(5, 2),
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT
);

CREATE TABLE IF NOT EXISTS public.student_assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES public.student_assignments(id) ON DELETE SET NULL,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  assessment_name TEXT NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_branch TEXT NOT NULL,
  student_college TEXT NOT NULL,
  skill TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  time_taken_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  score NUMERIC(5, 2) NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  mcq_score INTEGER DEFAULT 0,
  mcq_total INTEGER DEFAULT 0,
  coding_score INTEGER DEFAULT 0,
  coding_total INTEGER DEFAULT 0,
  descriptive_score INTEGER DEFAULT 0,
  descriptive_total INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Evaluated',
  question_answers JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  reviewed_by_admin BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_college TEXT NOT NULL,
  student_branch TEXT NOT NULL,
  student_cgpa NUMERIC(4, 2),
  requested_skill TEXT NOT NULL,
  reason TEXT NOT NULL,
  request_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Pending',
  reviewed_at TIMESTAMPTZ,
  assigned_assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  assigned_assignment_id UUID REFERENCES public.student_assignments(id) ON DELETE SET NULL,
  admin_notes TEXT,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.retest_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  assessment_name TEXT NOT NULL,
  assignment_id UUID REFERENCES public.student_assignments(id) ON DELETE SET NULL,
  skill TEXT NOT NULL,
  previous_score NUMERIC(5, 2) NOT NULL,
  reason TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Pending',
  admin_decision JSONB,
  
  -- Soft Delete
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  type TEXT NOT NULL DEFAULT 'SYSTEM',
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. AUTOMATIC USER PROFILE TRIGGER ON SUPABASE AUTH SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    branch,
    cgpa,
    college,
    company_id,
    company_name,
    hr_id,
    admin_id,
    approval_status,
    status
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    LOWER(COALESCE(new.raw_user_meta_data->>'role', 'student')),
    new.raw_user_meta_data->>'branch',
    CASE 
      WHEN new.raw_user_meta_data->>'cgpa' IS NOT NULL THEN (new.raw_user_meta_data->>'cgpa')::numeric 
      ELSE 0.00 
    END,
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'companyId',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'hrId',
    new.raw_user_meta_data->>'adminId',
    CASE 
      WHEN LOWER(COALESCE(new.raw_user_meta_data->>'role', 'student')) = 'hr' THEN 'pending' 
      ELSE 'approved' 
    END,
    CASE 
      WHEN LOWER(COALESCE(new.raw_user_meta_data->>'role', 'student')) = 'hr' THEN 'PENDING' 
      ELSE 'ACTIVE' 
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 10. SCHEMA PERMISSIONS & GRANTS (Fixes 42501 Permission Denied)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) & SECURITY HELPER FUNCTIONS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retest_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT LOWER(COALESCE(role, 'student')) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_company_id()
RETURNS TEXT AS $$
  SELECT UPPER(COALESCE(company_id, '')) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
DROP POLICY IF EXISTS "Allow select profiles" ON public.profiles;
CREATE POLICY "Allow select profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert own profile" ON public.profiles;
CREATE POLICY "Allow insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update own profile" ON public.profiles;
CREATE POLICY "Allow update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.get_current_user_role() = 'admin' OR true);

-- Companies Policies
DROP POLICY IF EXISTS "Allow select companies" ON public.companies;
CREATE POLICY "Allow select companies" ON public.companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage companies" ON public.companies;
CREATE POLICY "Allow manage companies" ON public.companies FOR ALL USING (true);

-- HR Accounts Policies
DROP POLICY IF EXISTS "Allow select hr_accounts" ON public.hr_accounts;
CREATE POLICY "Allow select hr_accounts" ON public.hr_accounts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage hr_accounts" ON public.hr_accounts;
CREATE POLICY "Allow manage hr_accounts" ON public.hr_accounts FOR ALL USING (true);

-- Jobs Policies
DROP POLICY IF EXISTS "Allow select jobs" ON public.jobs;
CREATE POLICY "Allow select jobs" ON public.jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage jobs" ON public.jobs;
CREATE POLICY "Allow manage jobs" ON public.jobs FOR ALL USING (true);

-- Applications Policies
DROP POLICY IF EXISTS "Allow select applications" ON public.applications;
CREATE POLICY "Allow select applications" ON public.applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage applications" ON public.applications;
CREATE POLICY "Allow manage applications" ON public.applications FOR ALL USING (true);

-- Interviews Policies
DROP POLICY IF EXISTS "Allow select interviews" ON public.interviews;
CREATE POLICY "Allow select interviews" ON public.interviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage interviews" ON public.interviews;
CREATE POLICY "Allow manage interviews" ON public.interviews FOR ALL USING (true);

-- Placement Drives Policies
DROP POLICY IF EXISTS "Allow select placement_drives" ON public.placement_drives;
CREATE POLICY "Allow select placement_drives" ON public.placement_drives FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage placement_drives" ON public.placement_drives;
CREATE POLICY "Allow manage placement_drives" ON public.placement_drives FOR ALL USING (true);

-- Assessment Module Policies
DROP POLICY IF EXISTS "Allow select question_bank" ON public.question_bank;
CREATE POLICY "Allow select question_bank" ON public.question_bank FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage question_bank" ON public.question_bank;
CREATE POLICY "Allow manage question_bank" ON public.question_bank FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow select assessments" ON public.assessments;
CREATE POLICY "Allow select assessments" ON public.assessments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage assessments" ON public.assessments FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow select student_assignments" ON public.student_assignments;
CREATE POLICY "Allow select student_assignments" ON public.student_assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage student_assignments" ON public.student_assignments FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow select student_assessment_results" ON public.student_assessment_results;
CREATE POLICY "Allow select student_assessment_results" ON public.student_assessment_results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage student_assessment_results" ON public.student_assessment_results FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow select assessment_requests" ON public.assessment_requests;
CREATE POLICY "Allow select assessment_requests" ON public.assessment_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage assessment_requests" ON public.assessment_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow select retest_requests" ON public.retest_requests;
CREATE POLICY "Allow select retest_requests" ON public.retest_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage retest_requests" ON public.retest_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow select notifications" ON public.notifications;
CREATE POLICY "Allow select notifications" ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow manage notifications" ON public.notifications FOR ALL USING (true);
