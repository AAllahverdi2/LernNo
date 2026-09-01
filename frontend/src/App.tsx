import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';

// Teacher Pages
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { ClassesPage } from './pages/ClassesPage';
import { ClassDetailPage } from './pages/ClassDetailPage';
import { TeacherVocabularyPage } from './pages/TeacherVocabularyPage';
import { TeacherStudentsPage } from './pages/TeacherStudentsPage';
import { TeacherAnalyticsPage } from './pages/TeacherAnalyticsPage';
import { TeacherAIToolsPage } from './pages/TeacherAIToolsPage';
import { TeacherSettingsPage } from './pages/TeacherSettingsPage';

// Student Pages
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { StudentTodayPage } from './pages/StudentTodayPage';
import { StudentReviewPage } from './pages/StudentReviewPage';
import { StudentVocabularyPage } from './pages/StudentVocabularyPage';
import { StudentQuizPage } from './pages/StudentQuizPage';
import { StudentProgressPage } from './pages/StudentProgressPage';
import { StudentSettingsPage } from './pages/StudentSettingsPage';

// Admin Page
import { AdminUsersPage } from './pages/AdminUsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const RoleBasedRedirect: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/admin/users" replace />;
  return <Navigate to={role === 'teacher' ? '/teacher' : '/student'} replace />;
};

const ProtectedTeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'teacher' && role !== 'admin') return <Navigate to="/student" replace />;
  return <>{children}</>;
};

const ProtectedStudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/teacher" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Admin Shell */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <DashboardLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route path="users" element={<AdminUsersPage />} />
              </Route>

              {/* Teacher Shell */}
              <Route
                path="/teacher"
                element={
                  <ProtectedTeacherRoute>
                    <DashboardLayout />
                  </ProtectedTeacherRoute>
                }
              >
                <Route index element={<TeacherDashboardPage />} />
                <Route path="classes" element={<ClassesPage />} />
                <Route path="classes/:classId" element={<ClassDetailPage />} />
                <Route path="vocabulary" element={<TeacherVocabularyPage />} />
                <Route path="assignments" element={<ClassDetailPage />} />
                <Route path="students" element={<TeacherStudentsPage />} />
                <Route path="analytics" element={<TeacherAnalyticsPage />} />
                <Route path="ai-tools" element={<TeacherAIToolsPage />} />
                <Route path="settings" element={<TeacherSettingsPage />} />
              </Route>

              {/* Student Shell */}
              <Route
                path="/student"
                element={
                  <ProtectedStudentRoute>
                    <DashboardLayout />
                  </ProtectedStudentRoute>
                }
              >
                <Route index element={<StudentDashboardPage />} />
                <Route path="today" element={<StudentTodayPage />} />
                <Route path="review" element={<StudentReviewPage />} />
                <Route path="vocabulary" element={<StudentVocabularyPage />} />
                <Route path="quiz" element={<StudentQuizPage />} />
                <Route path="progress" element={<StudentProgressPage />} />
                <Route path="settings" element={<StudentSettingsPage />} />
              </Route>

              {/* Fallbacks */}
              <Route path="/" element={<RoleBasedRedirect />} />
              <Route path="*" element={<RoleBasedRedirect />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
