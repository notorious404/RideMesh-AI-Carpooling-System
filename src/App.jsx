import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import CreateRidePage from './pages/CreateRidePage';
import FindRidePage from './pages/FindRidePage';
import RideDetailsPage from './pages/RideDetailsPage';
import ActiveRidePage from './pages/ActiveRidePage';
import MyRidesPage from './pages/MyRidesPage';
import ProfilePage from './pages/ProfilePage';
import RideHistoryPage from './pages/RideHistoryPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Authenticated Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-ride"
              element={
                <ProtectedRoute>
                  <CreateRidePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-ride"
              element={
                <ProtectedRoute>
                  <FindRidePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride/:rideId"
              element={
                <ProtectedRoute>
                  <RideDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/active-ride/:rideId"
              element={
                <ProtectedRoute>
                  <ActiveRidePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rides"
              element={
                <ProtectedRoute>
                  <MyRidesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride-history"
              element={
                <ProtectedRoute>
                  <RideHistoryPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
