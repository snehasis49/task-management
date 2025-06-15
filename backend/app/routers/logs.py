from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
import os
from pathlib import Path
from datetime import datetime, timedelta
import glob
from app.models.user import TokenData
from app.auth.security import verify_token

router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("/files")
async def list_log_files(token_data: TokenData = Depends(verify_token)):
    """List available log files"""
    try:
        log_dir = Path("logs")
        if not log_dir.exists():
            return {"files": []}
        
        log_files = []
        patterns = ['app-*.log', 'error-*.log', 'access-*.log', 'database-*.log', 'auth-*.log']
        
        for pattern in patterns:
            files = glob.glob(str(log_dir / pattern))
            for file_path in files:
                file_info = Path(file_path)
                stat = file_info.stat()
                log_files.append({
                    "name": file_info.name,
                    "type": file_info.name.split('-')[0],
                    "date": file_info.name.split('-')[1].replace('.log', ''),
                    "size": stat.st_size,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
                })
        
        # Sort by date descending
        log_files.sort(key=lambda x: x['date'], reverse=True)
        
        return {"files": log_files}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing log files: {str(e)}"
        )


@router.get("/view/{log_type}")
async def view_log(
    log_type: str,
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    lines: int = Query(100, description="Number of lines to return"),
    search: Optional[str] = Query(None, description="Search term"),
    token_data: TokenData = Depends(verify_token)
):
    """View log file contents"""
    try:
        # Validate log type
        valid_types = ['app', 'error', 'access', 'database', 'auth']
        if log_type not in valid_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid log type. Must be one of: {valid_types}"
            )
        
        # Use today's date if not specified
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        
        # Validate date format
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use YYYY-MM-DD"
            )
        
        log_file = Path(f"logs/{log_type}-{date}.log")
        
        if not log_file.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Log file not found: {log_file.name}"
            )
        
        # Read log file
        with open(log_file, 'r', encoding='utf-8') as f:
            all_lines = f.readlines()
        
        # Filter by search term if provided
        if search:
            all_lines = [line for line in all_lines if search.lower() in line.lower()]
        
        # Get last N lines
        log_lines = all_lines[-lines:] if len(all_lines) > lines else all_lines
        
        return {
            "file": log_file.name,
            "total_lines": len(all_lines),
            "returned_lines": len(log_lines),
            "lines": [line.rstrip() for line in log_lines]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading log file: {str(e)}"
        )


@router.get("/stats")
async def log_stats(token_data: TokenData = Depends(verify_token)):
    """Get log statistics"""
    try:
        log_dir = Path("logs")
        if not log_dir.exists():
            return {"stats": {}}
        
        stats = {}
        today = datetime.now().strftime('%Y-%m-%d')
        
        log_types = ['app', 'error', 'access', 'database', 'auth']
        
        for log_type in log_types:
            log_file = log_dir / f"{log_type}-{today}.log"
            
            if log_file.exists():
                with open(log_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                stats[log_type] = {
                    "total_lines": len(lines),
                    "file_size": log_file.stat().st_size,
                    "last_modified": datetime.fromtimestamp(log_file.stat().st_mtime).isoformat()
                }
                
                # Count log levels for app and error logs
                if log_type in ['app', 'error']:
                    levels = {'DEBUG': 0, 'INFO': 0, 'WARNING': 0, 'ERROR': 0, 'CRITICAL': 0}
                    for line in lines:
                        for level in levels.keys():
                            if f" - {level} - " in line:
                                levels[level] += 1
                                break
                    stats[log_type]['levels'] = levels
            else:
                stats[log_type] = {
                    "total_lines": 0,
                    "file_size": 0,
                    "last_modified": None
                }
        
        return {"stats": stats, "date": today}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting log stats: {str(e)}"
        )


@router.delete("/cleanup")
async def cleanup_logs(
    days: int = Query(7, description="Keep logs for this many days"),
    token_data: TokenData = Depends(verify_token)
):
    """Manually trigger log cleanup"""
    try:
        from app.core.logging_config import cleanup_old_logs
        
        log_dir = Path("logs")
        if not log_dir.exists():
            return {"message": "No logs directory found"}
        
        cleanup_old_logs(log_dir, days)
        
        return {"message": f"Log cleanup completed. Kept logs for last {days} days."}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during log cleanup: {str(e)}"
        )
