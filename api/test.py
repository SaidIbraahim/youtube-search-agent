"""
Simple test endpoint to verify Python functions work on Vercel.
"""
def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": {"status": "ok", "message": "Python function is working"}
    }

