"""
Vercel serverless function catch-all handler for FastAPI.

Step-by-step initialization with comprehensive error handling.
"""
import sys
import os
import traceback

# Write to stderr immediately to verify file is being executed
sys.stderr.write("=== Python handler file is being executed ===\n")
sys.stderr.flush()

# Debug: Print environment info
print("=== Starting handler initialization ===", file=sys.stderr, flush=True)
print(f"Python version: {sys.version}", file=sys.stderr, flush=True)
print(f"Current directory: {os.getcwd()}", file=sys.stderr, flush=True)
print(f"__file__: {__file__}", file=sys.stderr, flush=True)
print(f"Python path (before): {sys.path}", file=sys.stderr, flush=True)

# Add parent directory to Python path
try:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Base directory: {base_dir}", file=sys.stderr, flush=True)
    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)
    print(f"Python path (after): {sys.path}", file=sys.stderr, flush=True)
except Exception as e:
    print(f"ERROR setting up paths: {e}", file=sys.stderr, flush=True)
    print(traceback.format_exc(), file=sys.stderr, flush=True)

# Step 1: Import mangum
try:
    print("Step 1: Importing mangum...", file=sys.stderr, flush=True)
    from mangum import Mangum
    print("✓ Mangum imported successfully", file=sys.stderr, flush=True)
except Exception as e:
    print(f"✗ ERROR importing mangum: {e}", file=sys.stderr, flush=True)
    print(traceback.format_exc(), file=sys.stderr, flush=True)
    # Create error handler
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": {"error": "Import error", "message": f"Failed to import mangum: {str(e)}"}
        }

# Step 2: Import FastAPI app
try:
    print("Step 2: Importing youtube_agent modules...", file=sys.stderr, flush=True)
    # Try importing modules one by one to identify which one fails
    print("  - Importing youtube_agent...", file=sys.stderr, flush=True)
    import youtube_agent
    print("  ✓ youtube_agent imported", file=sys.stderr, flush=True)
    
    print("  - Importing youtube_agent.app...", file=sys.stderr, flush=True)
    import youtube_agent.app
    print("  ✓ youtube_agent.app imported", file=sys.stderr, flush=True)
    
    print("  - Importing youtube_agent.app.api...", file=sys.stderr, flush=True)
    from youtube_agent.app.api import app
    print("  ✓ FastAPI app imported successfully", file=sys.stderr, flush=True)
except Exception as e:
    print(f"✗ ERROR importing FastAPI app: {e}", file=sys.stderr, flush=True)
    print(traceback.format_exc(), file=sys.stderr, flush=True)
    # Create a minimal FastAPI app as fallback
    try:
        from fastapi import FastAPI
        app = FastAPI()
        
        @app.get("/health")
        async def health():
            return {
                "status": "degraded",
                "message": f"Import failed: {str(e)}",
                "error_type": type(e).__name__
            }
        print("  ✓ Created fallback FastAPI app", file=sys.stderr, flush=True)
    except Exception as fallback_error:
        print(f"✗ ERROR creating fallback app: {fallback_error}", file=sys.stderr, flush=True)
        # Last resort: create a simple handler
        def handler(event, context):
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": {
                    "error": "Initialization failed",
                    "message": str(e),
                    "fallback_error": str(fallback_error)
                }
            }
        print("=== Using error handler ===", file=sys.stderr, flush=True)

# Step 3: Create Mangum handler
try:
    print("Step 3: Creating Mangum handler...", file=sys.stderr, flush=True)
    handler = Mangum(app, lifespan="off")
    print("✓ Handler created successfully", file=sys.stderr, flush=True)
except Exception as e:
    print(f"✗ ERROR creating handler: {e}", file=sys.stderr, flush=True)
    print(traceback.format_exc(), file=sys.stderr, flush=True)
    
    # Fallback error handler
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": {"error": "Handler creation failed", "message": str(e)}
        }
    handler = error_handler

print("=== Handler initialization complete ===", file=sys.stderr, flush=True)
print(f"Handler type: {type(handler)}", file=sys.stderr, flush=True)
