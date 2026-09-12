import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SupportChat } from './components/SupportChat';
import { ClinicalBackground } from './components/ClinicalBackground';
import { IntroVideoSplashScreen } from './components/IntroVideoSplashScreen';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Screening } from './pages/Screening';
import { Result } from './pages/Result';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { Report } from './pages/Report';
import { Support } from './pages/Support';
import { Profile } from './pages/Profile';

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-transparent overflow-hidden text-[#16324F] relative z-10">
      {/* Sidebar for navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto relative">
          {children}
          {/* Floating AI Support Widget available throughout the app */}
          <SupportChat />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-[#F8FBFF] text-[#16324F] overflow-x-hidden selection:bg-[#1677C8] selection:text-white">
        {/* Global Animated Ophthalmology & AI MedTech Background System */}
        <ClinicalBackground />

        {/* 4-Second Introductory Video Splash Overlay */}
        <IntroVideoSplashScreen durationSeconds={4} videoSrc="/intro_video.mp4" />

        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/screening"
                element={
                  <AuthenticatedLayout>
                    <Screening />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/result/:assessmentId"
                element={
                  <AuthenticatedLayout>
                    <Result />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/screening/result/:assessmentId"
                element={
                  <AuthenticatedLayout>
                    <Result />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/history"
                element={
                  <AuthenticatedLayout>
                    <History />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <AuthenticatedLayout>
                    <Reports />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/reports/:assessmentId"
                element={
                  <AuthenticatedLayout>
                    <Report />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/support"
                element={
                  <AuthenticatedLayout>
                    <Support />
                  </AuthenticatedLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthenticatedLayout>
                    <Profile />
                  </AuthenticatedLayout>
                }
              />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
