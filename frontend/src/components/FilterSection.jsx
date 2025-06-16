import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
  Badge,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Grid } from '@mui/system';
import {
  ExpandMore,
  FilterList,
  Clear,
  Person,
  Schedule,
  LocalOffer,
  Flag,
  CalendarToday,
  Refresh,
  BookmarkBorder,
  Bookmark,
  Search,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SaveFilterDialog, ConfirmDialog, useConfirmDialog } from './common';

const FilterSection = ({
  tasks = [],
  onFiltersChange,
  initialFilters = {},
  showQuickFilters = true,
  compact = false,
}) => {
  const theme = useTheme();
  
  // Filter state
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: [],
    severity: [],
    tags: [],
    assignedTo: [],
    createdDateFrom: null,
    createdDateTo: null,
    updatedDateFrom: null,
    updatedDateTo: null,
    quickFilter: '',
    ...initialFilters,
  });

  // UI state
  const [expanded, setExpanded] = useState(!compact);
  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Confirm dialog hook for delete operations
  const { showDeleteConfirm, dialogProps } = useConfirmDialog();

  // Available options
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  
  // Extract unique values from tasks
  const [availableOptions, setAvailableOptions] = useState({
    tags: [],
    assignees: [],
  });

  // Quick filter presets
  const quickFilters = [
    { id: 'my-tasks', label: 'My Tasks', icon: <Person /> },
    { id: 'high-priority', label: 'High Priority', icon: <Flag /> },
    { id: 'overdue', label: 'Overdue', icon: <Schedule /> },
    { id: 'recent', label: 'Recent', icon: <CalendarToday /> },
    { id: 'unassigned', label: 'Unassigned', icon: <Person /> },
  ];

  // Extract available options from tasks
  useEffect(() => {
    const tags = new Set();
    const assignees = new Set();

    tasks.forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => tags.add(tag));
      }
      if (task.assigned_to || task.assignedTo) {
        assignees.add(task.assigned_to || task.assignedTo);
      }
    });

    setAvailableOptions({
      tags: Array.from(tags).sort(),
      assignees: Array.from(assignees).filter(Boolean).sort(),
    });
  }, [tasks]);

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleMultiSelectChange = (filterType, value) => {
    const newValue = typeof value === 'string' ? value.split(',') : value;
    setFilters(prev => ({
      ...prev,
      [filterType]: newValue,
    }));
  };

  const handleQuickFilter = (quickFilterId) => {
    let newFilters = { ...filters };

    switch (quickFilterId) {
      case 'my-tasks':
        // This would need user context - for now just clear other filters
        newFilters = { ...filters, quickFilter: quickFilterId };
        break;
      case 'high-priority':
        newFilters = {
          ...filters,
          severity: ['High', 'Critical'],
          quickFilter: quickFilterId,
        };
        break;
      case 'overdue':
        newFilters = {
          ...filters,
          // Would need due date logic
          quickFilter: quickFilterId,
        };
        break;
      case 'recent':
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 7);
        newFilters = {
          ...filters,
          createdDateFrom: recentDate,
          quickFilter: quickFilterId,
        };
        break;
      case 'unassigned':
        newFilters = {
          ...filters,
          assignedTo: ['unassigned'],
          quickFilter: quickFilterId,
        };
        break;
      default:
        break;
    }

    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      status: [],
      severity: [],
      tags: [],
      assignedTo: [],
      createdDateFrom: null,
      createdDateTo: null,
      updatedDateFrom: null,
      updatedDateTo: null,
      quickFilter: '',
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status.length > 0) count++;
    if (filters.severity.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.assignedTo.length > 0) count++;
    if (filters.createdDateFrom || filters.createdDateTo) count++;
    if (filters.updatedDateFrom || filters.updatedDateTo) count++;
    if (filters.quickFilter) count++;
    return count;
  };

  const saveCurrentFilter = () => {
    setShowSaveDialog(true);
  };

  const handleSaveFilter = (saveData) => {
    const newSavedFilter = {
      id: Date.now().toString(),
      name: saveData.name,
      filters: { ...saveData.filters },
      isDefault: saveData.makeDefault,
    };

    if (saveData.overwriteExisting) {
      setSavedFilters(prev =>
        prev.map(filter =>
          filter.name === saveData.name ? newSavedFilter : filter
        )
      );
    } else {
      setSavedFilters(prev => [...prev, newSavedFilter]);
    }

    setShowSaveDialog(false);
  };

  const applySavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
  };

  const deleteSavedFilter = (filterId, filterName) => {
    showDeleteConfirm({
      title: 'Delete Saved Filter',
      message: `Are you sure you want to delete the filter "${filterName}"? This action cannot be undone.`,
      onConfirm: async () => {
        setSavedFilters(prev => prev.filter(f => f.id !== filterId));
      }
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

  const renderMultiSelect = (label, value, options, onChange, icon, getColor = null) => (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                color={getColor ? getColor(item) : 'primary'}
                icon={icon}
                sx={{ height: 24 }}
              />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderContent = () => (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        boxShadow: 'none',
        '&:before': { display: 'none' },
        '& .MuiAccordionSummary-root': {
          minHeight: 56,
          '&.Mui-expanded': { minHeight: 56 },
        },
      }}
    >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              backgroundColor: compact
                ? 'transparent'
                : alpha(theme.palette.primary.main, 0.04),
              borderRadius: compact
                ? 0
                : (expanded ? '8px 8px 0 0' : '8px'),
              '&:hover': {
                backgroundColor: compact
                  ? alpha(theme.palette.primary.main, 0.04)
                  : alpha(theme.palette.primary.main, 0.08),
              },
              ...(compact && {
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                mt: 2,
                pt: 2,
              }),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Badge badgeContent={getActiveFilterCount()} color="primary">
                <FilterList color="primary" />
              </Badge>
              <Typography variant="h6" fontWeight="600" color="primary">
                Filters
              </Typography>
              {getActiveFilterCount() > 0 && (
                <Tooltip title="Clear all filters">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                    sx={{ ml: 'auto', mr: 1 }}
                  >
                    <Clear />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 3 }}>
            {/* Search Input */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Search color="primary" />
                Search Tasks
              </Typography>
              <TextField
                fullWidth
                placeholder="Search by title, description, or keywords..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: filters.searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => handleFilterChange('searchTerm', '')}
                          edge="end"
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>

            {/* Quick Filters */}
            {showQuickFilters && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOffer color="primary" />
                  Quick Filters
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {quickFilters.map((filter) => (
                    <Chip
                      key={filter.id}
                      label={filter.label}
                      icon={filter.icon}
                      onClick={() => handleQuickFilter(filter.id)}
                      color={filters.quickFilter === filter.id ? 'primary' : 'default'}
                      variant={filters.quickFilter === filter.id ? 'filled' : 'outlined'}
                      sx={{
                        '&:hover': {
                          backgroundColor: filters.quickFilter === filter.id
                            ? alpha(theme.palette.primary.main, 0.8)
                            : alpha(theme.palette.primary.main, 0.1),
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Advanced Filters */}
            <Grid container spacing={3}>
              {/* Status Filter */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                {renderMultiSelect(
                  'Status',
                  filters.status,
                  statusOptions,
                  (value) => handleMultiSelectChange('status', value),
                  <Flag />,
                  getStatusColor
                )}
              </Grid>

              {/* Priority/Severity Filter */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                {renderMultiSelect(
                  'Priority',
                  filters.severity,
                  severityOptions,
                  (value) => handleMultiSelectChange('severity', value),
                  <Flag />,
                  getSeverityColor
                )}
              </Grid>

              {/* Tags Filter */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                {renderMultiSelect(
                  'Tags',
                  filters.tags,
                  availableOptions.tags,
                  (value) => handleMultiSelectChange('tags', value),
                  <LocalOffer />
                )}
              </Grid>

              {/* Assignee Filter */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                {renderMultiSelect(
                  'Assignee',
                  filters.assignedTo,
                  ['unassigned', ...availableOptions.assignees],
                  (value) => handleMultiSelectChange('assignedTo', value),
                  <Person />
                )}
              </Grid>

              {/* Date Filters */}
              <Grid size={{ xs: 12, md: 6}}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Created Date Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <DatePicker
                    label="From"
                    value={filters.createdDateFrom}
                    onChange={(date) => handleFilterChange('createdDateFrom', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="To"
                    value={filters.createdDateTo}
                    onChange={(date) => handleFilterChange('createdDateTo', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6}}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Updated Date Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <DatePicker
                    label="From"
                    value={filters.updatedDateFrom}
                    onChange={(date) => handleFilterChange('updatedDateFrom', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="To"
                    value={filters.updatedDateTo}
                    onChange={(date) => handleFilterChange('updatedDateTo', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Filter Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearAllFilters}
                  disabled={getActiveFilterCount() === 0}
                  size="small"
                >
                  Clear All
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkBorder />}
                  onClick={saveCurrentFilter}
                  disabled={getActiveFilterCount() === 0}
                  size="small"
                >
                  Save Filter
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
              </Typography>
            </Box>

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Saved Filters
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {savedFilters.map((savedFilter) => (
                      <Chip
                        key={savedFilter.id}
                        label={savedFilter.name}
                        icon={<Bookmark />}
                        onClick={() => applySavedFilter(savedFilter)}
                        onDelete={() => deleteSavedFilter(savedFilter.id, savedFilter.name)}
                        color="secondary"
                        variant="outlined"
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {compact ? (
        renderContent()
      ) : (
        <Card
          sx={{
            mb: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 2,
            overflow: 'visible',
          }}
        >
          {renderContent()}
        </Card>
      )}

      {/* Save Filter Dialog */}
      <SaveFilterDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveFilter}
        activeFilters={filters}
        existingFilterNames={savedFilters.map(f => f.name)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog {...dialogProps} />
    </LocalizationProvider>
  );
};

export default FilterSection;
