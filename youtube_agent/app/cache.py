"""Caching module for YouTube API calls to reduce redundant requests."""

import hashlib
import json
from functools import wraps
from typing import Any, Callable, Optional

try:
    import diskcache as dc
except ImportError:
    dc = None

# In-memory cache fallback
_memory_cache: dict = {}


def _get_cache_key(func_name: str, *args, **kwargs) -> str:
    """Generate a cache key from function name and arguments."""
    key_data = {
        "func": func_name,
        "args": args,
        "kwargs": sorted(kwargs.items()) if kwargs else {},
    }
    key_str = json.dumps(key_data, sort_keys=True, default=str)
    return hashlib.md5(key_str.encode()).hexdigest()


def get_cache_backend(ttl: int = 3600) -> Any:
    """Get cache backend (diskcache if available, else memory)."""
    if dc is not None:
        return dc.Cache("./.cache", size_limit=100 * 1024 * 1024)  # 100MB limit
    return _memory_cache


def cached(ttl: int = 3600, max_size: int = 1000):
    """
    Decorator to cache function results.
    
    Args:
        ttl: Time to live in seconds (default: 1 hour)
        max_size: Maximum cache entries (for memory cache)
    """
    cache_backend = get_cache_backend(ttl)

    def decorator(func: Callable) -> Callable:
        func_name = func.__name__

        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = _get_cache_key(func_name, *args, **kwargs)

            # Try to get from cache
            if dc is not None:
                # diskcache with TTL
                cached_result = cache_backend.get(cache_key, default=None)
                if cached_result is not None:
                    return cached_result
            else:
                # Memory cache (simple dict)
                if cache_key in cache_backend:
                    cached_data = cache_backend[cache_key]
                    # Simple TTL check (store timestamp)
                    import time
                    if time.time() - cached_data.get("timestamp", 0) < ttl:
                        return cached_data.get("value")
                    else:
                        del cache_backend[cache_key]

            # Cache miss - execute function
            result = func(*args, **kwargs)

            # Store in cache
            if dc is not None:
                cache_backend.set(cache_key, result, expire=ttl)
            else:
                import time
                # Clean old entries if cache is too large
                if len(cache_backend) >= max_size:
                    # Remove oldest 20% of entries
                    sorted_items = sorted(
                        cache_backend.items(), key=lambda x: x[1].get("timestamp", 0)
                    )
                    for key, _ in sorted_items[: max_size // 5]:
                        del cache_backend[key]
                cache_backend[cache_key] = {"value": result, "timestamp": time.time()}

            return result

        return wrapper

    return decorator


def clear_cache():
    """Clear all cached data."""
    if dc is not None:
        cache = get_cache_backend()
        cache.clear()
    else:
        _memory_cache.clear()


def get_cache_stats() -> dict:
    """Get cache statistics."""
    if dc is not None:
        cache = get_cache_backend()
        return {
            "type": "diskcache",
            "size": len(cache),
            "size_limit_mb": 100,
        }
    return {
        "type": "memory",
        "size": len(_memory_cache),
        "max_size": 1000,
    }

