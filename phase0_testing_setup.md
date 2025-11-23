# Phase 0.5: Testing Infrastructure Setup

**Goal:** Establish a robust testing environment using Vitest and React Testing Library _before_ starting the major refactoring. This ensures we can write tests for new utilities and hooks as they are created, preventing regressions.

**Estimated Time:** 1-2 Hours

## 1. Install Dependencies

Install the necessary testing libraries and tools.

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @vitejs/plugin-react
```

## 2. Configure Vitest

Create a `vitest.config.ts` file (or update `vite.config.ts` if preferred, but separate is often cleaner) to configure the test runner.

#### [NEW] `vitest.config.ts`

- Set environment to `jsdom`
- Configure setup files
- Define coverage settings

## 3. Test Setup File

Create a setup file to extend Vitest's matchers with `@testing-library/jest-dom`.

#### [NEW] `src/test/setup.ts`

- Import `@testing-library/jest-dom`

## 4. Add Test Scripts

Update `package.json` to include test scripts.

#### [MODIFY] `package.json`

- `test`: "vitest"
- `test:ui`: "vitest --ui"
- `test:coverage`: "vitest run --coverage"

## 5. Verify Setup

Create a simple "Hello World" test to verify everything is working correctly.

#### [NEW] `src/test/App.test.tsx`

- Render a simple component
- Assert it is in the document

## 6. CI Integration (Optional for Local, Good for Repo)

- Ensure `npm test` runs in the pre-commit hook or CI pipeline if one exists.
