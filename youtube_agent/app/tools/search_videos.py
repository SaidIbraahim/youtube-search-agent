import logging
from typing import List, Dict, Union

from langchain_core.tools import tool
from pytube import Search

from ..cache import cached


# Suppress pytube noise
pytube_logger = logging.getLogger("pytube")
pytube_logger.setLevel(logging.ERROR)


@tool
@cached(ttl=1800)  # Cache for 30 minutes (search results change frequently)
def search_youtube(query: str) -> Union[List[Dict[str, str]], str]:
    """
    Search YouTube for videos matching the query.

    Args:
        query (str): The search term to look for on YouTube

    Returns:
        List[Dict[str, str]] | str: On success, a list of dicts containing
        title, video_id and url for each result. On failure, an error string.
    """
    try:
        search = Search(query)
        return [
            {
                "title": yt.title,
                "video_id": yt.video_id,
                "url": f"https://youtu.be/{yt.video_id}",
            }
            for yt in search.results
        ]
    except Exception as exc:  # noqa: BLE001
        return f"Error: {str(exc)}"


