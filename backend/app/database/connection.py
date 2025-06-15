from pymongo import MongoClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)
db_logger = logging.getLogger("database")


class Database:
    client: MongoClient = None
    database = None


db = Database()


def get_database():
    return db.database


def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = MongoClient(settings.mongo_uri)
        db.database = db.client.get_default_database()

        # Test the connection
        db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        db_logger.info(f"Database connection established to: {settings.mongo_uri}")

    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        db_logger.error(f"Failed to connect to MongoDB: {e}")
        raise


def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")
        db_logger.info("Database connection closed")
