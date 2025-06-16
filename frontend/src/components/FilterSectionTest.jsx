import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import FilterSection from './FilterSection';

// Test data
const testTasks = [
  {
    id: 1,
    title: 'Fix login authentication bug',
    description: 'Users cannot login with special characters in password',
    status: 'Open',
    severity: 'High',
    tags: ['bug', 'authentication'],
    assigned_to: 'john@example.com',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Add dark mode feature',
    description: 'Implement dark theme toggle for better user experience',
    status: 'In Progress',
    severity: 'Medium',
    tags: ['feature', 'ui'],
    assigned_to: 'jane@example.com',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    title: 'Database performance optimization',
    description: 'Optimize slow queries in user dashboard',
    status: 'Resolved',
    severity: 'Critical',
    tags: ['performance', 'database'],
    assigned_to: 'bob@example.com',
    createdAt: new Date('2024-01-05'),
  },
];

const FilterSectionTest = () => {
  const [filteredTasks, setFilteredTasks] = useState(testTasks);
  const [currentFilters, setCurrentFilters] = useState({});

  const applyFilters = (filters) => {
    let filtered = [...testTasks];

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    if (filters.severity && filters.severity.length > 0) {
      filtered = filtered.filter(task => filters.severity.includes(task.severity));
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags && filters.tags.some(tag => task.tags.includes(tag))
      );
    }

    return filtered;
  };

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    const filtered = applyFilters(filters);
    setFilteredTasks(filtered);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        FilterSection Search Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test the search functionality by typing keywords like "login", "dark", "performance", etc.
      </Typography>

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
          <Typography color="text.secondary">
            No tasks match the current filters
          </Typography>
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
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          Test Instructions:
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Search Tests:</strong>
          <ul>
            <li>Type "login" - should show the authentication bug task</li>
            <li>Type "dark" - should show the dark mode feature task</li>
            <li>Type "performance" - should show the database optimization task</li>
            <li>Type "user" - should show tasks with "user" in title or description</li>
          </ul>
          <strong>Filter Tests:</strong>
          <ul>
            <li>Select "High Priority" quick filter - should show high/critical tasks</li>
            <li>Use Status filter to show only "Open" tasks</li>
            <li>Use Tags filter to show only "bug" tagged tasks</li>
            <li>Combine search with filters for advanced filtering</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default FilterSectionTest;
