"""
Logging module for LegalIndia.ai backend.
Configures loguru for structured logging.
"""
import sys
from loguru import logger
from app.core.config import settings

# Remove default logger
logger.remove()

# Add custom logger with format
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="DEBUG" if settings.DEBUG else "INFO",
    colorize=True,
)

# Add file logger for production
if not settings.DEBUG:
    logger.add(
        "logs/app_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="30 days",
        compression="zip",
        level="INFO",
    )

# Export logger instance
__all__ = ["logger"]

