import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import {
  Delete,
  Save,
  Warning,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  CloudUpload,
} from '@mui/icons-material';
import {
  ConfirmDialog,
  SaveFilterDialog,
  LoadingDialog,
  useConfirmDialog,
  useLoadingDialog
} from '../common';

/**
 * Example component demonstrating all dialog types
 * This shows how to use the reusable dialog components
 */
const DialogExamples = () => {
  // State for individual dialogs
  const [showSaveFilter, setShowSaveFilter] = useState(false);
  
  // Hooks for dialog management
  const { showConfirm, showDeleteConfirm, showSaveConfirm, dialogProps } = useConfirmDialog();
  const { loading, message, submessage, progress, showLoading, hideLoading, updateProgress } = useLoadingDialog();

  // Example handlers
  const handleDeleteExample = () => {
    showDeleteConfirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete "Example Task"? This action cannot be undone.',
      onConfirm: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Task deleted!');
      }
    });
  };

  const handleSaveExample = () => {
    showSaveConfirm({
      title: 'Save Changes',
      message: 'Do you want to save your changes to this task?',
      onConfirm: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Changes saved!');
      }
    });
  };

  const handleWarningExample = () => {
    showConfirm({
      type: 'warning',
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave this page?',
      confirmText: 'Leave Page',
      onConfirm: async () => {
        console.log('Leaving page...');
      }
    });
  };

  const handleInfoExample = () => {
    showConfirm({
      type: 'info',
      title: 'Information',
      message: 'This action will send notifications to all team members.',
      confirmText: 'Send Notifications',
      onConfirm: async () => {
        console.log('Notifications sent!');
      }
    });
  };

  const handleErrorExample = () => {
    showConfirm({
      type: 'error',
      title: 'Error Occurred',
      message: 'An error occurred while processing your request. Would you like to retry?',
      confirmText: 'Retry',
      onConfirm: async () => {
        console.log('Retrying...');
      }
    });
  };

  const handleSuccessExample = () => {
    showConfirm({
      type: 'success',
      title: 'Success!',
      message: 'Your task has been completed successfully.',
      confirmText: 'OK',
      cancelText: 'View Details',
      onConfirm: async () => {
        console.log('OK clicked');
      }
    });
  };

  const handleLoadingExample = () => {
    showLoading('Processing...', 'Please wait while we process your request.');
    
    // Simulate progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      updateProgress(prog, `Processing... ${prog}%`);
      
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          hideLoading();
        }, 500);
      }
    }, 300);
  };

  const handleUploadExample = () => {
    showLoading('Uploading files...', 'Uploading 3 files to the server.', 0);
    
    // Simulate file upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      updateProgress(
        prog, 
        `Uploading files... ${prog}%`,
        `${Math.min(Math.ceil(prog / 33), 3)} of 3 files uploaded`
      );
      
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          hideLoading();
        }, 500);
      }
    }, 150);
  };

  const handleSaveFilterExample = (saveData) => {
    console.log('Filter saved:', saveData);
    setShowSaveFilter(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Dialog Examples
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Examples of all reusable dialog components with consistent styling and behavior.
      </Typography>

      <Grid container spacing={3}>
        {/* Confirm Dialogs */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirm Dialogs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteExample}
              >
                Delete Confirmation
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSaveExample}
              >
                Save Confirmation
              </Button>
              
              <Button
                variant="contained"
                color="warning"
                startIcon={<Warning />}
                onClick={handleWarningExample}
              >
                Warning Dialog
              </Button>
              
              <Button
                variant="contained"
                color="info"
                startIcon={<Info />}
                onClick={handleInfoExample}
              >
                Info Dialog
              </Button>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<ErrorIcon />}
                onClick={handleErrorExample}
              >
                Error Dialog
              </Button>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleSuccessExample}
              >
                Success Dialog
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Loading Dialogs */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loading Dialogs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleLoadingExample}
              >
                Progress Loading
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={handleUploadExample}
              >
                Upload Progress
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Save Filter Dialog */}
        <Grid xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Save Filter Dialog
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setShowSaveFilter(true)}
            >
              Open Save Filter Dialog
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog Components */}
      <ConfirmDialog {...dialogProps} />
      
      <LoadingDialog
        open={loading}
        message={message}
        submessage={submessage}
        progress={progress}
        type={progress !== undefined ? "linear" : "circular"}
        showProgress={true}
      />
      
      <SaveFilterDialog
        open={showSaveFilter}
        onClose={() => setShowSaveFilter(false)}
        onSave={handleSaveFilterExample}
        activeFilters={{
          status: ['Open', 'In Progress'],
          severity: ['High'],
          tags: ['urgent', 'bug'],
          searchTerm: 'example search'
        }}
        existingFilterNames={['My Filters', 'High Priority Tasks']}
      />
    </Box>
  );
};

export default DialogExamples;
