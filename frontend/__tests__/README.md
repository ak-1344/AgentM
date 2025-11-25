# Frontend Tests

This directory contains tests for the Agent M frontend application.

## Structure

```
__tests__/
├── index.ts                 # Test entry point
├── components/              # Component tests (to be added)
├── pages/                   # Page tests (to be added)
└── README.md                # This file
```

## Setup (Future)

To add testing to the frontend, install these dependencies:

```bash
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

## Test Configuration (Future)

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

## Example Tests (Future)

### Component Test

```typescript
import { render, screen } from '@testing-library/react'
import ResumeUploader from '@/components/ResumeUploader'

describe('ResumeUploader', () => {
  it('renders upload button', () => {
    render(<ResumeUploader onUploadSuccess={jest.fn()} />)
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument()
  })
})
```

### API Test

```typescript
import { api } from '@/lib/api'

describe('API Client', () => {
  it('should make authenticated requests', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock

    const result = await api.getSomething()
    expect(result.success).toBe(true)
  })
})
```

## Running Tests (Future)

```bash
npm test                 # Run all tests
npm test:watch          # Watch mode
npm test:coverage       # With coverage
```

## Testing Best Practices

1. **Test User Behavior**: Focus on what users see and do
2. **Avoid Implementation Details**: Don't test internal state
3. **Use Testing Library**: Query by accessible roles/text
4. **Mock External Dependencies**: API calls, Supabase, etc.
5. **Test Error States**: Loading, errors, empty states
6. **Accessibility**: Use accessible queries

## Current Status

⚠️ **Testing infrastructure not yet implemented**

This is a placeholder for future test implementation. Phase 1 MVP focuses on core functionality. Testing infrastructure will be added in a future iteration.

## Recommended Testing Strategy

When implementing tests, prioritize:

1. **Critical User Flows**:
   - Authentication (login/signup)
   - Resume upload
   - Context setup
   - Email sending

2. **Complex Components**:
   - ResumeUploader (file handling)
   - ContextSetupForm (form validation)
   - EmailComposer (rich text editing)

3. **Error Handling**:
   - Network failures
   - Invalid inputs
   - Authentication errors

4. **Integration Tests**:
   - Page navigation
   - Protected routes
   - API integration

## Resources

- [Next.js Testing](https://nextjs.org/docs/testing)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
