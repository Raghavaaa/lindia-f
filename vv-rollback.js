#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                         AUTOMATED ROLLBACK SYSTEM                        ║
 * ║              Instant revert to last verified deployment                  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

function printHeader(title) {
  const width = 78;
  const titleLen = title.length;
  const padding = Math.floor((width - titleLen - 2) / 2);
  
  console.log('\n' + colors.bright + colors.red);
  console.log('╔' + '═'.repeat(width) + '╗');
  console.log(
    '║' + ' '.repeat(padding) + 
    title + 
    ' '.repeat(width - padding - titleLen) + 
    '║'
  );
  console.log('╚' + '═'.repeat(width) + '╝');
  console.log(colors.reset);
}

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

class RollbackSystem {
  constructor() {
    this.currentCommit = execCommand('git rev-parse HEAD');
    this.currentBranch = execCommand('git rev-parse --abbrev-ref HEAD');
  }

  findLastVerifiedCommit() {
    console.log(`${colors.cyan}ℹ${colors.reset} Searching for last verified commit...\n`);
    
    // Look for release_verified tags
    const tags = execCommand('git tag -l "release_verified_*" --sort=-creatordate');
    
    if (tags) {
      const latestTag = tags.split('\n')[0];
      const tagCommit = execCommand(`git rev-list -n 1 ${latestTag}`);
      
      console.log(`${colors.green}✓${colors.reset} Found verified tag: ${colors.bright}${latestTag}${colors.reset}`);
      console.log(`  Commit: ${tagCommit.substring(0, 8)}`);
      console.log(`  Date: ${execCommand(`git log -1 --format=%ai ${tagCommit}`)}`);
      
      return { commit: tagCommit, tag: latestTag };
    }
    
    // Fallback: Look for commits with passing V&V reports
    const reportsDir = path.join(process.cwd(), 'vv-reports');
    if (fs.existsSync(reportsDir)) {
      const reports = fs.readdirSync(reportsDir)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();
      
      for (const reportFile of reports) {
        const reportPath = path.join(reportsDir, reportFile);
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        if (report.safeToDeploy) {
          console.log(`${colors.green}✓${colors.reset} Found passing V&V report: ${reportFile}`);
          console.log(`  Commit: ${report.commit}`);
          
          return { commit: report.commit, tag: null };
        }
      }
    }
    
    return null;
  }

  performRollback(target, reason) {
    printHeader('EXECUTING ROLLBACK');
    
    console.log(`${colors.yellow}⚠${colors.reset}  Current commit: ${this.currentCommit.substring(0, 8)}`);
    console.log(`${colors.cyan}→${colors.reset}  Rolling back to: ${target.commit.substring(0, 8)}`);
    
    if (target.tag) {
      console.log(`${colors.cyan}→${colors.reset}  Tag: ${target.tag}`);
    }
    
    console.log(`\n${colors.bright}Reason:${colors.reset} ${reason}\n`);
    
    // Create rollback log
    const rollbackLog = {
      timestamp: new Date().toISOString(),
      fromCommit: this.currentCommit,
      toCommit: target.commit,
      tag: target.tag,
      reason: reason,
      branch: this.currentBranch,
    };
    
    const logPath = path.join(process.cwd(), 'vv-reports', `rollback-${Date.now()}.json`);
    fs.writeFileSync(logPath, JSON.stringify(rollbackLog, null, 2));
    
    console.log(`${colors.cyan}ℹ${colors.reset} Rollback log saved to: ${logPath}\n`);
    
    // Perform git reset
    console.log(`${colors.cyan}ℹ${colors.reset} Resetting to verified commit...\n`);
    
    try {
      execSync(`git reset --hard ${target.commit}`, { stdio: 'inherit' });
      
      console.log('');
      console.log(colors.bgGreen + colors.bright + '                                                                               ' + colors.reset);
      console.log(colors.bgGreen + colors.bright + '                        ✓ ROLLBACK SUCCESSFUL                                  ' + colors.reset);
      console.log(colors.bgGreen + colors.bright + '                                                                               ' + colors.reset);
      console.log('');
      
      console.log(`${colors.green}✓${colors.reset} Repository restored to last verified state`);
      console.log(`${colors.yellow}⚠${colors.reset}  Failed commit flagged for review: ${this.currentCommit.substring(0, 8)}\n`);
      
      return true;
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} Rollback failed:`, error.message);
      return false;
    }
  }

  run(reason = 'Manual rollback requested') {
    printHeader('AUTOMATED ROLLBACK SYSTEM');
    
    const target = this.findLastVerifiedCommit();
    
    if (!target) {
      console.log(`${colors.red}✗${colors.reset} No verified commit found to rollback to`);
      console.log(`${colors.yellow}⚠${colors.reset}  Cannot perform automatic rollback\n`);
      return 1;
    }
    
    if (target.commit === this.currentCommit) {
      console.log(`${colors.green}✓${colors.reset} Already at verified commit - no rollback needed\n`);
      return 0;
    }
    
    const success = this.performRollback(target, reason);
    return success ? 0 : 1;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Entry Point
// ═══════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  const args = process.argv.slice(2);
  const reason = args.join(' ') || 'Post-deploy validation failed';
  
  const rollback = new RollbackSystem();
  const exitCode = rollback.run(reason);
  process.exit(exitCode);
}

module.exports = RollbackSystem;

