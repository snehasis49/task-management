import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BugList from './pages/BugList';
import CreateBug from './pages/CreateBug';
import BugDetail from './pages/BugDetail';




function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          pt: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/bugs" element={
              <ProtectedRoute>
                <AppLayout>
                  <BugList />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/bugs/new" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateBug />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/bugs/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <BugDetail />
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
