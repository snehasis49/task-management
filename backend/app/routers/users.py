from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.user import UserResponse, TokenData
from app.services.user_service import user_service
from app.auth.security import verify_token

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserResponse])
async def get_users(token_data: TokenData = Depends(verify_token)):
    """Get all users for assignment dropdown"""
    try:
        users = await user_service.get_all_users()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )
