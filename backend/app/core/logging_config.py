import logging
import logging.handlers
import os
from datetime import datetime, timedelta
import glob
from pathlib import Path
from app.core.config import settings


def setup_logging():
    """Setup logging configuration with daily rotation and cleanup"""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Clean up old log files (keep only last 7 days)
    cleanup_old_logs(log_dir)
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(funcName)s() - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Get current date for log file naming
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO if not settings.debug else logging.DEBUG)
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)
    root_logger.addHandler(console_handler)
    
    # Main application log file (daily rotation)
    app_log_file = log_dir / f"app-{current_date}.log"
    app_file_handler = logging.FileHandler(app_log_file, encoding='utf-8')
    app_file_handler.setLevel(logging.DEBUG if settings.debug else logging.INFO)
    app_file_handler.setFormatter(detailed_formatter)
    root_logger.addHandler(app_file_handler)
    
    # Error log file (daily rotation)
    error_log_file = log_dir / f"error-{current_date}.log"
    error_file_handler = logging.FileHandler(error_log_file, encoding='utf-8')
    error_file_handler.setLevel(logging.ERROR)
    error_file_handler.setFormatter(detailed_formatter)
    root_logger.addHandler(error_file_handler)
    
    # Access log file for API requests (daily rotation)
    access_log_file = log_dir / f"access-{current_date}.log"
    access_file_handler = logging.FileHandler(access_log_file, encoding='utf-8')
    access_file_handler.setLevel(logging.INFO)
    access_file_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    ))
    
    # Create access logger
    access_logger = logging.getLogger("access")
    access_logger.setLevel(logging.INFO)
    access_logger.addHandler(access_file_handler)
    access_logger.propagate = False
    
    # Database operations log
    db_log_file = log_dir / f"database-{current_date}.log"
    db_file_handler = logging.FileHandler(db_log_file, encoding='utf-8')
    db_file_handler.setLevel(logging.INFO)
    db_file_handler.setFormatter(detailed_formatter)
    
    # Create database logger
    db_logger = logging.getLogger("database")
    db_logger.setLevel(logging.INFO)
    db_logger.addHandler(db_file_handler)
    db_logger.propagate = False
    
    # Authentication log
    auth_log_file = log_dir / f"auth-{current_date}.log"
    auth_file_handler = logging.FileHandler(auth_log_file, encoding='utf-8')
    auth_file_handler.setLevel(logging.INFO)
    auth_file_handler.setFormatter(detailed_formatter)
    
    # Create auth logger
    auth_logger = logging.getLogger("auth")
    auth_logger.setLevel(logging.INFO)
    auth_logger.addHandler(auth_file_handler)
    auth_logger.propagate = False
    
    logging.info(f"Logging setup complete. Log files created in: {log_dir.absolute()}")
    logging.info(f"Debug mode: {settings.debug}")


def cleanup_old_logs(log_dir: Path, days_to_keep: int = 7):
    """Remove log files older than specified days"""
    try:
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        cutoff_date_str = cutoff_date.strftime('%Y-%m-%d')
        
        # Find all log files
        log_patterns = ['app-*.log', 'error-*.log', 'access-*.log', 'database-*.log', 'auth-*.log']
        
        deleted_count = 0
        for pattern in log_patterns:
            log_files = glob.glob(str(log_dir / pattern))
            
            for log_file in log_files:
                file_path = Path(log_file)
                # Extract date from filename (format: type-YYYY-MM-DD.log)
                try:
                    filename = file_path.stem
                    date_part = filename.split('-', 1)[1]  # Get everything after first dash
                    file_date = datetime.strptime(date_part, '%Y-%m-%d')
                    
                    if file_date < cutoff_date:
                        file_path.unlink()
                        deleted_count += 1
                        logging.info(f"Deleted old log file: {file_path.name}")
                        
                except (ValueError, IndexError) as e:
                    # Skip files that don't match expected format
                    logging.warning(f"Skipping file with unexpected format: {file_path.name}")
                    continue
        
        if deleted_count > 0:
            logging.info(f"Cleaned up {deleted_count} old log files (older than {days_to_keep} days)")
        else:
            logging.info("No old log files to clean up")
            
    except Exception as e:
        logging.error(f"Error during log cleanup: {e}")


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the specified name"""
    return logging.getLogger(name)


# Specialized loggers
def log_api_request(method: str, url: str, status_code: int, response_time: float, user_id: str = None):
    """Log API request details"""
    access_logger = logging.getLogger("access")
    user_info = f"User: {user_id}" if user_id else "Anonymous"
    access_logger.info(f"{method} {url} - Status: {status_code} - Time: {response_time:.3f}s - {user_info}")


def log_auth_event(event_type: str, email: str, success: bool, ip_address: str = None, details: str = None):
    """Log authentication events"""
    auth_logger = logging.getLogger("auth")
    status = "SUCCESS" if success else "FAILED"
    ip_info = f"IP: {ip_address}" if ip_address else ""
    detail_info = f"Details: {details}" if details else ""
    auth_logger.info(f"{event_type} - {email} - {status} - {ip_info} {detail_info}".strip())


def log_database_operation(operation: str, collection: str, query: dict = None, result_count: int = None, execution_time: float = None):
    """Log database operations"""
    db_logger = logging.getLogger("database")
    query_info = f"Query: {query}" if query else ""
    result_info = f"Results: {result_count}" if result_count is not None else ""
    time_info = f"Time: {execution_time:.3f}s" if execution_time else ""
    db_logger.info(f"{operation} on {collection} - {query_info} {result_info} {time_info}".strip())
