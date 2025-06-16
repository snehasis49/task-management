import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import {
  Search,
  Clear,
  AutoAwesome,
  TrendingUp,
  FilterList,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { tasksAPI } from '../utils/api';
import { toast } from 'react-toastify';

const SearchBar = ({ 
  onSearchResults, 
  onSearchChange, 
  placeholder = "Search tasks with AI-powered semantic search...",
  showSuggestions = true,
  searchType = "intelligent" 
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [enhancedQuery, setEnhancedQuery] = useState('');
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('taskSearchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // Keep only last 5 searches
  }, []);

  useEffect(() => {
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 500);
    } else if (query.trim().length === 0) {
      // Clear results when query is empty
      onSearchResults([]);
      setSuggestions([]);
      setEnhancedQuery('');
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, searchType]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await tasksAPI.searchTasks({
        query: searchQuery,
        limit: 50,
        search_type: searchType
      });

      const searchData = response.data;
      
      // Update search results
      onSearchResults(searchData.results || []);
      
      // Update suggestions and enhanced query
      setSuggestions(searchData.suggestions || []);
      setEnhancedQuery(searchData.enhanced_query || searchQuery);
      
      // Save to search history
      saveToSearchHistory(searchQuery);
      
      // Notify parent component
      if (onSearchChange) {
        onSearchChange({
          query: searchQuery,
          enhancedQuery: searchData.enhanced_query,
          totalResults: searchData.total_results,
          searchType: searchData.search_type
        });
      }

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const saveToSearchHistory = (searchQuery) => {
    const history = JSON.parse(localStorage.getItem('taskSearchHistory') || '[]');
    const updatedHistory = [
      searchQuery,
      ...history.filter(item => item !== searchQuery)
    ].slice(0, 5);
    
    localStorage.setItem('taskSearchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
  };

  const handleClearSearch = () => {
    setQuery('');
    onSearchResults([]);
    setSuggestions([]);
    setEnhancedQuery('');
    setShowSuggestionsList(false);
    if (onSearchChange) {
      onSearchChange({ query: '', enhancedQuery: '', totalResults: 0 });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const newQuery = query ? `${query} ${suggestion}` : suggestion;
    setQuery(newQuery);
    setShowSuggestionsList(false);
    performSearch(newQuery);
  };

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem);
    setShowSuggestionsList(false);
    performSearch(historyItem);
  };

  const handleInputFocus = () => {
    if (showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)) {
      setShowSuggestionsList(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch(query);
      setShowSuggestionsList(false);
    } else if (event.key === 'Escape') {
      setShowSuggestionsList(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestionsList(false)}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          ref={searchInputRef}
          fullWidth
          value={query}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Search color="action" />
                )}
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                  aria-label="clear search"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
          }}
        />

        {/* Enhanced Query Display */}
        {enhancedQuery && enhancedQuery !== query && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">
              AI Enhanced: "{enhancedQuery}"
            </Typography>
          </Box>
        )}

        {/* Suggestions and History Dropdown */}
        {showSuggestionsList && showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUp sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="subtitle2" color="primary.main">
                    AI Suggestions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
              <Box sx={{ p: 2, borderTop: suggestions.length > 0 ? `1px solid ${theme.palette.divider}` : 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FilterList sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Recent Searches
                  </Typography>
                </Box>
                <List dense>
                  {searchHistory.map((historyItem, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleHistoryClick(historyItem)}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemText
                        primary={historyItem}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
