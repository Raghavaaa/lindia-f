"""
Pre-Deploy Checks
Validates system configuration and readiness before deployment
"""
import asyncio
import sys
import os
import logging
from typing import Dict, Any, List

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)


class PreDeployChecker:
    """Runs comprehensive pre-deploy checks"""
    
    def __init__(self):
        self.checks_passed = []
        self.checks_failed = []
        self.warnings = []
    
    async def run_all_checks(self) -> bool:
        """Run all pre-deploy checks"""
        logger.info("=" * 70)
        logger.info("PRE-DEPLOY CHECKS - LegalIndia.ai Backend v2.0")
        logger.info("=" * 70)
        
        # Check 1: Environment variables
        await self.check_environment_variables()
        
        # Check 2: Configuration loading
        await self.check_configuration()
        
        # Check 3: Provider initialization
        await self.check_providers()
        
        # Check 4: Pipeline initialization
        await self.check_pipeline()
        
        # Check 5: Database connectivity
        await self.check_database()
        
        # Check 6: Dependencies
        await self.check_dependencies()
        
        # Check 7: Run sample inference
        await self.check_sample_inference()
        
        # Print summary
        self.print_summary()
        
        return len(self.checks_failed) == 0
    
    async def check_environment_variables(self):
        """Check required environment variables"""
        logger.info("\n[1/7] Checking environment variables...")
        
        required_vars = []
        optional_vars = [
            "RUNTIME_MODE",
            "AI_ENGINE_URL",
            "API_SECRET_KEY",
            "OPENAI_API_KEY",
            "DEEPSEEK_API_KEY",
            "GROQ_API_KEY",
            "DATABASE_URL",
            "CACHE_BACKEND",
            "RATE_LIMIT_ENABLED"
        ]
        
        # Check required
        for var in required_vars:
            if not os.getenv(var):
                self.checks_failed.append(f"Required env var missing: {var}")
        
        # Check optional
        configured_vars = []
        for var in optional_vars:
            if os.getenv(var):
                configured_vars.append(var)
        
        if configured_vars:
            logger.info(f"✓ Found {len(configured_vars)} configured variables")
            self.checks_passed.append("Environment variables")
        else:
            self.warnings.append("No environment variables configured - using defaults")
            self.checks_passed.append("Environment variables (defaults)")
    
    async def check_configuration(self):
        """Check configuration loading"""
        logger.info("\n[2/7] Checking configuration loading...")
        
        try:
            from config import load_config_from_env
            
            config = load_config_from_env()
            
            logger.info(f"✓ Runtime mode: {config.runtime_mode}")
            logger.info(f"✓ Providers configured: {len(config.provider_configs)}")
            logger.info(f"✓ Cache enabled: {config.enable_caching}")
            logger.info(f"✓ Rate limiting enabled: {config.rate_limit_enabled}")
            
            self.checks_passed.append("Configuration loading")
        
        except Exception as e:
            logger.error(f"✗ Configuration loading failed: {str(e)}")
            self.checks_failed.append(f"Configuration: {str(e)}")
    
    async def check_providers(self):
        """Check provider initialization and credentials"""
        logger.info("\n[3/7] Checking provider initialization...")
        
        try:
            from config import load_config_from_env
            from providers import initialize_provider_manager
            
            config = load_config_from_env()
            provider_manager = initialize_provider_manager(config.provider_configs)
            
            # Validate credentials
            logger.info("Validating provider credentials...")
            validation_results = await provider_manager.validate_all_providers()
            
            valid_count = sum(1 for valid in validation_results.values() if valid)
            total_count = len(validation_results)
            
            for name, valid in validation_results.items():
                status = "✓" if valid else "✗"
                logger.info(f"{status} Provider {name}: {'PASS' if valid else 'FAIL'}")
            
            if valid_count > 0:
                logger.info(f"✓ {valid_count}/{total_count} providers healthy")
                self.checks_passed.append(f"Providers ({valid_count}/{total_count} healthy)")
            else:
                logger.warning(f"⚠ No healthy providers (will use fallback)")
                self.warnings.append("No healthy providers - fallback mode only")
                self.checks_passed.append("Providers (fallback mode)")
        
        except Exception as e:
            logger.error(f"✗ Provider initialization failed: {str(e)}")
            self.checks_failed.append(f"Providers: {str(e)}")
    
    async def check_pipeline(self):
        """Check pipeline initialization"""
        logger.info("\n[4/7] Checking pipeline initialization...")
        
        try:
            from config import load_config_from_env
            from providers import initialize_provider_manager
            from pipeline import initialize_pipeline
            
            config = load_config_from_env()
            provider_manager = initialize_provider_manager(config.provider_configs)
            pipeline = initialize_pipeline(provider_manager, config.pipeline_config)
            
            logger.info("✓ Pipeline initialized successfully")
            logger.info(f"✓ Sanitization: {config.pipeline_config.enable_sanitization}")
            logger.info(f"✓ Citation extraction: {config.pipeline_config.enable_citation_extraction}")
            logger.info(f"✓ Response structuring: {config.pipeline_config.enable_response_structuring}")
            logger.info(f"✓ Output validation: {config.pipeline_config.enable_output_validation}")
            
            self.checks_passed.append("Pipeline initialization")
        
        except Exception as e:
            logger.error(f"✗ Pipeline initialization failed: {str(e)}")
            self.checks_failed.append(f"Pipeline: {str(e)}")
    
    async def check_database(self):
        """Check database connectivity"""
        logger.info("\n[5/7] Checking database connectivity...")
        
        try:
            from database import SessionLocal
            from sqlalchemy import text
            
            db = SessionLocal()
            db.execute(text("SELECT 1"))
            db.close()
            
            logger.info("✓ Database connection successful")
            self.checks_passed.append("Database connectivity")
        
        except Exception as e:
            logger.warning(f"⚠ Database connection failed: {str(e)}")
            self.warnings.append(f"Database unavailable: {str(e)}")
            self.checks_passed.append("Database (degraded)")
    
    async def check_dependencies(self):
        """Check Python dependencies"""
        logger.info("\n[6/7] Checking dependencies...")
        
        required_packages = [
            "fastapi",
            "uvicorn",
            "pydantic",
            "httpx",
            "sqlalchemy"
        ]
        
        missing = []
        for package in required_packages:
            try:
                __import__(package)
            except ImportError:
                missing.append(package)
        
        if missing:
            logger.error(f"✗ Missing packages: {', '.join(missing)}")
            self.checks_failed.append(f"Dependencies: {', '.join(missing)}")
        else:
            logger.info(f"✓ All required packages installed")
            self.checks_passed.append("Dependencies")
    
    async def check_sample_inference(self):
        """Run a sample inference test"""
        logger.info("\n[7/7] Running sample inference test...")
        
        try:
            from config import load_config_from_env
            from providers import initialize_provider_manager
            from pipeline import initialize_pipeline
            from pipeline.models import PipelineRequest
            
            config = load_config_from_env()
            provider_manager = initialize_provider_manager(config.provider_configs)
            pipeline = initialize_pipeline(provider_manager, config.pipeline_config)
            
            # Run test inference
            test_request = PipelineRequest(
                query="What is Section 302 IPC?",
                context="Test query for pre-deploy validation"
            )
            
            logger.info("Running test inference...")
            response = await pipeline.process(test_request)
            
            # Validate response
            if not response.answer:
                raise Exception("Empty response received")
            
            if len(response.answer) < 10:
                raise Exception("Response too short")
            
            logger.info(f"✓ Sample inference successful")
            logger.info(f"  Provider: {response.provider_used}")
            logger.info(f"  Model: {response.model_used}")
            logger.info(f"  Latency: {response.latency_ms:.2f}ms")
            logger.info(f"  Pipeline stages: {len(response.pipeline_stages)}")
            
            if response.fallback:
                logger.warning("⚠ Response used fallback mode")
                self.warnings.append("Sample inference used fallback")
            
            self.checks_passed.append("Sample inference")
        
        except Exception as e:
            logger.error(f"✗ Sample inference failed: {str(e)}")
            self.checks_failed.append(f"Sample inference: {str(e)}")
    
    def print_summary(self):
        """Print summary of checks"""
        logger.info("\n" + "=" * 70)
        logger.info("PRE-DEPLOY CHECK SUMMARY")
        logger.info("=" * 70)
        
        logger.info(f"\n✓ PASSED: {len(self.checks_passed)}")
        for check in self.checks_passed:
            logger.info(f"  - {check}")
        
        if self.warnings:
            logger.info(f"\n⚠ WARNINGS: {len(self.warnings)}")
            for warning in self.warnings:
                logger.warning(f"  - {warning}")
        
        if self.checks_failed:
            logger.info(f"\n✗ FAILED: {len(self.checks_failed)}")
            for failure in self.checks_failed:
                logger.error(f"  - {failure}")
        
        logger.info("\n" + "=" * 70)
        
        if len(self.checks_failed) == 0:
            logger.info("✓ ALL CHECKS PASSED - READY FOR DEPLOYMENT")
            logger.info("=" * 70)
            return True
        else:
            logger.error("✗ SOME CHECKS FAILED - NOT READY FOR DEPLOYMENT")
            logger.info("=" * 70)
            return False


async def main():
    """Run pre-deploy checks"""
    checker = PreDeployChecker()
    passed = await checker.run_all_checks()
    
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    asyncio.run(main())

