import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/BugList';
import CreateBug from './pages/CreateBug';
import BugDetail from './pages/BugDetail';
import Interview from './pages/Interview';
import 'react-toastify/dist/ReactToastify.css';




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
          width: '100%',
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
                  <TaskList />
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
            <Route path="/interview" element={
              <ProtectedRoute>
                <AppLayout>
                  <Interview />
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
