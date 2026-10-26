import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './locales';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { CropLibraryPage } from './pages/CropLibraryPage';
import { CropDetailPage } from './pages/CropDetailPage';
import { CultivationListPage } from './pages/CultivationListPage';
import { PestDiseasePage } from './pages/PestDiseasePage';
import { HarvestingPage } from './pages/HarvestingPage';
import { PostHarvestPage } from './pages/PostHarvestPage';
import { WeatherPage } from './pages/WeatherPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { LearningProgressPage } from './pages/LearningProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Public Pages */}
              <Route index element={<LandingPage />} />
              <Route path="login" element={<AuthPages initialMode="login" />} />
              <Route path="register" element={<AuthPages initialMode="register" />} />
              <Route path="recommendations" element={<RecommendationPage />} />
              <Route path="crops" element={<CropLibraryPage />} />
              <Route path="crops/:id" element={<CropDetailPage />} />
              <Route path="cultivation" element={<CultivationListPage />} />
              <Route path="cultivation/:id" element={<CropDetailPage />} />
              <Route path="pests-diseases" element={<PestDiseasePage />} />
              <Route path="harvesting" element={<HarvestingPage />} />
              <Route path="post-harvest" element={<PostHarvestPage />} />
              <Route path="weather" element={<WeatherPage />} />
              <Route path="chatbot" element={<ChatbotPage />} />

              {/* Protected User Pages */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-progress"
                element={
                  <ProtectedRoute>
                    <LearningProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Pages */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
