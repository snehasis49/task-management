from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from app.models.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus, TaskSeverity
from app.models.user import TokenData
from app.services.task_service import task_service
from app.auth.security import verify_token

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    token_data: TokenData = Depends(verify_token)
):
    """Create a new task"""
    try:
        task = await task_service.create_task(task_data, token_data.user_id)
        return task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[TaskStatus] = Query(None),
    severity: Optional[TaskSeverity] = Query(None),
    tags: Optional[str] = Query(None),
    token_data: TokenData = Depends(verify_token)
):
    """Get tasks with optional filtering"""
    try:
        tag_list = tags.split(',') if tags else None
        tasks = await task_service.get_tasks(status=status, severity=severity, tags=tag_list)
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tasks"
        )


@router.get("/stats", response_model=dict)
async def get_task_stats(token_data: TokenData = Depends(verify_token)):
    """Get task statistics"""
    try:
        stats = await task_service.get_task_stats()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve task statistics"
        )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Get a specific task"""
    task = await task_service.get_task_by_id(task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    token_data: TokenData = Depends(verify_token)
):
    """Update a task"""
    task = await task_service.update_task(task_id, task_data)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    token_data: TokenData = Depends(verify_token)
):
    """Delete a task"""
    success = await task_service.delete_task(task_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return {"message": "Task deleted successfully"}
