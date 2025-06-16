import { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { tasksAPI, usersAPI } from '../utils/api';
import HtmlViewer from '../components/HtmlViewer';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';

const BugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBug();
    fetchUsers();
  }, [id]);

  const fetchBug = async () => {
    try {
      const response = await tasksAPI.getTask(id);
      setBug(response.data);
      setEditData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to load task details');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(bug);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await tasksAPI.updateTask(id, editData);
      setBug(response.data);
      setEditing(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update task');
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await tasksAPI.deleteTask(id);
        toast.success('Task deleted successfully!');
        navigate('/bugs');
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDescriptionChange = (content) => {
    setEditData({
      ...editData,
      description: content,
    });
  };

  const handleTagsChange = (tags) => {
    setEditData({
      ...editData,
      tags: tags,
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
          <Grid size={12}>
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

          <Grid size={12}>
            {editing ? (
              <RichTextEditor
                value={editData.description || ''}
                onChange={handleDescriptionChange}
                label="Description"
                placeholder="Detailed description of the task, requirements, and acceptance criteria"
                taskTitle={editData.title || ''}
                showAIGenerate={true}
              />
            ) : (
              <HtmlViewer
                content={bug.description}
                showLabel={true}
                label="Description"
              />
            )}
          </Grid>

          <Grid size={12}>
            {editing ? (
              <TagInput
                tags={editData.tags || []}
                onChange={handleTagsChange}
                label="Tags"
                placeholder="Type a tag and press Enter"
                taskTitle={editData.title || ''}
                taskDescription={editData.description || ''}
                showAIGenerate={true}
                maxTags={10}
              />
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                {bug.tags && bug.tags.length > 0 ? (
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
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags assigned
                  </Typography>
                )}
              </>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={12}>
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



          <Grid size={12}>
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
