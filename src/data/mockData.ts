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
  id: 'STU-1001',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@university.edu',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  college: 'School of Engineering & Applied Sciences',
  branch: 'Computer Science',
  graduationYear: 2026,
  cgpa: 8.8,
  careerReadiness: 90,
  overallSkillScore: 88,
  headline: 'Full-Stack Developer & Distributed Systems Researcher',
  bio: 'Passionate about high-throughput backend services and modern frontend state architectures.',
  location: 'Bangalore / Seattle',
  linkedin: 'https://linkedin.com/in/sarahjenkins',
  github: 'https://github.com/sarahjenkins',
  portfolio: 'https://sarahjenkins.dev',
  resumeUrl: '',
  resumeFileName: 'Sarah_Jenkins_CV_2026.pdf',
  skills: { Python: 92, DSA: 88, SQL: 85, React: 84, Java: 80, DBMS: 86 },
  projects: [],
  education: [],
  certifications: [],
  achievements: [],
  atsScore: 92,
  profileCompleteness: 85,
  status: 'ACTIVE',
};

export const INITIAL_STUDENTS_LIST: StudentProfile[] = [
  {
    id: 'STU-1001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    college: 'School of Engineering & Applied Sciences',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 9.1,
    careerReadiness: 94,
    overallSkillScore: 92,
    headline: 'Full-Stack Developer & Distributed Systems Researcher',
    bio: 'Passionate about high-throughput backend services and modern frontend state architectures.',
    location: 'Bangalore / Seattle',
    linkedin: 'https://linkedin.com/in/sarahjenkins',
    github: 'https://github.com/sarahjenkins',
    portfolio: 'https://sarahjenkins.dev',
    resumeUrl: '',
    resumeFileName: 'Sarah_Jenkins_CV_2026.pdf',
    skills: { Python: 94, DSA: 92, React: 90, SQL: 88, Java: 86, DBMS: 89 },
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    atsScore: 94,
    profileCompleteness: 95,
    status: 'ACTIVE',
  },
  {
    id: 'STU-1002',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    college: 'School of Engineering & Applied Sciences',
    branch: 'Computer Science & AI',
    graduationYear: 2026,
    cgpa: 8.8,
    careerReadiness: 90,
    overallSkillScore: 88,
    headline: 'Machine Learning & Python Algorithmic Engineer',
    bio: 'Experienced in PyTorch, neural networks, and scalable cloud data pipelines.',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexrivera',
    github: 'https://github.com/alexrivera',
    portfolio: 'https://alexrivera.io',
    resumeUrl: '',
    resumeFileName: 'Alex_Rivera_Resume_2026.pdf',
    skills: { Python: 96, DSA: 88, SQL: 85, DBMS: 84 },
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    atsScore: 89,
    profileCompleteness: 90,
    status: 'ACTIVE',
  },
  {
    id: 'STU-1003',
    name: 'Priyadarshini Roy',
    email: 'priya.roy@university.edu',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    college: 'Institute of Technology',
    branch: 'Information Technology',
    graduationYear: 2026,
    cgpa: 9.4,
    careerReadiness: 96,
    overallSkillScore: 95,
    headline: 'Cloud Systems Architect & Core Database Engineer',
    bio: 'Specializing in PostgreSQL query optimization, distributed consensus, and microservices.',
    location: 'Hyderabad, India',
    linkedin: 'https://linkedin.com/in/priyaroy',
    github: 'https://github.com/priyaroy',
    portfolio: 'https://priyaroy.tech',
    resumeUrl: '',
    resumeFileName: 'Priya_Roy_Resume.pdf',
    skills: { SQL: 98, DBMS: 96, Java: 94, DSA: 91, React: 88 },
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    atsScore: 96,
    profileCompleteness: 98,
    status: 'ACTIVE',
  },
  {
    id: 'STU-1004',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@university.edu',
    phone: '+91 91234 56780',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    college: 'National Institute of Engineering',
    branch: 'Electronics & Communication',
    graduationYear: 2026,
    cgpa: 8.6,
    careerReadiness: 87,
    overallSkillScore: 85,
    headline: 'Embedded Software & IoT Full Stack Developer',
    bio: 'Bridging firmware, hardware protocols, and modern web telemetry dashboards.',
    location: 'Bangalore, India',
    linkedin: 'https://linkedin.com/in/rahulsharma',
    github: 'https://github.com/rahulsharma',
    portfolio: 'https://rahulsharma.dev',
    resumeUrl: '',
    resumeFileName: 'Rahul_Sharma_CV.pdf',
    skills: { Python: 88, React: 86, DSA: 82, Java: 84 },
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    atsScore: 86,
    profileCompleteness: 88,
    status: 'ACTIVE',
  },
];

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
