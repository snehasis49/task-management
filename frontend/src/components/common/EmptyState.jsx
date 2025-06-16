import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Assignment } from '@mui/icons-material';

/**
 * Reusable Empty State Component
 * Used for no data, no search results, etc.
 */
const EmptyState = ({
  icon: Icon = Assignment,
  title,
  description,
  action,
  sx = {}
}) => {
  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: 8,
        ...sx 
      }}
    >
      <Icon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
      
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'contained'}
          startIcon={action.icon}
          onClick={action.onClick}
          size={action.size || 'large'}
          sx={action.sx}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
