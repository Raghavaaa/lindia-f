#!/usr/bin/env python3
"""
Comprehensive Health Check Script
Tests full integration: Frontend -> Backend -> AI Engine
"""

import requests
import json
import time
from datetime import datetime

class HealthChecker:
    def __init__(self):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "checks": {},
            "integration_tests": {},
            "overall_status": "UNKNOWN"
        }
        
        # Service URLs
        self.backend_url = "https://lindia-b-production.up.railway.app"
        self.ai_engine_url = "https://lindia-ai-production.up.railway.app"
        
    def check_service_health(self, url, service_name):
        """Check basic health of a service"""
        try:
            response = requests.get(f"{url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "HEALTHY",
                    "response_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "data": data
                }
            else:
                return {
                    "status": "UNHEALTHY",
                    "response_code": response.status_code,
                    "error": f"Non-200 status: {response.status_code}"
                }
        except requests.exceptions.Timeout:
            return {
                "status": "TIMEOUT",
                "error": "Request timed out after 10 seconds"
            }
        except requests.exceptions.ConnectionError:
            return {
                "status": "CONNECTION_ERROR",
                "error": "Could not connect to service"
            }
        except Exception as e:
            return {
                "status": "ERROR",
                "error": str(e)
            }
    
    def test_backend_ai_integration(self):
        """Test Backend -> AI Engine integration"""
        test_payload = {
            "query": "test bail query for integration",
            "client_id": "health_check_test"
        }
        
        try:
            print("🔄 Testing Backend -> AI Engine integration...")
            response = requests.post(
                f"{self.backend_url}/api/v1/research/",
                json=test_payload,
                timeout=30,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "SUCCESS",
                    "response_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "ai_response": data.get("ai_response", "No response"),
                    "model_used": data.get("model_used", "Unknown"),
                    "confidence": data.get("confidence", 0.0)
                }
            else:
                return {
                    "status": "FAILED",
                    "response_code": response.status_code,
                    "error": f"Backend returned {response.status_code}"
                }
        except requests.exceptions.Timeout:
            return {
                "status": "TIMEOUT",
                "error": "Backend request timed out after 30 seconds"
            }
        except Exception as e:
            return {
                "status": "ERROR",
                "error": str(e)
            }
    
    def test_ai_engine_direct(self):
        """Test AI Engine directly"""
        test_payload = {
            "query": "test direct AI engine query",
            "client_id": "health_check_test"
        }
        
        try:
            print("🔄 Testing AI Engine directly...")
            response = requests.post(
                f"{self.ai_engine_url}/api/v1/research/",
                json=test_payload,
                timeout=30,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "SUCCESS",
                    "response_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "ai_response": data.get("ai_response", "No response"),
                    "model_used": data.get("model_used", "Unknown"),
                    "confidence": data.get("confidence", 0.0)
                }
            else:
                return {
                    "status": "FAILED",
                    "response_code": response.status_code,
                    "error": f"AI Engine returned {response.status_code}"
                }
        except requests.exceptions.Timeout:
            return {
                "status": "TIMEOUT",
                "error": "AI Engine request timed out after 30 seconds"
            }
        except Exception as e:
            return {
                "status": "ERROR",
                "error": str(e)
            }
    
    def run_comprehensive_check(self):
        """Run all health checks"""
        print("🚀 COMPREHENSIVE HEALTH CHECK STARTING")
        print("=" * 50)
        
        # Check Backend Health
        print("🔍 Checking Backend Health...")
        self.results["checks"]["backend_health"] = self.check_service_health(
            self.backend_url, "Backend"
        )
        
        # Check AI Engine Health
        print("🔍 Checking AI Engine Health...")
        self.results["checks"]["ai_engine_health"] = self.check_service_health(
            self.ai_engine_url, "AI Engine"
        )
        
        # Test Backend -> AI Integration
        print("🔍 Testing Backend -> AI Integration...")
        self.results["integration_tests"]["backend_to_ai"] = self.test_backend_ai_integration()
        
        # Test AI Engine Direct
        print("🔍 Testing AI Engine Direct...")
        self.results["integration_tests"]["ai_engine_direct"] = self.test_ai_engine_direct()
        
        # Determine Overall Status
        self.determine_overall_status()
        
        return self.results
    
    def determine_overall_status(self):
        """Determine overall system health status"""
        all_healthy = True
        
        # Check basic health
        for check_name, check_result in self.results["checks"].items():
            if check_result["status"] != "HEALTHY":
                all_healthy = False
                break
        
        # Check integration tests
        for test_name, test_result in self.results["integration_tests"].items():
            if test_result["status"] != "SUCCESS":
                all_healthy = False
                break
        
        self.results["overall_status"] = "HEALTHY" if all_healthy else "UNHEALTHY"
    
    def print_results(self):
        """Print formatted results"""
        print("\n" + "=" * 50)
        print("📊 COMPREHENSIVE HEALTH CHECK RESULTS")
        print("=" * 50)
        
        print(f"🕐 Timestamp: {self.results['timestamp']}")
        print(f"🎯 Overall Status: {self.results['overall_status']}")
        
        print("\n🔍 SERVICE HEALTH CHECKS:")
        for service, result in self.results["checks"].items():
            status_emoji = "✅" if result["status"] == "HEALTHY" else "❌"
            print(f"  {status_emoji} {service}: {result['status']}")
            if result["status"] == "HEALTHY":
                print(f"     Response Time: {result['response_time']:.2f}s")
                print(f"     Data: {result['data']}")
            else:
                print(f"     Error: {result.get('error', 'Unknown error')}")
        
        print("\n🔄 INTEGRATION TESTS:")
        for test, result in self.results["integration_tests"].items():
            status_emoji = "✅" if result["status"] == "SUCCESS" else "❌"
            print(f"  {status_emoji} {test}: {result['status']}")
            if result["status"] == "SUCCESS":
                print(f"     Response Time: {result['response_time']:.2f}s")
                print(f"     Model Used: {result.get('model_used', 'Unknown')}")
                print(f"     Confidence: {result.get('confidence', 0.0)}")
                print(f"     Response Preview: {result.get('ai_response', 'No response')[:100]}...")
            else:
                print(f"     Error: {result.get('error', 'Unknown error')}")
        
        print("\n" + "=" * 50)
        
        if self.results["overall_status"] == "HEALTHY":
            print("🎉 ALL SYSTEMS HEALTHY - READY FOR INTEGRATION")
        else:
            print("🚨 SYSTEM ISSUES DETECTED - REQUIRES ATTENTION")
        
        print("=" * 50)

if __name__ == "__main__":
    checker = HealthChecker()
    results = checker.run_comprehensive_check()
    checker.print_results()
    
    # Save results to file
    with open("health_check_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to: health_check_results.json")
