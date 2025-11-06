"""
Vercel serverless function entry point for YouTube Agent API.

Vercel's Python runtime detects an ASGI app when exported as `app`.
We expose the FastAPI app directly.
"""
import sys
import os

# Add parent directory to path to import youtube_agent
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from youtube_agent.app.api import app

# No wrapper needed; Vercel will serve the FastAPI ASGI app directly

