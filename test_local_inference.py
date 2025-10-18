#!/usr/bin/env python3
"""
Test the AI inference locally to verify the fix is working.
"""
import sys
import os
sys.path.append('/Users/raghavankarthik/ai-law-junior/ai-engine')

from core.providers import provider_router
import asyncio

async def test_local_inference():
    """Test the provider router locally."""
    print("Testing local AI inference...")
    
    try:
        # Test the provider router directly
        result = await provider_router.inference(
            query="murder bail conditions in India",
            context="legal research",
            tenant_id="test_user",
            request_id="test_123"
        )
        
        print("✅ Local inference successful!")
        print(f"Answer: {result.get('answer', 'No answer')[:200]}...")
        print(f"Model: {result.get('model', 'Unknown')}")
        print(f"Sources: {result.get('sources', [])}")
        
    except Exception as e:
        print(f"❌ Local inference failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_local_inference())
