import logging
import os
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv


# Load .env if present (local dev)
# Handle encoding issues gracefully
try:
    load_dotenv(encoding="utf-8")
except (UnicodeDecodeError, Exception):
    # Try without encoding or skip if file is corrupted
    try:
        load_dotenv()
    except Exception:
        # If .env file has issues, continue without it (use env vars directly)
        pass


@dataclass
class Settings:
    # Provider: groq | openai | ollama | bytez | cerebras
    provider: str = os.getenv("LLM_PROVIDER", "groq").lower()

    # Common
    model_name: str = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")

    # Groq
    groq_api_key: Optional[str] = os.getenv("GROQ_API_KEY")

    # OpenAI (optional fallback)
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    openai_model: Optional[str] = os.getenv("OPENAI_MODEL")

    # Ollama (local optional)
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # Bytez (OpenAI-compatible gateway)
    bytez_api_key: Optional[str] = os.getenv("BYTEZ_API_KEY")
    # Default to OpenAI-compatible path used by Bytez gateways
    bytez_base_url: Optional[str] = os.getenv("BYTEZ_BASE_URL", "https://api.bytez.com/openai/v1")

    # Cerebras Cloud (OpenAI-compatible API)
    # Correct endpoint: https://api.cerebras.ai/v1 (not cloud.cerebras.ai)
    cerebras_api_key: Optional[str] = os.getenv("CEREBRAS_API_KEY")
    cerebras_base_url: Optional[str] = os.getenv("CEREBRAS_BASE_URL", "https://api.cerebras.ai/v1")


def get_settings() -> Settings:
    settings = Settings()
    
    # Check for API key in environment variables (fallback if .env not loaded)
    if not settings.groq_api_key:
        # Try direct environment variable
        settings.groq_api_key = os.getenv("GROQ_API_KEY")
    
    if settings.provider == "groq" and not settings.groq_api_key:
        error_msg = (
            "GROQ_API_KEY not set!\n\n"
            "To fix this:\n"
            "1. Create a free API key at: https://console.groq.com/\n"
            "2. Add it to your .env file:\n"
            "   GROQ_API_KEY=your_key_here\n"
            "3. Or set it as an environment variable:\n"
            "   $env:GROQ_API_KEY='your_key_here' (PowerShell)\n"
            "   export GROQ_API_KEY='your_key_here' (Linux/Mac)\n"
        )
        raise RuntimeError(error_msg)
    if settings.provider == "openai" and not settings.openai_api_key:
        error_msg = (
            "OPENAI_API_KEY not set!\n\n"
            "To fix this:\n"
            "1. Get an API key from: https://platform.openai.com/api-keys\n"
            "2. Add it to your .env file:\n"
            "   OPENAI_API_KEY=your_key_here\n"
            "3. Or set LLM_PROVIDER=groq in .env to use free Groq instead\n"
        )
        raise RuntimeError(error_msg)
    if settings.provider == "bytez" and not settings.bytez_api_key:
        error_msg = (
            "BYTEZ_API_KEY not set!\n\n"
            "To fix this:\n"
            "1. Get a free API key from Bytez\n"
            "2. Add to your .env file:\n"
            "   BYTEZ_API_KEY=your_key_here\n"
            "   BYTEZ_BASE_URL=https://<your-bytez-endpoint>/v1\n"
            "3. Optionally set LLM_MODEL=gpt-4o-mini (default when using Bytez)\n"
        )
        raise RuntimeError(error_msg)
    if settings.provider == "cerebras" and not settings.cerebras_api_key:
        error_msg = (
            "CEREBRAS_API_KEY not set!\n\n"
            "To fix this:\n"
            "1. Create or copy your key from Cerebras Cloud dashboard.\n"
            "2. Add to your .env file:\n"
            "   CEREBRAS_API_KEY=your_key_here\n"
            "   CEREBRAS_BASE_URL=https://api.cerebras.ai/v1 (default, correct endpoint)\n"
            "3. Optionally set LLM_MODEL=gpt-oss-120b (or llama-3.3-70b)\n"
            "   Available models: gpt-oss-120b, llama-3.3-70b\n"
        )
        raise RuntimeError(error_msg)
    return settings


# Quiet third-party library logs globally
logging.getLogger("pytube").setLevel(logging.ERROR)
logging.getLogger("yt_dlp").setLevel(logging.ERROR)
logging.getLogger("youtube_transcript_api").setLevel(logging.ERROR)


