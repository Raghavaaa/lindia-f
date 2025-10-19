#!/usr/bin/env node

// Simple build test script
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Testing build configuration...');

try {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }

  // Check if vercel.json exists
  if (!fs.existsSync('vercel.json')) {
    throw new Error('vercel.json not found');
  }

  console.log('✅ Configuration files found');

  // Test npm install
  console.log('📦 Testing npm install...');
  execSync('npm install --dry-run', { stdio: 'inherit' });
  console.log('✅ npm install test passed');

  // Test build command
  console.log('🔨 Testing build command...');
  execSync('npm run build --dry-run', { stdio: 'inherit' });
  console.log('✅ Build command test passed');

  console.log('🎉 All tests passed! Ready for Vercel deployment.');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
