"""
Vercel serverless function catch-all handler for FastAPI.

Minimal implementation to isolate the crash issue.
"""
import sys
import os
import traceback

# Debug: Print environment info
print("=== Starting handler initialization ===", file=sys.stderr)
print(f"Python version: {sys.version}", file=sys.stderr)
print(f"Current directory: {os.getcwd()}", file=sys.stderr)
print(f"Python path: {sys.path}", file=sys.stderr)

# Add parent directory to Python path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(f"Base directory: {base_dir}", file=sys.stderr)
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

try:
    print("Importing mangum...", file=sys.stderr)
    from mangum import Mangum
    print("Mangum imported successfully", file=sys.stderr)
except Exception as e:
    print(f"ERROR importing mangum: {e}", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    raise

try:
    print("Importing youtube_agent.app.api...", file=sys.stderr)
    from youtube_agent.app.api import app
    print("FastAPI app imported successfully", file=sys.stderr)
except Exception as e:
    print(f"ERROR importing FastAPI app: {e}", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    # Create a minimal error app instead
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/health")
    async def health():
        return {"status": "error", "message": f"Import failed: {str(e)}"}

try:
    print("Creating Mangum handler...", file=sys.stderr)
    handler = Mangum(app, lifespan="off")
    print("Handler created successfully", file=sys.stderr)
except Exception as e:
    print(f"ERROR creating handler: {e}", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    
    # Fallback error handler
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": {"error": "Handler creation failed", "message": str(e)}
        }
    handler = error_handler

print("=== Handler initialization complete ===", file=sys.stderr)
