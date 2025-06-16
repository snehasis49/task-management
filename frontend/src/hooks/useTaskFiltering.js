import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for task filtering logic
 * Reusable across Dashboard, BugList, and other components
 */
const useTaskFiltering = (tasks = []) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Memoized filter function
  const applyFilters = useCallback((filters, taskList = tasks) => {
    let filtered = [...taskList];

    // Apply search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (task.description &&
            task.description
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((task) =>
        filters.status.includes(task.status)
      );
    }

    // Apply severity filter
    if (filters.severity && filters.severity.length > 0) {
      filtered = filtered.filter((task) =>
        filters.severity.includes(task.severity)
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(
        (task) =>
          task.tags && filters.tags.some((tag) => task.tags.includes(tag))
      );
    }

    // Apply assignee filter
    if (filters.assignedTo && filters.assignedTo.length > 0) {
      filtered = filtered.filter((task) => {
        const assignee = task.assigned_to || task.assignedTo;
        if (filters.assignedTo.includes("unassigned")) {
          return !assignee || filters.assignedTo.includes(assignee);
        }
        return assignee && filters.assignedTo.includes(assignee);
      });
    }

    // Apply date filters
    if (filters.createdDateFrom || filters.createdDateTo) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.createdAt || task.created_at);
        if (filters.createdDateFrom && taskDate < filters.createdDateFrom)
          return false;
        if (filters.createdDateTo && taskDate > filters.createdDateTo)
          return false;
        return true;
      });
    }

    if (filters.updatedDateFrom || filters.updatedDateTo) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.updatedAt || task.updated_at);
        if (filters.updatedDateFrom && taskDate < filters.updatedDateFrom)
          return false;
        if (filters.updatedDateTo && taskDate > filters.updatedDateTo)
          return false;
        return true;
      });
    }

    return filtered;
  }, [tasks]);

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) {
      return tasks;
    }
    return applyFilters(activeFilters, tasks);
  }, [tasks, activeFilters, applyFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).some((key) =>
      Array.isArray(activeFilters[key]) 
        ? activeFilters[key].length > 0 
        : activeFilters[key]
    );
  }, [activeFilters]);

  // Handle filter changes
  const handleFiltersChange = useCallback((filters) => {
    setActiveFilters(filters);
    setShowFilters(
      Object.keys(filters).some((key) =>
        Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key]
      )
    );
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setShowFilters(false);
  }, []);

  // Get filter summary
  const filterSummary = useMemo(() => {
    const summary = [];
    
    if (activeFilters.searchTerm) {
      summary.push(`Search: "${activeFilters.searchTerm}"`);
    }
    
    if (activeFilters.status?.length > 0) {
      summary.push(`Status: ${activeFilters.status.join(', ')}`);
    }
    
    if (activeFilters.severity?.length > 0) {
      summary.push(`Priority: ${activeFilters.severity.join(', ')}`);
    }
    
    if (activeFilters.tags?.length > 0) {
      summary.push(`Tags: ${activeFilters.tags.join(', ')}`);
    }
    
    if (activeFilters.assignedTo?.length > 0) {
      summary.push(`Assignee: ${activeFilters.assignedTo.join(', ')}`);
    }
    
    return summary;
  }, [activeFilters]);

  return {
    // State
    activeFilters,
    filteredTasks,
    showFilters,
    hasActiveFilters,
    filterSummary,
    
    // Actions
    handleFiltersChange,
    clearFilters,
    applyFilters,
    
    // Setters (for advanced use cases)
    setActiveFilters,
    setShowFilters
  };
};

export default useTaskFiltering;
