import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { Login } from './screens/Login';
import { Layout } from './components/Layout';
import { LecturerDashboard } from './screens/LecturerDashboard';
import { LectureEntry } from './screens/LectureEntry';
import { StudentDashboard } from './screens/StudentDashboard';
import { PRLDashboard } from './screens/PRLDashboard';
import { Profile } from './screens/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const RoleRedirect = () => {
  const { profile } = useAuth();
  if (!profile) return null;

  switch (profile.role) {
    case 'lecturer': return <LecturerDashboard />;
    case 'student': return <StudentDashboard />;
    case 'prl': return <PRLDashboard />;
    case 'pl': return <PRLDashboard />; 
    case 'admin': return <PRLDashboard />; 
    default: return <StudentDashboard />;
  }
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
          <Route path="/lecture/new" element={<ProtectedRoute><LectureEntry /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
