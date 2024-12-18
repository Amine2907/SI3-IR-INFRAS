import { Routes, Route, Navigate } from 'react-router-dom';
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entites"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Entites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/site-infos"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SiteDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sites"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Sites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sites/:Sid/contacts"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SiteInfoCard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/confirm-reset-password" element={<ResetPasswordForm />} />
      <Route path="/auth/confirm-sign-up" element={<ConfirmSignup />} />
    </Routes>
  );
}
