import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BugReport,
  Add,
  TrendingUp,
  CheckCircle,
  Warning,
  ErrorOutline,
  Assignment,
  Speed,
  Timeline,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    closed: 0,
  });
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/bugs');
      const bugs = response.data;

      // Calculate stats
      const newStats = {
        total: bugs.length,
        open: bugs.filter(bug => bug.status === 'Open').length,
        inProgress: bugs.filter(bug => bug.status === 'In Progress').length,
        resolved: bugs.filter(bug => bug.status === 'Resolved').length,
        closed: bugs.filter(bug => bug.status === 'Closed').length,
        critical: bugs.filter(bug => bug.severity === 'Critical').length,
      };

      setStats(newStats);
      setRecentBugs(bugs.slice(0, 6)); // Get 6 most recent bugs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'error';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };



  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid item xs={12} sm={6} md={2.4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={56} height={56} />
                  <Skeleton variant="text" sx={{ fontSize: '2rem', mt: 2 }} />
                  <Skeleton variant="text" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  const completionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  // Group bugs by status for kanban
  const kanbanColumns = [
    {
      title: 'Open',
      status: 'Open',
      color: 'error',
      bugs: recentBugs.filter(bug => bug.status === 'Open'),
      icon: <ErrorOutline />
    },
    {
      title: 'In Progress',
      status: 'In Progress',
      color: 'warning',
      bugs: recentBugs.filter(bug => bug.status === 'In Progress'),
      icon: <Timeline />
    },
    {
      title: 'Resolved',
      status: 'Resolved',
      color: 'success',
      bugs: recentBugs.filter(bug => bug.status === 'Resolved'),
      icon: <CheckCircle />
    },
    {
      title: 'Closed',
      status: 'Closed',
      color: 'default',
      bugs: recentBugs.filter(bug => bug.status === 'Closed'),
      icon: <Assignment />
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            color="white"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Bug Tracker Dashboard
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 300,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Monitor, track, and resolve issues efficiently
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} lg={2.4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Assignment sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  {stats.total}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Total Bugs
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
                  }}
                >
                  <ErrorOutline sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  color="error.main"
                  sx={{ mb: 1 }}
                >
                  {stats.open}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Open Issues
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(255, 167, 38, 0.3)',
                  }}
                >
                  <Timeline sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  color="warning.main"
                  sx={{ mb: 1 }}
                >
                  {stats.inProgress}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(102, 187, 106, 0.3)',
                  }}
                >
                  <CheckCircle sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  color="success.main"
                  sx={{ mb: 1 }}
                >
                  {stats.resolved}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Resolved
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef5350 0%, #f44336 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(239, 83, 80, 0.3)',
                  }}
                >
                  <Warning sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h3"
                  fontWeight="700"
                  color="error.main"
                  sx={{ mb: 1 }}
                >
                  {stats.critical}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Critical Issues
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Kanban Board */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="white"
            gutterBottom
            sx={{
              mb: 4,
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Project Status Board
          </Typography>

          <Grid container spacing={3}>
            {kanbanColumns.map((column) => (
              <Grid item xs={12} md={3} key={column.status}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    minHeight: '600px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    {/* Column Header */}
                    <Box
                      sx={{
                        p: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        background: `linear-gradient(135deg, ${
                          column.color === 'error' ? '#ff6b6b' :
                          column.color === 'warning' ? '#ffa726' :
                          column.color === 'success' ? '#66bb6a' :
                          '#667eea'
                        } 0%, ${
                          column.color === 'error' ? '#ee5a52' :
                          column.color === 'warning' ? '#ff9800' :
                          column.color === 'success' ? '#4caf50' :
                          '#764ba2'
                        } 100%)`,
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 2 }}>
                            {column.icon}
                          </Box>
                          <Typography variant="h6" fontWeight="bold">
                            {column.title}
                          </Typography>
                        </Box>
                        <Chip
                          label={column.bugs.length}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Bug Cards */}
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {column.bugs.map((bug) => (
                        <Card
                          key={bug._id}
                          elevation={0}
                          sx={{
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            },
                          }}
                          onClick={() => navigate(`/bugs/${bug._id}`)}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="600"
                              gutterBottom
                              sx={{
                                fontSize: '0.9rem',
                                lineHeight: 1.3,
                              }}
                            >
                              {bug.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 2,
                                fontSize: '0.8rem',
                                lineHeight: 1.4,
                              }}
                            >
                              {bug.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Chip
                                label={bug.severity}
                                size="small"
                                color={getSeverityColor(bug.severity)}
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                              {bug.assignedTo && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  {bug.assignedTo.name}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}

                      {column.bugs.length === 0 && (
                        <Box
                          sx={{
                            p: 4,
                            textAlign: 'center',
                            color: 'text.secondary',
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            bgcolor: 'grey.50',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            No {column.title.toLowerCase()} issues
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/bugs/new')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Report New Bug
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<BugReport />}
            onClick={() => navigate('/bugs')}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderWidth: 2,
              borderRadius: 3,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            View All Bugs
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
