#!/usr/bin/env python3
"""
Test script to verify backend functionality locally
"""
import asyncio
import httpx

async def test_backend():
    """Test the backend endpoints."""
    base_url = "https://api.legalindia.ai"
    
    print("=== BACKEND TEST ===")
    
    # Test health endpoint
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{base_url}/health", timeout=10.0)
            print(f"Health endpoint: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Health endpoint error: {str(e)}")
    
    # Test root endpoint
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{base_url}/", timeout=10.0)
            print(f"Root endpoint: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Root endpoint error: {str(e)}")
    
    # Test junior endpoint
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{base_url}/api/v1/junior/",
                json={"query": "murder bail", "client_id": "test"},
                timeout=30.0
            )
            print(f"Junior endpoint: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Junior endpoint error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_backend())
