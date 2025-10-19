"""
Main Inference Pipeline
Orchestrates all stages: A (sanitization), B (retrieval), C (inference), 
D (processing), E (validation)
"""
import logging
import time
from typing import Optional

from pipeline.models import PipelineRequest, PipelineResponse, PipelineConfig
from pipeline.sanitization import InputSanitizer
from pipeline.response_processor import ResponseProcessor
from providers import ProviderManager, InferenceRequest

logger = logging.getLogger(__name__)

# Global pipeline instance
_pipeline: Optional['InferencePipeline'] = None


class InferencePipeline:
    """
    Multi-stage inference pipeline.
    
    Stages:
    A. Input normalization and sanitization
    B. Retrieval (optional RAG)
    C. Model inference via provider manager
    D. Response processing and structuring
    E. Output validation
    """
    
    def __init__(
        self,
        provider_manager: ProviderManager,
        config: Optional[PipelineConfig] = None
    ):
        self.provider_manager = provider_manager
        self.config = config or PipelineConfig()
        
        # Initialize stage components
        self.sanitizer = InputSanitizer(max_length=self.config.max_query_length)
        self.response_processor = ResponseProcessor()
        
        logger.info("Inference pipeline initialized")
    
    async def process(self, request: PipelineRequest) -> PipelineResponse:
        """
        Process request through all pipeline stages.
        
        Args:
            request: Pipeline request
        
        Returns:
            Processed pipeline response
        """
        start_time = time.time()
        stages_completed = []
        
        try:
            # STAGE A: Input Sanitization and Normalization
            if self.config.enable_sanitization and not request.skip_sanitization:
                sanitized_query, is_safe, warnings = await self._stage_a_sanitization(request)
                stages_completed.append("sanitization")
                
                if warnings:
                    logger.warning(f"Sanitization warnings: {warnings}")
            else:
                sanitized_query = request.query
                is_safe = True
            
            # STAGE B: Retrieval (Optional RAG)
            retrieval_context = None
            if self.config.enable_retrieval and not request.skip_retrieval:
                retrieval_context = await self._stage_b_retrieval(sanitized_query, request)
                stages_completed.append("retrieval")
            
            # STAGE C: Model Inference
            inference_response = await self._stage_c_inference(
                sanitized_query,
                retrieval_context,
                request
            )
            stages_completed.append("inference")
            
            # STAGE D: Response Processing and Structuring
            if self.config.enable_response_structuring:
                processed_response = await self._stage_d_processing(
                    inference_response.answer,
                    request
                )
                stages_completed.append("processing")
            else:
                processed_response = {"answer": inference_response.answer}
            
            # STAGE E: Output Validation
            if self.config.enable_output_validation:
                validation_passed, issues = await self._stage_e_validation(
                    processed_response["answer"]
                )
                stages_completed.append("validation")
                
                if not validation_passed:
                    logger.warning(f"Validation issues: {issues}")
            else:
                validation_passed = True
            
            # Build final response
            total_latency = (time.time() - start_time) * 1000
            
            return PipelineResponse(
                answer=processed_response.get("answer", inference_response.answer),
                model_used=inference_response.model_used,
                provider_used=inference_response.provider_used,
                summary=processed_response.get("summary"),
                detailed_analysis=processed_response.get("detailed_analysis"),
                executive_summary=processed_response.get("executive_summary"),
                citations=processed_response.get("citations", []),
                legal_citations=processed_response.get("legal_citations", []),
                sources=processed_response.get("sources", []),
                confidence=inference_response.confidence,
                assistant_confidence=self._determine_confidence_level(
                    processed_response.get("confidence_indicators", [])
                ),
                quality_score=processed_response.get("quality_score"),
                tokens_used=inference_response.tokens_used,
                latency_ms=total_latency,
                cached=inference_response.cached,
                fallback=inference_response.fallback,
                pipeline_stages=stages_completed,
                sanitization_applied=self.config.enable_sanitization and not request.skip_sanitization,
                retrieval_used=retrieval_context is not None,
                validation_passed=validation_passed,
                metadata={
                    **request.metadata,
                    "inference_latency_ms": inference_response.latency_ms,
                    "pipeline_latency_ms": total_latency - inference_response.latency_ms
                }
            )
        
        except Exception as e:
            logger.error(f"Pipeline error: {str(e)}", exc_info=True)
            
            # Return error response
            return PipelineResponse(
                answer=f"Pipeline processing error: {str(e)}",
                model_used="error",
                provider_used="error",
                latency_ms=(time.time() - start_time) * 1000,
                fallback=True,
                validation_passed=False,
                pipeline_stages=stages_completed,
                assistant_confidence="low"
            )
    
    async def _stage_a_sanitization(
        self,
        request: PipelineRequest
    ) -> tuple[str, bool, list[str]]:
        """Stage A: Sanitize and normalize input"""
        logger.debug("Stage A: Input sanitization")
        
        # Validate length first
        is_valid, error = self.sanitizer.validate_length(request.query)
        if not is_valid:
            raise ValueError(error)
        
        # Sanitize
        sanitized_query, is_safe, warnings = self.sanitizer.sanitize(
            request.query,
            tenant_id=request.tenant_id
        )
        
        return sanitized_query, is_safe, warnings
    
    async def _stage_b_retrieval(
        self,
        query: str,
        request: PipelineRequest
    ) -> Optional[str]:
        """Stage B: Retrieve supporting context (optional RAG)"""
        logger.debug("Stage B: Retrieval (skipped - not configured)")
        
        # TODO: Implement RAG retrieval if needed
        # This would fetch relevant documents from vector store
        # For now, return None
        return None
    
    async def _stage_c_inference(
        self,
        query: str,
        retrieval_context: Optional[str],
        request: PipelineRequest
    ) -> any:
        """Stage C: Model inference"""
        logger.debug("Stage C: Model inference")
        
        # Build context
        context = request.context or "You are an expert AI legal assistant for Indian law."
        
        if retrieval_context:
            context += f"\n\nRelevant Context:\n{retrieval_context}"
        
        # Create inference request
        inference_req = InferenceRequest(
            query=query,
            context=context,
            tenant_id=request.tenant_id,
            model=request.model,
            provider=request.provider,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            metadata=request.metadata
        )
        
        # Call provider manager
        response = await self.provider_manager.generate(inference_req)
        
        return response
    
    async def _stage_d_processing(
        self,
        answer: str,
        request: PipelineRequest
    ) -> dict:
        """Stage D: Response processing and structuring"""
        logger.debug("Stage D: Response processing")
        
        # Process response
        processed = self.response_processor.process_response(
            answer,
            extract_citations=not request.skip_citation_extraction,
            create_summary=request.desired_response_format != "simple"
        )
        
        return processed
    
    async def _stage_e_validation(
        self,
        answer: str
    ) -> tuple[bool, list[str]]:
        """Stage E: Output validation"""
        logger.debug("Stage E: Output validation")
        
        # Validate response
        is_valid, issues = self.response_processor.validate_response(
            answer,
            max_length=self.config.max_response_length
        )
        
        return is_valid, issues
    
    def _determine_confidence_level(self, indicators: list[str]) -> str:
        """Determine overall confidence level from indicators"""
        high_count = sum(1 for ind in indicators if ind.startswith("high:"))
        low_count = sum(1 for ind in indicators if ind.startswith("low:"))
        
        if high_count > low_count * 2:
            return "high"
        elif low_count > high_count * 2:
            return "low"
        else:
            return "medium"
    
    def get_config(self) -> PipelineConfig:
        """Get pipeline configuration"""
        return self.config
    
    def update_config(self, config: PipelineConfig):
        """Update pipeline configuration"""
        self.config = config
        self.sanitizer = InputSanitizer(max_length=config.max_query_length)
        logger.info("Pipeline configuration updated")


def get_pipeline() -> InferencePipeline:
    """Get global pipeline instance"""
    global _pipeline
    if _pipeline is None:
        raise RuntimeError("Pipeline not initialized. Call initialize_pipeline() first.")
    return _pipeline


def initialize_pipeline(
    provider_manager: ProviderManager,
    config: Optional[PipelineConfig] = None
) -> InferencePipeline:
    """Initialize global pipeline"""
    global _pipeline
    _pipeline = InferencePipeline(provider_manager, config)
    return _pipeline

