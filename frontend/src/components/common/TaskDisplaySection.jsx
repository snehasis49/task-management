import React from 'react';
import { Box, Typography } from '@mui/material';
import { Grid } from '@mui/system';
import KanbanBoard from '../KanbanBoard';
import TaskTable from '../TaskTable';
import EmptyState from './EmptyState';
import { Add, Assignment } from '@mui/icons-material';

/**
 * Reusable Task Display Section Component
 * Handles different view modes and empty states
 */
const TaskDisplaySection = ({
  // Data
  tasks = [],
  searchResults = [],
  showSearchResults = false,
  
  // Display options
  viewMode = 'kanban', // 'kanban', 'table', 'cards'
  title,
  showTitle = true,
  
  // Callbacks
  onTaskUpdate,
  onTaskDelete,
  onCreateTask,
  
  // Loading
  loading = false,
  
  // Empty state customization
  emptyStateConfig = {
    title: "No tasks found",
    description: "Create your first task to get started",
    action: {
      label: "Create First Task",
      icon: <Add />,
      variant: "contained"
    }
  },
  
  // Search empty state
  searchEmptyStateConfig = {
    title: "No search results found",
    description: "Try different keywords or check the task board below"
  },
  
  // Custom render functions
  renderTaskCard,
  
  // Styling
  sx = {}
}) => {
  // Determine which tasks to display
  const displayTasks = showSearchResults 
    ? (searchResults.map ? searchResults.map(result => result.task) : searchResults)
    : tasks;

  // Handle empty states
  if (!loading && displayTasks.length === 0) {
    const emptyConfig = showSearchResults ? searchEmptyStateConfig : emptyStateConfig;
    return (
      <Box sx={{ mb: 6, ...sx }}>
        {showTitle && title && (
          <Typography
            variant="h4"
            fontWeight="600"
            color="text.primary"
            gutterBottom
            sx={{ mb: 4, textAlign: "center" }}
          >
            {title}
          </Typography>
        )}
        
        <EmptyState
          icon={Assignment}
          title={emptyConfig.title}
          description={emptyConfig.description}
          action={emptyConfig.action ? {
            ...emptyConfig.action,
            onClick: onCreateTask || emptyConfig.action.onClick
          } : undefined}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6, ...sx }}>
      {showTitle && title && (
        <Typography
          variant="h4"
          fontWeight="600"
          color="text.primary"
          gutterBottom
          sx={{ mb: 4, textAlign: "center" }}
        >
          {title}
        </Typography>
      )}

      {/* Render based on view mode */}
      {viewMode === 'kanban' && (
        <KanbanBoard
          tasks={displayTasks}
          onTaskUpdate={onTaskUpdate}
          loading={loading}
        />
      )}

      {viewMode === 'table' && (
        <TaskTable
          tasks={displayTasks}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      )}

      {viewMode === 'cards' && (
        <Grid container spacing={3}>
          {displayTasks.map((task) => (
            <Grid xs={12} md={6} lg={4} key={task.id || task._id}>
              {renderTaskCard ? renderTaskCard(task) : (
                <div>Card view not implemented - provide renderTaskCard prop</div>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TaskDisplaySection;
