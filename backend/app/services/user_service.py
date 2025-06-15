from typing import Optional
from bson import ObjectId
from datetime import datetime
import time
from app.database.connection import get_database
from app.models.user import UserCreate, UserInDB, UserResponse
from app.auth.security import get_password_hash, verify_password
from app.core.logging_config import log_database_operation


class UserService:
    def __init__(self):
        self.db = None
        self.collection = None

    def _get_collection(self):
        if self.collection is None:
            self.db = get_database()
            self.collection = self.db.users
        return self.collection

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Create a new user"""
        collection = self._get_collection()
        start_time = time.time()

        # Check if user already exists
        existing_user = collection.find_one({"email": user_data.email})
        if existing_user:
            log_database_operation("FIND_USER", "users", {"email": user_data.email}, 1, time.time() - start_time)
            raise ValueError("User with this email already exists")

        # Hash password and create user
        hashed_password = get_password_hash(user_data.password)
        user_dict = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }

        result = collection.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)

        execution_time = time.time() - start_time
        log_database_operation("CREATE_USER", "users", {"email": user_data.email}, 1, execution_time)

        return UserInDB(**user_dict)

    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Authenticate user with email and password"""
        collection = self._get_collection()
        start_time = time.time()

        user = collection.find_one({"email": email})
        execution_time = time.time() - start_time

        if not user:
            log_database_operation("AUTH_USER", "users", {"email": email}, 0, execution_time)
            return None

        if not verify_password(password, user["password"]):
            log_database_operation("AUTH_USER", "users", {"email": email}, 1, execution_time)
            return None

        user["_id"] = str(user["_id"])
        log_database_operation("AUTH_USER", "users", {"email": email}, 1, execution_time)
        return UserInDB(**user)

    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID"""
        try:
            from bson import ObjectId
            collection = self._get_collection()
            user = collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
                return UserResponse(**user)
            return None
        except Exception:
            return None

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get user by email"""
        collection = self._get_collection()
        user = collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None

    async def get_all_users(self) -> list[UserResponse]:
        """Get all users (for assignment dropdown)"""
        collection = self._get_collection()
        users = list(collection.find({}, {"password": 0}))
        for user in users:
            user["_id"] = str(user["_id"])
        return [UserResponse(**user) for user in users]


# Singleton instance
user_service = UserService()
