#!/usr/bin/env node
/**
 * Accessibility Audit Script
 * 
 * This script checks for common accessibility issues in the codebase.
 * For full axe-core testing, run this with a browser automation tool.
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('ACCESSIBILITY AUDIT');
console.log('='.repeat(60));
console.log('');

const issues = [];
const warnings = [];

// Scan source files
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.relative(process.cwd(), filePath);
  
  // Check for images without alt text
  if (content.match(/<img(?![^>]*alt=)/g)) {
    issues.push(`${fileName}: <img> tags without alt attribute`);
  }
  
  // Check for buttons without accessible text
  if (content.match(/<button[^>]*>[\s]*<[^>]*\/>[^<]*<\/button>/g)) {
    warnings.push(`${fileName}: Button with only icon (check aria-label)`);
  }
  
  // Check for inputs without labels
  if (content.match(/<input(?![^>]*aria-label)(?![^>]*id="[^"]*"[^>]*<label[^>]*for=)/g)) {
    issues.push(`${fileName}: Input without label or aria-label`);
  }
  
  // Check for onClick on non-interactive elements
  if (content.match(/<div[^>]*onClick/g) || content.match(/<span[^>]*onClick/g)) {
    warnings.push(`${fileName}: onClick on div/span (should use button)`);
  }
  
  // Check for role="button" without keyboard handler
  if (content.match(/role="button"(?![^>]*onKeyDown)/g)) {
    issues.push(`${fileName}: role="button" without onKeyDown handler`);
  }
}

// Recursively scan directory
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      scanFile(filePath);
    }
  }
}

// Run scan
try {
  scanDirectory(path.join(process.cwd(), 'src'));
  
  console.log(`Scanned source files\n`);
  
  if (issues.length > 0) {
    console.log(`\n❌ CRITICAL ISSUES (${issues.length}):`);
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ No obvious accessibility issues found\n');
    console.log('Note: This is a basic scan. Run axe-core with browser for full audit.');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY: ${issues.length} critical, ${warnings.length} warnings`);
  console.log('='.repeat(60));
  
  process.exit(issues.length > 0 ? 1 : 0);
  
} catch (error) {
  console.error('Error during accessibility scan:', error.message);
  process.exit(1);
}

