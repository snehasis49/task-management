import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import SearchBar from '../SearchBar';
import FilterSection from '../FilterSection';

/**
 * Reusable Search and Filter Section Component
 * Combines SearchBar and FilterSection with consistent styling
 */
const SearchAndFilterSection = ({
  // Search props
  onSearchResults,
  onSearchChange,
  searchPlaceholder = "Search tasks with intelligent semantic understanding...",
  showSuggestions = true,
  searchType = "intelligent",
  
  // Filter props
  tasks = [],
  onFiltersChange,
  showQuickFilters = true,
  compact = true,
  
  // Search info display
  searchInfo,
  
  // Styling
  title = "🔍 AI-Powered Task Search",
  showTitle = true,
  sx = {}
}) => {
  return (
    <Paper sx={{ p: 3, mb: 4, width: "100%", maxWidth: "100%", ...sx }}>
      {/* AI Search Section */}
      <Box sx={{ mb: 4 }}>
        {showTitle && (
          <Typography
            variant="h6"
            fontWeight="600"
            color="primary.main"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>
        )}
        
        <SearchBar
          onSearchResults={onSearchResults}
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
          showSuggestions={showSuggestions}
          searchType={searchType}
        />
        
        {searchInfo && searchInfo.totalResults > 0 && (
          <Box
            sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
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

      {/* Integrated Filter Section */}
      <FilterSection
        tasks={tasks}
        onFiltersChange={onFiltersChange}
        showQuickFilters={showQuickFilters}
        compact={compact}
      />
    </Paper>
  );
};

export default SearchAndFilterSection;
