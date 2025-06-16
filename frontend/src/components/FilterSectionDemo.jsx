import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import FilterSection from './FilterSection';

// Sample task data for demonstration
const sampleTasks = [
  {
    id: 1,
    title: 'Fix login bug',
    description: 'Users cannot login with special characters',
    status: 'Open',
    severity: 'High',
    tags: ['bug', 'authentication', 'urgent'],
    assigned_to: 'john@example.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 2,
    title: 'Add dark mode',
    description: 'Implement dark mode theme toggle',
    status: 'In Progress',
    severity: 'Medium',
    tags: ['feature', 'ui', 'enhancement'],
    assigned_to: 'jane@example.com',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 3,
    title: 'Database optimization',
    description: 'Optimize slow queries in user dashboard',
    status: 'Resolved',
    severity: 'Critical',
    tags: ['performance', 'database', 'optimization'],
    assigned_to: 'bob@example.com',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 4,
    title: 'Update documentation',
    description: 'Update API documentation for v2.0',
    status: 'Open',
    severity: 'Low',
    tags: ['documentation', 'api'],
    assigned_to: null,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 5,
    title: 'Mobile responsive design',
    description: 'Make dashboard mobile-friendly',
    status: 'In Progress',
    severity: 'High',
    tags: ['mobile', 'responsive', 'ui'],
    assigned_to: 'alice@example.com',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-19'),
  },
];

const FilterSectionDemo = () => {
  const [filteredTasks, setFilteredTasks] = useState(sampleTasks);
  const [activeFilters, setActiveFilters] = useState({});

  const applyFilters = (filters) => {
    let filtered = [...sampleTasks];

    // Apply search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Apply severity filter
    if (filters.severity && filters.severity.length > 0) {
      filtered = filtered.filter(task => filters.severity.includes(task.severity));
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags && filters.tags.some(tag => task.tags.includes(tag))
      );
    }

    // Apply assignee filter
    if (filters.assignedTo && filters.assignedTo.length > 0) {
      filtered = filtered.filter(task => {
        const assignee = task.assigned_to;
        if (filters.assignedTo.includes('unassigned')) {
          return !assignee || filters.assignedTo.includes(assignee);
        }
        return assignee && filters.assignedTo.includes(assignee);
      });
    }

    // Apply date filters
    if (filters.createdDateFrom || filters.createdDateTo) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.createdAt);
        if (filters.createdDateFrom && taskDate < filters.createdDateFrom) return false;
        if (filters.createdDateTo && taskDate > filters.createdDateTo) return false;
        return true;
      });
    }

    return filtered;
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    const filtered = applyFilters(filters);
    setFilteredTasks(filtered);
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 4 }}>
        FilterSection Component Demo
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This demo showcases the FilterSection component with sample task data. 
        Try using the filters to see how they affect the task list below.
      </Typography>

      {/* Filter Section */}
      <FilterSection
        tasks={sampleTasks}
        onFiltersChange={handleFiltersChange}
        showQuickFilters={true}
        compact={false}
      />

      {/* Results Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter Results: {filteredTasks.length} of {sampleTasks.length} tasks
        </Typography>
        {Object.keys(activeFilters).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <pre style={{ fontSize: '0.875rem', color: '#666' }}>
              {JSON.stringify(activeFilters, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>

      {/* Filtered Tasks Display */}
      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid xs={12} md={6} lg={4} key={task.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {task.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                  <Chip
                    label={task.severity}
                    color={getSeverityColor(task.severity)}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                  {task.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 1 }} />
                
                <Typography variant="caption" color="text.secondary">
                  Assigned: {task.assigned_to || 'Unassigned'}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Created: {task.createdAt.toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTasks.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No tasks match the current filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filter criteria
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default FilterSectionDemo;
