"""
Vercel serverless function catch-all handler for FastAPI.

Vercel automatically routes /api/* requests to this function.
We use Mangum to wrap FastAPI as an ASGI handler.
"""
import sys
import os
import traceback

# Add parent directory to Python path
# Vercel runs functions from the repo root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

# Wrap imports in try-except to catch initialization errors
try:
    from mangum import Mangum
    from youtube_agent.app.api import app
    
    # Export handler for Vercel
    # Mangum converts ASGI app to Lambda handler format
    handler = Mangum(app, lifespan="off")
    
except ImportError as e:
    # Print detailed error for Vercel logs
    error_msg = f"Import error: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr)
    
    # Create a minimal error handler
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": {"error": "Import error", "message": str(e)}
        }
    handler = error_handler
    
except Exception as e:
    # Print detailed error for Vercel logs
    error_msg = f"Initialization error: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr)
    
    # Create a minimal error handler
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": {"error": "Initialization error", "message": str(e)}
        }
    handler = error_handler
