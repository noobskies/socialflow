# Phase 0a: Development Tools Setup

**Estimated Time:** 1 hour

## Overview

Establish professional development tooling foundation before code refactoring begins. This phase sets up linting, formatting, and testing infrastructure without writing any tests yet.

## Prerequisites

- Clean git working directory (commit any pending changes)
- Node.js 18+ installed
- npm package manager available

## Goals

1. Configure ESLint for React/TypeScript with recommended rules
2. Configure Prettier for automatic code formatting
3. Set up Vitest testing framework (infrastructure only, no tests)
4. Add npm scripts for development workflow
5. Verify all tools work together without conflicts

## Why These Tools?

### ESLint

- Catches common React mistakes (missing deps, incorrect hooks usage)
- Enforces TypeScript best practices
- Prevents bugs before they reach production
- Provides consistent code quality across team

### Prettier

- Automatic code formatting on save
- No more formatting debates in PRs
- Consistent style across entire codebase
- Works seamlessly with ESLint

### Vitest

- Vite-native test runner (same config, fast execution)
- Compatible with Jest ecosystem (@testing-library)
- Built-in coverage reports
- Watch mode for TDD workflow
- Ready for Phase 7 when we write actual tests

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install -D \
  eslint \
  @eslint/js \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  prettier \
  eslint-config-prettier \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  @vitest/ui
```

**Estimated time:** 2-3 minutes (depending on internet speed)

### Step 2: Configure ESLint

Create `eslint.config.js` in project root:

```javascript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Recommended rules for this project
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  }
);
```

**Key Configuration Choices:**

- **Recommended rules**: Start with recommended, not strict (per user preference)
- **React Hooks rules**: Enforces proper hooks usage and dependencies
- **No unused vars**: Prevents dead code, allows `_` prefix for intentional unused params
- **No explicit any**: Maintains strong typing throughout codebase

### Step 3: Configure Prettier

Create `.prettierrc` in project root:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore` in project root:

```
# Build outputs
dist
build
coverage

# Dependencies
node_modules

# Documentation (preserve formatting)
*.md

# Lock files
package-lock.json
pnpm-lock.yaml
yarn.lock

# Environment files
.env
.env.*
```

**Configuration Rationale:**

- **semi: true** - Explicit semicolons prevent ASI issues
- **singleQuote: false** - Double quotes for consistency with JSON
- **tabWidth: 2** - Standard for React projects
- **printWidth: 80** - Readable line length
- **endOfLine: lf** - Unix-style line endings for consistency

### Step 4: Configure Vitest

Create `vitest.config.ts` in project root:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
    },
  },
});
```

Create test setup directory and file:

```bash
mkdir -p src/test
```

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**Why This Configuration:**

- **globals: true** - Use `describe`, `it`, `expect` without imports
- **environment: jsdom** - Simulates browser environment for React
- **setupFiles** - Configures testing-library matchers
- **css: true** - Process CSS imports in tests
- **coverage** - Ready for coverage reports when tests are written

### Step 5: Update package.json Scripts

Add/update the `scripts` section in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,css,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,css,md,json}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

**Script Explanations:**

- `lint` - Check for linting errors (fails on warnings)
- `lint:fix` - Auto-fix linting errors where possible
- `format` - Format all code files
- `format:check` - Check formatting without modifying files (CI use)
- `test` - Run tests in watch mode (for development)
- `test:ui` - Open Vitest UI in browser
- `test:run` - Run tests once (CI use)
- `test:coverage` - Generate coverage report
- `type-check` - TypeScript type checking only (no emit)

### Step 6: Install Missing Dependency

The ESLint config requires `globals` package:

```bash
npm install -D globals
```

### Step 7: Format Entire Codebase

Run Prettier to establish consistent formatting baseline:

```bash
npm run format
```

This will format all `.ts`, `.tsx`, `.css`, `.md`, and `.json` files.

**Expected:** Many files will be modified with consistent formatting.

### Step 8: Fix ESLint Issues

Run ESLint with auto-fix:

```bash
npm run lint:fix
```

**Expected:** Auto-fixable issues will be resolved. Manual fixes may be needed.

Check for remaining issues:

```bash
npm run lint
```

**Manual Fixes:**

If you see errors like:

- Unused variables → Remove or prefix with `_`
- Missing dependencies in hooks → Add to dependency array
- Explicit `any` types → Replace with proper types

### Step 9: Type Check

Verify TypeScript has no errors:

```bash
npm run type-check
```

**Expected:** No type errors. If errors appear, they were already present.

### Step 10: Verify Dev Server

Start the development server to ensure everything still works:

```bash
npm run dev
```

**Expected:**

- Server starts without errors
- No ESLint/TypeScript errors in terminal
- App loads correctly in browser
- Hot module replacement works

## VS Code Integration (Optional)

For automatic formatting and linting in VS Code, create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

Recommended extensions (create `.vscode/extensions.json`):

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "vitest.explorer"
  ]
}
```

## Testing the Setup

### ESLint Test

Create a test file with an intentional error:

```typescript
// test-eslint.ts
const unusedVar = "test";
let x: any = 5;
```

Run: `npm run lint`

**Expected:** ESLint should report errors for unused variable and `any` type.

Delete the test file after verification.

### Prettier Test

Create a poorly formatted file:

```typescript
// test-prettier.ts
const x = { a: 1, b: 2 };
function test() {
  return x;
}
```

Run: `npm run format`

**Expected:** File should be reformatted to:

```typescript
// test-prettier.ts
const x = { a: 1, b: 2 };
function test() {
  return x;
}
```

Delete the test file after verification.

### Vitest Test

Create a simple test file:

```typescript
// src/test/example.test.ts
import { describe, it, expect } from "vitest";

describe("Example Test", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm run test:run`

**Expected:** Test should pass, showing Vitest is working.

Delete the test file after verification (no actual tests yet).

## Troubleshooting

### ESLint Errors After Setup

**Issue:** Many linting errors appear
**Solution:** Run `npm run lint:fix` to auto-fix. Manually fix remaining issues.

### Prettier Conflicts with ESLint

**Issue:** ESLint and Prettier rules conflict
**Solution:** Ensure `eslint-config-prettier` is installed and properly configured

### TypeScript Can't Find @testing-library

**Issue:** Import errors for testing libraries
**Solution:** Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "Restart TS Server")

### Vitest Can't Find jsdom

**Issue:** "Environment 'jsdom' not found"
**Solution:** Ensure `jsdom` is installed: `npm install -D jsdom`

### Dev Server Won't Start

**Issue:** Vite errors after tool installation
**Solution:**

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Try `npm run dev` again

## Verification Checklist

Before proceeding to Phase 1, verify:

- [ ] All dependencies installed successfully
- [ ] `eslint.config.js` created and configured
- [ ] `.prettierrc` and `.prettierignore` created
- [ ] `vitest.config.ts` created
- [ ] `src/test/setup.ts` created
- [ ] `package.json` scripts updated
- [ ] `npm run format` completed successfully
- [ ] `npm run lint` shows no errors (or only intentional warnings)
- [ ] `npm run type-check` passes
- [ ] `npm run dev` starts without errors
- [ ] App loads correctly in browser
- [ ] Test infrastructure verified with example test
- [ ] VS Code integration configured (optional)

## Completion Criteria

✅ **Phase 0a is complete when:**

1. ESLint configured with recommended rules
2. Prettier configured and all files formatted
3. Vitest framework installed and verified working
4. All npm scripts added and functional
5. No TypeScript compilation errors
6. Dev server runs without errors
7. App functions exactly as before (no regressions)
8. Git commit created: `git commit -m "Phase 0a: Dev tools setup - ESLint, Prettier, Vitest"`

## Configuration Files Summary

After Phase 0a, you should have these new files:

```
/socialflow
├── eslint.config.js           # ESLint configuration
├── .prettierrc                # Prettier formatting rules
├── .prettierignore            # Prettier ignore patterns
├── vitest.config.ts           # Vitest test configuration
├── src/
│   └── test/
│       └── setup.ts           # Test environment setup
└── .vscode/                   # Optional VS Code settings
    ├── settings.json
    └── extensions.json
```

## Important Notes

### No Pre-commit Hooks

Per project decision, we are **not** using pre-commit hooks (Husky, lint-staged). Developers will run linting and formatting manually or via IDE integration.

### No Tests Yet

Vitest is configured but no actual tests are written in this phase. Test writing happens in **Phase 7: Testing Strategy**.

### Gradual Lint Fixes

Don't feel pressured to fix every lint warning immediately. Focus on:

1. Getting the infrastructure working
2. Fixing critical errors
3. Addressing warnings during refactoring in subsequent phases

## Next Phase

After Phase 0a is complete and committed, proceed to:

**Phase 1: Foundation Setup** (`phase1_foundation.md`)

- Create feature-based directory structure
- Configure TypeScript path aliases
- Split types.ts into organized modules
- Extract constants and mock data
- Update all imports

---

## Commands Quick Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format all files
npm run format:check     # Check formatting (CI)
npm run type-check       # TypeScript check only

# Testing (infrastructure ready, write tests in Phase 7)
npm run test             # Run tests in watch mode
npm run test:ui          # Open Vitest UI
npm run test:run         # Run tests once (CI)
npm run test:coverage    # Generate coverage report
```
