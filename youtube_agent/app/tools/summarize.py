from typing import Optional

from langchain_core.tools import tool


@tool
def extract_video_id(url: str) -> str:
    """
    Extract the 11-character YouTube video ID from a URL.
    Supports common formats (watch, youtu.be, embed).
    """
    import re  # local import to keep global namespace clean

    pattern = r"(?:v=|be/|embed/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)
    return match.group(1) if match else "Error: Invalid YouTube URL"


@tool
def truncate_text(text: str, max_chars: int = 3000) -> str:
    """
    Utility tool to safely truncate large text blocks for LLM prompts.
    """
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 3] + "..."


