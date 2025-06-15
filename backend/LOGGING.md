# Logging System Documentation

## Overview

The Task Management API includes a comprehensive logging system that creates daily log files and automatically manages log retention (keeps logs for the last 7 days).

## Log Files

All log files are stored in the `logs/` directory with the following naming convention:
- `app-YYYY-MM-DD.log` - General application logs
- `error-YYYY-MM-DD.log` - Error logs only
- `access-YYYY-MM-DD.log` - API request/response logs
- `database-YYYY-MM-DD.log` - Database operation logs
- `auth-YYYY-MM-DD.log` - Authentication event logs

## Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for handled exceptions
- **CRITICAL**: Critical errors that may cause application failure

## Log Rotation and Cleanup

- **Daily Rotation**: New log files are created each day
- **Automatic Cleanup**: Logs older than 7 days are automatically deleted on startup
- **Manual Cleanup**: Use the API endpoint `/api/logs/cleanup` to manually trigger cleanup

## Monitoring Logs

### Using the API

1. **List Log Files**:
   ```
   GET /api/logs/files
   ```

2. **View Log Contents**:
   ```
   GET /api/logs/view/{log_type}?date=2024-01-15&lines=100&search=error
   ```

3. **Get Log Statistics**:
   ```
   GET /api/logs/stats
   ```

### Using the Monitor Script

```bash
# Show log statistics
python scripts/monitor_logs.py stats

# View last 20 lines of app log
python scripts/monitor_logs.py app

# Follow error log in real-time
python scripts/monitor_logs.py error --tail

# Search for specific term in access log
python scripts/monitor_logs.py access --search "POST /api/auth/login"

# View specific date
python scripts/monitor_logs.py app --date 2024-01-15 --lines 50
```

### Command Line Examples

```bash
# View recent application logs
tail -f logs/app-2024-01-15.log

# Search for authentication failures
grep "LOGIN.*FAILED" logs/auth-2024-01-15.log

# Monitor API errors
tail -f logs/error-2024-01-15.log

# Check database operations
grep "CREATE_USER\|AUTH_USER" logs/database-2024-01-15.log
```

## Log Content Examples

### Application Log
```
2024-01-15 10:30:15 - INFO - Application startup complete
2024-01-15 10:30:20 - DEBUG - Processing request: POST /api/auth/login
2024-01-15 10:30:21 - ERROR - Database connection failed: Connection timeout
```

### Access Log
```
2024-01-15 10:30:20 - POST /api/auth/login - Status: 200 - Time: 0.145s - User: authenticated
2024-01-15 10:30:25 - GET /api/tasks/ - Status: 200 - Time: 0.089s - User: authenticated
2024-01-15 10:30:30 - POST /api/tasks - Status: 401 - Time: 0.012s - Anonymous
```

### Authentication Log
```
2024-01-15 10:30:20 - LOGIN - user@example.com - SUCCESS - IP: 127.0.0.1 User ID: 507f1f77bcf86cd799439011
2024-01-15 10:30:45 - LOGIN - hacker@evil.com - FAILED - IP: 192.168.1.100 Details: Invalid credentials
2024-01-15 10:31:00 - REGISTER - newuser@example.com - SUCCESS - IP: 127.0.0.1 User ID: 507f1f77bcf86cd799439012
```

### Database Log
```
2024-01-15 10:30:20 - AUTH_USER on users - Query: {'email': 'user@example.com'} Results: 1 Time: 0.023s
2024-01-15 10:30:25 - GET_TASKS on tasks - Results: 15 Time: 0.045s
2024-01-15 10:30:30 - CREATE_TASK on tasks - Query: {'title': 'New Task'} Results: 1 Time: 0.034s
```

## Configuration

The logging system is configured in `app/core/logging_config.py`:

- **Log Directory**: `logs/` (created automatically)
- **Retention Period**: 7 days (configurable in `cleanup_old_logs()`)
- **Log Format**: Timestamp, logger name, level, filename:line, function, message
- **Encoding**: UTF-8

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure the application has write permissions to the `logs/` directory
2. **Disk Space**: Monitor disk usage as logs can grow large with high traffic
3. **Log Rotation**: If logs aren't rotating, check the date format and file naming

### Debugging

1. Check if logs directory exists and is writable
2. Verify log file permissions
3. Monitor log file sizes and cleanup frequency
4. Check for any errors in the main application log

## Security Considerations

- Log files may contain sensitive information (IP addresses, user emails)
- Ensure proper file permissions on the logs directory
- Consider log encryption for production environments
- Regularly review and audit log access

## Performance Impact

- Logging is asynchronous where possible
- File I/O is optimized for minimal performance impact
- Log cleanup runs only on startup to avoid runtime overhead
- Consider log aggregation services for high-traffic applications
