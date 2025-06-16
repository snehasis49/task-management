import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import {
  Close,
  Save,
  FilterList,
} from '@mui/icons-material';

/**
 * Reusable Save Filter Dialog Component
 * Used for saving filter configurations with name and options
 */
const SaveFilterDialog = ({
  open = false,
  onClose,
  onSave,
  title = "Save Filter",
  loading = false,
  maxWidth = "sm",
  fullWidth = true,
  activeFilters = {},
  existingFilterNames = [],
  defaultName = "",
  showMakeDefault = true,
  showOverwriteOption = true,
  ...dialogProps
}) => {
  const theme = useTheme();
  const [filterName, setFilterName] = useState(defaultName);
  const [makeDefault, setMakeDefault] = useState(false);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [nameError, setNameError] = useState('');

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setFilterName(defaultName);
      setMakeDefault(false);
      setOverwriteExisting(false);
      setNameError('');
    }
  }, [open, defaultName]);

  // Validate filter name
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Filter name is required';
    }
    if (name.length < 2) {
      return 'Filter name must be at least 2 characters';
    }
    if (name.length > 50) {
      return 'Filter name must be less than 50 characters';
    }
    if (existingFilterNames.includes(name.trim()) && !overwriteExisting) {
      return 'Filter name already exists. Enable overwrite or choose a different name.';
    }
    return '';
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    setFilterName(name);
    setNameError(validateName(name));
  };

  const handleSave = () => {
    const error = validateName(filterName);
    if (error) {
      setNameError(error);
      return;
    }

    if (onSave) {
      onSave({
        name: filterName.trim(),
        filters: activeFilters,
        makeDefault,
        overwriteExisting,
      });
    }
  };

  const handleClose = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

  // Get filter summary
  const getFilterSummary = () => {
    const summary = [];
    
    if (activeFilters.searchTerm) {
      summary.push(`Search: "${activeFilters.searchTerm}"`);
    }
    
    if (activeFilters.status?.length > 0) {
      summary.push(`Status: ${activeFilters.status.join(', ')}`);
    }
    
    if (activeFilters.severity?.length > 0) {
      summary.push(`Priority: ${activeFilters.severity.join(', ')}`);
    }
    
    if (activeFilters.tags?.length > 0) {
      summary.push(`Tags: ${activeFilters.tags.join(', ')}`);
    }
    
    if (activeFilters.assignedTo?.length > 0) {
      summary.push(`Assignee: ${activeFilters.assignedTo.join(', ')}`);
    }
    
    return summary;
  };

  const filterSummary = getFilterSummary();
  const isNameExists = existingFilterNames.includes(filterName.trim());

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[24],
        }
      }}
      {...dialogProps}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight="600">
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.hover, 0.1),
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Filter Summary */}
          {filterSummary.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                Current Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filterSummary.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Filter Name Input */}
          <TextField
            label="Filter Name"
            value={filterName}
            onChange={handleNameChange}
            error={!!nameError}
            helperText={nameError || 'Enter a name for this filter configuration'}
            fullWidth
            autoFocus
            disabled={loading}
            placeholder="e.g., High Priority Open Tasks"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          {/* Name exists warning */}
          {isNameExists && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              }}
            >
              <Typography variant="body2" color="warning.main" fontWeight="500">
                A filter with this name already exists. Enable "Overwrite existing" to replace it.
              </Typography>
            </Box>
          )}

          {/* Options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {showMakeDefault && (
              <FormControlLabel
                control={
                  <Switch
                    checked={makeDefault}
                    onChange={(e) => setMakeDefault(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Make this my default filter"
              />
            )}
            
            {showOverwriteOption && isNameExists && (
              <FormControlLabel
                control={
                  <Switch
                    checked={overwriteExisting}
                    onChange={(e) => setOverwriteExisting(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Overwrite existing filter"
              />
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 100,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={loading || !!nameError || !filterName.trim()}
          variant="contained"
          startIcon={<Save />}
          size="large"
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? 'Saving...' : 'Save Filter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFilterDialog;
