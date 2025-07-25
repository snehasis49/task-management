import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Card,
} from '@mui/material';
import { Grid } from '@mui/system';
import {
  Add,
  Edit,
  Delete,
  Assignment,
  Schedule,
  Person,
  Visibility,
  ViewModule,
  TableRows,
  Search,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { tasksAPI } from '../utils/api';
import TaskTable from '../components/TaskTable';
import SearchBar from '../components/SearchBar';
import FilterSection from '../components/FilterSection';
import {
  PageHeader,
  SearchAndFilterSection,
  TaskDisplaySection,
  PageLoadingSkeleton,
  useTaskFiltering
} from '../components/common';

const TaskList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // 'cards' or 'table'
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchInfo, setSearchInfo] = useState(null);
  const [allTags, setAllTags] = useState([]);

  // Use the custom filtering hook
  const {
    filteredTasks,
    showFilters: showAdvancedFilters,
    handleFiltersChange,
    activeFilters,
    setActiveFilters
  } = useTaskFiltering(tasks);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [location.pathname]);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);

      // Extract all unique tags
      const tags = new Set();
      response.data.forEach(task => {
        if (task.tags) {
          task.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeleteTask = async (taskId) => {
      try {
        await tasksAPI.deleteTask(taskId);
        fetchTasks(); // Refresh the list
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleSearchChange = (searchData) => {
    setSearchInfo(searchData);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
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

  const groupTasksByPriority = () => {
    const groups = {
      High: [],
      Medium: [],
      Low: []
    };

    filteredTasks.forEach(task => {
      if (groups[task.severity]) {
        groups[task.severity].push(task);
      }
    });

    return groups;
  };

  const renderTaskCard = (task) => (
    <Fade in={true} key={task.id || task._id}>
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
        onClick={() => navigate(`/bugs/${task.id || task._id}`)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar
              sx={{
                bgcolor: `${getPriorityColor(task.severity)}.main`,
                width: 48,
                height: 48,
              }}
            >
              <Assignment />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={task.severity}
                  color={getPriorityColor(task.severity)}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
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
                  navigate(`/bugs/${task.id || task._id}`);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Task">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/bugs/${task.id || task._id}`); // Will handle edit in detail page
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id || task._id);
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
          {task.description ? task.description.replace(/<[^>]*>/g, '') : 'No description'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {task.tags && task.tags.slice(0, 3).map((tag, index) => (
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
                  // Add tag to filters
                  const currentTags = activeFilters.tags || [];
                  if (!currentTags.includes(tag)) {
                    setActiveFilters(prev => ({
                      ...prev,
                      tags: [...currentTags, tag]
                    }));
                  }
                }}
              />
            ))}
            {task.tags && task.tags.length > 3 && (
              <Chip
                label={`+${task.tags.length - 3}`}
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
                {new Date(task.createdAt || task.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            {task.assignedTo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.assignedTo}
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
      <PageLoadingSkeleton
        showHeader={true}
        showSearch={true}
        showStats={true}
        showCards={true}
        cardCount={6}
      />
    );
  }

  const taskGroups = groupTasksByPriority();

  return (
    <Box sx={{ p: 4, minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <PageHeader
        title="Task Management 2025"
        subtitle="Professional Project Management System"
        description="Complete task schedule from planning to completion"
        actions={[
          {
            label: "Create New Task",
            icon: <Add />,
            onClick: () => navigate('/bugs/new'),
            variant: "contained"
          }
        ]}
      />

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" fontWeight="700" color="primary.main" sx={{ mb: 1 }}>
              {tasks.length}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              Total Tasks
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" fontWeight="700" color="error.main" sx={{ mb: 1 }}>
              {tasks.filter(t => t.status === 'Open').length}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              Open
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" fontWeight="700" color="warning.main" sx={{ mb: 1 }}>
              {tasks.filter(t => t.status === 'In Progress').length}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              In Progress
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" fontWeight="700" color="success.main" sx={{ mb: 1 }}>
              {tasks.filter(t => t.status === 'Resolved').length}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              Completed
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* AI-Powered Search and View Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" color="primary.main" sx={{ mb: 2 }}>
            🔍 AI-Powered Task Search
          </Typography>
          <SearchBar
            onSearchResults={handleSearchResults}
            onSearchChange={handleSearchChange}
            placeholder="Search tasks with intelligent semantic understanding..."
            showSuggestions={true}
            searchType="intelligent"
          />
          {searchInfo && searchInfo.totalResults > 0 && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Found {searchInfo.totalResults} results
              </Typography>
              {searchInfo.enhancedQuery !== searchInfo.query && (
                <Typography variant="body2" color="primary.main">
                  • Enhanced with AI
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Grid container spacing={3} alignItems="center">
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Traditional keyword search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }
              }}
              size="small"
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {activeFilters.tags && activeFilters.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      const newTags = activeFilters.tags.filter(t => t !== tag);
                      setActiveFilters(prev => ({
                        ...prev,
                        tags: newTags
                      }));
                    }}
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Table View">
                  <IconButton
                    onClick={() => setViewMode('table')}
                    color={viewMode === 'table' ? 'primary' : 'default'}
                  >
                    <TableRows />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Card View">
                  <IconButton
                    onClick={() => setViewMode('cards')}
                    color={viewMode === 'cards' ? 'primary' : 'default'}
                  >
                    <ViewModule />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Advanced Filter Section */}
      <FilterSection
        tasks={tasks}
        onFiltersChange={handleFiltersChange}
        showQuickFilters={true}
        compact={false}
      />

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
          <Tab label={`All (${tasks.length})`} />
          <Tab label={`Open (${tasks.filter(t => t.status === 'Open').length})`} />
          <Tab label={`In Progress (${tasks.filter(t => t.status === 'In Progress').length})`} />
          <Tab label={`Resolved (${tasks.filter(t => t.status === 'Resolved').length})`} />
          <Tab label={`Closed (${tasks.filter(t => t.status === 'Closed').length})`} />
        </Tabs>
      </Box>

      {/* Task List */}
      {showSearchResults ? (
        // Show AI search results
        searchResults.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No search results found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Try different keywords or use the traditional search below
            </Typography>
          </Box>
        ) : viewMode === 'table' ? (
          <TaskTable
            tasks={searchResults.map(result => result.task)}
            onTaskUpdate={fetchTasks}
            onTaskDelete={handleDeleteTask}
          />
        ) : (
          <Grid container spacing={3}>
            {searchResults.map((result) => (
              <Grid xs={12} md={6} lg={4} key={result.task.id || result.task._id}>
                <Box sx={{ position: 'relative' }}>
                  {renderTaskCard(result.task)}
                  <Chip
                    label={`${Math.round(result.similarity_score * 100)}% match`}
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        // Show filtered tasks (traditional search)
        filteredTasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {searchTerm || (activeFilters.tags && activeFilters.tags.length > 0) || showAdvancedFilters
                ? 'Try adjusting your search criteria or filters'
                : 'No tasks have been created yet. Create your first task!'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/bugs/new')}
              size="large"
            >
              Create First Task
            </Button>
          </Box>
        ) : viewMode === 'table' ? (
          <TaskTable
            tasks={filteredTasks}
            onTaskUpdate={fetchTasks}
            onTaskDelete={handleDeleteTask}
          />
        ) : (
          <Grid container spacing={3}>
            {filteredTasks.map((task) => (
              <Grid xs={12} md={6} lg={4} key={task.id || task._id}>
                {renderTaskCard(task)}
              </Grid>
            ))}
          </Grid>
        )
      )}

    </Box>
  );
};

export default TaskList;
