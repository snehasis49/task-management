import { useState, useCallback } from 'react';

/**
 * Custom hook for managing confirm dialog state
 * Provides a simple API for showing confirmation dialogs
 */
const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    loading: false,
    confirmButtonProps: {},
    cancelButtonProps: {},
  });

  // Show confirmation dialog
  const showConfirm = useCallback((options = {}) => {
    setDialogState({
      open: true,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to proceed?',
      type: options.type || 'warning',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm || null,
      loading: false,
      confirmButtonProps: options.confirmButtonProps || {},
      cancelButtonProps: options.cancelButtonProps || {},
    });
  }, []);

  // Show delete confirmation dialog
  const showDeleteConfirm = useCallback((options = {}) => {
    showConfirm({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      type: 'delete',
      confirmText: 'Delete',
      ...options,
    });
  }, [showConfirm]);

  // Show save confirmation dialog
  const showSaveConfirm = useCallback((options = {}) => {
    showConfirm({
      title: 'Save Changes',
      message: 'Do you want to save your changes?',
      type: 'save',
      confirmText: 'Save',
      ...options,
    });
  }, [showConfirm]);

  // Hide dialog
  const hideConfirm = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  // Set loading state
  const setLoading = useCallback((loading) => {
    setDialogState(prev => ({ ...prev, loading }));
  }, []);

  // Handle confirm action
  const handleConfirm = useCallback(async () => {
    if (dialogState.onConfirm) {
      try {
        setLoading(true);
        await dialogState.onConfirm();
        hideConfirm();
      } catch (error) {
        console.error('Confirm action failed:', error);
        // Keep dialog open on error
      } finally {
        setLoading(false);
      }
    } else {
      hideConfirm();
    }
  }, [dialogState.onConfirm, hideConfirm, setLoading]);

  return {
    // State
    dialogState,
    
    // Actions
    showConfirm,
    showDeleteConfirm,
    showSaveConfirm,
    hideConfirm,
    handleConfirm,
    setLoading,
    
    // Dialog props (spread these to ConfirmDialog component)
    dialogProps: {
      open: dialogState.open,
      title: dialogState.title,
      message: dialogState.message,
      type: dialogState.type,
      confirmText: dialogState.confirmText,
      cancelText: dialogState.cancelText,
      loading: dialogState.loading,
      onClose: hideConfirm,
      onConfirm: handleConfirm,
      confirmButtonProps: dialogState.confirmButtonProps,
      cancelButtonProps: dialogState.cancelButtonProps,
    },
  };
};

export default useConfirmDialog;
