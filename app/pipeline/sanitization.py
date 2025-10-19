"""
Stage A: Input Sanitization and Normalization
Detects and neutralizes prompt injections and unsafe patterns
"""
import re
import logging
from typing import Tuple, List

logger = logging.getLogger(__name__)


class InputSanitizer:
    """
    Sanitizes and validates input queries.
    Detects prompt injection attempts and unsafe patterns.
    """
    
    # Common prompt injection patterns
    INJECTION_PATTERNS = [
        r"ignore\s+(all\s+)?previous\s+instructions",
        r"disregard\s+(all\s+)?previous",
        r"forget\s+(all\s+)?previous",
        r"system\s*:\s*you\s+are",
        r"<\s*system\s*>",
        r"</\s*system\s*>",
        r"{{.*?}}",  # Template injection
        r"\[INST\]|\[/INST\]",  # Llama-style injection
        r"<\|.*?\|>",  # Special tokens
        r"###\s*System",
        r"###\s*Human",
        r"###\s*Assistant",
        r"BEGIN\s+SYSTEM\s+PROMPT",
        r"END\s+SYSTEM\s+PROMPT",
    ]
    
    # Suspicious patterns that may indicate injection
    SUSPICIOUS_PATTERNS = [
        r"(execute|run)\s+(command|code|script)",
        r"eval\s*\(",
        r"exec\s*\(",
        r"__import__",
        r"subprocess",
        r"os\.system",
    ]
    
    def __init__(self, max_length: int = 10000):
        self.max_length = max_length
        self.compiled_patterns = [
            re.compile(pattern, re.IGNORECASE | re.MULTILINE)
            for pattern in self.INJECTION_PATTERNS
        ]
        self.suspicious_compiled = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.SUSPICIOUS_PATTERNS
        ]
    
    def sanitize(self, query: str, tenant_id: Optional[str] = None) -> Tuple[str, bool, List[str]]:
        """
        Sanitize input query.
        
        Args:
            query: Input query to sanitize
            tenant_id: Optional tenant ID for logging
        
        Returns:
            Tuple of (sanitized_query, is_safe, warnings)
        """
        warnings = []
        
        # Length check
        if len(query) > self.max_length:
            warnings.append(f"Query truncated from {len(query)} to {self.max_length} chars")
            query = query[:self.max_length]
        
        # Check for injection attempts
        for pattern in self.compiled_patterns:
            if pattern.search(query):
                warnings.append(f"Potential prompt injection detected: {pattern.pattern[:50]}")
                logger.warning(f"Prompt injection attempt from tenant {tenant_id}: {pattern.pattern[:50]}")
                # Neutralize by replacing with safe text
                query = pattern.sub("[FILTERED]", query)
        
        # Check for suspicious patterns
        for pattern in self.suspicious_compiled:
            if pattern.search(query):
                warnings.append(f"Suspicious pattern detected: {pattern.pattern[:50]}")
                logger.warning(f"Suspicious pattern from tenant {tenant_id}: {pattern.pattern[:50]}")
        
        # Normalize whitespace
        query = " ".join(query.split())
        
        # Remove control characters except newlines and tabs
        query = "".join(char for char in query if char.isprintable() or char in "\n\t")
        
        # Check if query is safe
        is_safe = len(warnings) == 0
        
        if not is_safe:
            logger.info(f"Sanitized query with {len(warnings)} warnings")
        
        return query, is_safe, warnings
    
    def validate_length(self, query: str, min_length: int = 3) -> Tuple[bool, str]:
        """
        Validate query length.
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(query) < min_length:
            return False, f"Query too short (minimum {min_length} characters)"
        if len(query) > self.max_length:
            return False, f"Query too long (maximum {self.max_length} characters)"
        return True, ""


from typing import Optional

def sanitize_input(query: str, tenant_id: Optional[str] = None, max_length: int = 10000) -> Tuple[str, bool, List[str]]:
    """
    Convenience function to sanitize input.
    
    Returns:
        Tuple of (sanitized_query, is_safe, warnings)
    """
    sanitizer = InputSanitizer(max_length=max_length)
    return sanitizer.sanitize(query, tenant_id)

