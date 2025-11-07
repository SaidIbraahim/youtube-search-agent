"""Minimal AWS Lambda-style handler for Vercel testing."""

def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": {
            "status": "ok",
            "message": "Simple Python handler responding",
            "event": event.get("path") if isinstance(event, dict) else str(event),
        },
    }

