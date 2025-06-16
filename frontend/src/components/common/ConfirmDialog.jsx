import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  Warning,
  Delete,
  Save,
  Info,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

/**
 * Reusable Confirm Dialog Component
 * Used for delete confirmations, save operations, and other confirmations
 */
const ConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning', 'error', 'info', 'success', 'delete', 'save'
  loading = false,
  maxWidth = "sm",
  fullWidth = true,
  children,
  confirmButtonProps = {},
  cancelButtonProps = {},
  showCloseButton = true,
  ...dialogProps
}) => {
  const theme = useTheme();

  // Get icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'delete':
        return {
          icon: <Delete sx={{ fontSize: 48 }} />,
          iconColor: theme.palette.error.main,
          confirmColor: 'error',
          defaultTitle: 'Delete Confirmation',
          defaultMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
          defaultConfirmText: 'Delete'
        };
      case 'save':
        return {
          icon: <Save sx={{ fontSize: 48 }} />,
          iconColor: theme.palette.primary.main,
          confirmColor: 'primary',
          defaultTitle: 'Save Confirmation',
          defaultMessage: 'Do you want to save your changes?',
          defaultConfirmText: 'Save'
        };
      case 'error':
        return {
          icon: <ErrorIcon sx={{ fontSize: 48 }} />,
          iconColor: theme.palette.error.main,
          confirmColor: 'error',
          defaultTitle: 'Error',
          defaultMessage: 'An error occurred. Please try again.',
          defaultConfirmText: 'OK'
        };
      case 'success':
        return {
          icon: <CheckCircle sx={{ fontSize: 48 }} />,
          iconColor: theme.palette.success.main,
          confirmColor: 'success',
          defaultTitle: 'Success',
          defaultMessage: 'Operation completed successfully.',
          defaultConfirmText: 'OK'
        };
      case 'info':
        return {
          icon: <Info sx={{ fontSize: 48 }} />,
          iconColor: theme.palette.info.main,
          confirmColor: 'info',
          defaultTitle: 'Information',
          defaultMessage: 'Please confirm your action.',
          defaultConfirmText: 'OK'
        };
      case 'warning':
      default:
        return {
          icon: <Warning sx={{ fontSize: 48 }} />,
          iconColor: theme.palette.warning.main,
          confirmColor: 'warning',
          defaultTitle: 'Warning',
          defaultMessage: 'Are you sure you want to proceed?',
          defaultConfirmText: 'Proceed'
        };
    }
  };

  const config = getTypeConfig();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

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
        <Typography variant="h6" fontWeight="600">
          {title || config.defaultTitle}
        </Typography>
        {showCloseButton && (
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
        )}
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: alpha(config.iconColor, 0.1),
              color: config.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {config.icon}
          </Box>

          {/* Message */}
          {(message || config.defaultMessage) && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 400, lineHeight: 1.6 }}
            >
              {message || config.defaultMessage}
            </Typography>
          )}

          {/* Custom Content */}
          {children}
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
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color={config.confirmColor}
          size="large"
          sx={{
            minWidth: 100,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
          {...confirmButtonProps}
        >
          {loading ? 'Processing...' : (confirmText || config.defaultConfirmText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
