import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import FilterSection from './FilterSection';

// Simple test data
const testTasks = [
  {
    id: 1,
    title: 'Fix login bug',
    description: 'Users cannot login',
    status: 'Open',
    severity: 'High',
    tags: ['bug', 'authentication'],
    assigned_to: 'john@example.com',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Add dark mode',
    description: 'Implement dark theme',
    status: 'In Progress',
    severity: 'Medium',
    tags: ['feature', 'ui'],
    assigned_to: 'jane@example.com',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    title: 'Database optimization',
    description: 'Optimize slow queries',
    status: 'Resolved',
    severity: 'Critical',
    tags: ['performance', 'database'],
    assigned_to: 'bob@example.com',
    createdAt: new Date('2024-01-05'),
  },
];

const FilterDebugTest = () => {
  const [filteredTasks, setFilteredTasks] = useState(testTasks);
  const [currentFilters, setCurrentFilters] = useState({});
  const [debugInfo, setDebugInfo] = useState([]);

  const addDebugInfo = (message) => {
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const applyFilters = (filters) => {
    addDebugInfo(`Applying filters: ${JSON.stringify(filters)}`);
    let filtered = [...testTasks];

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
      addDebugInfo(`After search filter: ${filtered.length} tasks`);
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
      addDebugInfo(`After status filter: ${filtered.length} tasks`);
    }

    // Apply severity filter
    if (filters.severity && filters.severity.length > 0) {
      filtered = filtered.filter(task => filters.severity.includes(task.severity));
      addDebugInfo(`After severity filter: ${filtered.length} tasks`);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags && filters.tags.some(tag => task.tags.includes(tag))
      );
      addDebugInfo(`After tags filter: ${filtered.length} tasks`);
    }

    return filtered;
  };

  const handleFiltersChange = (filters) => {
    console.log('FilterDebugTest - Received filters:', filters);
    addDebugInfo(`Received filters from FilterSection`);
    setCurrentFilters(filters);
    const filtered = applyFilters(filters);
    setFilteredTasks(filtered);
  };

  useEffect(() => {
    addDebugInfo('Component mounted');
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Filter Debug Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This is a debug test for the FilterSection component. 
        Try selecting different status options (Open, In Progress, Resolved) to see if filtering works.
      </Alert>

      {/* Debug Info */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
        <Typography variant="h6" gutterBottom>
          Debug Log:
        </Typography>
        {debugInfo.map((info, index) => (
          <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {info}
          </Typography>
        ))}
      </Paper>

      {/* Filter Section */}
      <FilterSection
        tasks={testTasks}
        onFiltersChange={handleFiltersChange}
        showQuickFilters={true}
        compact={false}
      />

      {/* Current Filters Display */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Filters:
        </Typography>
        <pre style={{ fontSize: '0.875rem', color: '#666', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(currentFilters, null, 2)}
        </pre>
      </Paper>

      {/* Results */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtered Results ({filteredTasks.length} of {testTasks.length} tasks):
        </Typography>
        
        {filteredTasks.length === 0 ? (
          <Alert severity="warning">
            No tasks match the current filters. This might indicate a filtering issue.
          </Alert>
        ) : (
          <List>
            {filteredTasks.map((task) => (
              <ListItem key={task.id} divider>
                <ListItemText
                  primary={task.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={task.status} size="small" color="primary" />
                        <Chip label={task.severity} size="small" color="secondary" />
                        {task.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Test Instructions */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          Test Steps:
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Expand the Filters section above</li>
            <li>Click on the "Status" dropdown</li>
            <li>Select "Open" - should show only the "Fix login bug" task</li>
            <li>Select "In Progress" - should show only the "Add dark mode" task</li>
            <li>Select "Resolved" - should show only the "Database optimization" task</li>
            <li>Watch the debug log and current filters to see what's happening</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default FilterDebugTest;
