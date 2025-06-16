from typing import List, Dict, Any, Optional, Tuple
import logging
import re
from datetime import datetime
from bson import ObjectId
from app.database.connection import get_database
from app.services.embedding_service import embedding_service
from app.services.ai_service import ai_service
from app.models.task import TaskResponse
from langchain_core.messages import HumanMessage, SystemMessage

logger = logging.getLogger(__name__)


class SearchService:
    def __init__(self):
        self.db = None
        self.collection = None

    def _get_collection(self):
        if self.collection is None:
            self.db = get_database()
            self.collection = self.db.tasks
        return self.collection

    async def semantic_search(
        self, 
        query: str, 
        limit: int = 20,
        similarity_threshold: float = 0.3,
        user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Perform semantic search using embeddings"""
        try:
            # Generate query embedding
            query_embedding = await embedding_service.generate_query_embedding(query)
            if not query_embedding:
                logger.warning("Could not generate query embedding, falling back to keyword search")
                return await self.keyword_search(query, limit, user_id)

            # Get all tasks with embeddings
            collection = self._get_collection()
            
            # Build base query
            base_query = {"embedding": {"$exists": True, "$ne": None}}
            if user_id:
                base_query["created_by"] = user_id

            tasks = list(collection.find(base_query))
            
            if not tasks:
                return []

            # Calculate similarities
            scored_tasks = []
            for task in tasks:
                if "embedding" in task and task["embedding"]:
                    similarity = embedding_service.calculate_similarity(
                        query_embedding, 
                        task["embedding"]
                    )
                    
                    if similarity >= similarity_threshold:
                        task["_id"] = str(task["_id"])
                        task["similarity_score"] = similarity
                        scored_tasks.append(task)

            # Sort by similarity score (descending)
            scored_tasks.sort(key=lambda x: x["similarity_score"], reverse=True)
            
            # Return top results
            return scored_tasks[:limit]

        except Exception as e:
            logger.error(f"Error in semantic search: {e}")
            return await self.keyword_search(query, limit, user_id)

    async def keyword_search(
        self, 
        query: str, 
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Perform traditional keyword search as fallback"""
        try:
            collection = self._get_collection()
            
            # Build search query
            search_terms = query.strip().split()
            if not search_terms:
                return []

            # Create regex patterns for case-insensitive search
            regex_patterns = [{"$regex": term, "$options": "i"} for term in search_terms]
            
            # Build MongoDB query
            search_query = {
                "$or": [
                    {"title": {"$in": regex_patterns}},
                    {"description": {"$in": regex_patterns}},
                    {"tags": {"$in": search_terms}}
                ]
            }
            
            if user_id:
                search_query["created_by"] = user_id

            # Execute search
            tasks = list(collection.find(search_query).sort("created_at", -1).limit(limit))
            
            # Convert ObjectId to string and add basic relevance scoring
            for task in tasks:
                task["_id"] = str(task["_id"])
                task["similarity_score"] = self._calculate_keyword_relevance(task, search_terms)

            # Sort by relevance score
            tasks.sort(key=lambda x: x.get("similarity_score", 0), reverse=True)
            
            return tasks

        except Exception as e:
            logger.error(f"Error in keyword search: {e}")
            return []

    def _calculate_keyword_relevance(self, task: Dict[str, Any], search_terms: List[str]) -> float:
        """Calculate relevance score for keyword search"""
        score = 0.0
        
        title = task.get("title", "").lower()
        description = task.get("description", "").lower()
        tags = [tag.lower() for tag in task.get("tags", [])]
        
        for term in search_terms:
            term_lower = term.lower()
            
            # Title matches get highest score
            if term_lower in title:
                score += 3.0
            
            # Tag matches get medium score
            if term_lower in tags:
                score += 2.0
            
            # Description matches get lower score
            if term_lower in description:
                score += 1.0
        
        return score

    async def hybrid_search(
        self, 
        query: str, 
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Combine semantic and keyword search for best results"""
        try:
            # Perform both searches
            semantic_results = await self.semantic_search(query, limit * 2, 0.2, user_id)
            keyword_results = await self.keyword_search(query, limit * 2, user_id)
            
            # Combine and deduplicate results
            combined_results = {}
            
            # Add semantic results with higher weight
            for task in semantic_results:
                task_id = task["_id"]
                task["final_score"] = task.get("similarity_score", 0) * 0.7  # 70% weight
                combined_results[task_id] = task
            
            # Add keyword results with lower weight, boost if already exists
            for task in keyword_results:
                task_id = task["_id"]
                keyword_score = task.get("similarity_score", 0) * 0.3  # 30% weight
                
                if task_id in combined_results:
                    # Boost existing result
                    combined_results[task_id]["final_score"] += keyword_score
                else:
                    # Add new result
                    task["final_score"] = keyword_score
                    combined_results[task_id] = task
            
            # Sort by final score and return top results
            final_results = list(combined_results.values())
            final_results.sort(key=lambda x: x.get("final_score", 0), reverse=True)
            
            return final_results[:limit]

        except Exception as e:
            logger.error(f"Error in hybrid search: {e}")
            return await self.keyword_search(query, limit, user_id)

    async def intelligent_search(
        self, 
        query: str, 
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """AI-enhanced search with query understanding and suggestions"""
        try:
            # Enhance query using AI
            enhanced_query = await self._enhance_query_with_ai(query)
            
            # Perform hybrid search
            results = await self.hybrid_search(enhanced_query, limit, user_id)
            
            # Generate search suggestions
            suggestions = await self._generate_search_suggestions(query, results)
            
            return {
                "results": results,
                "enhanced_query": enhanced_query,
                "suggestions": suggestions,
                "total_results": len(results)
            }

        except Exception as e:
            logger.error(f"Error in intelligent search: {e}")
            # Fallback to basic hybrid search
            results = await self.hybrid_search(query, limit, user_id)
            return {
                "results": results,
                "enhanced_query": query,
                "suggestions": [],
                "total_results": len(results)
            }

    async def _enhance_query_with_ai(self, query: str) -> str:
        """Use AI to enhance and expand the search query"""
        if not ai_service.llm:
            return query

        try:
            system_message = SystemMessage(content="""You are a search query enhancement expert. 
Your task is to improve search queries for a task management system.

Enhance the query by:
1. Adding relevant synonyms and related terms
2. Expanding abbreviations
3. Including technical terms that might be relevant
4. Maintaining the original intent

Return ONLY the enhanced query, nothing else.""")

            human_message = HumanMessage(content=f"""Enhance this search query for better task search results:

Original query: "{query}"

Enhanced query:""")

            response = await ai_service.llm.ainvoke([system_message, human_message])
            enhanced = response.content.strip()
            
            # Clean up the response
            if enhanced and len(enhanced) > 0 and len(enhanced) < 200:
                return enhanced
            else:
                return query

        except Exception as e:
            logger.error(f"Error enhancing query with AI: {e}")
            return query

    async def _generate_search_suggestions(
        self, 
        original_query: str, 
        results: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate search suggestions based on results"""
        suggestions = []
        
        try:
            # Extract common tags from results
            tag_frequency = {}
            for task in results[:10]:  # Only look at top 10 results
                for tag in task.get("tags", []):
                    tag_frequency[tag] = tag_frequency.get(tag, 0) + 1
            
            # Get most common tags as suggestions
            common_tags = sorted(tag_frequency.items(), key=lambda x: x[1], reverse=True)
            for tag, _ in common_tags[:5]:
                if tag.lower() not in original_query.lower():
                    suggestions.append(tag)
            
            # Add some predefined suggestions based on query content
            query_lower = original_query.lower()
            if "bug" in query_lower and "critical" not in query_lower:
                suggestions.append("critical")
            if "feature" in query_lower and "enhancement" not in query_lower:
                suggestions.append("enhancement")
            if "ui" in query_lower and "frontend" not in query_lower:
                suggestions.append("frontend")
            
        except Exception as e:
            logger.error(f"Error generating search suggestions: {e}")
        
        return suggestions[:5]  # Return max 5 suggestions


# Singleton instance
search_service = SearchService()
