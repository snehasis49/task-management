import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Reusable Page Header Component
 * Used across Dashboard, BugList, and other pages
 */
const PageHeader = ({
  title,
  subtitle,
  description,
  actions = [],
  centered = true,
  sx = {}
}) => {
  return (
    <Box
      sx={{
        mb: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        textAlign: centered ? 'center' : 'left',
        ...sx
      }}
    >
      <Typography
        variant="h2"
        fontWeight="800"
        color="text.primary"
        gutterBottom
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          mb: 2,
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: 600,
            mb: 4,
          }}
        >
          {subtitle}
        </Typography>
      )}
      
      {description && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
          }}
        >
          {description}
        </Typography>
      )}
      
      {actions.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: centered ? 'center' : 'flex-start' }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'contained'}
              size={action.size || 'large'}
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                ...action.sx
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
