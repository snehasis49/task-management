# FilterSection Component

A professional, reusable filter component for task management systems that provides comprehensive filtering capabilities with a modern Material-UI design.

## Features

### 🔍 Search Functionality
- **Keyword Search**: Real-time search through task titles and descriptions
- **Clear Search**: Easy clear button to reset search terms
- **Search Integration**: Combines with other filters for powerful filtering

### 🚀 Quick Filters
- **My Tasks**: Filter tasks assigned to current user
- **High Priority**: Show only High and Critical priority tasks
- **Overdue**: Display overdue tasks
- **Recent**: Show tasks created in the last 7 days
- **Unassigned**: Display tasks without assignees

### 🔧 Advanced Filters
- **Status Filter**: Multi-select dropdown for task statuses (Open, In Progress, Resolved, Closed)
- **Priority Filter**: Multi-select dropdown for task priorities (Low, Medium, High, Critical)
- **Tags Filter**: Multi-select dropdown for task tags
- **Assignee Filter**: Multi-select dropdown for task assignees
- **Date Range Filters**: 
  - Created date range picker
  - Updated date range picker

### 💾 Filter Management
- **Save Filters**: Save current filter configuration with custom names
- **Load Saved Filters**: Quick access to previously saved filter combinations
- **Clear All**: Reset all filters to default state
- **Active Filter Count**: Visual indicator of how many filters are active

### 🎨 UI/UX Features
- **Collapsible Design**: Expandable/collapsible accordion interface
- **Professional Styling**: Material-UI components with consistent theming
- **Responsive Layout**: Works on desktop and mobile devices
- **Visual Indicators**: Color-coded chips and badges
- **Tooltips**: Helpful hover information
- **Smooth Animations**: Transition effects for better user experience

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tasks` | Array | `[]` | Array of task objects to extract filter options from |
| `onFiltersChange` | Function | - | Callback function called when filters change |
| `initialFilters` | Object | `{}` | Initial filter state |
| `showQuickFilters` | Boolean | `true` | Whether to show quick filter buttons |
| `compact` | Boolean | `false` | Whether to use compact mode |

## Usage

### Basic Usage
```jsx
import FilterSection from '../components/FilterSection';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleFiltersChange = (filters) => {
    // Apply filters to tasks
    const filtered = applyFilters(tasks, filters);
    setFilteredTasks(filtered);
  };

  return (
    <div>
      <FilterSection
        tasks={tasks}
        onFiltersChange={handleFiltersChange}
        showQuickFilters={true}
        compact={false}
      />
      {/* Render filtered tasks */}
    </div>
  );
}
```

### Advanced Usage with Initial Filters
```jsx
const initialFilters = {
  status: ['Open', 'In Progress'],
  severity: ['High'],
  tags: ['bug'],
  quickFilter: 'high-priority'
};

<FilterSection
  tasks={tasks}
  onFiltersChange={handleFiltersChange}
  initialFilters={initialFilters}
  showQuickFilters={true}
  compact={false}
/>
```

## Filter Object Structure

The `onFiltersChange` callback receives a filter object with the following structure:

```javascript
{
  searchTerm: 'bug fix',                     // Search keyword string
  status: ['Open', 'In Progress'],           // Array of selected statuses
  severity: ['High', 'Critical'],           // Array of selected priorities
  tags: ['bug', 'feature'],                 // Array of selected tags
  assignedTo: ['john@example.com'],          // Array of selected assignees
  createdDateFrom: Date,                     // Start date for created date filter
  createdDateTo: Date,                       // End date for created date filter
  updatedDateFrom: Date,                     // Start date for updated date filter
  updatedDateTo: Date,                       // End date for updated date filter
  quickFilter: 'high-priority'              // Active quick filter ID
}
```

## Integration Examples

### Dashboard Integration
```jsx
// In Dashboard.jsx
import FilterSection from "../components/FilterSection";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleFiltersChange = (filters) => {
    const filtered = applyFilters(tasks, filters);
    setFilteredTasks(filtered);
    setShowFilters(hasActiveFilters(filters));
  };

  return (
    <Box>
      <FilterSection
        tasks={tasks}
        onFiltersChange={handleFiltersChange}
        showQuickFilters={true}
        compact={false}
      />
      <KanbanBoard
        tasks={showFilters ? filteredTasks : tasks}
        onTaskUpdate={fetchTasks}
      />
    </Box>
  );
};
```

### BugList Integration
```jsx
// In BugList.jsx
import FilterSection from '../components/FilterSection';

const BugList = () => {
  const [tasks, setTasks] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    // Apply filters logic here
  };

  return (
    <Box>
      <FilterSection
        tasks={tasks}
        onFiltersChange={handleFiltersChange}
        showQuickFilters={true}
        compact={false}
      />
      {/* Render task list/table */}
    </Box>
  );
};
```

## Styling and Theming

The component uses Material-UI's theming system and can be customized through:

- Theme palette colors
- Component-level sx props
- CSS-in-JS styling
- Material-UI theme overrides

## Dependencies

- `@mui/material` - Core Material-UI components
- `@mui/x-date-pickers` - Date picker components
- `date-fns` - Date manipulation library
- `@mui/system` - Grid system

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Uses React.memo for optimization
- Debounced filter updates
- Efficient re-rendering with proper dependency arrays
- Minimal DOM updates through virtual DOM

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
