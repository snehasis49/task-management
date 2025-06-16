import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Skeleton,

  Paper,
  Collapse,
  IconButton,
} from "@mui/material";
import { Grid } from "@mui/system";
import {
  Add,
  Assignment,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tasksAPI } from "../utils/api";
import KanbanBoard from "../components/KanbanBoard";
import SearchBar from "../components/SearchBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchInfo, setSearchInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      <Box sx={{ p: 4, minHeight: "100vh", width: "100%" }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Skeleton variant="text" sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, width: 600, mb: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 400, mb: 2 }} />
          <Skeleton variant="text" sx={{ width: 300, mb: 4 }} />
        </Box>

        {/* Search Bar Skeleton */}
        <Paper sx={{ p: 3, mb: 4, maxWidth: 800, mx: 'auto' }}>
          <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 300, mb: 2 }} />
          <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
        </Paper>

        {/* Kanban Board Skeleton */}
        <Box sx={{ mb: 6 }}>
          <Skeleton variant="text" sx={{ fontSize: "2rem", width: 300, mx: "auto", mb: 4 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((column) => (
              <Grid size={{ xs: 12, md: 3 }} key={column}>
                <Card sx={{ minHeight: 600, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem', flex: 1 }} />
                    <Skeleton variant="rounded" width={30} height={24} />
                  </Box>
                  {[1, 2, 3].map((task) => (
                    <Skeleton
                      key={task}
                      variant="rectangular"
                      height={120}
                      sx={{ mb: 2, borderRadius: 2 }}
                    />
                  ))}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions Skeleton */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4 }}>
          <Skeleton variant="rounded" width={180} height={48} />
          <Skeleton variant="rounded" width={160} height={48} />
        </Box>
      </Box>
    );
  }



  return (
    <Box sx={{ p: 4, minHeight: "100vh", width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="800"
          color="text.primary"
          gutterBottom
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            mb: 2,
          }}
        >
          Task Management Dashboard
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            maxWidth: 600,
            mb: 4,
          }}
        >
          Professional Project Management System
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
          }}
        >
          Monitor, track, and complete tasks efficiently
        </Typography>

        {/* AI-Powered Search */}
        <Paper sx={{ p: 3, mb: 4, width: '100%', maxWidth: '100%' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="600" color="primary.main" sx={{ mb: 2 }}>
              🔍 AI-Powered Task Search
            </Typography>
            <SearchBar
              onSearchResults={handleSearchResults}
              onSearchChange={handleSearchChange}
              placeholder="Search tasks with intelligent semantic understanding..."
              showSuggestions={true}
              searchType="intelligent"
            />
            {searchInfo && searchInfo.totalResults > 0 && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Found {searchInfo.totalResults} results
                </Typography>
                {searchInfo.enhancedQuery !== searchInfo.query && (
                  <Typography variant="body2" color="primary.main">
                    • Enhanced with AI
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Search Results */}
      {showSearchResults && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight="600"
            color="text.primary"
            gutterBottom
            sx={{ mb: 4, textAlign: "center" }}
          >
            🔍 AI Search Results
          </Typography>
          {searchResults.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No search results found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Try different keywords or check the task board below
              </Typography>
            </Box>
          ) : (
            <KanbanBoard
              tasks={searchResults.map(result => result.task)}
              onTaskUpdate={fetchDashboardData}
              loading={false}
            />
          )}
        </Box>
      )}

      {/* Kanban Board */}
      {!showSearchResults && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight="600"
            color="text.primary"
            gutterBottom
            sx={{ mb: 4, textAlign: "center" }}
          >
            📋 Task Board
          </Typography>

          <KanbanBoard
            tasks={recentBugs}
            onTaskUpdate={fetchDashboardData}
            loading={loading}
          />
        </Box>
      )}

      {/* Quick Actions */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate("/bugs/new")}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Create New Task
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Assignment />}
          onClick={() => navigate("/bugs")}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          View All Tasks
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
