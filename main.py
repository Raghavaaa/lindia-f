from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(
    title="LegalIndia Backend API",
    description="Backend API for LegalIndia platform",
    version="2.0.0"
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
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "lindia-b",
        "version": "2.0.0",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "development")
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "LegalIndia Backend API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/api/v1/status")
async def api_status():
    """API status endpoint"""
    return {
        "api_status": "operational",
        "endpoints": [
            "/health",
            "/api/v1/status",
            "/api/v1/junior/",
            "/api/v1/research/"
        ]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)