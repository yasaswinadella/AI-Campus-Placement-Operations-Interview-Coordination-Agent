import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Screen
import { LoginPage } from './pages/auth/LoginPage';

// Student Screens (16 Screens)
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAssessment } from './pages/student/StudentAssessment';
import { StudentResults } from './pages/student/StudentResults';
import { StudentSkillAnalysis } from './pages/student/StudentSkillAnalysis';
import { StudentSkillGaps } from './pages/student/StudentSkillGaps';
import { StudentAiJobSuggestions } from './pages/student/StudentAiJobSuggestions';
import { StudentCareerPaths } from './pages/student/StudentCareerPaths';
import { StudentJobs } from './pages/student/StudentJobs';
import { StudentJobEligibility } from './pages/student/StudentJobEligibility';
import { StudentApply } from './pages/student/StudentApply';
import { StudentApplications } from './pages/student/StudentApplications';
import { StudentInterview } from './pages/student/StudentInterview';
import { StudentRetest } from './pages/student/StudentRetest';
import { StudentProgress } from './pages/student/StudentProgress';
import { StudentProfileResume } from './pages/student/StudentProfileResume';

// HR Screens (9 Screens)
import { HrDashboard } from './pages/hr/HrDashboard';
import { HrPostJob } from './pages/hr/HrPostJob';
import { HrManageJobs } from './pages/hr/HrManageJobs';
import { HrApplicants } from './pages/hr/HrApplicants';
import { HrApplicantDetail } from './pages/hr/HrApplicantDetail';
import { HrScheduleInterview } from './pages/hr/HrScheduleInterview';
import { HrInterviewManagement } from './pages/hr/HrInterviewManagement';
import { HrPlacementDrives } from './pages/hr/HrPlacementDrives';
import { HrShortlistedPool } from './pages/hr/HrShortlistedPool';

// Admin Screens (10 Screens)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminCompanies } from './pages/admin/AdminCompanies';
import { AdminPlacementDrives } from './pages/admin/AdminPlacementDrives';
import { AdminInterviews } from './pages/admin/AdminInterviews';
import { AdminAssessments } from './pages/admin/AdminAssessments';
import { AdminSkillAnalytics } from './pages/admin/AdminSkillAnalytics';
import { AdminOffers } from './pages/admin/AdminOffers';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

const RootRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (user.role === 'HR') return <Navigate to="/hr/dashboard" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastContainer />
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Student Role Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="assignments" element={<Navigate to="/student/assessment" replace />} />
              <Route path="assessment" element={<StudentAssessment />} />
              <Route path="results" element={<StudentResults />} />
              <Route path="skill-analysis" element={<StudentSkillAnalysis />} />
              <Route path="skill-gaps" element={<StudentSkillGaps />} />
              <Route path="ai-job-suggestions" element={<StudentAiJobSuggestions />} />
              <Route path="career-paths" element={<StudentCareerPaths />} />
              <Route path="jobs" element={<StudentJobs />} />
              <Route path="job-eligibility" element={<StudentJobEligibility />} />
              <Route path="apply" element={<StudentApply />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="interview" element={<StudentInterview />} />
              <Route path="retest" element={<StudentRetest />} />
              <Route path="progress" element={<StudentProgress />} />
              <Route path="profile-resume" element={<StudentProfileResume />} />
            </Route>

            {/* HR Role Routes */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/hr/dashboard" replace />} />
              <Route path="dashboard" element={<HrDashboard />} />
              <Route path="post-job" element={<HrPostJob />} />
              <Route path="manage-jobs" element={<HrManageJobs />} />
              <Route path="applicants" element={<HrApplicants />} />
              <Route path="applicant-detail" element={<HrApplicantDetail />} />
              <Route path="placement-drives" element={<HrPlacementDrives />} />
              <Route path="schedule-interview" element={<HrScheduleInterview />} />
              <Route path="interview-management" element={<HrInterviewManagement />} />
              <Route path="shortlisted-pool" element={<HrShortlistedPool />} />
            </Route>

            {/* Admin Role Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="placement-drives" element={<AdminPlacementDrives />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="assessments" element={<Navigate to="/admin/skill-analytics" replace />} />
              <Route path="skill-analytics" element={<AdminSkillAnalytics />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Root / Catch-all Redirect */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
