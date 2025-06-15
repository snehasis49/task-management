import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BugReport,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  ErrorOutline,
  Timeline,
  CheckCircle,
  Assignment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../utils/api';

const KanbanBoard = ({ tasks, onTaskUpdate, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const columns = [
    {
      id: 'Open',
      title: 'Open',
      color: 'error',
      icon: <ErrorOutline />,
      bgColor: theme.palette.mode === 'light' ? '#fef2f2' : '#450a0a',
      borderColor: theme.palette.mode === 'light' ? '#fecaca' : '#dc2626',
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      color: 'warning',
      icon: <Timeline />,
      bgColor: theme.palette.mode === 'light' ? '#fffbeb' : '#451a03',
      borderColor: theme.palette.mode === 'light' ? '#fed7aa' : '#ea580c',
    },
    {
      id: 'Resolved',
      title: 'Resolved',
      color: 'success',
      icon: <CheckCircle />,
      bgColor: theme.palette.mode === 'light' ? '#f0fdf4' : '#052e16',
      borderColor: theme.palette.mode === 'light' ? '#bbf7d0' : '#16a34a',
    },
    {
      id: 'Closed',
      title: 'Closed',
      color: 'default',
      icon: <Assignment />,
      bgColor: theme.palette.mode === 'light' ? '#f8fafc' : '#0f172a',
      borderColor: theme.palette.mode === 'light' ? '#cbd5e1' : '#475569',
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;

    try {
      await tasksAPI.updateTask(draggableId, { status: newStatus });

      // Call parent component to refresh tasks
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id || task._id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 2,
            cursor: 'grab',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            boxShadow: snapshot.isDragging 
              ? theme.shadows[8] 
              : theme.shadows[1],
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: snapshot.isDragging ? 'rotate(5deg)' : 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ flex: 1, pr: 1 }}>
                {task.title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, task);
                }}
                sx={{ ml: 1 }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
              {task.description.length > 80 
                ? `${task.description.substring(0, 80)}...` 
                : task.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                label={task.severity}
                color={getSeverityColor(task.severity)}
                size="small"
                sx={{ fontWeight: 500, fontSize: '0.7rem' }}
              />
              <Avatar
                sx={{
                  bgcolor: `${getSeverityColor(task.severity)}.main`,
                  width: 24,
                  height: 24,
                }}
              >
                <BugReport sx={{ fontSize: 14 }} />
              </Avatar>
            </Box>
            
            {task.tags && task.tags.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {task.tags.slice(0, 2).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.6rem', height: 20 }}
                  />
                ))}
                {task.tags.length > 2 && (
                  <Chip
                    label={`+${task.tags.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.6rem', height: 20 }}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  if (loading) {
    return (
      <Grid container spacing={3}>
        {columns.map((column) => (
          <Grid item xs={12} md={3} key={column.id}>
            <Card sx={{ minHeight: 600 }}>
              <CardContent>
                <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container spacing={3}>
        {columns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.id);
          
          return (
            <Grid item xs={12} md={3} key={column.id}>
              <Card
                sx={{
                  minHeight: 600,
                  backgroundColor: alpha(column.bgColor, 0.3),
                  border: `2px solid ${alpha(column.borderColor, 0.3)}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    {column.icon}
                    <Typography variant="h6" fontWeight="600">
                      {column.title}
                    </Typography>
                    <Chip
                      label={columnTasks.length}
                      size="small"
                      color={column.color}
                      sx={{ ml: 'auto', fontWeight: 600 }}
                    />
                  </Box>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          minHeight: 500,
                          backgroundColor: snapshot.isDraggingOver 
                            ? alpha(column.borderColor, 0.1) 
                            : 'transparent',
                          borderRadius: 2,
                          transition: 'background-color 0.2s ease',
                          p: 1,
                        }}
                      >
                        {columnTasks.map((task, index) => (
                          <TaskCard key={task.id || task._id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Task Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/bugs/${selectedTask?.id || selectedTask?._id}`);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/bugs/${selectedTask?.id || selectedTask?._id}`);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </DragDropContext>
  );
};

export default KanbanBoard;
