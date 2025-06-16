import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Skeleton,
  useTheme,
} from "@mui/material";
import { Grid } from "@mui/system";
import {
  Add,
  CheckCircle,
  ErrorOutline,
  Assignment,
  Timeline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tasksAPI } from "../utils/api";
import KanbanBoard from "../components/KanbanBoard";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    critical: 0,
  });
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await tasksAPI.getTasks();
      const bugs = response.data;

      // Calculate stats
      const newStats = {
        total: bugs.length,
        open: bugs.filter((bug) => bug.status === "Open").length,
        inProgress: bugs.filter((bug) => bug.status === "In Progress").length,
        resolved: bugs.filter((bug) => bug.status === "Resolved").length,
        closed: bugs.filter((bug) => bug.status === "Closed").length,
        critical: bugs.filter((bug) => bug.severity === "Critical").length,
      };

      setStats(newStats);
      setRecentBugs(bugs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "error";
      case "In Progress":
        return "warning";
      case "Resolved":
        return "success";
      case "Closed":
        return "default";
      default:
        return "default";
    }
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

        {/* Stats Cards Skeleton */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
              <Card sx={{ textAlign: "center", p: 3 }}>
                <Skeleton
                  variant="circular"
                  width={64}
                  height={64}
                  sx={{ mx: "auto", mb: 3 }}
                />
                <Skeleton variant="text" sx={{ fontSize: "3rem", mb: 1 }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Card>
            </Grid>
          ))}
        </Grid>

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

  const completionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

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
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Assignment sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight="700"
              color="primary.main"
              sx={{ mb: 1 }}
            >
              {stats.total}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              Total Tasks
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <ErrorOutline sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight="700"
              color="error.main"
              sx={{ mb: 1 }}
            >
              {stats.open}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              Open
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "warning.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Timeline sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight="700"
              color="warning.main"
              sx={{ mb: 1 }}
            >
              {stats.inProgress}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              In Progress
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <CheckCircle sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight="700"
              color="success.main"
              sx={{ mb: 1 }}
            >
              {stats.resolved}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="600">
              Completed
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Kanban Board */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="600"
          color="text.primary"
          gutterBottom
          sx={{ mb: 4, textAlign: "center" }}
        >
          Interactive Task Board
        </Typography>

        <KanbanBoard
          tasks={recentBugs}
          onTaskUpdate={fetchDashboardData}
          loading={loading}
        />
      </Box>

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
