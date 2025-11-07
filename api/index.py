"""Ultra-minimal handler - no imports except json."""
import json

def handler(event, context):
    """Minimal handler - returns JSON string."""
    response = {
        "status": "ok",
        "message": "Python handler is working",
    }
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(response),
    }
