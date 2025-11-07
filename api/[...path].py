"""
Vercel serverless function catch-all handler for FastAPI.

Vercel automatically routes /api/* requests to this function.
We use Mangum to wrap FastAPI as an ASGI handler.
"""
import sys
import os

# Add parent directory to Python path
# Vercel runs functions from the repo root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

# Import FastAPI app and wrap with Mangum
from mangum import Mangum
from youtube_agent.app.api import app

# Export handler for Vercel
# Mangum converts ASGI app to Lambda handler format
handler = Mangum(app, lifespan="off")
