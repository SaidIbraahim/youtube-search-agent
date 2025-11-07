"""FastAPI REST API for YouTube Agent."""

from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .agent import build_universal_chain
from .cache import clear_cache, get_cache_stats
from .config import get_settings

# Detect Vercel environment
import os
VERCEL = os.getenv("VERCEL") == "1"

# For Vercel with Mangum, we need root_path="/api" so FastAPI knows the base path
# This ensures routes like /health work correctly when accessed via /api/health
app = FastAPI(
    title="YouTube Agent API",
    description="Intelligent YouTube interaction system with recursive tool-calling",
    version="2.0.0",
    root_path="/api" if VERCEL else "",
)

# CORS middleware for frontend and Vercel

# Get allowed origins from environment or use defaults
# In production, Vercel sets VERCEL_URL and VERCEL_ENV automatically
# You can also set ALLOWED_ORIGINS explicitly in Vercel environment variables
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
).split(",")

# Add Vercel preview and production URLs if available
FRONTEND_URL = os.getenv("FRONTEND_URL", "")
VERCEL_URL = os.getenv("VERCEL_URL", "")  # Vercel automatically sets this for serverless functions
VERCEL_ENV = os.getenv("VERCEL_ENV", "")  # preview, production, development

# Add Vercel URLs dynamically
if VERCEL_URL:
    # Vercel provides the full URL including protocol
    ALLOWED_ORIGINS.append(f"https://{VERCEL_URL}")
    
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)
    # Also add without trailing slash
    if FRONTEND_URL.endswith("/"):
        ALLOWED_ORIGINS.append(FRONTEND_URL.rstrip("/"))
    else:
        ALLOWED_ORIGINS.append(f"{FRONTEND_URL}/")

# Clean up origins (remove empty strings)
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()]

# For production, allow all origins if needed (can be restricted via environment)
# Note: FastAPI doesn't support wildcard "*" in allow_origins, so we use a list
ALLOW_ALL_ORIGINS = os.getenv("ALLOW_ALL_ORIGINS", "false").lower() == "true"
if ALLOW_ALL_ORIGINS:
    # Use allow_origin_regex for wildcard support
    ALLOWED_ORIGINS = [r".*"]

# Configure CORS based on environment
if ALLOW_ALL_ORIGINS:
    # Allow all origins for development/flexible deployment
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Restrict to specific origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


class QueryRequest(BaseModel):
    query: str
    use_cache: bool = True


class BatchQueryRequest(BaseModel):
    queries: List[str]
    use_cache: bool = True


class QueryResponse(BaseModel):
    query: str
    response: str
    success: bool
    error: Optional[str] = None


class BatchQueryResponse(BaseModel):
    results: List[QueryResponse]
    total: int
    successful: int
    failed: int


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "YouTube Agent API",
        "version": "1.0.0",
        "endpoints": {
            "/query": "POST - Single query processing",
            "/batch": "POST - Batch query processing",
            "/cache/stats": "GET - Cache statistics",
            "/cache/clear": "POST - Clear cache",
            "/health": "GET - Health check",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "youtube-agent"}


@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a single query."""
    try:
        # Quick greeting guard to avoid unnecessary tool-calls
        simple_greetings = {"hi", "hello", "hey", "hola", "yo"}
        if request.query.strip().lower() in simple_greetings:
            return QueryResponse(
                query=request.query,
                response=(
                    "Hello! I'm your YouTube Agent. I can search videos, fetch transcripts, "
                    "summarize content, and provide sources. Ask me about a video or topic, "
                    "e.g. 'Summarize https://youtu.be/...'") ,
                success=True,
            )

        chain = build_universal_chain()
        messages = chain.invoke({"query": request.query})
        final = messages[-1]
        
        # Extract tool calls information for processing status
        tool_calls_info = []
        for msg in messages:
            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                for tc in msg.tool_calls:
                    tool_calls_info.append(tc.get('name', 'unknown_tool'))
        
        return QueryResponse(
            query=request.query,
            response=final.content,
            success=True,
        )
    except Exception as e:
        error_str = str(e)
        
        # Detect HTML responses from LLM API (wrong endpoint/auth)
        if "<!DOCTYPE html>" in error_str or "<html" in error_str.lower() or "cerebras cloud" in error_str.lower():
            settings = get_settings()
            provider = settings.provider
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "LLM API returned HTML instead of JSON",
                    "message": f"The {provider.upper()} API endpoint returned a website page instead of API response.",
                    "likely_causes": [
                        "API endpoint URL is incorrect",
                        "API key is missing or invalid",
                        "API endpoint requires different authentication",
                        "The provider's API structure has changed"
                    ],
                    "suggestions": [
                        f"Verify your {provider.upper()}_API_KEY is correct",
                        f"Check the {provider.upper()}_BASE_URL endpoint",
                        "Try switching to a different LLM provider (groq, openai)",
                        "Check the provider's documentation for the correct API endpoint"
                    ],
                    "provider": provider,
                    "original_error_preview": error_str[:500] if len(error_str) > 500 else error_str
                }
            )
        
        # Handle rate limit errors with better messaging
        if "429" in error_str or "rate_limit" in error_str.lower() or "Rate limit" in error_str:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "message": "You've reached the daily token limit for your LLM API. Please try again later or upgrade your plan.",
                    "suggestion": "Wait for the rate limit to reset or upgrade your API plan",
                    "original_error": error_str
                }
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}",
        )


@app.post("/batch", response_model=BatchQueryResponse)
async def process_batch(request: BatchQueryRequest):
    """Process multiple queries in batch."""
    if not request.queries:
        raise HTTPException(status_code=400, detail="No queries provided")

    results = []
    successful = 0
    failed = 0

    chain = build_universal_chain()
    for query in request.queries:
        try:
            messages = chain.invoke({"query": query})
            final = messages[-1]
            results.append(
                QueryResponse(
                    query=query,
                    response=final.content,
                    success=True,
                )
            )
            successful += 1
        except Exception as e:
            results.append(
                QueryResponse(
                    query=query,
                    response="",
                    success=False,
                    error=str(e),
                )
            )
            failed += 1

    return BatchQueryResponse(
        results=results,
        total=len(request.queries),
        successful=successful,
        failed=failed,
    )


@app.get("/cache/stats")
async def cache_stats():
    """Get cache statistics."""
    return get_cache_stats()


@app.post("/cache/clear")
async def cache_clear():
    """Clear all cached data."""
    clear_cache()
    return {"message": "Cache cleared successfully"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

