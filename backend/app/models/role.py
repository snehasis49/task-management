from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class Permission(str, Enum):
    # Project Permissions
    CREATE_PROJECT = "create_project"
    UPDATE_PROJECT = "update_project"
    DELETE_PROJECT = "delete_project"
    VIEW_PROJECT = "view_project"
    MANAGE_PROJECT_MEMBERS = "manage_project_members"
    
    # Task Permissions
    CREATE_TASK = "create_task"
    UPDATE_TASK = "update_task"
    DELETE_TASK = "delete_task"
    VIEW_TASK = "view_task"
    ASSIGN_TASK = "assign_task"
    
    # User Management Permissions
    MANAGE_USERS = "manage_users"
    MANAGE_ROLES = "manage_roles"
    VIEW_USERS = "view_users"
    
    # Comment Permissions
    ADD_COMMENT = "add_comment"
    DELETE_COMMENT = "delete_comment"


class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    MANAGER = "manager"
    DEVELOPER = "developer"
    TESTER = "tester"


# Define default permissions for each role
ROLE_PERMISSIONS: Dict[UserRole, List[Permission]] = {
    UserRole.SUPER_ADMIN: list(Permission),  # All permissions
    UserRole.MANAGER: [
        Permission.CREATE_PROJECT,
        Permission.UPDATE_PROJECT,
        Permission.VIEW_PROJECT,
        Permission.MANAGE_PROJECT_MEMBERS,
        Permission.CREATE_TASK,
        Permission.UPDATE_TASK,
        Permission.DELETE_TASK,
        Permission.VIEW_TASK,
        Permission.ASSIGN_TASK,
        Permission.VIEW_USERS,
        Permission.ADD_COMMENT,
        Permission.DELETE_COMMENT,
    ],
    UserRole.DEVELOPER: [
        Permission.VIEW_PROJECT,
        Permission.CREATE_TASK,
        Permission.UPDATE_TASK,
        Permission.VIEW_TASK,
        Permission.ADD_COMMENT,
    ],
    UserRole.TESTER: [
        Permission.VIEW_PROJECT,
        Permission.CREATE_TASK,
        Permission.UPDATE_TASK,
        Permission.VIEW_TASK,
        Permission.ADD_COMMENT,
    ]
}


class RoleAssignment(BaseModel):
    role: UserRole
    project_id: Optional[str] = None  # None means global role
    
    class Config:
        populate_by_name = True
