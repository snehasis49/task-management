import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Add, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tasksAPI } from "../utils/api";
import {
  PageHeader,
  SearchAndFilterSection,
  TaskDisplaySection,
  PageLoadingSkeleton,
  useTaskFiltering
} from "../components/common";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchInfo, setSearchInfo] = useState(null);

  // Use the custom filtering hook
  const {
    filteredTasks,
    showFilters,
    handleFiltersChange
  } = useTaskFiltering(recentBugs);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, []); // Only run on mount

  const fetchDashboardData = async () => {
    try {
      const response = await tasksAPI.getTasks();
      const bugs = response.data;

      setRecentBugs(bugs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleSearchChange = (searchData) => {
    setSearchInfo(searchData);
  };

  if (loading) {
    return (
      <PageLoadingSkeleton
        showHeader={true}
        showSearch={true}
        showKanban={true}
      />
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", width: "100%" }}>
      {/* Header */}
      <PageHeader
        title="Task Management Dashboard"
        subtitle="Professional Project Management System"
        description="Monitor, track, and complete tasks efficiently"
        actions={[
          {
            label: "Create New Task",
            icon: <Add />,
            onClick: () => navigate("/bugs/new"),
            variant: "contained"
          },
          {
            label: "View All Tasks",
            icon: <Assignment />,
            onClick: () => navigate("/bugs"),
            variant: "outlined"
          }
        ]}
      />

      {/* AI-Powered Search and Filters */}
      <SearchAndFilterSection
        onSearchResults={handleSearchResults}
        onSearchChange={handleSearchChange}
        tasks={recentBugs}
        onFiltersChange={handleFiltersChange}
        searchInfo={searchInfo}
      />

      {/* Task Display */}
      <TaskDisplaySection
        tasks={showFilters ? filteredTasks : recentBugs}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        viewMode="kanban"
        title={showSearchResults
          ? "🔍 AI Search Results"
          : `📋 Task Board${showFilters ? ` (Filtered: ${filteredTasks.length} tasks)` : ""}`
        }
        onTaskUpdate={fetchDashboardData}
        onCreateTask={() => navigate("/bugs/new")}
        loading={loading}
        emptyStateConfig={{
          title: "No tasks found",
          description: "Create your first task to get started",
          action: {
            label: "Create First Task",
            icon: <Add />,
            onClick: () => navigate("/bugs/new")
          }
        }}
        searchEmptyStateConfig={{
          title: "No search results found",
          description: "Try different keywords or check the task board below"
        }}
      />
    </Box>
  );
};

export default Dashboard;
