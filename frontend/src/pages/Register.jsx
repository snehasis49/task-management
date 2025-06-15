import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BugReport,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'dark'
            ? `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 50%)`
            : 'none',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={theme.palette.mode === 'light' ? 24 : 8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            background: theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : alpha(theme.palette.background.paper, 0.95),
            border: theme.palette.mode === 'dark'
              ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              : 'none',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  mb: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
                    : '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}
              >
                <BugReport sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
                Bug Tracker
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our team and start tracking bugs efficiently
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Full Name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  mb: 3,
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    background: theme.palette.mode === 'light'
                      ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                      : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    transform: 'translateY(-1px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                      : '0 8px 25px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ py: 1.5 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
