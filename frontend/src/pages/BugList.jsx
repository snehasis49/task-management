import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Avatar,
  Skeleton,
  useTheme,
  alpha,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  ExpandMore,
  BugReport,
  Schedule,
  Person,
  LocalOffer,
  MoreVert,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../utils/api';

const BugList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [bugs, setBugs] = useState([]);
  const [filteredBugs, setFilteredBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'

  useEffect(() => {
    fetchBugs();
  }, []);

  useEffect(() => {
    filterBugs();
  }, [bugs, searchTerm, selectedTab, selectedSeverity, selectedTags]);

  const fetchBugs = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setBugs(response.data);

      // Extract all unique tags
      const tags = new Set();
      response.data.forEach(bug => {
        if (bug.tags) {
          bug.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      setLoading(false);
    }
  };

  const filterBugs = () => {
    let filtered = [...bugs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bug =>
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status (tab)
    const statusFilters = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
    if (selectedTab > 0) {
      const status = statusFilters[selectedTab];
      filtered = filtered.filter(bug => bug.status === status);
    }

    // Filter by severity
    if (selectedSeverity) {
      filtered = filtered.filter(bug => bug.severity === selectedSeverity);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bug =>
        bug.tags && selectedTags.some(tag => bug.tags.includes(tag))
      );
    }

    setFilteredBugs(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeleteBug = async (bugId) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await tasksAPI.deleteTask(bugId);
        fetchBugs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting bug:', error);
      }
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

  const groupBugsBySeverity = () => {
    const groups = {
      Critical: [],
      High: [],
      Medium: [],
      Low: []
    };
    
    filteredBugs.forEach(bug => {
      if (groups[bug.severity]) {
        groups[bug.severity].push(bug);
      }
    });
    
    return groups;
  };

  const renderBugCard = (bug) => (
    <Fade in={true} key={bug.id || bug._id}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.12)}`,
            transform: 'translateY(-2px)',
          },
        }}
        onClick={() => navigate(`/bugs/${bug.id || bug._id}`)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar
              sx={{
                bgcolor: `${getSeverityColor(bug.severity)}.main`,
                width: 48,
                height: 48,
              }}
            >
              <BugReport />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {bug.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={bug.severity}
                  color={getSeverityColor(bug.severity)}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
                <Chip
                  label={bug.status}
                  color={getStatusColor(bug.status)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/bugs/${bug.id || bug._id}`);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Bug">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/bugs/${bug.id || bug._id}`); // Will handle edit in detail page
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Bug">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBug(bug.id || bug._id);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {bug.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {bug.tags && bug.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedTags.includes(tag)) {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              />
            ))}
            {bug.tags && bug.tags.length > 3 && (
              <Chip
                label={`+${bug.tags.length - 3}`}
                variant="outlined"
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(bug.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            {bug.assigned_to && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Assigned
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Fade>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: 200, bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Skeleton variant="text" sx={{ width: 300, bgcolor: 'rgba(255,255,255,0.2)' }} />
          </Box>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
                        <Skeleton variant="text" sx={{ width: '60%' }} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  const bugGroups = groupBugsBySeverity();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
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
              mb: 2,
            }}
          >
            Bug Reports
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 300,
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
            }}
          >
            Track and manage all reported issues efficiently
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/bugs/new')}
            size="large"
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
        </Box>

        {/* Stats Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  p: 3,
                }}
              >
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
                  {bugs.length}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Total Bugs
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h3" fontWeight="700" color="error.main" sx={{ mb: 1 }}>
                  {bugs.filter(b => b.status === 'Open').length}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Open
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h3" fontWeight="700" color="warning.main" sx={{ mb: 1 }}>
                  {bugs.filter(b => b.status === 'In Progress').length}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  In Progress
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h3" fontWeight="700" color="success.main" sx={{ mb: 1 }}>
                  {bugs.filter(b => b.status === 'Resolved').length}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="600">
                  Resolved
                </Typography>
              </Card>
            </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search bugs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {selectedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  }}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              ))}
              {selectedTags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Click on tags to filter
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minWidth: 120,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 1.5,
            },
          }}
        >
          <Tab label={`All (${bugs.length})`} />
          <Tab label={`Open (${bugs.filter(b => b.status === 'Open').length})`} />
          <Tab label={`In Progress (${bugs.filter(b => b.status === 'In Progress').length})`} />
          <Tab label={`Resolved (${bugs.filter(b => b.status === 'Resolved').length})`} />
          <Tab label={`Closed (${bugs.filter(b => b.status === 'Closed').length})`} />
        </Tabs>
      </Box>

      {/* Bug List */}
      {filteredBugs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BugReport sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No bugs found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {searchTerm || selectedTags.length > 0
              ? 'Try adjusting your search criteria or filters'
              : 'No bugs have been reported yet. Create your first bug report!'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/bugs/new')}
            size="large"
          >
            Report First Bug
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredBugs.map((bug) => (
            <Grid item xs={12} md={6} lg={4} key={bug.id || bug._id}>
              {renderBugCard(bug)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Alternative: Grouped by Severity View */}
      {false && Object.entries(bugGroups).map(([severity, severityBugs]) => (
        severityBugs.length > 0 && (
          <Accordion
            key={severity}
            defaultExpanded
            sx={{
              mb: 2,
              borderRadius: 3,
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                borderRadius: 3,
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={severity}
                  color={getSeverityColor(severity)}
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="h6" fontWeight="600">
                  {severity} Priority ({severityBugs.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {severityBugs.map((bug) => (
                  <Grid item xs={12} md={6} lg={4} key={bug.id || bug._id}>
                    {renderBugCard(bug)}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )
      ))}
      </Container>
    </Box>
  );
};

export default BugList;
