import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit, Save, Cancel, Delete, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBug();
    fetchUsers();
  }, [id]);

  const fetchBug = async () => {
    try {
      const response = await axios.get(`/bugs`);
      const foundBug = response.data.find(b => b._id === id);
      if (foundBug) {
        setBug(foundBug);
        setEditData(foundBug);
      } else {
        setError('Bug not found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bug:', error);
      setError('Failed to load bug details');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(bug);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      const response = await axios.put(`/bugs/${id}`, editData);
      setBug(response.data);
      setEditing(false);
      setSuccess('Bug updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update bug');
    }
    
    setSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug? This action cannot be undone.')) {
      try {
        await axios.delete(`/bugs/${id}`);
        navigate('/bugs');
      } catch (error) {
        setError('Failed to delete bug');
      }
    }
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'error';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getAssignedUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? `${user.name} (${user.email})` : 'Unassigned';
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !bug) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/bugs')}
          sx={{ mt: 2 }}
        >
          Back to Bug List
        </Button>
      </Container>
    );
  }

  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/bugs')}
          sx={{ mb: 2 }}
        >
          Back to Bug List
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Bug Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!editing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {editing ? (
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editData.title || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {bug.title}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Description"
                name="description"
                value={editData.description || ''}
                onChange={handleInputChange}
                margin="normal"
              />
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {bug.description}
                </Typography>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {editing ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={editData.severity || ''}
                  onChange={handleInputChange}
                  label="Severity"
                >
                  {severityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Severity
                </Typography>
                <Chip
                  label={bug.severity}
                  color={getSeverityColor(bug.severity)}
                />
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {editing ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editData.status || ''}
                  onChange={handleInputChange}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={bug.status}
                  color={getStatusColor(bug.status)}
                />
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            {editing ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  name="assigned_to"
                  value={editData.assigned_to || ''}
                  onChange={handleInputChange}
                  label="Assigned To"
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
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Assigned To
                </Typography>
                <Typography variant="body1">
                  {getAssignedUserName(bug.assigned_to)}
                </Typography>
              </>
            )}
          </Grid>

          {bug.tags && bug.tags.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {bug.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(bug.created_at).toLocaleString()}
            </Typography>
            {bug.updated_at && bug.updated_at !== bug.created_at && (
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(bug.updated_at).toLocaleString()}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BugDetail;
