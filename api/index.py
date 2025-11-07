"""
Ultra-minimal Vercel Python handler - testing absolute basics.
"""
import sys
import os

# Write immediately to verify file is executed
sys.stderr.write("=== Handler file is being executed ===\n")
sys.stderr.flush()

def handler(event, context):
    """Handler function for Vercel."""
    sys.stderr.write(f"=== Handler called with event: {type(event)} ===\n")
    sys.stderr.flush()
    
    try:
        import json
        response_data = {
            "status": "ok",
            "message": "Handler is working",
        }
        
        sys.stderr.write("=== Returning response ===\n")
        sys.stderr.flush()
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(response_data),
        }
    except Exception as e:
        import traceback
        error_msg = f"Error in handler: {str(e)}\n{traceback.format_exc()}"
        sys.stderr.write(error_msg)
        sys.stderr.flush()
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }

# Test if module loads
sys.stderr.write("=== Module loaded successfully ===\n")
sys.stderr.flush()
