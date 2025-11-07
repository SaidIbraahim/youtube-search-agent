"""
Vercel serverless function catch-all handler for FastAPI.

This handler catches all requests to /api/* and forwards them to FastAPI via Mangum.
"""
import sys
import os

# Add parent directory to path to import youtube_agent
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from mangum import Mangum
from youtube_agent.app.api import app

# Wrap FastAPI app with Mangum
# This handler catches all /api/* routes
handler = Mangum(app, lifespan="off")

