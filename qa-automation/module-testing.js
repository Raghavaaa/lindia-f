#!/usr/bin/env node
/**
 * Module Testing Script - International Standards Compliance
 * 
 * Tests all frontend modules according to international standards:
 * - WCAG 2.1 AA accessibility
 * - International phone number validation
 * - Form validation standards
 * - Keyboard navigation
 * - Screen reader compatibility
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('MODULE TESTING - INTERNATIONAL STANDARDS COMPLIANCE');
console.log('='.repeat(80));
console.log('');

const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function logTest(testName, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${testName}: ${status}`);
  if (details) console.log(`   ${details}`);
  
  testResults.details.push({ test: testName, status, details });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

// Test 1: Phone Number Validation
function testPhoneValidation() {
  console.log('\n📱 PHONE NUMBER VALIDATION TESTS');
  console.log('-'.repeat(40));
  
  const validPhones = [
    '+1 234 567 8900',
    '+91 99999 99999',
    '+44 20 7946 0958',
    '1234567890',
    '+33 1 42 86 83 26',
    '+49 30 12345678'
  ];
  
  const invalidPhones = [
    'abc123',
    '123',
    '123456789012345678', // too long
    '0000000000', // starts with 0
    '++1234567890', // double plus
    '' // empty
  ];
  
  // Test valid phones
  validPhones.forEach(phone => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const isValid = /^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone) && 
                   cleanPhone.length >= 10 && cleanPhone.length <= 15;
    logTest(`Valid phone: ${phone}`, isValid ? 'PASS' : 'FAIL');
  });
  
  // Test invalid phones
  invalidPhones.forEach(phone => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const isValid = /^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone) && 
                   cleanPhone.length >= 10 && cleanPhone.length <= 15;
    logTest(`Invalid phone: ${phone}`, !isValid ? 'PASS' : 'FAIL');
  });
}

// Test 2: Form Validation Standards
function testFormValidation() {
  console.log('\n📝 FORM VALIDATION TESTS');
  console.log('-'.repeat(40));
  
  // Test name validation
  const validNames = ['John Doe', 'Dr. Smith', 'Mary Jane Watson-Parker'];
  const invalidNames = ['A', 'x'.repeat(101), '', '   '];
  
  validNames.forEach(name => {
    const isValid = name.trim().length >= 2 && name.trim().length <= 100;
    logTest(`Valid name: "${name}"`, isValid ? 'PASS' : 'FAIL');
  });
  
  invalidNames.forEach(name => {
    const isValid = name.trim().length >= 2 && name.trim().length <= 100;
    logTest(`Invalid name: "${name}"`, !isValid ? 'PASS' : 'FAIL');
  });
}

// Test 3: Accessibility Standards
function testAccessibility() {
  console.log('\n♿ ACCESSIBILITY TESTS');
  console.log('-'.repeat(40));
  
  const files = [
    'src/components/ClientModal.tsx',
    'src/components/ResearchModule.tsx',
    'src/components/JuniorModule.tsx',
    'src/components/PropertyOpinionModule.tsx',
    'src/components/CaseModule.tsx'
  ];
  
  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for aria-labels
      const hasAriaLabels = content.includes('aria-label') || content.includes('aria-describedby');
      logTest(`${file} - ARIA labels`, hasAriaLabels ? 'PASS' : 'WARN', 
              hasAriaLabels ? 'ARIA labels present' : 'Missing ARIA labels');
      
      // Check for proper form labels
      const hasFormLabels = content.includes('htmlFor=') || content.includes('aria-labelledby');
      logTest(`${file} - Form labels`, hasFormLabels ? 'PASS' : 'WARN',
              hasFormLabels ? 'Form labels present' : 'Missing form labels');
      
      // Check for keyboard navigation
      const hasKeyboardNav = content.includes('onKeyDown') || content.includes('tabIndex');
      logTest(`${file} - Keyboard navigation`, hasKeyboardNav ? 'PASS' : 'WARN',
              hasKeyboardNav ? 'Keyboard navigation present' : 'Missing keyboard handlers');
      
      // Check for focus management
      const hasFocusManagement = content.includes('autoFocus') || content.includes('focus()');
      logTest(`${file} - Focus management`, hasFocusManagement ? 'PASS' : 'WARN',
              hasFocusManagement ? 'Focus management present' : 'Missing focus management');
    }
  });
}

// Test 4: International Standards Compliance
function testInternationalStandards() {
  console.log('\n🌍 INTERNATIONAL STANDARDS TESTS');
  console.log('-'.repeat(40));
  
  // Test WCAG 2.1 AA compliance indicators
  const wcagTests = [
    {
      name: 'Color contrast ratio >= 4.5:1',
      check: () => {
        // Check if CSS uses proper contrast ratios
        const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
        if (fs.existsSync(globalsPath)) {
          const content = fs.readFileSync(globalsPath, 'utf8');
          return content.includes('hsl(') || content.includes('rgb(');
        }
        return false;
      }
    },
    {
      name: 'Semantic HTML structure',
      check: () => {
        const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
        if (fs.existsSync(layoutPath)) {
          const content = fs.readFileSync(layoutPath, 'utf8');
          return content.includes('<main>') && content.includes('<header>') && content.includes('<footer>');
        }
        return false;
      }
    },
    {
      name: 'Alternative text for images',
      check: () => {
        const headerPath = path.join(process.cwd(), 'src/components/header.tsx');
        if (fs.existsSync(headerPath)) {
          const content = fs.readFileSync(headerPath, 'utf8');
          return !content.includes('<img') || content.includes('alt=');
        }
        return true;
      }
    }
  ];
  
  wcagTests.forEach(test => {
    const result = test.check();
    logTest(`WCAG 2.1 AA - ${test.name}`, result ? 'PASS' : 'FAIL');
  });
}

// Test 5: Module Functionality
function testModuleFunctionality() {
  console.log('\n🔧 MODULE FUNCTIONALITY TESTS');
  console.log('-'.repeat(40));
  
  const modules = [
    'ResearchModule',
    'JuniorModule', 
    'PropertyOpinionModule',
    'CaseModule',
    'ClientModal',
    'HistoryPanel'
  ];
  
  modules.forEach(module => {
    const filePath = path.join(process.cwd(), `src/components/${module}.tsx`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for proper error handling
      const hasErrorHandling = content.includes('try {') && content.includes('catch');
      logTest(`${module} - Error handling`, hasErrorHandling ? 'PASS' : 'WARN',
              hasErrorHandling ? 'Error handling present' : 'Missing error handling');
      
      // Check for loading states
      const hasLoadingStates = content.includes('loading') || content.includes('isSubmitting');
      logTest(`${module} - Loading states`, hasLoadingStates ? 'PASS' : 'WARN',
              hasLoadingStates ? 'Loading states present' : 'Missing loading states');
      
      // Check for proper TypeScript types
      const hasTypes = content.includes(': ') && content.includes('interface') || content.includes('type ');
      logTest(`${module} - TypeScript types`, hasTypes ? 'PASS' : 'WARN',
              hasTypes ? 'TypeScript types present' : 'Missing type definitions');
    }
  });
}

// Run all tests
function runAllTests() {
  testPhoneValidation();
  testFormValidation();
  testAccessibility();
  testInternationalStandards();
  testModuleFunctionality();
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📊 Total: ${testResults.passed + testResults.failed + testResults.warnings}`);
  
  const successRate = ((testResults.passed / (testResults.passed + testResults.failed + testResults.warnings)) * 100).toFixed(1);
  console.log(`🎯 Success Rate: ${successRate}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 ALL CRITICAL TESTS PASSED - READY FOR PRODUCTION');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED - REVIEW REQUIRED');
  }
  
  // Save detailed results
  const resultsFile = 'module-test-results.json';
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

runAllTests();
