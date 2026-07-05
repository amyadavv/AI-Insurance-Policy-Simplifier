// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import ClaimsAppealPage from './pages/ClaimsAppealPage';
import AppealDetailPage from './pages/AppealDetailPage';
import PolicyComparisonPage from './pages/PolicyComparisonPage';
import ComparisonDetailPage from './pages/ComparisonDetailPage';
import AgentSettingsPage from './pages/AgentSettingsPage';
import SharedPolicyPage from './pages/SharedPolicyPage';
import HRDashboardPage from './pages/HRDashboardPage';
import EmployeePortalPage from './pages/EmployeePortalPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <RecoilRoot>
        <Router>
          <div className="min-h-screen bg-page text-primary-theme font-sans">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/policy/:id"
                element={
                  <ProtectedRoute>
                    <PolicyDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appeals"
                element={
                  <ProtectedRoute>
                    <ClaimsAppealPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appeals/:id"
                element={
                  <ProtectedRoute>
                    <AppealDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare"
                element={
                  <ProtectedRoute>
                    <PolicyComparisonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare/:id"
                element={
                  <ProtectedRoute>
                    <ComparisonDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent/settings"
                element={
                  <ProtectedRoute>
                    <AgentSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute>
                    <HRDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee/portal"
                element={
                  <ProtectedRoute>
                    <EmployeePortalPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Public Client shared route */}
              <Route path="/shared/policy/:id" element={<SharedPolicyPage />} />

              {/* Legal Pages */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </Router>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
