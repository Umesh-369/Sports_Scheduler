import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/RouteGuards';

// Pages
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SessionsPage } from './pages/SessionsPage';
import { SessionDetailsPage } from './pages/SessionDetailsPage';
import { CreateSessionPage } from './pages/CreateSessionPage';
import { AdminSportsPage } from './pages/AdminSportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-card max-w-md w-full space-y-4">
        <div className="text-5xl font-black text-brand-red">404</div>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested page could not be found. Please check the URL or return to dashboard.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-2 px-5 py-2 rounded-full font-bold text-xs text-white bg-brand-red hover:bg-brand-red-dark transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest Only Auth Routes */}
          <Route
            path="/signin"
            element={
              <GuestRoute>
                <SignInPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUpPage />
              </GuestRoute>
            }
          />

          {/* Protected Application Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/sessions/:id" element={<SessionDetailsPage />} />
            <Route path="/create-session" element={<CreateSessionPage />} />
            <Route path="/sports" element={<AdminSportsPage />} />
            <Route path="/admin" element={<Navigate to="/admin/sports" replace />} />
            <Route
              path="/admin/sports"
              element={
                <AdminRoute>
                  <AdminSportsPage />
                </AdminRoute>
              }
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
