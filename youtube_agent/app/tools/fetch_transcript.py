import logging
from typing import Union

from langchain_core.tools import tool
from youtube_transcript_api import YouTubeTranscriptApi

from ..cache import cached


# Suppress library logs
yt_api_logger = logging.getLogger("youtube_transcript_api")
yt_api_logger.setLevel(logging.ERROR)


@tool
@cached(ttl=86400)  # Cache for 24 hours (transcripts don't change)
def fetch_transcript(video_id: str, language: str = "en") -> Union[str, dict]:
    """
    Fetch the transcript of a YouTube video.

    Args:
        video_id (str): The YouTube video ID (e.g., "dQw4w9WgXcQ").
        language (str): Language code for the transcript (e.g., "en", "es").

    Returns:
        str | dict: Transcript text on success; error dict on failure.
    """
    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id, languages=[language])
        # The library returns an object with .snippets in newer versions in the lab,
        # but commonly returns a list of dicts with 'text'. Handle both.
        if hasattr(transcript, "snippets"):
            return " ".join(snippet.text for snippet in transcript.snippets)
        return " ".join(segment.get("text", "") for segment in transcript)
    except Exception as exc:  # noqa: BLE001
        return {"error": f"Failed to fetch transcript: {str(exc)}"}


