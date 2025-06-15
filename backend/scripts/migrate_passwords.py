#!/usr/bin/env python3
"""
Password migration script for Task Management API
This script migrates old Werkzeug password hashes to bcrypt
"""

import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.database.connection import connect_to_mongo, get_database
from app.auth.security import get_password_hash
from werkzeug.security import check_password_hash
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def is_werkzeug_hash(password_hash: str) -> bool:
    """Check if a password hash is in Werkzeug format"""
    # Werkzeug hashes typically start with method$salt$hash or pbkdf2:sha256:...
    return (
        password_hash.startswith('pbkdf2:') or 
        password_hash.startswith('scrypt:') or
        '$' in password_hash
    )


def migrate_user_passwords():
    """Migrate all user passwords from Werkzeug to bcrypt format"""
    try:
        # Connect to database
        connect_to_mongo()
        db = get_database()
        users_collection = db.users
        
        # Find all users
        users = list(users_collection.find({}))
        logger.info(f"Found {len(users)} users to check")
        
        migrated_count = 0
        skipped_count = 0
        
        for user in users:
            user_id = user['_id']
            email = user['email']
            current_hash = user['password']
            
            # Check if this is a Werkzeug hash that needs migration
            if is_werkzeug_hash(current_hash):
                logger.info(f"Migrating password for user: {email}")
                
                # For migration, we'll need to prompt for the password or use a default
                # In a real scenario, you'd either:
                # 1. Force users to reset their passwords
                # 2. Have them re-enter their password during migration
                # 3. Use a temporary password
                
                # For this demo, we'll mark these users as needing password reset
                users_collection.update_one(
                    {'_id': user_id},
                    {
                        '$set': {
                            'password_migration_needed': True,
                            'old_password_hash': current_hash
                        }
                    }
                )
                migrated_count += 1
                logger.info(f"Marked user {email} for password reset")
                
            else:
                logger.debug(f"User {email} already has bcrypt hash, skipping")
                skipped_count += 1
        
        logger.info(f"Migration complete: {migrated_count} users marked for password reset, {skipped_count} users skipped")
        
        if migrated_count > 0:
            logger.info("Users with old password hashes have been marked for password reset.")
            logger.info("They will need to reset their passwords on next login.")
        
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        raise


def reset_user_password(email: str, new_password: str):
    """Reset a specific user's password to bcrypt format"""
    try:
        connect_to_mongo()
        db = get_database()
        users_collection = db.users
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            logger.error(f"User {email} not found")
            return False
        
        # Hash new password with bcrypt
        new_hash = get_password_hash(new_password)
        
        # Update user
        result = users_collection.update_one(
            {'email': email},
            {
                '$set': {
                    'password': new_hash
                },
                '$unset': {
                    'password_migration_needed': '',
                    'old_password_hash': ''
                }
            }
        )
        
        if result.modified_count > 0:
            logger.info(f"Password reset successful for user: {email}")
            return True
        else:
            logger.error(f"Failed to reset password for user: {email}")
            return False
            
    except Exception as e:
        logger.error(f"Error resetting password for {email}: {e}")
        return False


def create_test_user():
    """Create a test user with bcrypt password for testing"""
    try:
        connect_to_mongo()
        db = get_database()
        users_collection = db.users
        
        test_email = "test@example.com"
        test_password = "password123"
        
        # Check if test user already exists
        if users_collection.find_one({'email': test_email}):
            logger.info(f"Test user {test_email} already exists")
            return
        
        # Create test user
        from datetime import datetime
        user_data = {
            'name': 'Test User',
            'email': test_email,
            'password': get_password_hash(test_password),
            'created_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_data)
        logger.info(f"Created test user: {test_email} with password: {test_password}")
        logger.info(f"User ID: {result.inserted_id}")
        
    except Exception as e:
        logger.error(f"Error creating test user: {e}")


def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Password migration utility')
    parser.add_argument('action', choices=['migrate', 'reset', 'create-test'], 
                       help='Action to perform')
    parser.add_argument('--email', help='Email for reset action')
    parser.add_argument('--password', help='New password for reset action')
    
    args = parser.parse_args()
    
    if args.action == 'migrate':
        migrate_user_passwords()
    elif args.action == 'reset':
        if not args.email or not args.password:
            logger.error("Email and password are required for reset action")
            sys.exit(1)
        reset_user_password(args.email, args.password)
    elif args.action == 'create-test':
        create_test_user()


if __name__ == "__main__":
    main()
