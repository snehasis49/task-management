import React, { useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Collapse,
  InputAdornment,
  IconButton
} from '@mui/material';
import { AutoAwesome, Refresh, Add, Clear } from '@mui/icons-material';
import { tasksAPI } from '../utils/api';
import { toast } from 'react-toastify';

const TagInput = ({
  tags = [],
  onChange,
  label = "Tags",
  placeholder = "Type a tag and press Enter",
  disabled = false,
  taskTitle = "",
  taskDescription = "",
  showAIGenerate = false,
  maxTags = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIAlert, setShowAIAlert] = useState(false);
  const [aiAlertType, setAiAlertType] = useState('success');
  const [aiAlertMessage, setAiAlertMessage] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tagText) => {
    if (!tagText || tags.includes(tagText) || tags.length >= maxTags) {
      if (tags.length >= maxTags) {
        toast.warning(`Maximum ${maxTags} tags allowed`);
      } else if (tags.includes(tagText)) {
        toast.warning('Tag already exists');
      }
      return;
    }

    const newTags = [...tags, tagText];
    onChange(newTags);
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  const clearAllTags = () => {
    onChange([]);
  };

  const handleGenerateTags = async () => {
    if (!taskTitle.trim()) {
      toast.error('Please enter a task title first');
      return;
    }

    setIsGenerating(true);
    setShowAIAlert(false);

    try {
      const response = await tasksAPI.generateTags(taskTitle, taskDescription);
      const { tags: generatedTags, generated_by_ai } = response.data;

      // Merge with existing tags, avoiding duplicates
      const uniqueTags = [...new Set([...tags, ...generatedTags])];
      const limitedTags = uniqueTags.slice(0, maxTags);
      
      onChange(limitedTags);

      // Show success alert
      setAiAlertType('success');
      setAiAlertMessage(
        generated_by_ai
          ? `✨ AI-generated ${generatedTags.length} tags successfully! You can add more or remove any as needed.`
          : '📝 Tags generated using fallback method. AI service is currently unavailable.'
      );
      setShowAIAlert(true);

      // Auto-hide alert after 5 seconds
      setTimeout(() => setShowAIAlert(false), 5000);

    } catch (error) {
      console.error('Error generating tags:', error);
      setAiAlertType('error');
      setAiAlertMessage('Failed to generate tags. Please try again.');
      setShowAIAlert(true);
      setTimeout(() => setShowAIAlert(false), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateTags = async () => {
    // Clear existing tags and generate new ones
    onChange([]);
    await handleGenerateTags();
  };

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {label}
        </Typography>
      )}

      {/* AI Alert */}
      <Collapse in={showAIAlert}>
        <Alert 
          severity={aiAlertType} 
          sx={{ mb: 2 }}
          onClose={() => setShowAIAlert(false)}
        >
          {aiAlertMessage}
        </Alert>
      </Collapse>

      {/* AI Generate Buttons */}
      {showAIGenerate && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Generate tags using AI based on task title and description">
            <Button
              variant="outlined"
              size="small"
              startIcon={isGenerating ? <CircularProgress size={16} /> : <AutoAwesome />}
              onClick={handleGenerateTags}
              disabled={isGenerating || disabled || !taskTitle.trim()}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.50'
                }
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Tags'}
            </Button>
          </Tooltip>

          {tags.length > 0 && (
            <Tooltip title="Clear current tags and generate new ones">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={handleRegenerateTags}
                disabled={isGenerating || disabled || !taskTitle.trim()}
                sx={{
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  '&:hover': {
                    borderColor: 'secondary.dark',
                    backgroundColor: 'secondary.50'
                  }
                }}
              >
                Regenerate
              </Button>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Tag Input Field */}
      <TextField
        fullWidth
        size="small"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        placeholder={disabled ? "Tags will be generated automatically" : placeholder}
        disabled={disabled || isGenerating || tags.length >= maxTags}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {inputValue.trim() && (
                <Tooltip title="Add tag">
                  <IconButton
                    size="small"
                    onClick={() => addTag(inputValue.trim())}
                    disabled={disabled || isGenerating || tags.length >= maxTags}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              )}
              {tags.length > 0 && (
                <Tooltip title="Clear all tags">
                  <IconButton
                    size="small"
                    onClick={clearAllTags}
                    disabled={disabled || isGenerating}
                    sx={{ ml: 0.5 }}
                  >
                    <Clear />
                  </IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            opacity: isGenerating ? 0.7 : 1,
            transition: 'opacity 0.3s ease'
          }
        }}
      />

      {/* Tags Display */}
      {tags.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={disabled || isGenerating ? undefined : () => removeTag(tag)}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                fontSize: '0.875rem',
                opacity: isGenerating ? 0.7 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
          ))}
        </Box>
      )}

      {/* Tag count indicator */}
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ mt: 1, display: 'block' }}
      >
        {tags.length}/{maxTags} tags
      </Typography>
    </Box>
  );
};

export default TagInput;
