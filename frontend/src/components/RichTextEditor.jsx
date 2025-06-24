import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
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
  showAIGenerate = false,
  markdownView = false // new prop to control markdown view
}) => {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIAlert, setShowAIAlert] = useState(false);
  const [aiAlertType, setAiAlertType] = useState('success');
  const [aiAlertMessage, setAiAlertMessage] = useState('');

  const handleChange = (val) => {
    onChange(val);
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

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        {label && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: error ? 'error.main' : 'text.primary' }}
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
              sx={{ minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.75rem', borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'primary.main', color: 'white' }, '&.Mui-disabled': { borderColor: 'action.disabled', color: 'action.disabled' } }}
            >
              {isGenerating ? 'Generating...' : value ? 'Regenerate' : 'Generate with AI'}
            </Button>
          </Tooltip>
        )}
      </Box>
      <Collapse in={showAIAlert}>
        <Alert severity={aiAlertType} sx={{ mb: 1 }} onClose={() => setShowAIAlert(false)}>
          {aiAlertMessage}
        </Alert>
      </Collapse>
      {/* Only show the markdown editor or markdown viewer, not both */}
      {!markdownView ? (
        <MDEditor
          value={value || ''}
          onChange={isGenerating ? () => {} : handleChange}
          height={height}
          previewOptions={{
            // Show both edit and preview tabs
            showPreview: true,
            showEdit: true,
          }}
          textareaProps={{
            placeholder: isGenerating ? "Generating description..." : placeholder,
            disabled: disabled || isGenerating,
            style: { minHeight: height - 60 }
          }}
        />
      ) : (
        <Box sx={{ border: error ? `1px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`, borderRadius: 1, bgcolor: 'background.paper', p: 2, minHeight: height }}>
          <ReactMarkdown>{value || ''}</ReactMarkdown>
        </Box>
      )}
      {(error || helperText) && (
        <Typography
          variant="caption"
          sx={{ mt: 0.5, color: error ? 'error.main' : 'text.secondary', display: 'block' }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;
