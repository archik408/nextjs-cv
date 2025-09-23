#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Security patterns to check
const SECURITY_PATTERNS = [
  {
    name: 'Hardcoded API Keys',
    pattern: /(api[_-]?key|secret[_-]?key|private[_-]?key)\s*[:=]\s*['"][^'"]{10,}['"]/gi,
    severity: 'high',
    description: 'Potential hardcoded API keys or secrets found',
  },
  // {
  //   name: 'Console.log statements',
  //   pattern: /console\.(log|warn|error|info|debug)/g,
  //   severity: 'medium',
  //   description: 'Console statements should be removed in production',
  //   exclude: ['node_modules', '.next', 'coverage', '__tests__', 'scripts']
  // },
  {
    name: 'TODO/FIXME comments',
    pattern: /(TODO|FIXME|HACK|XXX):/gi,
    severity: 'low',
    description: 'TODO/FIXME comments should be addressed before production',
  },
  {
    name: 'Debugger statements',
    pattern: /debugger\s*;/g,
    severity: 'high',
    description: 'Debugger statements should be removed in production',
  },
  {
    name: 'Eval usage',
    pattern: /eval\s*\(/g,
    severity: 'high',
    description: 'eval() usage is dangerous and should be avoided',
    exclude: ['scripts', 'node_modules', '.next', 'coverage', '__tests__'],
  },
  {
    name: 'InnerHTML usage',
    pattern: /\.innerHTML\s*=/g,
    severity: 'medium',
    description: 'innerHTML can lead to XSS vulnerabilities, use textContent instead',
  },
  {
    name: 'Dangerous redirects',
    pattern: /window\.location\s*=\s*[^;]+/g,
    severity: 'medium',
    description: 'Direct window.location assignments can be dangerous',
  },
];

function shouldExcludeFile(filePath, excludePatterns) {
  return excludePatterns.some((pattern) => filePath.includes(pattern));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  SECURITY_PATTERNS.forEach(({ name, pattern, severity, description, exclude }) => {
    if (exclude && shouldExcludeFile(filePath, exclude)) {
      return;
    }

    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const lines = content.substring(0, content.indexOf(match)).split('\n');
        const lineNumber = lines.length;

        issues.push({
          file: filePath,
          line: lineNumber,
          severity,
          pattern: name,
          description,
          match: match.trim(),
        });
      });
    }
  });

  return issues;
}

function scanDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const issues = [];

  function scanRecursive(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, .next, .git, etc.
        if (!['node_modules', '.next', '.git', 'coverage', 'dist', 'build'].includes(item)) {
          scanRecursive(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          try {
            const fileIssues = scanFile(fullPath);
            issues.push(...fileIssues);
          } catch (error) {
            console.warn(`Warning: Could not scan ${fullPath}: ${error.message}`);
          }
        }
      }
    });
  }

  scanRecursive(dirPath);
  return issues;
}

function generateReport(issues) {
  const report = {
    summary: {
      total: issues.length,
      high: issues.filter((i) => i.severity === 'high').length,
      medium: issues.filter((i) => i.severity === 'medium').length,
      low: issues.filter((i) => i.severity === 'low').length,
    },
    issues: issues,
  };

  return report;
}

function printReport(report) {
  console.log('🔒 Security Scan Report\n');
  console.log(`Total issues found: ${report.summary.total}`);
  console.log(`High severity: ${report.summary.high}`);
  console.log(`Medium severity: ${report.summary.medium}`);
  console.log(`Low severity: ${report.summary.low}\n`);

  if (report.issues.length === 0) {
    console.log('✅ No security issues found!');
    return;
  }

  // Group by severity
  const grouped = report.issues.reduce((acc, issue) => {
    if (!acc[issue.severity]) acc[issue.severity] = [];
    acc[issue.severity].push(issue);
    return acc;
  }, {});

  // Print by severity (high first)
  ['high', 'medium', 'low'].forEach((severity) => {
    if (grouped[severity]) {
      const emoji = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢';
      console.log(`${emoji} ${severity.toUpperCase()} SEVERITY ISSUES:`);

      grouped[severity].forEach((issue) => {
        console.log(`  ${issue.file}:${issue.line}`);
        console.log(`    ${issue.description}`);
        console.log(`    Found: ${issue.match}`);
        console.log('');
      });
    }
  });
}

async function main() {
  const startTime = Date.now();

  console.log('🔍 Starting security scan...\n');

  const issues = scanDirectory('.');
  const report = generateReport(issues);

  printReport(report);

  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Scan completed in ${duration}ms`);

  // Exit with error code if high severity issues found
  if (report.summary.high > 0) {
    console.log('\n🚨 High severity issues found! Please fix them before proceeding.');
    process.exit(1);
  }

  // Exit with warning if medium severity issues found
  if (report.summary.medium > 0) {
    console.log('\n⚠️  Medium severity issues found. Consider fixing them.');
    process.exit(0); // Don't fail the build for medium issues
  }

  console.log('\n✅ Security scan passed!');
  process.exit(0);
}

// Only run if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error during security scan:', error);
    process.exit(1);
  });
}

module.exports = { scanDirectory, scanFile, generateReport };
