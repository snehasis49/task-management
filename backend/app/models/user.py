from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .role import UserRole, RoleAssignment


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: Optional[datetime] = None
    roles: List[RoleAssignment] = []
    is_active: bool = True

    class Config:
        populate_by_name = True


class UserInDB(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    password: str
    created_at: datetime
    roles: List[RoleAssignment] = []
    is_active: bool = True

    class Config:
        populate_by_name = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None
