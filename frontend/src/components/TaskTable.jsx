import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  ErrorOutline,
  CheckCircle,
  Schedule,
  Assignment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TaskTable = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEdit = () => {
    if (selectedTask) {
      navigate(`/bugs/${selectedTask.id || selectedTask._id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedTask && onTaskDelete) {
      onTaskDelete(selectedTask.id || selectedTask._id);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedTask) {
      navigate(`/bugs/${selectedTask.id || selectedTask._id}`);
    }
    handleMenuClose();
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'Open': { color: 'warning', icon: <ErrorOutline sx={{ fontSize: 16 }} /> },
      'In Progress': { color: 'info', icon: <Schedule sx={{ fontSize: 16 }} /> },
      'Resolved': { color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
      'Closed': { color: 'default', icon: <Assignment sx={{ fontSize: 16 }} /> },
    };

    const config = statusConfig[status] || statusConfig['Open'];
    
    return (
      <Chip
        label={status}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          '& .MuiChip-icon': {
            fontSize: 16,
          },
        }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      'High': { color: 'error', bgcolor: '#ff5722' },
      'Medium': { color: 'warning', bgcolor: '#ff9800' },
      'Low': { color: 'success', bgcolor: '#4caf50' },
    };

    const config = priorityConfig[priority] || priorityConfig['Medium'];
    
    return (
      <Chip
        label={priority}
        size="small"
        sx={{
          backgroundColor: config.bgcolor,
          color: 'white',
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
          minWidth: 60,
        }}
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        boxShadow: theme.palette.mode === 'light' 
          ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
          : '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>DATE</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>TASK</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>STATUS</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>PRIORITY</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>ASSIGNEE</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>DUE DATE</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id || task._id}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
                transition: 'background-color 0.2s ease',
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {formatDate(task.createdAt)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    sx={{ 
                      mb: 0.5,
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' }
                    }}
                    onClick={() => navigate(`/bugs/${task.id || task._id}`)}
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {task.description ? task.description.replace(/<[^>]*>/g, '').substring(0, 100) : 'No description'}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                {getStatusChip(task.status)}
              </TableCell>
              
              <TableCell>
                {getPriorityChip(task.priority)}
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      fontSize: '0.875rem',
                      bgcolor: 'primary.main' 
                    }}
                  >
                    {task.assignedTo?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="body2" fontWeight={500}>
                    {task.assignedTo || 'Unassigned'}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography 
                  variant="body2" 
                  fontWeight={500}
                  color={task.dueDate && new Date(task.dueDate) < new Date() ? 'error.main' : 'text.primary'}
                >
                  {formatDate(task.dueDate)}
                </Typography>
              </TableCell>
              
              <TableCell align="center">
                <Tooltip title="More actions">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, task)}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.3)',
          },
        }}
      >
        <MenuItem onClick={handleView} sx={{ gap: 1 }}>
          <Visibility fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
          <Edit fontSize="small" />
          Edit Task
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ gap: 1, color: 'error.main' }}>
          <Delete fontSize="small" />
          Delete Task
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default TaskTable;
