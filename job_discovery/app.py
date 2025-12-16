"""
FastAPI application for job discovery
Exposes /discover endpoint that uses LangChain tools
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from JobAgent import load_search_context, adzuna_search

# Create FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Serve index.html"""
    return FileResponse("index.html")


@app.post("/discover")
def discover_jobs(data: dict):
    """
    Discover jobs using Adzuna API
    Accepts combined JSON and returns job listings
    """
    # Load search context (pass through)
    context = load_search_context.invoke({"data": data})
    
    # Search jobs using Adzuna
    result = adzuna_search.invoke({"data": context})
    
    # Return result as JSON
    return JSONResponse(content=result)
