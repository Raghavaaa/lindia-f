#!/usr/bin/env python3
"""
Test script to verify AI inference is working properly.
"""
import asyncio
import httpx
import json

async def test_ai_inference():
    """Test the AI inference endpoint."""
    ai_engine_url = "https://lindia-ai-production.up.railway.app"
    
    # Test data
    test_cases = [
        {
            "query": "murder bail conditions in India",
            "context": "legal research",
            "tenant_id": "test_user"
        },
        {
            "query": "contract law requirements",
            "context": "business law",
            "tenant_id": "test_user"
        }
    ]
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        print("Testing AI inference endpoints...")
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n--- Test Case {i} ---")
            print(f"Query: {test_case['query']}")
            
            try:
                response = await client.post(
                    f"{ai_engine_url}/inference",
                    json=test_case,
                    headers={"Content-Type": "application/json"}
                )
                
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"Answer: {data.get('answer', 'No answer')[:200]}...")
                    print(f"Model: {data.get('model', 'Unknown')}")
                    print(f"Tokens: {data.get('tokens_used', 'Unknown')}")
                else:
                    print(f"Error: {response.text}")
                    
            except Exception as e:
                print(f"Exception: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_ai_inference())
