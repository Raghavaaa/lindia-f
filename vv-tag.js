#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                      VERIFIED RELEASE TAGGING SYSTEM                     ║
 * ║              Auto-tag verified commits for instant rollback              ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

function generateTagName() {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  
  // Find existing tags for today
  const existingTags = execCommand(`git tag -l "release_verified_${date}_*"`) || '';
  const buildNumbers = existingTags.split('\n')
    .filter(t => t)
    .map(tag => {
      const match = tag.match(/_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });
  
  const buildNo = buildNumbers.length > 0 ? Math.max(...buildNumbers) + 1 : 1;
  
  return `release_verified_${date}_${buildNo}`;
}

function tagVerifiedRelease() {
  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║                    TAGGING VERIFIED RELEASE                               ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const currentCommit = execCommand('git rev-parse HEAD');
  const shortCommit = currentCommit.substring(0, 8);
  const branch = execCommand('git rev-parse --abbrev-ref HEAD');
  const author = execCommand('git log -1 --format="%an"');
  
  console.log(`${colors.cyan}ℹ${colors.reset} Commit:  ${shortCommit}`);
  console.log(`${colors.cyan}ℹ${colors.reset} Branch:  ${branch}`);
  console.log(`${colors.cyan}ℹ${colors.reset} Author:  ${author}\n`);
  
  const tagName = generateTagName();
  const message = `Verified deployment - All V&V checks passed\nCommit: ${shortCommit}\nBranch: ${branch}\nAuthor: ${author}`;
  
  try {
    execSync(`git tag -a "${tagName}" -m "${message}"`, { stdio: 'pipe' });
    
    console.log(`${colors.green}✓${colors.reset} Created tag: ${colors.bright}${tagName}${colors.reset}\n`);
    console.log(`${colors.cyan}ℹ${colors.reset} This commit is now marked as a verified release point`);
    console.log(`${colors.cyan}ℹ${colors.reset} Rollback is available via: npm run vv:rollback\n`);
    
    // Save tag metadata
    const tagMeta = {
      tag: tagName,
      commit: currentCommit,
      branch: branch,
      author: author,
      timestamp: new Date().toISOString(),
    };
    
    const metaPath = path.join(process.cwd(), 'vv-reports', `tag-${tagName}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(tagMeta, null, 2));
    
    console.log(`${colors.green}✓${colors.reset} Tag metadata saved to: ${metaPath}\n`);
    
    // Push tag if on main/master
    if (branch === 'main' || branch === 'master') {
      console.log(`${colors.yellow}⚠${colors.reset}  To push this tag to remote:\n`);
      console.log(`   git push origin ${tagName}\n`);
    }
    
    return 0;
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Failed to create tag:`, error.message);
    return 1;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Entry Point
// ═══════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  const exitCode = tagVerifiedRelease();
  process.exit(exitCode);
}

module.exports = { tagVerifiedRelease, generateTagName };

