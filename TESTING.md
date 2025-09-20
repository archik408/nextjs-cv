# Testing Guide

## Overview

This project uses Jest and React Testing Library for comprehensive testing coverage.

## Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── *.test.tsx      # Unit tests
│   └── *.snapshot.test.tsx  # Snapshot tests
├── lib/                # Library tests
├── utils/              # Utility tests
├── api/                # API route tests
└── integration/        # Integration tests
```

## Available Scripts

### Test Commands

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI/CD (no watch, with coverage)
- `npm run test:staged` - Run tests for staged files only
- `npm run test:components` - Run component tests only
- `npm run test:lib` - Run library tests only
- `npm run test:utils` - Run utility tests only

### Quality Assurance

- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run security:check` - Run security audits

## Pre-commit Hooks

The project uses `lint-staged` and `husky` for automated quality checks:

### Pre-commit (lint-staged)

- **TypeScript/JavaScript files**: ESLint + Prettier + related tests
- **JSON/CSS/Markdown files**: Prettier formatting
- **package.json**: Security audit
- **Components**: Component-specific tests
- **Lib**: Library-specific tests
- **Utils**: Utility-specific tests

### Pre-push

- Full test suite with coverage
- TypeScript type checking

## Test Configuration

### Jest Configuration

- **Environment**: jsdom (for DOM testing)
- **Coverage threshold**: 70% for all metrics
- **Module mapping**: `@/` aliases supported
- **Setup**: Custom setup file with mocks

### Coverage Requirements

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Snapshot Tests

```typescript
import { render } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent Snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(<MyComponent />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

### Utility Tests

```typescript
import { myUtility } from '@/utils/myUtility';

describe('myUtility', () => {
  it('should work correctly', () => {
    expect(myUtility('input')).toBe('expected output');
  });
});
```

## Mocking

### Global Mocks (jest.setup.js)

- Next.js router and navigation
- Next.js Image component
- IntersectionObserver
- ResizeObserver
- matchMedia

### Component Mocks

- Theme context
- Language context
- External libraries

## Best Practices

1. **Test Structure**: Use describe/it blocks for organization
2. **Naming**: Use descriptive test names
3. **Coverage**: Aim for meaningful coverage, not just high numbers
4. **Mocks**: Mock external dependencies appropriately
5. **Snapshots**: Use snapshots for UI regression testing
6. **Integration**: Test component interactions, not just individual units

## CI/CD Integration

The test suite is designed to work seamlessly with CI/CD pipelines:

- `npm run test:ci` - Optimized for CI environments
- Coverage reports generated automatically
- Security checks integrated
- Type checking included

## Troubleshooting

### Common Issues

1. **Provider errors**: Ensure components are wrapped with necessary providers
2. **Import errors**: Check module path mappings
3. **Mock issues**: Verify mock implementations match real APIs
4. **Coverage gaps**: Review uncovered code paths

### Debug Mode

```bash
npm test -- --verbose
npm test -- --no-coverage
npm test -- --testNamePattern="specific test"
```
