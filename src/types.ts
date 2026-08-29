export type UserRole = 'STUDENT' | 'HR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hrId?: string;
  adminId?: string;
  company?: string;
  companyId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'APPROVED';
  college?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  college: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  careerReadiness: number; // 0 - 100
  overallSkillScore: number; // 0 - 100
  headline: string;
  bio: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  resumeUrl: string;
  resumeFileName?: string;
  skills: { [key: string]: number }; // e.g. { Python: 94, DSA: 88, SQL: 82, React: 90, DBMS: 76, Java: 80, Aptitude: 85, Communication: 90 }
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    score: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }[];
  achievements: string[];
  atsScore: number;
  profileCompleteness: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface HrProfile {
  id: string;
  hrId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyId?: string;
  companyLogo: string;
  companyIndustry: string;
  companyWebsite: string;
  companyLocation: string;
  companySize: string;
  companyDescription: string;
  avatar: string;
}

export type HrAccountStatus = 'APPROVED' | 'PENDING' | 'INACTIVE';

export interface HrAccount {
  id: string;
  hrId: string;
  name: string;
  email: string;
  password?: string;
  companyId: string;
  companyName: string;
  status: HrAccountStatus;
  phone?: string;
  avatar?: string;
  registeredAt?: string;
}

export interface Job {
  id: string;
  company: string;
  companyId?: string;
  companyLogo: string;
  title: string;
  department: string;
  location: string;
  workplace: 'Remote' | 'Hybrid' | 'On-site';
  type: 'Full-time' | 'Internship' | 'Contract';
  salary: string; // e.g. "$120k - $150k" or "12 - 16 LPA"
  experience: string;
  minCgpa: number;
  deadline: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  applicantsCount: number;
  postedByHrId?: string;
  postedByRole?: 'ADMIN' | 'HR';
  postedBy?: string;
}

export type ApplicationStatus = 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'OFFERED' | 'REJECTED';

export interface Company {
  id: string;
  companyId: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  contactEmail: string;
  tier: 'Super Dream' | 'Tier-1' | 'Tier-2';
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
  activeJobsCount?: number;
  createdAt?: string;
}

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  studentCgpa: number;
  studentSkills: string[];
  matchScore: number;
  appliedDate: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  coverLetter?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  notes?: string;
  timeline: ApplicationTimelineEvent[];
}

export type InterviewRound = 'Technical' | 'System Design' | 'HR Screen' | 'Culture Fit' | 'Coding Assessment' | 'Final Round';
export type InterviewFormat = 'Virtual' | 'On-site' | 'Phone';
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  round: InterviewRound;
  date: string;
  time: string;
  format: InterviewFormat;
  meetingLink: string;
  interviewers: string[];
  instructions?: string;
  status: InterviewStatus;
  feedback?: string;
  rating?: number;
}

export interface PlacementDrive {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  salaryPackage: string;
  minCgpa: number;
  eligibleBranches: string[];
  maxBacklogs: number;
  minAssessmentScore: number;
  driveDate: string;
  registrationDeadline: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  description: string;
  registeredStudentIds: string[];
  selectedStudentIds: string[];
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type QuestionType = 'MCQ' | 'Coding' | 'Descriptive';
export type SkillDomain =
  | 'Python'
  | 'Java'
  | 'JavaScript'
  | 'React'
  | 'DSA'
  | 'SQL'
  | 'DBMS'
  | 'Aptitude'
  | 'Communication'
  | 'HTML/CSS';

export type SkillCategory = SkillDomain;

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
export type AiVerificationStatus = 'AI Verified' | 'Needs Review' | 'Rejected';

export interface TestCase {
  input: string;
  output: string;
}

export interface CodingTestCase {
  input: string;
  expectedOutput?: string;
  output?: string;
  isHidden?: boolean;
}

export interface BankQuestion {
  id: string;
  type: QuestionType;
  skill: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  aiStatus: AiVerificationStatus;
  aiFeedback?: string;
  
  // MCQ fields
  question?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string | number; // 'A' | 'B' | 'C' | 'D' or 0,1,2,3
  explanation?: string;

  // Coding fields
  problemStatement?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  exampleInput?: string;
  exampleOutput?: string;
  expectedSolution?: string;
  testCases?: CodingTestCase[];

  // Descriptive fields
  expectedAnswer?: string;
  evaluationCriteria?: string;
}

export interface Assessment {
  id: string;
  name: string;
  skill: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  mcqCount: number;
  codingCount: number;
  descriptiveCount: number;
  totalMarks: number;
  durationMinutes: number;
  questions: BankQuestion[];
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
}

export type AssignmentTargetType = 'SPECIFIC_STUDENT' | 'MULTIPLE_STUDENTS' | 'ALL_STUDENTS' | 'BRANCH' | 'COLLEGE';

export interface StudentAssignment {
  id: string;
  assessmentId: string;
  assessmentName: string;
  skill: string;
  difficulty: string;
  totalQuestions: number;
  mcqCount: number;
  codingCount: number;
  descriptiveCount: number;
  totalMarks: number;
  timeLimit: number; // in minutes
  deadline: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentBranch: string;
  studentCollege: string;
  status: 'New' | 'In Progress' | 'Completed' | 'Expired';
  assignedAt: string;
  completedAt?: string;
  submissionId?: string;
  score?: number;
  percentage?: number;
}

export interface QuestionSubmissionDetail {
  questionId: string;
  questionType: QuestionType;
  questionText: string;
  skill: string;
  difficulty: string;
  maxMarks: number;
  awardedMarks: number;
  studentAnswer: string | number;
  correctAnswerOrSolution: string;
  explanationOrCriteria: string;
  isCorrect?: boolean;
  adminFeedback?: string;
}

export interface StudentAssessmentResult {
  id: string;
  assignmentId?: string;
  assessmentId?: string;
  assessmentName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentBranch: string;
  studentCollege: string;
  skill: string;
  date: string;
  timeTakenMinutes: number;
  totalMarks: number;
  obtainedMarks: number;
  score: number;
  percentage: number;
  mcqScore: number;
  mcqTotal: number;
  codingScore: number;
  codingTotal: number;
  descriptiveScore: number;
  descriptiveTotal: number;
  status: 'Evaluated' | 'Pending Review';
  questionAnswers: QuestionSubmissionDetail[];
  strengths: string[];
  weaknesses: string[];
  reviewedByAdmin?: boolean;
  adminNotes?: string;
}

export type AssessmentRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Assessment Sent';

export interface StudentAssessmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  studentCgpa?: number;
  requestedSkill: string;
  reason: string;
  requestDate: string;
  status: AssessmentRequestStatus;
  reviewedAt?: string;
  assignedAssessmentId?: string;
  assignedAssignmentId?: string;
  adminNotes?: string;
}

export interface RetestRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assessmentId: string;
  assessmentName: string;
  assignmentId?: string;
  skill: string;
  previousScore: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminDecision?: {
    action: 'Approved' | 'Rejected';
    questionStrategy?: 'Same Questions' | 'New Questions';
    newAssessmentId?: string;
    decidedAt: string;
    remarks?: string;
  };
}

export interface AssessmentSubmission {
  id: string;
  skill: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  percentile: number;
  timeTakenMinutes: number;
  date: string;
  skillBreakdown: { [skill: string]: number };
  answers: { [questionId: string]: number };
}

export interface SkillGap {
  skill: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  learningCourse: string;
  estimatedHours: number;
}

export interface AiJobSuggestion {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  salary: string;
  location: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  aiExplanation: string;
  workplace: 'Remote' | 'Hybrid' | 'On-site';
  jobId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'APPLICATION' | 'INTERVIEW' | 'ASSESSMENT' | 'DRIVE' | 'SYSTEM';
  actionUrl?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'application' | 'assessment' | 'interview' | 'drive' | 'system';
  icon: string;
  badgeColor?: string;
}

export interface HrInvitation {
  id: string;
  code: string;
  company: string;
  email: string;
  status: 'PENDING' | 'USED' | 'EXPIRED';
  createdAt: string;
}

export interface SelfAssessmentAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  skill: string;
  status: 'IN_PROGRESS' | 'ROUND1_COMPLETED' | 'SUBMITTED' | 'EXPIRED';
  startedAt: string;
  expiresAt: string;
  submittedAt?: string;
  round1CompletedAt?: string;
  round2StartedAt?: string;
  round1Score?: number;
  round1Total?: number;
  round2Count?: number;
  round2Status?: 'PENDING_EVALUATION' | 'EVALUATED' | 'COMPLETED';
  score?: number;
  percentage?: number;
  result?: string;
  mcqQuestionIds: string[];
  codingQuestionIds: string[];
  violationsCount?: number;
}

export interface AssessmentAnswerRecord {
  id?: string;
  attemptId: string;
  questionId: string;
  studentId: string;
  answer: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  answeredAt?: string;
  updatedAt?: string;
}

export interface AssessmentViolationRecord {
  id?: string;
  attemptId: string;
  studentId: string;
  violationType: string;
  occurredAt: string;
  metadata?: any;
}

