"""
Configuration module for LegalIndia.ai backend.
Loads environment variables and provides application settings.
"""
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database configuration
    DATABASE_URL: str = "postgresql://user:pass@localhost:5432/legalindia"
    
    # AI Engine configuration
    AI_ENGINE_URL: str = "https://ai.legalindia.ai"
    
    # JWT configuration
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS configuration
    FRONTEND_ORIGIN: str = "https://legalindia.ai"
    
    # Application configuration
    APP_NAME: str = "LegalIndia.ai Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API configuration
    API_V1_PREFIX: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create a global settings instance
settings = Settings()

