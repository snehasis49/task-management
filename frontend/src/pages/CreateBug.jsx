import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tasksAPI, usersAPI } from '../utils/api';

const CreateBug = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Medium',
    status: 'Open',
    assigned_to: '',
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingTags, setGeneratingTags] = useState(false);
  const [generatedTags, setGeneratedTags] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await tasksAPI.createTask(formData);
      setSuccess('Task created successfully!');
      setGeneratedTags(response.data.tags || []);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/bugs');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create task');
    }

    setLoading(false);
  };

  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box sx={{ maxWidth: 'md', width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight="800" gutterBottom color="text.primary">
              Create New Task
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Add a new task to your project management system
            </Typography>
          </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
            {generatedTags.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  AI-generated tags:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {generatedTags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" color="primary" />
                  ))}
                </Box>
              </Box>
            )}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            placeholder="Brief description of the task"
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            placeholder="Detailed description of the task, requirements, and acceptance criteria"
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                label="Priority"
              >
                {severityOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assign To (Optional)</InputLabel>
            <Select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              label="Assign To (Optional)"
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Task'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/bugs')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateBug;
