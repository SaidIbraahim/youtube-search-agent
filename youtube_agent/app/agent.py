from typing import Any, Dict, List

from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.runnables import RunnableLambda

from .config import get_settings
from .prompts import SYSTEM_PROMPT
from .tools.extract_metadata import (
    get_full_metadata,
    get_thumbnails,
    get_trending_videos,
)
from .tools.fetch_transcript import fetch_transcript
from .tools.search_videos import search_youtube
from .tools.summarize import extract_video_id, truncate_text


def _build_llm_with_tools():
    settings = get_settings()
    if settings.provider == "groq":
        # Use Groq (free tier available)
        from langchain_groq import ChatGroq

        llm = ChatGroq(model=settings.model_name, api_key=settings.groq_api_key)
    elif settings.provider == "openai":
        from langchain_openai import ChatOpenAI

        model_name = settings.openai_model or settings.model_name
        llm = ChatOpenAI(model=model_name, api_key=settings.openai_api_key)
    elif settings.provider == "bytez":
        # Bytez is OpenAI-compatible; use ChatOpenAI with base_url and key
        from langchain_openai import ChatOpenAI

        # Default to gpt-4o-mini when provider is Bytez if not explicitly set
        model_name = settings.model_name if settings.model_name else "gpt-4o-mini"
        llm = ChatOpenAI(
            model=model_name,
            api_key=settings.bytez_api_key,
            base_url=settings.bytez_base_url,
        )
    elif settings.provider == "cerebras":
        # Cerebras Cloud: OpenAI-compatible endpoint at https://api.cerebras.ai/v1
        # Supports tool calling via ChatOpenAI wrapper
        from langchain_openai import ChatOpenAI

        # Default model: gpt-oss-120b (as per Cerebras API documentation)
        # Available models: gpt-oss-120b, llama-3.3-70b, etc.
        model_name = settings.model_name or "gpt-oss-120b"
        llm = ChatOpenAI(
            model=model_name,
            api_key=settings.cerebras_api_key,
            base_url=settings.cerebras_base_url,
        )
    else:
        # Fallback to Ollama if chosen
        llm = init_chat_model(
            settings.ollama_model,
            model_provider="ollama",
        )
    tools = [
        extract_video_id,
        fetch_transcript,
        search_youtube,
        get_full_metadata,
        get_trending_videos,
        get_thumbnails,
        truncate_text,
    ]
    return llm.bind_tools(tools)


def _execute_tool(tool_mapping, tool_call):
    try:
        result = tool_mapping[tool_call["name"]].invoke(tool_call["args"])
        # Ensure string content for ToolMessage
        if isinstance(result, (dict, list)):
            import json

            content = json.dumps(result)
        else:
            content = str(result)
    except Exception as exc:  # noqa: BLE001
        content = f"Error: {str(exc)}"
    return ToolMessage(content=content, tool_call_id=tool_call["id"])


def _build_tool_mapping():
    return {
        "extract_video_id": extract_video_id,
        "fetch_transcript": fetch_transcript,
        "search_youtube": search_youtube,
        "get_full_metadata": get_full_metadata,
        "get_trending_videos": get_trending_videos,
        "get_thumbnails": get_thumbnails,
        "truncate_text": truncate_text,
    }


def _recursive_processor(llm_with_tools):
    tool_mapping = _build_tool_mapping()

    def _should_continue(messages):
        last = messages[-1]
        return bool(getattr(last, "tool_calls", None))

    def _process_once(messages):
        last = messages[-1]
        tool_messages = [
            _execute_tool(tool_mapping, tc) for tc in getattr(last, "tool_calls", [])
        ]
        # System message is already at the start from first_step, just append tool results
        updated = messages + tool_messages
        next_ai = llm_with_tools.invoke(updated)
        return updated + [next_ai]

    def _recur(messages):
        if _should_continue(messages):
            return _recur(_process_once(messages))
        return messages

    return RunnableLambda(_recur)


def build_universal_chain():
    llm_with_tools = _build_llm_with_tools()

    def first_step(x: Dict[str, Any]):
        # Start with system prompt to set expectations
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=x["query"]),
        ]
        ai1 = llm_with_tools.invoke(messages)
        return messages + [ai1]

    return RunnableLambda(first_step) | _recursive_processor(llm_with_tools)


