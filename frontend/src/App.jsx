import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Layout from './components/common/Layout';
import AuthLayout from './components/common/AuthLayout';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CVAnalyzer from './pages/CVAnalyzer';
import SkillAssessment from './pages/SkillAssessment';
import CareerGuidance from './pages/CareerGuidance';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// HR Portal Pages
import HRDashboard from './pages/hr/HRDashboard';
import JobPostings from './pages/hr/JobPostings';
import CandidateSearch from './pages/hr/CandidateSearch';
import MatchingResults from './pages/hr/MatchingResults';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import SystemConfig from './pages/admin/SystemConfig';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    style: {
                      background: '#10B981',
                    },
                  },
                  error: {
                    style: {
                      background: '#EF4444',
                    },
                  },
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Authentication Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/cv-analyzer" element={<CVAnalyzer />} />
                  <Route path="/skill-assessment" element={<SkillAssessment />} />
                  <Route path="/career-guidance" element={<CareerGuidance />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* HR Portal Routes */}
                <Route element={<ProtectedRoute role="hr"><Layout /></ProtectedRoute>}>
                  <Route path="/hr/dashboard" element={<HRDashboard />} />
                  <Route path="/hr/job-postings" element={<JobPostings />} />
                  <Route path="/hr/candidate-search" element={<CandidateSearch />} />
                  <Route path="/hr/matching-results" element={<MatchingResults />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute role="admin"><Layout /></ProtectedRoute>}>
                  <Route path="/admin/panel" element={<AdminPanel />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/config" element={<SystemConfig />} />
                </Route>

                {/* Fallback Routes */}
                <Route path="/404" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404</h1><p className="text-gray-600 dark:text-gray-300">Page not found</p></div></div>} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;