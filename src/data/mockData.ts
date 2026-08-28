import {
  StudentProfile,
  HrProfile,
  HrAccount,
  Job,
  JobApplication,
  Interview,
  PlacementDrive,
  AssessmentQuestion,
  SkillGap,
  AiJobSuggestion,
  Notification,
  ActivityLog,
  HrInvitation,
  Company,
  BankQuestion,
  Assessment,
  StudentAssignment,
  StudentAssessmentResult,
  RetestRequest,
  StudentAssessmentRequest,
} from '../types';

// ============================================================================
// CLEAN INITIAL STATES (NO MOCK / FAKE DATA)
// All data is sourced dynamically from Supabase / real database tables.
// ============================================================================

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  college: '',
  branch: '',
  graduationYear: new Date().getFullYear(),
  cgpa: 0,
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
  profileCompleteness: 0,
  status: 'ACTIVE',
};

export const INITIAL_STUDENTS_LIST: StudentProfile[] = [];

export const INITIAL_HR_PROFILE: HrProfile = {
  id: '',
  hrId: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  companyId: '',
  companyLogo: '',
  companyIndustry: '',
  companyWebsite: '',
  companyLocation: '',
  companySize: '',
  companyDescription: '',
  avatar: '',
};

export const INITIAL_COMPANIES: Company[] = [];

export const INITIAL_HR_ACCOUNTS: HrAccount[] = [];

export const INITIAL_JOBS: Job[] = [];

export const INITIAL_APPLICATIONS: JobApplication[] = [];

export const INITIAL_INTERVIEWS: Interview[] = [];

export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [];

export const INITIAL_QUESTION_BANK: BankQuestion[] = [];

export const INITIAL_ASSESSMENTS: Assessment[] = [];

export const INITIAL_STUDENT_ASSIGNMENTS: StudentAssignment[] = [];

export const INITIAL_STUDENT_ASSESSMENT_RESULTS: StudentAssessmentResult[] = [];

export const INITIAL_ASSESSMENT_REQUESTS: StudentAssessmentRequest[] = [];

export const INITIAL_RETEST_REQUESTS: RetestRequest[] = [];

export const INITIAL_SKILL_GAPS: SkillGap[] = [];

export const INITIAL_AI_SUGGESTIONS: AiJobSuggestion[] = [];

export const INITIAL_NOTIFICATIONS: Notification[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const INITIAL_HR_INVITATIONS: HrInvitation[] = [];
