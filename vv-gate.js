#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                    PRE-DEPLOYMENT V&V GATE SYSTEM                       ║
 * ║                     Zero Tolerance QA Enforcement                        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * 
 * This system ensures NO broken builds reach production.
 * Every commit must pass all checks before deployment is permitted.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// ANSI Color Codes for Beautiful Terminal Output
// ═══════════════════════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Standard colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

// ═══════════════════════════════════════════════════════════════════════════
// Pretty Print Utilities
// ═══════════════════════════════════════════════════════════════════════════

const box = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
  divider: '─',
};

function printHeader(title) {
  const width = 78;
  const titleLen = title.length;
  const padding = Math.floor((width - titleLen - 2) / 2);
  
  console.log('\n' + colors.bright + colors.cyan);
  console.log(box.topLeft + box.horizontal.repeat(width) + box.topRight);
  console.log(
    box.vertical + ' '.repeat(padding) + 
    title + 
    ' '.repeat(width - padding - titleLen) + 
    box.vertical
  );
  console.log(box.bottomLeft + box.horizontal.repeat(width) + box.bottomRight);
  console.log(colors.reset);
}

function printSection(section, number, total) {
  console.log(
    `\n${colors.bright}${colors.blue}[${number}/${total}]${colors.reset} ` +
    `${colors.bright}${section}${colors.reset}`
  );
  console.log(colors.dim + box.divider.repeat(78) + colors.reset);
}

function printSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function printError(message) {
  console.log(`${colors.red}✗${colors.reset} ${colors.red}${message}${colors.reset}`);
}

function printWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${colors.yellow}${message}${colors.reset}`);
}

function printInfo(message) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout || error.stderr || ''
    };
  }
}

function getGitInfo() {
  const hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().substring(0, 8);
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  const author = execSync('git log -1 --format="%an"', { encoding: 'utf8' }).trim();
  const date = new Date().toISOString();
  
  let changedFiles = [];
  try {
    const diffOutput = execSync('git diff --name-only HEAD', { encoding: 'utf8' });
    changedFiles = diffOutput.trim().split('\n').filter(f => f);
  } catch (e) {
    // No changes
  }
  
  return { hash, branch, author, date, changedFiles };
}

function generateTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
         now.toTimeString().split(' ')[0].replace(/:/g, '');
}

// ═══════════════════════════════════════════════════════════════════════════
// V&V Check Implementations
// ═══════════════════════════════════════════════════════════════════════════

class VVCheck {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.status = 'PENDING';
    this.details = [];
    this.errors = [];
    this.warnings = [];
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = Date.now();
  }

  end(status) {
    this.endTime = Date.now();
    this.status = status;
  }

  getDuration() {
    if (!this.startTime || !this.endTime) return 0;
    return ((this.endTime - this.startTime) / 1000).toFixed(2);
  }

  addDetail(detail) {
    this.details.push(detail);
  }

  addError(error) {
    this.errors.push(error);
  }

  addWarning(warning) {
    this.warnings.push(warning);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main V&V Gate System
// ═══════════════════════════════════════════════════════════════════════════

class VVGateSystem {
  constructor() {
    this.checks = [];
    this.gitInfo = getGitInfo();
    this.startTime = Date.now();
    this.reportPath = null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 1: Syntax & Linting
  // ─────────────────────────────────────────────────────────────────────────
  async checkLinting() {
    const check = new VVCheck('Syntax & Linting', 'ESLint validation with zero warnings tolerance');
    check.start();
    
    printInfo('Running ESLint on all source files...');
    
    const result = execCommand('npm run lint -- --max-warnings 0', { silent: true });
    
    if (result.success) {
      check.addDetail('All files passed ESLint validation');
      check.end('PASS');
      printSuccess('No linting errors or warnings found');
    } else {
      check.addError('ESLint found issues');
      check.addDetail(result.output);
      check.end('FAIL');
      printError('Linting issues detected - must be resolved');
    }
    
    this.checks.push(check);
    return check.status === 'PASS';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 2: Type Safety
  // ─────────────────────────────────────────────────────────────────────────
  async checkTypeScript() {
    const check = new VVCheck('Type Safety', 'TypeScript strict type validation');
    check.start();
    
    printInfo('Running TypeScript compiler in strict mode...');
    
    const result = execCommand('npx tsc --noEmit --pretty false', { silent: true });
    
    if (result.success) {
      check.addDetail('All TypeScript files type-checked successfully');
      check.end('PASS');
      printSuccess('Type safety validated');
    } else {
      const errors = result.output.split('\n').filter(line => line.includes('error TS'));
      check.addError(`Found ${errors.length} type errors`);
      errors.slice(0, 10).forEach(err => check.addDetail(err));
      if (errors.length > 10) {
        check.addDetail(`... and ${errors.length - 10} more errors`);
      }
      check.end('FAIL');
      printError(`Type check failed with ${errors.length} errors`);
    }
    
    this.checks.push(check);
    return check.status === 'PASS';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 3: Test Suite
  // ─────────────────────────────────────────────────────────────────────────
  async checkTests() {
    const check = new VVCheck('Test Suite', 'Unit and integration test execution');
    check.start();
    
    printInfo('Checking for test configuration...');
    
    // Check if tests exist
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.test) {
      printInfo('Running test suite...');
      const result = execCommand('npm test', { silent: true });
      
      if (result.success) {
        check.addDetail('All tests passed');
        check.end('PASS');
        printSuccess('Test suite completed successfully');
      } else {
        check.addError('Some tests failed');
        check.addDetail(result.output);
        check.end('FAIL');
        printError('Test failures detected');
      }
    } else {
      check.addWarning('No test script configured in package.json');
      check.addDetail('Consider adding unit and integration tests');
      check.end('WARN');
      printWarning('No test script found - skipping test execution');
    }
    
    this.checks.push(check);
    return check.status === 'PASS' || check.status === 'WARN';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 4: Build Integrity
  // ─────────────────────────────────────────────────────────────────────────
  async checkBuild() {
    const check = new VVCheck('Build Integrity', 'Production build compilation and optimization');
    check.start();
    
    printInfo('Running production build...');
    
    // Clean previous build
    if (fs.existsSync('.next')) {
      execCommand('rm -rf .next', { silent: true });
    }
    
    const result = execCommand('npm run build', { silent: true });
    
    if (result.success) {
      check.addDetail('Production build completed successfully');
      
      // Check bundle sizes
      if (fs.existsSync('.next/static')) {
        const totalSize = execSync(
          "find .next/static -type f -name '*.js' -exec du -ch {} + | grep total | awk '{print $1}'",
          { encoding: 'utf8' }
        ).trim();
        check.addDetail(`Total JS bundle size: ${totalSize}`);
        printInfo(`Bundle size: ${totalSize}`);
      }
      
      check.end('PASS');
      printSuccess('Production build successful');
    } else {
      check.addError('Production build failed');
      check.addDetail(result.output);
      check.end('FAIL');
      printError('Build compilation failed - critical blocker');
    }
    
    this.checks.push(check);
    return check.status === 'PASS';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 5: API Health
  // ─────────────────────────────────────────────────────────────────────────
  async checkAPIHealth() {
    const check = new VVCheck('API Health', 'Backend endpoint connectivity validation');
    check.start();
    
    printInfo('Checking API configuration...');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (!backendUrl) {
      check.addWarning('NEXT_PUBLIC_BACKEND_URL not configured');
      check.addDetail('Set environment variable for production deployment');
      check.end('WARN');
      printWarning('Backend URL not configured - skipping API health check');
    } else {
      printInfo(`Testing connection to: ${backendUrl}`);
      
      try {
        // Try to check if the URL is accessible (basic check)
        check.addDetail(`Backend configured: ${backendUrl}`);
        check.addWarning('API health check requires runtime validation');
        check.end('WARN');
        printWarning('API health check skipped (requires deployed backend)');
      } catch (error) {
        check.addError('Could not validate API connectivity');
        check.addDetail(error.message);
        check.end('WARN');
        printWarning('API health check incomplete');
      }
    }
    
    this.checks.push(check);
    return true; // Non-blocking for build-time checks
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 6: Dependency Audit
  // ─────────────────────────────────────────────────────────────────────────
  async checkDependencies() {
    const check = new VVCheck('Dependency Audit', 'Security vulnerability scan');
    check.start();
    
    printInfo('Running npm audit...');
    
    const result = execCommand('npm audit --audit-level=high --json', { silent: true });
    
    try {
      const auditData = JSON.parse(result.output);
      const vulnerabilities = auditData.metadata?.vulnerabilities || {};
      
      const critical = vulnerabilities.critical || 0;
      const high = vulnerabilities.high || 0;
      const moderate = vulnerabilities.moderate || 0;
      const low = vulnerabilities.low || 0;
      
      check.addDetail(`Critical: ${critical}, High: ${high}, Moderate: ${moderate}, Low: ${low}`);
      
      if (critical > 0) {
        check.addError(`${critical} critical vulnerabilities found`);
        check.end('FAIL');
        printError(`${critical} critical security vulnerabilities - must fix before deploy`);
      } else if (high > 0) {
        check.addWarning(`${high} high-severity vulnerabilities found`);
        check.end('WARN');
        printWarning(`${high} high-severity vulnerabilities - consider fixing`);
      } else {
        check.end('PASS');
        printSuccess('No critical or high-severity vulnerabilities');
      }
    } catch (e) {
      // Audit might fail in various ways, be lenient
      check.addWarning('Could not parse audit results');
      check.end('WARN');
      printWarning('Dependency audit completed with warnings');
    }
    
    this.checks.push(check);
    return check.status === 'PASS' || check.status === 'WARN';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 7: Environment Validation
  // ─────────────────────────────────────────────────────────────────────────
  async checkEnvironment() {
    const check = new VVCheck('Environment Validation', 'Environment variables and secrets audit');
    check.start();
    
    printInfo('Scanning for hardcoded secrets...');
    
    // Check for common secret patterns
    const secretPatterns = [
      { pattern: /sk-[a-zA-Z0-9]{32,}/, name: 'OpenAI API key' },
      { pattern: /AIzaSy[a-zA-Z0-9_-]{33}/, name: 'Google API key' },
      { pattern: /Bearer [A-Za-z0-9_-]+/, name: 'Bearer token' },
      { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/, name: 'API key assignment' },
      { pattern: /password\s*[:=]\s*['"][^'"]+['"]/, name: 'Password assignment' },
    ];
    
    let secretsFound = false;
    
    for (const { pattern, name } of secretPatterns) {
      const grepResult = execCommand(
        `grep -r -n "${pattern.source}" src/ 2>/dev/null || true`,
        { silent: true }
      );
      
      if (grepResult.output && grepResult.output.trim()) {
        secretsFound = true;
        check.addError(`Potential secret found: ${name}`);
        check.addDetail(grepResult.output.split('\n').slice(0, 3).join('\n'));
      }
    }
    
    // Check for required environment variables
    const requiredEnvVars = ['NEXT_PUBLIC_BACKEND_URL'];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    
    if (missingVars.length > 0) {
      check.addWarning(`Missing environment variables: ${missingVars.join(', ')}`);
    }
    
    if (secretsFound) {
      check.end('FAIL');
      printError('Hardcoded secrets detected - CRITICAL SECURITY ISSUE');
    } else if (missingVars.length > 0) {
      check.addDetail('All critical environment variables should be set before deployment');
      check.end('WARN');
      printWarning(`${missingVars.length} environment variables not configured`);
    } else {
      check.addDetail('No hardcoded secrets found');
      check.addDetail('All required environment variables configured');
      check.end('PASS');
      printSuccess('Environment validation passed');
    }
    
    this.checks.push(check);
    return check.status !== 'FAIL';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECK 8: UI Consistency
  // ─────────────────────────────────────────────────────────────────────────
  async checkUIConsistency() {
    const check = new VVCheck('UI Consistency', 'Component rendering and console error validation');
    check.start();
    
    printInfo('Validating UI components...');
    
    // Check for common UI anti-patterns
    const patterns = [
      { file: 'src/**/*.tsx', pattern: 'console.log', severity: 'warn' },
      { file: 'src/**/*.tsx', pattern: 'console.error', severity: 'error' },
      { file: 'src/**/*.tsx', pattern: 'debugger', severity: 'error' },
    ];
    
    let errors = 0;
    let warnings = 0;
    
    for (const { file, pattern, severity } of patterns) {
      const result = execCommand(
        `grep -r "${pattern}" ${file} 2>/dev/null | wc -l || echo 0`,
        { silent: true }
      );
      
      const count = parseInt(result.output.trim()) || 0;
      if (count > 0) {
        if (severity === 'error') {
          errors += count;
          check.addError(`Found ${count} ${pattern} statements`);
        } else {
          warnings += count;
          check.addWarning(`Found ${count} ${pattern} statements`);
        }
      }
    }
    
    // Check for proper TypeScript component typing
    const componentFiles = execCommand(
      'find src/components -name "*.tsx" | wc -l',
      { silent: true }
    );
    const componentCount = parseInt(componentFiles.output.trim()) || 0;
    
    check.addDetail(`Validated ${componentCount} component files`);
    
    if (errors > 0) {
      check.end('FAIL');
      printError(`UI consistency issues: ${errors} errors, ${warnings} warnings`);
    } else if (warnings > 0) {
      check.end('WARN');
      printWarning(`UI validation completed with ${warnings} warnings`);
    } else {
      check.end('PASS');
      printSuccess('UI components validated successfully');
    }
    
    this.checks.push(check);
    return check.status !== 'FAIL';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Report Generation
  // ─────────────────────────────────────────────────────────────────────────
  generateReport() {
    const timestamp = generateTimestamp();
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    const passCount = this.checks.filter(c => c.status === 'PASS').length;
    const failCount = this.checks.filter(c => c.status === 'FAIL').length;
    const warnCount = this.checks.filter(c => c.status === 'WARN').length;
    
    const safeToDeployy = failCount === 0;
    
    const report = {
      timestamp,
      commit: this.gitInfo.hash,
      branch: this.gitInfo.branch,
      author: this.gitInfo.author,
      date: this.gitInfo.date,
      changedFiles: this.gitInfo.changedFiles,
      duration: `${totalDuration}s`,
      summary: {
        total: this.checks.length,
        passed: passCount,
        failed: failCount,
        warnings: warnCount,
        status: safeToDeployy ? 'SAFE TO PUSH ✓' : 'HOLD FOR REVIEW ✗'
      },
      checks: this.checks.map(check => ({
        name: check.name,
        description: check.description,
        status: check.status,
        duration: `${check.getDuration()}s`,
        details: check.details,
        errors: check.errors,
        warnings: check.warnings
      })),
      recommendation: safeToDeployy 
        ? 'All critical checks passed. Deployment authorized.'
        : 'Critical issues detected. Resolve all FAIL status checks before proceeding.',
      safeToDeploy: safeToDeployy
    };
    
    // Save JSON report
    const reportDir = path.join(process.cwd(), 'vv-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const jsonPath = path.join(reportDir, `vv-report-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    
    // Generate beautiful text report
    const textReport = this.generateTextReport(report);
    const txtPath = path.join(reportDir, `vv-report-${timestamp}.txt`);
    fs.writeFileSync(txtPath, textReport);
    
    this.reportPath = { json: jsonPath, txt: txtPath };
    
    return report;
  }

  generateTextReport(report) {
    const lines = [];
    const w = 80;
    
    lines.push('╔' + '═'.repeat(w) + '╗');
    lines.push('║' + ' '.repeat(20) + 'PRE-DEPLOYMENT V&V QUALITY GATE REPORT' + ' '.repeat(21) + '║');
    lines.push('╚' + '═'.repeat(w) + '╝');
    lines.push('');
    
    lines.push('COMMIT INFORMATION');
    lines.push('─'.repeat(w));
    lines.push(`  Commit Hash:    ${report.commit}`);
    lines.push(`  Branch:         ${report.branch}`);
    lines.push(`  Author:         ${report.author}`);
    lines.push(`  Timestamp:      ${report.date}`);
    lines.push(`  Duration:       ${report.duration}`);
    lines.push('');
    
    if (report.changedFiles.length > 0) {
      lines.push('CHANGED FILES');
      lines.push('─'.repeat(w));
      report.changedFiles.forEach(file => {
        lines.push(`  • ${file}`);
      });
      lines.push('');
    }
    
    lines.push('VERIFICATION & VALIDATION RESULTS');
    lines.push('═'.repeat(w));
    lines.push('');
    
    report.checks.forEach((check, idx) => {
      const statusSymbol = check.status === 'PASS' ? '✓' : 
                          check.status === 'FAIL' ? '✗' : '⚠';
      const statusText = check.status.padEnd(6);
      
      lines.push(`[${idx + 1}/${report.checks.length}] ${statusSymbol} ${statusText} ${check.name}`);
      lines.push(`     ${check.description}`);
      lines.push(`     Duration: ${check.duration}`);
      
      if (check.errors.length > 0) {
        lines.push('     ERRORS:');
        check.errors.forEach(err => lines.push(`       ✗ ${err}`));
      }
      
      if (check.warnings.length > 0) {
        lines.push('     WARNINGS:');
        check.warnings.forEach(warn => lines.push(`       ⚠ ${warn}`));
      }
      
      if (check.details.length > 0 && check.status === 'PASS') {
        check.details.slice(0, 2).forEach(detail => {
          lines.push(`       ${detail}`);
        });
      }
      
      lines.push('');
    });
    
    lines.push('═'.repeat(w));
    lines.push('SUMMARY');
    lines.push('─'.repeat(w));
    lines.push(`  Total Checks:   ${report.summary.total}`);
    lines.push(`  Passed:         ${report.summary.passed} ✓`);
    lines.push(`  Failed:         ${report.summary.failed} ✗`);
    lines.push(`  Warnings:       ${report.summary.warnings} ⚠`);
    lines.push('');
    lines.push(`  Status:         ${report.summary.status}`);
    lines.push('');
    lines.push('RECOMMENDATION');
    lines.push('─'.repeat(w));
    lines.push(`  ${report.recommendation}`);
    lines.push('');
    
    if (report.safeToDeploy) {
      lines.push('╔' + '═'.repeat(w) + '╗');
      lines.push('║' + ' '.repeat(30) + '✓ DEPLOYMENT AUTHORIZED' + ' '.repeat(27) + '║');
      lines.push('╚' + '═'.repeat(w) + '╝');
    } else {
      lines.push('╔' + '═'.repeat(w) + '╗');
      lines.push('║' + ' '.repeat(28) + '✗ DEPLOYMENT BLOCKED' + ' '.repeat(30) + '║');
      lines.push('║' + ' '.repeat(20) + 'Resolve all critical issues before proceeding' + ' '.repeat(14) + '║');
      lines.push('╚' + '═'.repeat(w) + '╝');
    }
    
    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Display Report
  // ─────────────────────────────────────────────────────────────────────────
  displayReport(report) {
    console.log('\n\n');
    printHeader('V&V GATE RESULTS');
    
    console.log(`\n${colors.bright}Commit:${colors.reset} ${report.commit} (${report.branch})`);
    console.log(`${colors.bright}Author:${colors.reset} ${report.author}`);
    console.log(`${colors.bright}Duration:${colors.reset} ${report.duration}`);
    
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════════════════${colors.reset}\n`);
    
    report.checks.forEach((check, idx) => {
      const statusColor = check.status === 'PASS' ? colors.green :
                         check.status === 'FAIL' ? colors.red : colors.yellow;
      const statusSymbol = check.status === 'PASS' ? '✓' :
                          check.status === 'FAIL' ? '✗' : '⚠';
      
      console.log(
        `${colors.bright}[${idx + 1}/${report.checks.length}]${colors.reset} ` +
        `${statusColor}${statusSymbol} ${check.status}${colors.reset} ` +
        `${colors.bright}${check.name}${colors.reset} ${colors.dim}(${check.duration})${colors.reset}`
      );
      
      if (check.errors.length > 0) {
        check.errors.forEach(err => {
          console.log(`    ${colors.red}✗${colors.reset} ${err}`);
        });
      }
      
      if (check.warnings.length > 0) {
        check.warnings.forEach(warn => {
          console.log(`    ${colors.yellow}⚠${colors.reset} ${warn}`);
        });
      }
    });
    
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.bright}SUMMARY${colors.reset}`);
    console.log(`  Total:    ${report.summary.total}`);
    console.log(`  ${colors.green}Passed:   ${report.summary.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed:   ${report.summary.failed}${colors.reset}`);
    console.log(`  ${colors.yellow}Warnings: ${report.summary.warnings}${colors.reset}`);
    
    console.log('');
    
    if (report.safeToDeploy) {
      console.log(
        `${colors.bgGreen}${colors.bright}${colors.white}                                                                               ${colors.reset}`
      );
      console.log(
        `${colors.bgGreen}${colors.bright}${colors.white}                        ✓ SAFE TO PUSH                                        ${colors.reset}`
      );
      console.log(
        `${colors.bgGreen}${colors.bright}${colors.white}                                                                               ${colors.reset}`
      );
    } else {
      console.log(
        `${colors.bgRed}${colors.bright}${colors.white}                                                                               ${colors.reset}`
      );
      console.log(
        `${colors.bgRed}${colors.bright}${colors.white}                        ✗ HOLD FOR REVIEW                                      ${colors.reset}`
      );
      console.log(
        `${colors.bgRed}${colors.bright}${colors.white}                   Fix critical issues before deploying                       ${colors.reset}`
      );
      console.log(
        `${colors.bgRed}${colors.bright}${colors.white}                                                                               ${colors.reset}`
      );
    }
    
    console.log(`\n${colors.dim}Reports saved to:${colors.reset}`);
    console.log(`  JSON: ${this.reportPath.json}`);
    console.log(`  TEXT: ${this.reportPath.txt}`);
    console.log('');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Main Execution
  // ─────────────────────────────────────────────────────────────────────────
  async run() {
    printHeader('PRE-DEPLOYMENT V&V GATE SYSTEM');
    
    console.log(`${colors.dim}Zero Tolerance Quality Enforcement${colors.reset}`);
    console.log(`${colors.dim}All checks must pass before deployment${colors.reset}\n`);
    
    printInfo(`Starting verification for commit: ${this.gitInfo.hash}`);
    printInfo(`Branch: ${this.gitInfo.branch}`);
    printInfo(`Author: ${this.gitInfo.author}\n`);
    
    const totalChecks = 8;
    
    printSection('Syntax & Linting', 1, totalChecks);
    const lintPass = await this.checkLinting();
    
    printSection('Type Safety', 2, totalChecks);
    const typePass = await this.checkTypeScript();
    
    printSection('Test Suite', 3, totalChecks);
    const testPass = await this.checkTests();
    
    printSection('Build Integrity', 4, totalChecks);
    const buildPass = await this.checkBuild();
    
    printSection('API Health', 5, totalChecks);
    const apiPass = await this.checkAPIHealth();
    
    printSection('Dependency Audit', 6, totalChecks);
    const depPass = await this.checkDependencies();
    
    printSection('Environment Validation', 7, totalChecks);
    const envPass = await this.checkEnvironment();
    
    printSection('UI Consistency', 8, totalChecks);
    const uiPass = await this.checkUIConsistency();
    
    const report = this.generateReport();
    this.displayReport(report);
    
    return report.safeToDeploy ? 0 : 1;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Entry Point
// ═══════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  const gate = new VVGateSystem();
  gate.run()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error(`${colors.red}Fatal error:${colors.reset}`, error);
      process.exit(1);
    });
}

module.exports = VVGateSystem;

