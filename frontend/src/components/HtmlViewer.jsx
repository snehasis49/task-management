import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DOMPurify from 'dompurify';

const HtmlViewer = ({
  content,
  maxHeight,
  showLabel = false,
  label = "Description",
  sx = {}
}) => {
  const theme = useTheme();

  const sanitizedContent = DOMPurify.sanitize(content || '');

  if (!content || content.trim() === '') {
    return (
      <Box>
        {showLabel && (
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          No description provided
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {showLabel && (
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          maxHeight,
          overflow: maxHeight ? 'auto' : 'visible',
          fontFamily: 'Poppins, Arial, sans-serif',
          fontSize: '14px',
          lineHeight: 1.6,
          color: theme.palette.text.primary,
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            color: theme.palette.text.primary,
            fontWeight: 600,
            margin: '16px 0 8px 0',
          },
          '& p': {
            color: theme.palette.text.primary,
            margin: '0 0 8px 0',
            lineHeight: 1.6,
          },
          '& ul, & ol': {
            color: theme.palette.text.primary,
            margin: '8px 0',
            paddingLeft: '24px',
          },
          '& li': {
            margin: '4px 0',
          },
          '& blockquote': {
            margin: '16px 0',
            padding: '8px 16px',
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.action.hover,
            fontStyle: 'italic',
          },
          '& code': {
            backgroundColor: theme.palette.action.hover,
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875em',
          },
          '& pre': {
            backgroundColor: theme.palette.action.hover,
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            margin: '8px 0',
          },
          '& a': {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
          },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            margin: '8px 0',
          },
          '& th, & td': {
            border: `1px solid ${theme.palette.divider}`,
            padding: '8px',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: theme.palette.action.hover,
            fontWeight: 600,
          },
          ...sx,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </Box>
  );
};

export default HtmlViewer;
