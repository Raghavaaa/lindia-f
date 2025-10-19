"""
Stage D: Response Processing and Structuring
Extracts citations, creates summaries, applies formatting
"""
import re
import logging
from typing import Dict, Any, List, Tuple, Optional

logger = logging.getLogger(__name__)


class ResponseProcessor:
    """
    Processes AI responses to extract structured information,
    citations, and apply legal formatting.
    """
    
    # Legal citation patterns (Indian law)
    CITATION_PATTERNS = [
        # AIR citations: AIR 1950 SC 27
        r"AIR\s+\d{4}\s+[A-Z]{2,5}\s+\d+",
        # Section references: Section 302, IPC or Section 420 of IPC
        r"Section\s+\d+[A-Z]?\s+(of\s+)?(?:IPC|CrPC|CPC|IT Act)",
        # Article references: Article 21 or Article 32 of Constitution
        r"Article\s+\d+[A-Z]?\s+(of\s+(the\s+)?Constitution)?",
        # Act references: Indian Penal Code, 1860
        r"(?:Indian|Constitution|Code|Act)\s+[\w\s]+,?\s+\d{4}",
        # Case name pattern: Name v. Name
        r"[A-Z][a-zA-Z\s]+\s+v\.?\s+[A-Z][a-zA-Z\s]+",
    ]
    
    def __init__(self):
        self.citation_regex = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.CITATION_PATTERNS
        ]
    
    def process_response(
        self,
        answer: str,
        extract_citations: bool = True,
        create_summary: bool = True
    ) -> Dict[str, Any]:
        """
        Process response and extract structured information.
        
        Args:
            answer: Raw AI response
            extract_citations: Whether to extract citations
            create_summary: Whether to create summary
        
        Returns:
            Dict with processed response components
        """
        result = {
            "answer": answer,
            "summary": None,
            "detailed_analysis": None,
            "executive_summary": None,
            "citations": [],
            "legal_citations": [],
            "sources": [],
            "confidence_indicators": [],
            "quality_score": 0.0
        }
        
        # Extract citations
        if extract_citations:
            citations = self._extract_citations(answer)
            result["citations"] = citations["all"]
            result["legal_citations"] = citations["legal"]
            result["sources"] = citations["sources"]
        
        # Create summaries
        if create_summary:
            summaries = self._create_summaries(answer)
            result["summary"] = summaries["summary"]
            result["executive_summary"] = summaries["executive"]
            result["detailed_analysis"] = summaries["detailed"]
        
        # Detect confidence indicators
        result["confidence_indicators"] = self._detect_confidence_indicators(answer)
        
        # Calculate quality score
        result["quality_score"] = self._calculate_quality_score(answer, result)
        
        return result
    
    def _extract_citations(self, text: str) -> Dict[str, List]:
        """Extract legal citations from text"""
        all_citations = []
        legal_citations = []
        sources = []
        
        # Find all citation matches
        for regex in self.citation_regex:
            matches = regex.findall(text)
            for match in matches:
                citation_text = match.strip()
                
                # Categorize citation
                if any(keyword in citation_text.upper() for keyword in ["AIR", "V.", "CASE"]):
                    legal_citations.append({
                        "citation": citation_text,
                        "type": "case_law",
                        "confidence": 0.9
                    })
                elif "SECTION" in citation_text.upper():
                    legal_citations.append({
                        "citation": citation_text,
                        "type": "statute",
                        "confidence": 0.95
                    })
                elif "ARTICLE" in citation_text.upper():
                    legal_citations.append({
                        "citation": citation_text,
                        "type": "constitutional",
                        "confidence": 0.95
                    })
                else:
                    legal_citations.append({
                        "citation": citation_text,
                        "type": "general",
                        "confidence": 0.7
                    })
                
                all_citations.append({
                    "text": citation_text,
                    "source": "extracted"
                })
                sources.append(citation_text)
        
        # Deduplicate
        legal_citations = self._deduplicate_citations(legal_citations)
        sources = list(set(sources))
        
        return {
            "all": all_citations,
            "legal": legal_citations,
            "sources": sources
        }
    
    def _deduplicate_citations(self, citations: List[Dict]) -> List[Dict]:
        """Remove duplicate citations"""
        seen = set()
        unique = []
        
        for citation in citations:
            key = citation["citation"].lower()
            if key not in seen:
                seen.add(key)
                unique.append(citation)
        
        return unique
    
    def _create_summaries(self, text: str) -> Dict[str, Optional[str]]:
        """Create various summary types from text"""
        summaries = {
            "summary": None,
            "executive": None,
            "detailed": None
        }
        
        # Split into sections if available
        sections = self._split_into_sections(text)
        
        # Executive summary: first paragraph or first 200 chars
        if sections:
            first_section = sections[0]
            summaries["executive"] = self._truncate_smart(first_section, 200)
        else:
            summaries["executive"] = self._truncate_smart(text, 200)
        
        # Summary: first 500 chars
        summaries["summary"] = self._truncate_smart(text, 500)
        
        # Detailed: full text with sections
        if len(sections) > 1:
            summaries["detailed"] = text
        
        return summaries
    
    def _split_into_sections(self, text: str) -> List[str]:
        """Split text into logical sections"""
        # Split by common section markers
        section_markers = [
            r"\n\n\*\*[A-Z]",  # **Section Title
            r"\n\n#+ ",  # ## Markdown headers
            r"\n\n\d+\.",  # 1. Numbered sections
        ]
        
        sections = [text]
        for marker_pattern in section_markers:
            if re.search(marker_pattern, text):
                sections = re.split(marker_pattern, text)
                break
        
        return [s.strip() for s in sections if s.strip()]
    
    def _truncate_smart(self, text: str, max_length: int) -> str:
        """Truncate text at sentence boundary"""
        if len(text) <= max_length:
            return text
        
        # Try to truncate at sentence boundary
        truncated = text[:max_length]
        last_period = truncated.rfind('.')
        last_newline = truncated.rfind('\n')
        
        boundary = max(last_period, last_newline)
        if boundary > max_length * 0.7:  # Only if we don't lose too much
            return text[:boundary + 1].strip()
        
        return truncated.strip() + "..."
    
    def _detect_confidence_indicators(self, text: str) -> List[str]:
        """Detect confidence indicators in text"""
        indicators = []
        
        # High confidence indicators
        high_confidence = [
            r"according to",
            r"as per",
            r"clearly stated",
            r"explicitly",
            r"mandated by",
            r"Supreme Court held",
            r"established precedent"
        ]
        
        # Low confidence indicators
        low_confidence = [
            r"may",
            r"might",
            r"possibly",
            r"uncertain",
            r"unclear",
            r"subject to interpretation",
            r"depends on",
            r"could be"
        ]
        
        text_lower = text.lower()
        
        for pattern in high_confidence:
            if re.search(pattern, text_lower):
                indicators.append(f"high:{pattern}")
        
        for pattern in low_confidence:
            if re.search(pattern, text_lower):
                indicators.append(f"low:{pattern}")
        
        return indicators
    
    def _calculate_quality_score(self, text: str, processed: Dict[str, Any]) -> float:
        """Calculate quality score for response"""
        score = 0.5  # Base score
        
        # Length score (appropriate length is good)
        if 200 <= len(text) <= 5000:
            score += 0.1
        
        # Citation score (more citations = better)
        num_citations = len(processed.get("citations", []))
        if num_citations > 0:
            score += min(0.2, num_citations * 0.05)
        
        # Structure score (has sections)
        if "**" in text or "##" in text:
            score += 0.1
        
        # Confidence indicators
        confidence_indicators = processed.get("confidence_indicators", [])
        high_conf = sum(1 for ind in confidence_indicators if ind.startswith("high:"))
        low_conf = sum(1 for ind in confidence_indicators if ind.startswith("low:"))
        
        if high_conf > low_conf:
            score += 0.1
        elif low_conf > high_conf:
            score -= 0.1
        
        return min(1.0, max(0.0, score))
    
    def validate_response(
        self,
        response: str,
        max_length: int = 50000
    ) -> Tuple[bool, List[str]]:
        """
        Validate response meets quality criteria.
        
        Returns:
            Tuple of (is_valid, issues)
        """
        issues = []
        
        # Length check
        if len(response) < 10:
            issues.append("Response too short")
        elif len(response) > max_length:
            issues.append(f"Response exceeds maximum length ({max_length})")
        
        # Content check
        if not response.strip():
            issues.append("Response is empty")
        
        # Check for error messages
        error_patterns = [
            r"error:",
            r"exception:",
            r"failed to",
            r"unable to process"
        ]
        
        for pattern in error_patterns:
            if re.search(pattern, response.lower()):
                issues.append(f"Response contains error pattern: {pattern}")
        
        is_valid = len(issues) == 0
        return is_valid, issues

