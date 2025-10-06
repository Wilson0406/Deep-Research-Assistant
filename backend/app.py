from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
import os
from perplexity import Perplexity
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Perplexity(api_key=os.getenv("PERPLEXITY_API_KEY"))

class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str

class ResearchResponse(BaseModel):
    results: list[SearchResult]

@app.get("/research", response_model=ResearchResponse)
def research(
    query: str = Query(..., min_length=3, description="Research query"),
    max_results: int = Query(5, ge=1, le=20, description="Max number of results to return")
):
    try:
        search = client.search.create(query=query, max_results=max_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    results = []
    for item in search.results:
        results.append(
            SearchResult(
                title=item.title,
                url=item.url,
                snippet=getattr(item, "snippet", "") or ""
            )
        )
    
    return ResearchResponse(results=results)
