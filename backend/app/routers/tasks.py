from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from app.models.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus, TaskSeverity, DescriptionGenerateRequest, DescriptionGenerateResponse, TagGenerateRequest, TagGenerateResponse, SearchRequest, SearchResponse, SearchResult
from app.models.user import TokenData
from app.services.task_service import task_service
from app.services.ai_service import ai_service
from app.services.search_service import search_service
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


@router.get("/search", response_model=SearchResponse)
async def search_tasks(
    query: str = Query(..., min_length=1, max_length=500, description="Search query"),
    limit: int = Query(default=20, ge=1, le=100, description="Maximum number of results"),
    search_type: str = Query(default="intelligent", description="Type of search: keyword, semantic, hybrid, intelligent"),
    token_data: TokenData = Depends(verify_token)
):
    """Search tasks using various search methods including RAG-based semantic search"""
    try:
        if search_type == "semantic":
            results = await search_service.semantic_search(query, limit, user_id=token_data.user_id)
            enhanced_query = query
            suggestions = []
        elif search_type == "keyword":
            results = await search_service.keyword_search(query, limit, user_id=token_data.user_id)
            enhanced_query = query
            suggestions = []
        elif search_type == "hybrid":
            results = await search_service.hybrid_search(query, limit, user_id=token_data.user_id)
            enhanced_query = query
            suggestions = []
        else:  # intelligent
            search_result = await search_service.intelligent_search(query, limit, user_id=token_data.user_id)
            results = search_result["results"]
            enhanced_query = search_result["enhanced_query"]
            suggestions = search_result["suggestions"]

        # Convert results to SearchResult format
        search_results = []
        for task_data in results:
            # Remove embedding from response for performance
            task_data.pop("embedding", None)

            task = TaskResponse(**task_data)
            search_result = SearchResult(
                task=task,
                similarity_score=task_data.get("similarity_score", 0.0),
                final_score=task_data.get("final_score", 0.0)
            )
            search_results.append(search_result)

        return SearchResponse(
            results=search_results,
            enhanced_query=enhanced_query,
            suggestions=suggestions,
            total_results=len(search_results),
            search_type=search_type
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
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


@router.post("/generate-description", response_model=DescriptionGenerateResponse)
async def generate_description(
    request: DescriptionGenerateRequest,
    token_data: TokenData = Depends(verify_token)
):
    """Generate AI-powered description based on task title using LangChain + Groq"""
    try:
        description = await ai_service.generate_description(request.title)

        # Check if AI was used (LangChain ChatGroq client available and description is detailed)
        generated_by_ai = ai_service.llm is not None and len(description) > 200

        return DescriptionGenerateResponse(
            description=description,
            generated_by_ai=generated_by_ai
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate description"
        )


@router.post("/generate-tags", response_model=TagGenerateResponse)
async def generate_tags(
    request: TagGenerateRequest,
    token_data: TokenData = Depends(verify_token)
):
    """Generate AI-powered tags based on task title and description using LangChain + Groq"""
    try:
        tags = await ai_service.generate_tags(request.title, request.description)

        # Check if AI was used (LangChain ChatGroq client available)
        generated_by_ai = ai_service.llm is not None

        return TagGenerateResponse(
            tags=tags,
            generated_by_ai=generated_by_ai
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate tags"
        )



