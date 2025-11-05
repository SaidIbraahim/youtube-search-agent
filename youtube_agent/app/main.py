import argparse
import sys

from .agent import build_universal_chain


def run_cli():
    """Run CLI mode for single query."""
    parser = argparse.ArgumentParser(
        description="YouTube Agent CLI (recursive tool-calling with cloud LLM)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single query
  python -m youtube_agent.app.main "Summarize this video: https://youtu.be/..."

  # Launch web interface
  python -m youtube_agent.app.main --web

  # Launch FastAPI server
  python -m youtube_agent.app.main --api
        """,
    )
    parser.add_argument(
        "query",
        nargs="?",
        type=str,
        help="Natural language query, e.g. 'Summarize https://youtu.be/...'",
    )
    parser.add_argument(
        "--web",
        action="store_true",
        help="[DEPRECATED] Use FastAPI server and frontend instead. Launch with: python -m youtube_agent.app.main --api",
    )
    parser.add_argument(
        "--api",
        action="store_true",
        help="Launch FastAPI REST API server",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=7860,
        help="Port for web interface (default: 7860) or API (default: 8000)",
    )
    parser.add_argument(
        "--share",
        action="store_true",
        help="Create public Gradio link (for web interface)",
    )

    args = parser.parse_args()

    # Launch web interface (deprecated - use FastAPI + frontend instead)
    if args.web:
        print("⚠️  Gradio web interface is deprecated.")
        print("💡 Use FastAPI server + frontend instead:")
        print("   1. Start backend: python -m youtube_agent.app.main --api")
        print("   2. Start frontend: cd frontend && npm run dev")
        sys.exit(0)

    # Launch FastAPI server
    if args.api:
        try:
            import uvicorn

            from .api import app

            print(f"🚀 Launching FastAPI server on port {args.port}...")
            print(f"📖 API docs available at: http://localhost:{args.port}/docs")
            uvicorn.run(app, host="0.0.0.0", port=args.port)
        except ImportError as e:
            print(f"Error: FastAPI/uvicorn not installed. Install with: pip install fastapi uvicorn")
            sys.exit(1)
        return

    # CLI mode - require query
    if not args.query:
        parser.print_help()
        sys.exit(1)

    try:
        chain = build_universal_chain()
        messages = chain.invoke({"query": args.query})
        final = messages[-1]
        # Print only the model's final content
        print(final.content)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    run_cli()


