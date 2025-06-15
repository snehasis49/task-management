import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import log_api_request


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all API requests and responses"""
    
    def __init__(self, app):
        super().__init__(app)
        self.logger = logging.getLogger("access")
    
    async def dispatch(self, request: Request, call_next):
        # Start timing
        start_time = time.time()
        
        # Get client IP
        client_ip = self.get_client_ip(request)
        
        # Get user info if available
        user_id = None
        try:
            # Try to extract user from token if present
            auth_header = request.headers.get("authorization")
            if auth_header and auth_header.startswith("Bearer "):
                # You could decode the JWT here to get user info
                # For now, we'll just note that it's an authenticated request
                user_id = "authenticated"
        except Exception:
            pass
        
        # Process the request
        try:
            response = await call_next(request)
            
            # Calculate response time
            process_time = time.time() - start_time
            
            # Log the request
            log_api_request(
                method=request.method,
                url=str(request.url),
                status_code=response.status_code,
                response_time=process_time,
                user_id=user_id
            )
            
            # Add response time header
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            # Calculate response time even for errors
            process_time = time.time() - start_time
            
            # Log the error
            self.logger.error(f"Request failed: {request.method} {request.url} - Error: {str(e)} - Time: {process_time:.3f}s - IP: {client_ip}")
            
            # Re-raise the exception
            raise
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        # Check for forwarded headers first (for reverse proxies)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        # Fall back to direct client IP
        if hasattr(request.client, 'host'):
            return request.client.host
        
        return "unknown"
