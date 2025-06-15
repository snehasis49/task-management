#!/usr/bin/env python3
"""
Log monitoring script for Task Management API
Usage: python scripts/monitor_logs.py [log_type] [--tail] [--search term]
"""

import argparse
import time
import os
from pathlib import Path
from datetime import datetime
import sys

def tail_file(file_path, lines=10):
    """Tail a file and return last N lines"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            all_lines = f.readlines()
            return all_lines[-lines:] if len(all_lines) > lines else all_lines
    except FileNotFoundError:
        return [f"Log file not found: {file_path}\n"]
    except Exception as e:
        return [f"Error reading file: {e}\n"]

def follow_file(file_path, search_term=None):
    """Follow a file like 'tail -f'"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            # Go to end of file
            f.seek(0, 2)
            
            print(f"Following {file_path} (Press Ctrl+C to stop)")
            print("-" * 50)
            
            while True:
                line = f.readline()
                if line:
                    if search_term is None or search_term.lower() in line.lower():
                        print(line.rstrip())
                else:
                    time.sleep(0.1)
                    
    except KeyboardInterrupt:
        print("\nStopped following log file.")
    except FileNotFoundError:
        print(f"Log file not found: {file_path}")
    except Exception as e:
        print(f"Error following file: {e}")

def show_log_stats():
    """Show statistics for all log files"""
    log_dir = Path("logs")
    if not log_dir.exists():
        print("No logs directory found.")
        return
    
    today = datetime.now().strftime('%Y-%m-%d')
    log_types = ['app', 'error', 'access', 'database', 'auth']
    
    print(f"Log Statistics for {today}")
    print("=" * 50)
    
    for log_type in log_types:
        log_file = log_dir / f"{log_type}-{today}.log"
        
        if log_file.exists():
            stat = log_file.stat()
            with open(log_file, 'r', encoding='utf-8') as f:
                lines = len(f.readlines())
            
            print(f"{log_type.upper():>10}: {lines:>6} lines, {stat.st_size:>8} bytes")
        else:
            print(f"{log_type.upper():>10}: No log file found")

def main():
    parser = argparse.ArgumentParser(description='Monitor Task Management API logs')
    parser.add_argument('log_type', nargs='?', choices=['app', 'error', 'access', 'database', 'auth', 'stats'], 
                       help='Type of log to monitor')
    parser.add_argument('--tail', '-t', action='store_true', help='Follow the log file (like tail -f)')
    parser.add_argument('--lines', '-n', type=int, default=20, help='Number of lines to show (default: 20)')
    parser.add_argument('--search', '-s', type=str, help='Search for specific term')
    parser.add_argument('--date', '-d', type=str, help='Date in YYYY-MM-DD format (default: today)')
    
    args = parser.parse_args()
    
    # Change to backend directory if script is run from project root
    if os.path.exists('backend'):
        os.chdir('backend')
    
    if args.log_type == 'stats' or args.log_type is None:
        show_log_stats()
        return
    
    # Use today's date if not specified
    date = args.date or datetime.now().strftime('%Y-%m-%d')
    
    log_file = Path(f"logs/{args.log_type}-{date}.log")
    
    if not log_file.exists():
        print(f"Log file not found: {log_file}")
        print("Available log files:")
        log_dir = Path("logs")
        if log_dir.exists():
            for file in sorted(log_dir.glob("*.log")):
                print(f"  {file.name}")
        return
    
    if args.tail:
        follow_file(log_file, args.search)
    else:
        lines = tail_file(log_file, args.lines)
        
        if args.search:
            lines = [line for line in lines if args.search.lower() in line.lower()]
        
        print(f"Last {len(lines)} lines from {log_file.name}:")
        print("-" * 50)
        for line in lines:
            print(line.rstrip())

if __name__ == "__main__":
    main()
