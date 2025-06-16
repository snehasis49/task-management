import React, { useState } from 'react';
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  BtnClearFormatting,
  BtnStyles
} from 'react-simple-wysiwyg';
import {
  Box,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import { AutoAwesome, Refresh } from '@mui/icons-material';
import { tasksAPI } from '../utils/api';
import { toast } from 'react-toastify';

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter description...",
  label,
  error,
  helperText,
  height = 300,
  disabled = false,
  taskTitle = "",
  showAIGenerate = false
}) => {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIAlert, setShowAIAlert] = useState(false);
  const [aiAlertType, setAiAlertType] = useState('success');
  const [aiAlertMessage, setAiAlertMessage] = useState('');

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleGenerateDescription = async () => {
    if (!taskTitle.trim()) {
      toast.error('Please enter a task title first');
      return;
    }

    setIsGenerating(true);
    setShowAIAlert(false);

    try {
      const response = await tasksAPI.generateDescription(taskTitle);
      const { description, generated_by_ai } = response.data;

      onChange(description);

      // Show success alert
      setAiAlertType('success');
      setAiAlertMessage(
        generated_by_ai
          ? '✨ AI-generated description created successfully! You can edit it as needed.'
          : '📝 Description template generated. AI service is currently unavailable.'
      );
      setShowAIAlert(true);

      // Auto-hide alert after 5 seconds
      setTimeout(() => setShowAIAlert(false), 5000);

    } catch (error) {
      console.error('Error generating description:', error);
      setAiAlertType('error');
      setAiAlertMessage('Failed to generate description. Please try again.');
      setShowAIAlert(true);
      setTimeout(() => setShowAIAlert(false), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateDescription = async () => {
    // Clear existing content and generate new description
    onChange('');
    await handleGenerateDescription();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        {label && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: error ? 'error.main' : 'text.primary'
            }}
          >
            {label}
          </Typography>
        )}

        {showAIGenerate && (
          <Tooltip title={value ? "Regenerate description with AI" : "Generate description with AI"}>
            <Button
              variant="outlined"
              size="small"
              startIcon={
                isGenerating ? (
                  <CircularProgress size={16} />
                ) : value ? (
                  <Refresh />
                ) : (
                  <AutoAwesome />
                )
              }
              onClick={handleGenerateDescription}
              disabled={isGenerating || disabled}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                '&.Mui-disabled': {
                  borderColor: 'action.disabled',
                  color: 'action.disabled',
                }
              }}
            >
              {isGenerating ? 'Generating...' : value ? 'Regenerate' : 'Generate with AI'}
            </Button>
          </Tooltip>
        )}
      </Box>

      <Collapse in={showAIAlert}>
        <Alert
          severity={aiAlertType}
          sx={{ mb: 1 }}
          onClose={() => setShowAIAlert(false)}
        >
          {aiAlertMessage}
        </Alert>
      </Collapse>

      <Box
        sx={{
          border: error ? `1px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          opacity: isGenerating ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
          '& .rsw-toolbar-container': {
            display: 'block !important',
            visibility: 'visible !important',
          },
          '& .rsw-separator': {
            width: '1px',
            height: '24px',
            backgroundColor: theme.palette.divider,
            margin: '0 4px',
          },
          '& .rsw-editor': {
            height: 'auto !important',
            minHeight: height,
            maxHeight: height * 1.5,
            fontFamily: 'Poppins, Arial, sans-serif',
            fontSize: '14px',
            overflow: 'visible',
            '&:focus-within': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: -2,
            }
          },
          '& .rsw-toolbar': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            display: 'flex !important',
            visibility: 'visible !important',
            opacity: '1 !important',
            position: 'relative',
            top: 0,
            zIndex: 10,
            padding: '8px 12px',
            minHeight: '48px',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '4px',
            '& .rsw-btn': {
              margin: '0 2px',
              padding: '6px 10px',
              borderRadius: '4px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: theme.palette.text.primary,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
              '&.active': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
              }
            },
            '& .rsw-dd': {
              margin: '0 2px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              fontSize: '14px',
              cursor: 'pointer',
              '&:focus': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: -2,
              }
            }
          },
          '& .rsw-ce': {
            padding: '12px',
            lineHeight: 1.6,
            minHeight: height - 60, // Account for toolbar height
            maxHeight: height * 1.5 - 60,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&:focus': {
              outline: 'none',
            },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.grey[100],
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[400],
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: theme.palette.grey[600],
              }
            }
          }
        }}
      >
        <EditorProvider>
          <Editor
            value={value || ''}
            onChange={isGenerating ? () => {} : handleChange}
            placeholder={isGenerating ? "Generating description..." : placeholder}
            containerProps={{
              style: {
                height: height,
                resize: 'vertical',
                pointerEvents: isGenerating ? 'none' : 'auto',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column',
              }
            }}
          >
            <Toolbar>
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <BtnStrikeThrough />
              <BtnNumberedList />
              <BtnBulletList />
              <BtnLink />
              <BtnClearFormatting />
              <BtnStyles />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </Box>

      {(error || helperText) && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            color: error ? 'error.main' : 'text.secondary',
            display: 'block'
          }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;
