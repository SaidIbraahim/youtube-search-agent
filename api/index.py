"""
Simple FastAPI handler for Vercel - test if basic setup works.
"""
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Vercel", "status": "working"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Export handler for Vercel
handler = Mangum(app)

