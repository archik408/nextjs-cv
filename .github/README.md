# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD, testing, and deployment.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:** Push to main/develop, Pull Requests to main/develop

**Features:**

- ✅ Multi-version Node.js testing (18.x, 20.x)
- ✅ TypeScript type checking
- ✅ ESLint and Prettier validation
- ✅ Security audit
- ✅ Test suite execution with coverage
- ✅ Build verification
- ✅ Lighthouse performance testing (PR only)
- ✅ Trivy security scanning

### 2. Code Quality (`code-quality.yml`)

**Triggers:** Pull Requests, Push to main/develop

**Features:**

- ✅ ESLint code quality checks
- ✅ Prettier formatting validation
- ✅ TypeScript compilation
- ✅ Security pattern scanning
- ✅ Test coverage reporting
- ✅ Codecov integration
- ✅ PR coverage comments

### 3. Dependencies Update (`dependencies.yml`)

**Triggers:** Weekly schedule (Mondays 9 AM UTC), Manual

**Features:**

- ✅ Automated dependency updates
- ✅ Security fixes via npm audit
- ✅ Post-update testing
- ✅ Automatic PR creation
- ✅ Safe update process

### 4. Deploy (`deploy.yml`)

**Triggers:** Push to main, Manual

**Features:**

- ✅ Production deployment
- ✅ Pre-deployment testing
- ✅ Vercel/Netlify deployment
- ✅ Slack notifications
- ✅ Environment protection

## Required Secrets

Add these secrets to your repository settings:

### Deployment

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Notifications (Optional)

- `SLACK_WEBHOOK` - Slack webhook URL for notifications
- `CODECOV_TOKEN` - Codecov token for coverage reporting

## Security Features

### Automated Security Checks

- **npm audit** - Dependency vulnerability scanning
- **Trivy** - Container and filesystem security scanning
- **Custom security patterns** - Code pattern analysis
- **Security headers** - HTTP security header validation

### Security Headers Checked

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'; ...`

## Performance Monitoring

### Lighthouse CI

- Performance score: ≥80%
- Accessibility score: ≥90%
- Best practices score: ≥80%
- SEO score: ≥80%

## Local Development

Run the same checks locally:

```bash
# Run all quality checks
npm run lint:check
npm run format:check
npm run type-check
npm run test:ci
npm run security:check
npm run test:security

# Run specific checks
npm run test:coverage
npm run security:audit
npm run security:headers
```

## Workflow Status

Check workflow status in the Actions tab of your repository. All workflows must pass before merging to main branch.

## Troubleshooting

### Common Issues

1. **Security scan failures**: Check for hardcoded secrets, console.log statements, or debugger statements
2. **TypeScript errors**: Run `npm run type-check` locally to identify issues
3. **Linting failures**: Run `npm run lint:check` and fix reported issues
4. **Test failures**: Run `npm test` locally to debug test issues

### Getting Help

- Check the Actions tab for detailed logs
- Review the security scan reports
- Ensure all required secrets are configured
- Verify Node.js version compatibility
