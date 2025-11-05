"""
Vercel serverless function entry point for YouTube Agent API.
"""
import sys
import os

# Add parent directory to path to import youtube_agent
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from mangum import Mangum
from youtube_agent.app.api import app

# Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
handler = Mangum(app, lifespan="off")

