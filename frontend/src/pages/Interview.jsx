import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Interview = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchInterviewContent = async () => {
      try {
        setLoading(true);
        // Fetch the markdown content directly from public folder
        const response = await fetch('/interview.md');
        if (!response.ok) {
          throw new Error('Failed to fetch interview content');
        }
        const content = await response.text();
        setMarkdownContent(content);
      } catch (err) {
        console.error('Error fetching interview content:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewContent();
  }, []);

  const markdownComponents = {
    // Custom styling for different markdown elements
    h1: ({ children }) => (
      <Typography
        variant="h3"
        component="h1"
        sx={{
          mb: 3,
          mt: 4,
          fontWeight: 700,
          color: theme.palette.primary.main,
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          pb: 1
        }}
      >
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: 2,
          mt: 3,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography
        variant="h5"
        component="h3"
        sx={{
          mb: 2,
          mt: 2,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography
        variant="h6"
        component="h4"
        sx={{
          mb: 1.5,
          mt: 2,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          lineHeight: 1.7,
          color: theme.palette.text.primary
        }}
      >
        {children}
      </Typography>
    ),
    code: ({ inline, children, ...props }) => {
      return !inline ? (
        <Box
          component="pre"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2.5,
            mb: 3,
            overflow: 'auto',
            maxWidth: '100%',
            '& code': {
              backgroundColor: 'transparent !important',
              padding: '0 !important',
              fontSize: '0.875rem',
              fontFamily: '"Fira Code", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineHeight: 1.5,
              color: theme.palette.text.primary
            },
            '&::-webkit-scrollbar': {
              height: 8,
              width: 8
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.text.primary, 0.1)
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.text.primary, 0.3),
              borderRadius: 4
            }
          }}
        >
          <code {...props}>
            {children}
          </code>
        </Box>
      ) : (
        <Box
          component="code"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            fontSize: '0.875rem',
            fontFamily: '"Fira Code", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontWeight: 500
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },
    blockquote: ({ children }) => (
      <Box
        sx={{
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          pl: 2,
          py: 1,
          mb: 2,
          fontStyle: 'italic'
        }}
      >
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <Box component="ul" sx={{ mb: 2, pl: 3 }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component="ol" sx={{ mb: 2, pl: 3 }}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Typography component="li" variant="body1" sx={{ mb: 0.5, lineHeight: 1.6 }}>
        {children}
      </Typography>
    ),
    table: ({ children }) => (
      <Box sx={{ overflow: 'auto', mb: 2 }}>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid ${theme.palette.divider}`,
            '& th, & td': {
              border: `1px solid ${theme.palette.divider}`,
              px: 2,
              py: 1,
              textAlign: 'left'
            },
            '& th': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              fontWeight: 600
            }
          }}
        >
          {children}
        </Box>
      </Box>
    ),
    hr: () => (
      <Divider sx={{ my: 3 }} />
    )
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading interview content: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Chip
            label="📚 Study Material"
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontSize: '0.875rem' }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1
            }}
          >
            Interview Preparation Guide
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Comprehensive interview questions and answers based on the Task Management System project
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Markdown Content */}
        <Box
          sx={{
            '& > *:first-of-type': {
              mt: 0
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& strong': {
              fontWeight: 600,
              color: theme.palette.text.primary
            },
            '& em': {
              fontStyle: 'italic',
              color: theme.palette.text.secondary
            }
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {markdownContent}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default Interview;
