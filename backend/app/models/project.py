from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .role import UserRole


class ProjectStatus(str, Enum):
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectMember(BaseModel):
    user_id: str
    role: UserRole
    joined_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    status: ProjectStatus = Field(default=ProjectStatus.ACTIVE)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None


class ProjectResponse(ProjectBase):
    id: str = Field(alias="_id")
    created_by: str
    created_at: datetime
    updated_at: datetime
    members: List[ProjectMember]

    class Config:
        populate_by_name = True


class ProjectMemberUpdate(BaseModel):
    role: UserRole
