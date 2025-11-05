import logging
from typing import Dict, List, Union

import yt_dlp
from langchain_core.tools import tool

from ..cache import cached


# Suppress yt-dlp logs
yt_dpl_logger = logging.getLogger("yt_dlp")
yt_dpl_logger.setLevel(logging.ERROR)


@tool
@cached(ttl=3600)  # Cache for 1 hour (metadata changes slowly)
def get_full_metadata(url: str) -> Dict:
    """
    Extract detailed metadata for a YouTube URL without downloading content.

    Returns:
        Dict: title, views, duration, channel, likes, comments, chapters
    """
    with yt_dlp.YoutubeDL({"quiet": True, "logger": yt_dpl_logger}) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            "title": info.get("title"),
            "views": info.get("view_count"),
            "duration": info.get("duration"),
            "channel": info.get("uploader"),
            "likes": info.get("like_count"),
            "comments": info.get("comment_count"),
            "chapters": info.get("chapters", []),
        }


@tool
def get_trending_videos(region_code: str) -> List[Dict[str, Union[str, int]]]:
    """
    Fetch currently trending videos for a specific region (country code).
    Note: YouTube's trending feed has access restrictions. This function attempts
    to fetch trending videos, but may return an error if access is blocked.
    Returns top 25 entries with basic fields.
    """
    ydl_opts = {
        "geo_bypass_country": region_code.upper(),
        "extract_flat": True,
        "quiet": True,
        "no_warnings": True,
        "logger": yt_dpl_logger,
        "skip_download": True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Try trending feed URL
            info = ydl.extract_info(
                f"https://www.youtube.com/feed/trending?gl={region_code.upper()}",
                download=False,
            )
            results: List[Dict[str, Union[str, int]]] = []
            entries = info.get("entries", [])
            if not entries:
                # If no entries, try alternative approach
                return [
                    {
                        "error": "Trending feed access restricted. YouTube may require authentication or block programmatic access. Try using search_youtube with 'trending' or 'popular' keywords instead.",
                        "suggestion": "Use search_youtube('trending videos') as an alternative",
                    }
                ]
            for entry in entries[:25]:
                # Ensure we have valid video data
                if entry.get("id") and entry.get("url"):
                    results.append(
                        {
                            "title": entry.get("title", "N/A"),
                            "video_id": entry.get("id", "N/A"),
                            "url": entry.get("url", f"https://youtu.be/{entry.get('id', '')}"),
                            "channel": entry.get("uploader", "N/A"),
                            "duration": entry.get("duration", 0),
                            "view_count": entry.get("view_count", 0),
                        }
                    )
            return results if results else [
                {
                    "error": "No trending videos found. YouTube may restrict access to trending feed.",
                    "suggestion": "Use search_youtube('trending videos') as an alternative",
                }
            ]
    except Exception as exc:  # noqa: BLE001
        return [
            {
                "error": f"Failed to fetch trending videos: {str(exc)}",
                "suggestion": "YouTube's trending feed requires authentication or blocks programmatic access. Use search_youtube('trending videos') or search_youtube('popular videos') as an alternative.",
            }
        ]


@tool
@cached(ttl=86400)  # Cache for 24 hours (thumbnails don't change)
def get_thumbnails(url: str) -> List[Dict[str, Union[str, int]]]:
    """
    Retrieve available thumbnails for a YouTube URL.
    """
    try:
        with yt_dlp.YoutubeDL({"quiet": True, "logger": yt_dpl_logger}) as ydl:
            info = ydl.extract_info(url, download=False)
            thumbnails: List[Dict[str, Union[str, int]]] = []
            for t in info.get("thumbnails", []):
                if "url" in t:
                    thumbnails.append(
                        {
                            "url": t["url"],
                            "width": t.get("width"),
                            "height": t.get("height"),
                            "resolution": f"{t.get('width', '')}x{t.get('height', '')}".strip(
                                "x"
                            ),
                        }
                    )
            return thumbnails
    except Exception as exc:  # noqa: BLE001
        return [{"error": f"Failed to get thumbnails: {str(exc)}"}]


