from fastapi import APIRouter, HTTPException, status, Depends, Request
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.services.user_service import user_service
from app.auth.security import create_access_token, verify_token
from app.models.user import TokenData
from app.core.logging_config import log_auth_event

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=dict)
async def register(user_data: UserCreate, request: Request):
    """Register a new user"""
    client_ip = getattr(request.client, 'host', 'unknown') if request.client else 'unknown'

    try:
        user = await user_service.create_user(user_data)

        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})

        # Log successful registration
        log_auth_event("REGISTER", user_data.email, True, client_ip, f"User ID: {user.id}")

        return {
            "message": "User created successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }
    except ValueError as e:
        # Log failed registration
        log_auth_event("REGISTER", user_data.email, False, client_ip, str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Log failed registration
        log_auth_event("REGISTER", user_data.email, False, client_ip, "Internal server error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/login", response_model=dict)
async def login(user_data: UserLogin, request: Request):
    """Login user"""
    client_ip = getattr(request.client, 'host', 'unknown') if request.client else 'unknown'

    user = await user_service.authenticate_user(user_data.email, user_data.password)

    if not user:
        # Log failed login
        log_auth_event("LOGIN", user_data.email, False, client_ip, "Invalid credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    # Log successful login
    log_auth_event("LOGIN", user_data.email, True, client_ip, f"User ID: {user.id}")

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user(token_data: TokenData = Depends(verify_token)):
    """Get current user information"""
    user = await user_service.get_user_by_id(token_data.user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
