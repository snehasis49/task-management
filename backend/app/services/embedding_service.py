from typing import List, Dict, Any, Optional
import logging
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self):
        self.model = None
        self.executor = ThreadPoolExecutor(max_workers=2)
        self._initialize_model()

    def _initialize_model(self):
        """Initialize the sentence transformer model"""
        try:
            # Use a lightweight but effective model for embeddings
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("SentenceTransformer model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize SentenceTransformer model: {e}")
            self.model = None

    async def generate_task_embedding(self, title: str, description: str, tags: List[str]) -> Optional[List[float]]:
        """Generate embedding for a task combining title, description, and tags"""
        if not self.model:
            logger.warning("SentenceTransformer model not available")
            return None

        try:
            # Combine all text content for embedding
            combined_text = self._prepare_text_for_embedding(title, description, tags)
            
            # Generate embedding asynchronously
            loop = asyncio.get_event_loop()
            embedding = await loop.run_in_executor(
                self.executor, 
                self._generate_embedding_sync, 
                combined_text
            )
            
            return embedding.tolist() if embedding is not None else None
            
        except Exception as e:
            logger.error(f"Error generating task embedding: {e}")
            return None

    def _prepare_text_for_embedding(self, title: str, description: str, tags: List[str]) -> str:
        """Prepare and clean text content for embedding generation"""
        # Clean HTML from description
        import re
        clean_description = re.sub(r'<[^>]+>', ' ', description) if description else ""
        clean_description = re.sub(r'\s+', ' ', clean_description).strip()
        
        # Combine all text with appropriate weights
        combined_parts = []
        
        # Title gets highest weight (repeated 3 times)
        if title:
            combined_parts.extend([title] * 3)
        
        # Description gets medium weight (repeated 2 times)
        if clean_description:
            combined_parts.extend([clean_description] * 2)
        
        # Tags get standard weight
        if tags:
            combined_parts.extend(tags)
        
        return " ".join(combined_parts)

    def _generate_embedding_sync(self, text: str) -> Optional[np.ndarray]:
        """Synchronous embedding generation for use with executor"""
        try:
            if not text.strip():
                return None
            
            embedding = self.model.encode(text, convert_to_tensor=False)
            return embedding
            
        except Exception as e:
            logger.error(f"Error in synchronous embedding generation: {e}")
            return None

    async def generate_query_embedding(self, query: str) -> Optional[List[float]]:
        """Generate embedding for a search query"""
        if not self.model:
            logger.warning("SentenceTransformer model not available")
            return None

        try:
            # Clean and prepare query
            clean_query = query.strip()
            if not clean_query:
                return None
            
            # Generate embedding asynchronously
            loop = asyncio.get_event_loop()
            embedding = await loop.run_in_executor(
                self.executor, 
                self._generate_embedding_sync, 
                clean_query
            )
            
            return embedding.tolist() if embedding is not None else None
            
        except Exception as e:
            logger.error(f"Error generating query embedding: {e}")
            return None

    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings"""
        try:
            if not embedding1 or not embedding2:
                return 0.0
            
            # Convert to numpy arrays
            emb1 = np.array(embedding1).reshape(1, -1)
            emb2 = np.array(embedding2).reshape(1, -1)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(emb1, emb2)[0][0]
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0

    async def batch_generate_embeddings(self, texts: List[str]) -> List[Optional[List[float]]]:
        """Generate embeddings for multiple texts in batch"""
        if not self.model:
            logger.warning("SentenceTransformer model not available")
            return [None] * len(texts)

        try:
            # Filter out empty texts
            valid_texts = [(i, text) for i, text in enumerate(texts) if text.strip()]
            
            if not valid_texts:
                return [None] * len(texts)
            
            # Generate embeddings in batch
            loop = asyncio.get_event_loop()
            embeddings = await loop.run_in_executor(
                self.executor,
                self._batch_generate_embeddings_sync,
                [text for _, text in valid_texts]
            )
            
            # Map results back to original positions
            results = [None] * len(texts)
            for (original_idx, _), embedding in zip(valid_texts, embeddings):
                results[original_idx] = embedding.tolist() if embedding is not None else None
            
            return results
            
        except Exception as e:
            logger.error(f"Error in batch embedding generation: {e}")
            return [None] * len(texts)

    def _batch_generate_embeddings_sync(self, texts: List[str]) -> List[Optional[np.ndarray]]:
        """Synchronous batch embedding generation"""
        try:
            embeddings = self.model.encode(texts, convert_to_tensor=False, batch_size=8)
            return [emb for emb in embeddings]
        except Exception as e:
            logger.error(f"Error in synchronous batch embedding generation: {e}")
            return [None] * len(texts)

    def is_available(self) -> bool:
        """Check if the embedding service is available"""
        return self.model is not None


# Singleton instance
embedding_service = EmbeddingService()
