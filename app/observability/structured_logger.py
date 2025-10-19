"""
Structured Logging
JSON-formatted logs with metadata for better observability
"""
import logging
import json
import sys
from typing import Dict, Any, Optional
from datetime import datetime


class JSONFormatter(logging.Formatter):
    """Custom formatter that outputs JSON logs"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields
        if hasattr(record, "extra_data"):
            log_data.update(record.extra_data)
        
        return json.dumps(log_data)


class StructuredLogger:
    """
    Structured logger that produces JSON-formatted logs.
    """
    
    def __init__(self, name: str = "app"):
        self.logger = logging.getLogger(name)
        
        # Only configure if not already configured
        if not self.logger.handlers:
            self._configure_logger()
    
    def _configure_logger(self):
        """Configure logger with JSON formatter"""
        self.logger.setLevel(logging.INFO)
        
        # Console handler with JSON formatter
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        self.logger.addHandler(handler)
    
    def _log_with_metadata(
        self,
        level: int,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs
    ):
        """Log with metadata"""
        extra = {"extra_data": metadata or {}}
        self.logger.log(level, message, extra=extra, **kwargs)
    
    def info(self, message: str, metadata: Optional[Dict[str, Any]] = None, **kwargs):
        """Log info message"""
        self._log_with_metadata(logging.INFO, message, metadata, **kwargs)
    
    def warning(self, message: str, metadata: Optional[Dict[str, Any]] = None, **kwargs):
        """Log warning message"""
        self._log_with_metadata(logging.WARNING, message, metadata, **kwargs)
    
    def error(self, message: str, metadata: Optional[Dict[str, Any]] = None, **kwargs):
        """Log error message"""
        self._log_with_metadata(logging.ERROR, message, metadata, **kwargs)
    
    def debug(self, message: str, metadata: Optional[Dict[str, Any]] = None, **kwargs):
        """Log debug message"""
        self._log_with_metadata(logging.DEBUG, message, metadata, **kwargs)
    
    def critical(self, message: str, metadata: Optional[Dict[str, Any]] = None, **kwargs):
        """Log critical message"""
        self._log_with_metadata(logging.CRITICAL, message, metadata, **kwargs)
    
    def log_request(
        self,
        method: str,
        path: str,
        status_code: int,
        latency_ms: float,
        tenant_id: Optional[str] = None,
        **kwargs
    ):
        """Log HTTP request"""
        metadata = {
            "type": "http_request",
            "method": method,
            "path": path,
            "status_code": status_code,
            "latency_ms": latency_ms,
            "tenant_id": tenant_id,
            **kwargs
        }
        self.info(f"{method} {path} {status_code} ({latency_ms:.2f}ms)", metadata)
    
    def log_inference(
        self,
        query: str,
        provider: str,
        model: str,
        latency_ms: float,
        tokens_used: Optional[int] = None,
        cached: bool = False,
        fallback: bool = False,
        tenant_id: Optional[str] = None,
        **kwargs
    ):
        """Log inference request"""
        metadata = {
            "type": "inference",
            "query_length": len(query),
            "provider": provider,
            "model": model,
            "latency_ms": latency_ms,
            "tokens_used": tokens_used,
            "cached": cached,
            "fallback": fallback,
            "tenant_id": tenant_id,
            **kwargs
        }
        self.info(
            f"Inference: provider={provider}, model={model}, "
            f"latency={latency_ms:.2f}ms, cached={cached}",
            metadata
        )
    
    def log_error_with_context(
        self,
        error: Exception,
        context: Dict[str, Any]
    ):
        """Log error with context"""
        metadata = {
            "type": "error",
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context
        }
        self.error(f"Error: {str(error)}", metadata, exc_info=True)


# Global logger instance
_structured_logger: Optional[StructuredLogger] = None


def get_logger(name: str = "app") -> StructuredLogger:
    """Get structured logger instance"""
    global _structured_logger
    if _structured_logger is None:
        _structured_logger = StructuredLogger(name)
    return _structured_logger

