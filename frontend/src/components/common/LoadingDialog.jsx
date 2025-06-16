import React from 'react';
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  Box,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * Reusable Loading Dialog Component
 * Used for showing loading states during operations
 */
const LoadingDialog = ({
  open = false,
  message = "Loading...",
  submessage,
  type = "circular", // 'circular', 'linear'
  progress, // For linear progress (0-100)
  size = 60,
  disableBackdropClick = true,
  disableEscapeKeyDown = true,
  maxWidth = "xs",
  fullWidth = false,
  showProgress = false,
  ...dialogProps
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableEscapeKeyDown={disableEscapeKeyDown}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[24],
          minWidth: 300,
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.7),
        }
      }}
      onClose={disableBackdropClick ? undefined : () => {}}
      {...dialogProps}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 3,
          textAlign: 'center',
        }}
      >
        {/* Loading Indicator */}
        <Box sx={{ mb: 3 }}>
          {type === 'circular' ? (
            <CircularProgress
              size={size}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
          ) : (
            <Box sx={{ width: '100%', minWidth: 200 }}>
              <LinearProgress
                variant={progress !== undefined ? "determinate" : "indeterminate"}
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
              {showProgress && progress !== undefined && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {Math.round(progress)}%
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Main Message */}
        <Typography
          variant="h6"
          fontWeight="500"
          color="text.primary"
          sx={{ mb: submessage ? 1 : 0 }}
        >
          {message}
        </Typography>

        {/* Sub Message */}
        {submessage && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 250, lineHeight: 1.5 }}
          >
            {submessage}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * Hook for managing loading dialog state
 */
export const useLoadingDialog = () => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("Loading...");
  const [submessage, setSubmessage] = React.useState("");
  const [progress, setProgress] = React.useState(undefined);

  const showLoading = (msg = "Loading...", sub = "", prog = undefined) => {
    setMessage(msg);
    setSubmessage(sub);
    setProgress(prog);
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  const updateProgress = (prog, msg, sub) => {
    if (prog !== undefined) setProgress(prog);
    if (msg !== undefined) setMessage(msg);
    if (sub !== undefined) setSubmessage(sub);
  };

  return {
    loading,
    message,
    submessage,
    progress,
    showLoading,
    hideLoading,
    updateProgress,
  };
};

export default LoadingDialog;
