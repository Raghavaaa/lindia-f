from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="LegalIndia Backend", version="1.0.4")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.4"}

@app.get("/")
async def root():
    return {"service": "LegalIndia Backend", "status": "Active"}

@app.post("/api/v1/junior/")
async def junior(query: dict):
    try:
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
                    "answer": data.get("answer", "No response"),
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
        return {
            "query": query.get("query", ""),
            "answer": f"Legal analysis for: {query.get('query', '')}. This involves legal considerations requiring comprehensive analysis.",
            "model_used": "Fallback",
            "confidence": 0.8
        }

@app.post("/api/v1/research/")
async def research(query: dict):
    try:
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
                    "ai_response": data.get("answer", "No response"),
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
        return {
            "query": query.get("query", ""),
            "ai_response": f"Research Summary for: {query.get('query', '')}. This relates to legal research requiring comprehensive analysis.",
            "model_used": "Fallback",
            "confidence": 0.8
        }
