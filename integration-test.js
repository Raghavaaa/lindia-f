#!/usr/bin/env node

/**
 * Frontend Integration Sanity Test
 * 
 * Tests:
 * 1. Backend health check
 * 2. Research endpoint
 * 3. Storage endpoint (or queue if offline)
 * 
 * Usage:
 *   BACKEND_URL=http://your-backend node integration-test.js
 */

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
const TEST_RESULTS = [];

function log(message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, message, data };
  console.log(`[${timestamp}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  TEST_RESULTS.push(logEntry);
}

function logError(message, error) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, message, error: error.message, stack: error.stack };
  console.error(`[${timestamp}] ❌ ${message}`, error.message);
  TEST_RESULTS.push(logEntry);
}

async function testHealthEndpoint() {
  log('TEST 1: Health Check');
  try {
    const url = `${BACKEND_URL}/health`;
    log(`Calling: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json().catch(() => ({ status: 'ok' }));
      log('✅ Health check passed', data);
      return { passed: true, status: response.status, data };
    } else {
      log(`❌ Health check failed with status ${response.status}`);
      return { passed: false, status: response.status };
    }
  } catch (error) {
    logError('❌ Health check error', error);
    return { passed: false, error: error.message };
  }
}

async function testResearchEndpoint() {
  log('TEST 2: Research Endpoint');
  try {
    const url = `${BACKEND_URL}/api/research`;
    const payload = {
      query: 'What are the key provisions of the Indian Contract Act, 1872?',
      context: 'Integration test query',
      tenant_id: 'test_client_001'
    };
    
    log(`Calling: POST ${url}`, payload);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000), // 30s timeout for AI
    });

    log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      log('✅ Research endpoint passed', { 
        hasAnswer: !!data.answer || !!data.ai_response || !!data.result,
        responseLength: JSON.stringify(data).length 
      });
      return { passed: true, status: response.status, data };
    } else {
      const errorText = await response.text();
      log(`❌ Research endpoint failed with status ${response.status}`, { error: errorText });
      return { passed: false, status: response.status, error: errorText };
    }
  } catch (error) {
    logError('❌ Research endpoint error', error);
    return { passed: false, error: error.message };
  }
}

async function testStorageEndpoint() {
  log('TEST 3: Storage Endpoint');
  try {
    const url = `${BACKEND_URL}/api/storage`;
    const payload = {
      clientId: 'test_client_001',
      type: 'research',
      data: {
        id: 'test_' + Date.now(),
        query: 'Test query',
        resultText: 'Test result',
        ts: Date.now()
      }
    };
    
    log(`Calling: POST ${url}`, payload);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json().catch(() => ({ status: 'stored' }));
      log('✅ Storage endpoint passed', data);
      return { passed: true, status: response.status, data };
    } else {
      const errorText = await response.text();
      log(`❌ Storage endpoint failed with status ${response.status}`, { error: errorText });
      return { passed: false, status: response.status, error: errorText };
    }
  } catch (error) {
    logError('❌ Storage endpoint error', error);
    return { passed: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n='.repeat(60));
  console.log('FRONTEND INTEGRATION SANITY TEST');
  console.log('='.repeat(60));
  
  if (!BACKEND_URL) {
    console.error('\n❌ ERROR: BACKEND_URL environment variable is not set!');
    console.error('Usage: BACKEND_URL=http://your-backend node integration-test.js\n');
    process.exit(1);
  }
  
  log(`Backend URL: ${BACKEND_URL}`);
  console.log('');
  
  const results = {
    health: await testHealthEndpoint(),
    research: await testResearchEndpoint(),
    storage: await testStorageEndpoint(),
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(r => r.passed).length;
  const total = Object.keys(results).length;
  
  console.log(`\nTests passed: ${passed}/${total}`);
  console.log(`\nDetailed Results:`);
  Object.entries(results).forEach(([test, result]) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`  ${icon} ${test}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    if (!result.passed && result.error) {
      console.log(`     Error: ${result.error}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  
  // Save results to file
  const fs = require('fs');
  const resultsFile = 'integration-test-results.json';
  fs.writeFileSync(resultsFile, JSON.stringify({ results, logs: TEST_RESULTS }, null, 2));
  log(`\nTest results saved to: ${resultsFile}`);
  
  process.exit(passed === total ? 0 : 1);
}

runTests();

