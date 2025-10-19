"""
Application Configuration
Loads all configuration from environment variables
"""
import os
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from providers.models import ProviderConfig, ProviderType, ModelConfig
from pipeline.models import PipelineConfig

logger = logging.getLogger(__name__)

# Global config instance
_app_config: Optional['AppConfig'] = None


class AppConfig(BaseModel):
    """Complete application configuration"""
    
    # Runtime mode
    runtime_mode: str = "LOCAL"  # LOCAL or PROD
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 4
    
    # Database
    database_url: str = Field(default="sqlite:///./legalindia.db")
    
    # Authentication
    api_secret_key: Optional[str] = None
    jwt_secret: Optional[str] = None
    
    # AI Providers
    ai_engine_url: Optional[str] = None
    openai_api_key: Optional[str] = None
    deepseek_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    huggingface_api_key: Optional[str] = None
    
    # Provider configuration
    provider_configs: List[ProviderConfig] = Field(default_factory=list)
    
    # Pipeline configuration
    pipeline_config: PipelineConfig = Field(default_factory=PipelineConfig)
    
    # Cache settings
    cache_backend: str = "memory"  # memory or redis
    cache_ttl_seconds: int = 300
    redis_url: Optional[str] = None
    
    # Rate limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window_seconds: int = 60
    
    # Feature flags
    enable_local_model: bool = False
    enable_rag: bool = False
    enable_caching: bool = True
    
    # Observability
    sentry_dsn: Optional[str] = None
    log_level: str = "INFO"
    
    # Deployment
    railway_environment: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False


def load_config_from_env() -> AppConfig:
    """
    Load configuration from environment variables.
    Follows the requirements: all secrets from env, two runtime modes.
    """
    
    # Detect runtime mode
    runtime_mode = os.getenv("RUNTIME_MODE", "LOCAL").upper()
    
    # Load basic config
    config = AppConfig(
        runtime_mode=runtime_mode,
        database_url=os.getenv(
            "DATABASE_URL",
            "/tmp/legalindia.db" if os.getenv("RAILWAY_ENVIRONMENT") else "sqlite:///./legalindia.db"
        ),
        api_secret_key=os.getenv("API_SECRET_KEY"),
        jwt_secret=os.getenv("JWT_SECRET"),
        
        # AI Provider credentials
        ai_engine_url=os.getenv("AI_ENGINE_URL", "https://lindia-ai-production.up.railway.app"),
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        deepseek_api_key=os.getenv("DEEPSEEK_API_KEY"),
        groq_api_key=os.getenv("GROQ_API_KEY"),
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
        huggingface_api_key=os.getenv("HUGGINGFACE_API_KEY"),
        
        # Cache settings
        cache_backend=os.getenv("CACHE_BACKEND", "memory"),
        cache_ttl_seconds=int(os.getenv("CACHE_TTL_SECONDS", "300")),
        redis_url=os.getenv("REDIS_URL"),
        
        # Rate limiting
        rate_limit_enabled=os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true",
        rate_limit_requests=int(os.getenv("RATE_LIMIT_REQUESTS", "100")),
        rate_limit_window_seconds=int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60")),
        
        # Feature flags
        enable_local_model=os.getenv("ENABLE_LOCAL_MODEL", "false").lower() == "true",
        enable_rag=os.getenv("ENABLE_RAG", "false").lower() == "true",
        enable_caching=os.getenv("ENABLE_CACHING", "true").lower() == "true",
        
        # Observability
        sentry_dsn=os.getenv("SENTRY_DSN"),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
        
        # Deployment
        railway_environment=os.getenv("RAILWAY_ENVIRONMENT")
    )
    
    # Build provider configurations based on available credentials
    provider_configs = []
    
    # AI Engine provider (always available)
    if config.ai_engine_url:
        provider_configs.append(ProviderConfig(
            type=ProviderType.AI_ENGINE,
            name="ai_engine",
            base_url=config.ai_engine_url,
            default_model="default",
            priority=1,
            enabled=True,
            timeout_seconds=60.0,
            max_retries=2
        ))
    
    # OpenAI provider
    if config.openai_api_key and runtime_mode == "PROD":
        provider_configs.append(ProviderConfig(
            type=ProviderType.OPENAI,
            name="openai",
            api_key=config.openai_api_key,
            default_model="gpt-4",
            priority=2,
            enabled=True,
            timeout_seconds=60.0
        ))
    
    # DeepSeek provider
    if config.deepseek_api_key and runtime_mode == "PROD":
        provider_configs.append(ProviderConfig(
            type=ProviderType.DEEPSEEK,
            name="deepseek",
            api_key=config.deepseek_api_key,
            default_model="deepseek-chat",
            priority=3,
            enabled=True,
            timeout_seconds=60.0
        ))
    
    # Groq provider
    if config.groq_api_key and runtime_mode == "PROD":
        provider_configs.append(ProviderConfig(
            type=ProviderType.GROQ,
            name="groq",
            api_key=config.groq_api_key,
            default_model="llama-3.1-70b-versatile",
            priority=4,
            enabled=True,
            timeout_seconds=30.0
        ))
    
    # Mock provider for testing (LOCAL mode)
    if runtime_mode == "LOCAL":
        provider_configs.append(ProviderConfig(
            type=ProviderType.MOCK,
            name="mock",
            default_model="mock-model-v1",
            priority=10,
            enabled=True
        ))
    
    config.provider_configs = provider_configs
    
    # Pipeline configuration
    config.pipeline_config = PipelineConfig(
        enable_sanitization=True,
        enable_retrieval=config.enable_rag,
        enable_citation_extraction=True,
        enable_response_structuring=True,
        enable_output_validation=True,
        max_query_length=10000,
        max_response_length=50000
    )
    
    logger.info(f"Configuration loaded: {len(provider_configs)} providers configured")
    logger.info(f"Runtime mode: {runtime_mode}")
    
    return config


def get_config() -> AppConfig:
    """Get global configuration instance"""
    global _app_config
    if _app_config is None:
        _app_config = load_config_from_env()
    return _app_config


def reload_config() -> AppConfig:
    """Reload configuration from environment"""
    global _app_config
    _app_config = load_config_from_env()
    return _app_config

