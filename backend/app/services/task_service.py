from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from app.database.connection import get_database
from app.models.task import TaskCreate, TaskUpdate, TaskInDB, TaskResponse, TaskStatus, TaskSeverity
from app.services.ai_service import ai_service


class TaskService:
    def __init__(self):
        self.db = None
        self.collection = None

    def _get_collection(self):
        if self.collection is None:
            self.db = get_database()
            self.collection = self.db.tasks
        return self.collection

    async def create_task(self, task_data: TaskCreate, user_id: str) -> TaskResponse:
        """Create a new task"""
        collection = self._get_collection()

        # Generate AI tags
        ai_tags = await ai_service.generate_tags(task_data.title, task_data.description)

        task_dict = {
            "title": task_data.title,
            "description": task_data.description,
            "severity": task_data.severity,
            "status": task_data.status,
            "assigned_to": task_data.assigned_to,
            "tags": ai_tags,
            "created_by": user_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = collection.insert_one(task_dict)
        task_dict["_id"] = str(result.inserted_id)

        return TaskResponse(**task_dict)

    async def get_task_by_id(self, task_id: str) -> Optional[TaskResponse]:
        """Get task by ID"""
        try:
            from bson import ObjectId
            collection = self._get_collection()
            task = collection.find_one({"_id": ObjectId(task_id)})
            if task:
                task["_id"] = str(task["_id"])
                return TaskResponse(**task)
            return None
        except Exception:
            return None

    async def get_tasks(
        self,
        status: Optional[TaskStatus] = None,
        severity: Optional[TaskSeverity] = None,
        tags: Optional[List[str]] = None
    ) -> List[TaskResponse]:
        """Get tasks with optional filtering"""
        collection = self._get_collection()
        query = {}

        if status:
            query["status"] = status
        if severity:
            query["severity"] = severity
        if tags:
            query["tags"] = {"$in": tags}

        tasks = list(collection.find(query).sort("created_at", -1))
        for task in tasks:
            task["_id"] = str(task["_id"])
        return [TaskResponse(**task) for task in tasks]

    async def update_task(self, task_id: str, task_data: TaskUpdate) -> Optional[TaskResponse]:
        """Update a task"""
        try:
            from bson import ObjectId
            collection = self._get_collection()

            update_data = {
                "updated_at": datetime.utcnow()
            }

            # Only update fields that are provided
            for field, value in task_data.dict(exclude_unset=True).items():
                if value is not None:
                    update_data[field] = value

            result = collection.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": update_data}
            )

            if result.matched_count == 0:
                return None

            updated_task = collection.find_one({"_id": ObjectId(task_id)})
            updated_task["_id"] = str(updated_task["_id"])
            return TaskResponse(**updated_task)

        except Exception:
            return None

    async def delete_task(self, task_id: str) -> bool:
        """Delete a task"""
        try:
            from bson import ObjectId
            collection = self._get_collection()
            result = collection.delete_one({"_id": ObjectId(task_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    async def get_task_stats(self) -> dict:
        """Get task statistics"""
        collection = self._get_collection()
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]

        stats = list(collection.aggregate(pipeline))
        result = {
            "total": 0,
            "open": 0,
            "in_progress": 0,
            "resolved": 0,
            "closed": 0
        }

        for stat in stats:
            status = stat["_id"].lower().replace(" ", "_")
            result[status] = stat["count"]
            result["total"] += stat["count"]

        return result


# Singleton instance
task_service = TaskService()
