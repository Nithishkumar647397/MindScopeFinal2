import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WellnessProvider } from './contexts/WellnessContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <WellnessProvider>
                    <Dashboard />
                  </WellnessProvider>
                </PrivateRoute>
              }
            />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;