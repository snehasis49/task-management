import React from 'react';
import { Box, Skeleton, Card, Paper } from '@mui/material';
import { Grid } from '@mui/system';

/**
 * Reusable Loading Skeleton Components
 */

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Skeleton variant="text" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, width: 600, mb: 2 }} />
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 400, mb: 2 }} />
    <Skeleton variant="text" sx={{ width: 300, mb: 4 }} />
    <Skeleton variant="rounded" width={180} height={48} />
  </Box>
);

// Search Bar Skeleton
export const SearchBarSkeleton = () => (
  <Paper sx={{ p: 3, mb: 4, maxWidth: 800, mx: 'auto' }}>
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 300, mb: 2 }} />
    <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
  </Paper>
);

// Task Card Skeleton
export const TaskCardSkeleton = () => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
    }}
  >
    {/* Header with Avatar and Title */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </Box>

    {/* Description */}
    <Skeleton variant="text" sx={{ mb: 1 }} />
    <Skeleton variant="text" sx={{ width: '80%', mb: 2 }} />

    {/* Footer with Tags and Metadata */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width={50} height={20} />
        <Skeleton variant="rounded" width={60} height={20} />
        <Skeleton variant="rounded" width={40} height={20} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={60} />
      </Box>
    </Box>
  </Paper>
);

// Kanban Board Skeleton
export const KanbanBoardSkeleton = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" sx={{ fontSize: '2rem', width: 300, mx: 'auto', mb: 4 }} />
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
);

// Stats Cards Skeleton
export const StatsCardsSkeleton = ({ count = 4 }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
        <Card sx={{ textAlign: 'center', p: 3 }}>
          <Skeleton variant="text" sx={{ fontSize: '3rem', mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Full Page Loading Skeleton
export const PageLoadingSkeleton = ({ 
  showHeader = true, 
  showSearch = true, 
  showStats = false, 
  showKanban = true,
  showCards = false,
  cardCount = 6 
}) => (
  <Box sx={{ p: 4, minHeight: '100vh', width: '100%' }}>
    {showHeader && <PageHeaderSkeleton />}
    {showSearch && <SearchBarSkeleton />}
    {showStats && <StatsCardsSkeleton />}
    {showKanban && <KanbanBoardSkeleton />}
    {showCards && (
      <Grid container spacing={3}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <Grid xs={12} md={6} lg={4} key={index}>
            <TaskCardSkeleton />
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

export default PageLoadingSkeleton;
