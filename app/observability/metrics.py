"""
Metrics Collection
Collects and exposes application metrics
"""
import time
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from collections import defaultdict

logger = logging.getLogger(__name__)

# Global metrics collector
_metrics_collector: Optional['MetricsCollector'] = None


class MetricsCollector:
    """
    Collects application metrics:
    - Request counts and latencies
    - Provider performance
    - Cache hit rates
    - Error rates
    """
    
    def __init__(self):
        self.start_time = time.time()
        
        # Request metrics
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        self.request_latencies: List[float] = []
        
        # Provider metrics
        self.provider_requests: Dict[str, int] = defaultdict(int)
        self.provider_successes: Dict[str, int] = defaultdict(int)
        self.provider_failures: Dict[str, int] = defaultdict(int)
        self.provider_latencies: Dict[str, List[float]] = defaultdict(list)
        
        # Cache metrics
        self.cache_hits = 0
        self.cache_misses = 0
        
        # Error metrics
        self.errors_by_type: Dict[str, int] = defaultdict(int)
        
        # Rate limit metrics
        self.rate_limit_rejections = 0
        
        logger.info("Metrics collector initialized")
    
    def record_request(
        self,
        latency_ms: float,
        success: bool,
        provider: Optional[str] = None,
        cached: bool = False,
        error_type: Optional[str] = None
    ):
        """Record a request"""
        self.total_requests += 1
        
        if success:
            self.successful_requests += 1
        else:
            self.failed_requests += 1
            if error_type:
                self.errors_by_type[error_type] += 1
        
        self.request_latencies.append(latency_ms)
        
        # Keep only last 1000 latencies to avoid memory issues
        if len(self.request_latencies) > 1000:
            self.request_latencies = self.request_latencies[-1000:]
        
        if provider:
            self.provider_requests[provider] += 1
            
            if success:
                self.provider_successes[provider] += 1
            else:
                self.provider_failures[provider] += 1
            
            self.provider_latencies[provider].append(latency_ms)
            
            # Keep only last 1000 latencies per provider
            if len(self.provider_latencies[provider]) > 1000:
                self.provider_latencies[provider] = self.provider_latencies[provider][-1000:]
        
        if cached:
            self.cache_hits += 1
        else:
            self.cache_misses += 1
    
    def record_rate_limit_rejection(self):
        """Record a rate limit rejection"""
        self.rate_limit_rejections += 1
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all metrics"""
        uptime_seconds = time.time() - self.start_time
        
        # Calculate averages
        avg_latency = (
            sum(self.request_latencies) / len(self.request_latencies)
            if self.request_latencies else 0.0
        )
        
        # Calculate requests per second
        requests_per_second = self.total_requests / uptime_seconds if uptime_seconds > 0 else 0.0
        
        # Calculate success rate
        success_rate = (
            (self.successful_requests / self.total_requests * 100)
            if self.total_requests > 0 else 0.0
        )
        
        # Calculate cache hit rate
        total_cache_requests = self.cache_hits + self.cache_misses
        cache_hit_rate = (
            (self.cache_hits / total_cache_requests * 100)
            if total_cache_requests > 0 else 0.0
        )
        
        # Provider metrics
        provider_metrics = {}
        for provider in self.provider_requests.keys():
            provider_total = self.provider_requests[provider]
            provider_success = self.provider_successes[provider]
            provider_latencies = self.provider_latencies[provider]
            
            provider_metrics[provider] = {
                "requests": provider_total,
                "successes": provider_success,
                "failures": self.provider_failures[provider],
                "success_rate": (provider_success / provider_total * 100) if provider_total > 0 else 0.0,
                "avg_latency_ms": (
                    sum(provider_latencies) / len(provider_latencies)
                    if provider_latencies else 0.0
                )
            }
        
        return {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "uptime_seconds": round(uptime_seconds, 2),
            "requests": {
                "total": self.total_requests,
                "successful": self.successful_requests,
                "failed": self.failed_requests,
                "success_rate": round(success_rate, 2),
                "requests_per_second": round(requests_per_second, 2),
                "avg_latency_ms": round(avg_latency, 2)
            },
            "providers": provider_metrics,
            "cache": {
                "hits": self.cache_hits,
                "misses": self.cache_misses,
                "total": total_cache_requests,
                "hit_rate": round(cache_hit_rate, 2)
            },
            "rate_limiting": {
                "rejections": self.rate_limit_rejections
            },
            "errors": dict(self.errors_by_type)
        }
    
    def reset(self):
        """Reset all metrics"""
        self.start_time = time.time()
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        self.request_latencies.clear()
        self.provider_requests.clear()
        self.provider_successes.clear()
        self.provider_failures.clear()
        self.provider_latencies.clear()
        self.cache_hits = 0
        self.cache_misses = 0
        self.errors_by_type.clear()
        self.rate_limit_rejections = 0
        logger.info("Metrics reset")


def get_metrics_collector() -> MetricsCollector:
    """Get global metrics collector"""
    global _metrics_collector
    if _metrics_collector is None:
        _metrics_collector = MetricsCollector()
    return _metrics_collector

