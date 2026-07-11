// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './components/common/PublicLayout';
import DashboardLayout from './components/common/DashboardLayout';

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
          <Routes>
            {/* Public Marketing & Legal Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Public Client shared route */}
              <Route path="/shared/policy/:id" element={<SharedPolicyPage />} />

              {/* Legal Pages */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Authenticated Dashboard Routes with Left Sidebar Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/policy/:id" element={<PolicyDetailPage />} />
              <Route path="/appeals" element={<ClaimsAppealPage />} />
              <Route path="/appeals/:id" element={<AppealDetailPage />} />
              <Route path="/compare" element={<PolicyComparisonPage />} />
              <Route path="/compare/:id" element={<ComparisonDetailPage />} />
              <Route path="/agent/settings" element={<AgentSettingsPage />} />
              <Route path="/hr/dashboard" element={<HRDashboardPage />} />
              <Route path="/employee/portal" element={<EmployeePortalPage />} />
            </Route>
          </Routes>
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
