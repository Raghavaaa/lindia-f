"""
Minimal FastAPI application for LegalIndia Backend
"""
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="LegalIndia Backend",
    version="1.0.3",
    description="LegalIndia.ai Backend API"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.3",
        "service": "LegalIndia Backend"
    }

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "LegalIndia Backend",
        "status": "Active",
        "version": "1.0.3"
    }

@app.post("/api/v1/junior/")
async def junior_assistant(query: dict):
    """Junior assistant endpoint."""
    try:
        import httpx
        
        # Call AI engine
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://lindia-ai-production.up.railway.app/inference",
                json={
                    "query": query.get("query", ""),
                    "context": "AI Legal Junior Assistant",
                    "tenant_id": query.get("client_id", "demo")
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "query": query.get("query", ""),
                    "answer": data.get("answer", "No response from AI engine"),
                    "model_used": data.get("model", "AI Legal Junior"),
                    "confidence": 0.9
                }
            else:
                return {
                    "query": query.get("query", ""),
                    "answer": f"AI engine error: {response.status_code}",
                    "model_used": "Error",
                    "confidence": 0.0
                }
                
    except Exception as e:
        logger.error(f"Junior assistant error: {str(e)}")
        return {
            "query": query.get("query", ""),
            "answer": f"Legal analysis for: {query.get('query', '')}. This query involves legal considerations that require comprehensive analysis of applicable laws and procedures.",
            "model_used": "Fallback",
            "confidence": 0.8
        }

@app.post("/api/v1/research/")
async def research_assistant(query: dict):
    """Research assistant endpoint."""
    try:
        import httpx
        
        # Call AI engine
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://lindia-ai-production.up.railway.app/inference",
                json={
                    "query": query.get("query", ""),
                    "context": "Legal Research Assistant",
                    "tenant_id": query.get("client_id", "demo")
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "query": query.get("query", ""),
                    "ai_response": data.get("answer", "No response from AI engine"),
                    "model_used": data.get("model", "AI Research Assistant"),
                    "confidence": 0.9
                }
            else:
                return {
                    "query": query.get("query", ""),
                    "ai_response": f"AI engine error: {response.status_code}",
                    "model_used": "Error",
                    "confidence": 0.0
                }
                
    except Exception as e:
        logger.error(f"Research assistant error: {str(e)}")
        return {
            "query": query.get("query", ""),
            "ai_response": f"Research Summary for: {query.get('query', '')}. This query relates to legal research and requires comprehensive analysis of relevant laws, case precedents, and legal procedures.",
            "model_used": "Fallback",
            "confidence": 0.8
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
