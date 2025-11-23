# Technical Context: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Project

**Current State**: AI Studio-generated MVP that needs professional code organization

**Focus**: Refactoring existing frontend code with SOLID/DRY principles

**Not Building**: Backend infrastructure (future phase)

**Freedom**: No backwards compatibility - restructure as needed for best practices

**Goal**: Production-ready frontend codebase prepared for eventual backend integration

---

## Technology Stack

### Frontend Framework

**React 19.2.0**

- Latest React with concurrent features
- React Compiler benefits (automatic optimization)
- Server Components support (not used yet, client-only for now)
- Improved hydration and error handling

**Why React 19**:

- Modern, actively maintained
- Large ecosystem and community
- Excellent TypeScript support
- Performance improvements over React 18
- Team familiarity

### Build Tool

**Vite 6.2.0**

- Lightning-fast HMR (Hot Module Replacement)
- ESM-first development server
- Optimized production builds
- Built-in TypeScript support

**Why Vite**:

- 10x faster than Create React App
- Simple configuration
- Native ESM for instant updates
- Tree-shaking and code-splitting out of the box
- Modern tooling (esbuild, Rollup)

**Build Configuration** (`vite.config.ts`):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port
    open: true, // Auto-open browser
  },
});
```

### Language

**TypeScript 5.8.2**

- Strict type checking enabled
- Full IDE autocomplete support
- Catches errors at compile time
- Self-documenting code through types

**TypeScript Configuration** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "skipLibCheck": true
  }
}
```

**Why TypeScript**:

- Prevents entire classes of bugs
- Better refactoring support
- Excellent tooling and IDE integration
- Industry standard for React projects
- Helps with team collaboration

### UI & Styling

**Tailwind CSS (via CDN/classes)**

- Utility-first CSS framework
- Responsive design utilities
- Dark mode support via `.dark` class
- Custom design system colors

**Component Styling Pattern**:

```typescript
// Example: Responsive, theme-aware button
<button className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors md:px-6 md:py-3">
  Click Me
</button>
```

**Design Tokens**:

- Primary: Indigo (indigo-600, indigo-500)
- Success: Emerald (emerald-500)
- Warning: Amber (amber-500)
- Error: Rose (rose-500)
- Neutral: Slate (slate-50 to slate-950)

**Icons**: Lucide React (v0.554.0)

- 1000+ consistent, customizable icons
- Tree-shakeable (only import what you use)
- Perfect match for Tailwind aesthetic

### Charts & Visualization

**Recharts 3.4.1**

- Declarative chart library built on React
- Responsive by default
- Clean, modern design
- Easy to customize

**Current Usage**:

- Bar charts for engagement analytics (Dashboard)
- Line charts planned for trend analysis
- Responsive container for mobile

```typescript
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={data}>
    <Bar dataKey="engagement" fill="#6366f1" />
  </BarChart>
</ResponsiveContainer>
```

### AI Integration

**Google Gemini 1.30.0** (`@google/genai`)

- Latest Gemini API SDK
- Text generation and analysis
- Supports prompt engineering
- Rate limiting and error handling

**API Configuration**:

```typescript
// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/genai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
```

**Why Gemini**:

- Free tier with generous limits
- Fast response times
- Multimodal support (text + images)
- Instruction following capability
- Cost-effective for MVP

**API Key Management**:

- Stored in `.env.local` (not committed to git)
- Accessed via `import.meta.env.VITE_GEMINI_API_KEY`
- Must prefix with `VITE_` for Vite access

## Development Environment

### Package Manager

**npm** (comes with Node.js)

- Lock file: `package-lock.json` (committed to repo)
- Scripts defined in `package.json`

**Available Scripts**:

```json
{
  "scripts": {
    "dev": "vite", // Start development server
    "build": "vite build", // Production build
    "preview": "vite preview" // Preview production build locally
  }
}
```

### Runtime Requirements

**Node.js 18+**

- Required for Vite and build tools
- LTS version recommended
- Check version: `node --version`

### Development Workflow

```bash
# First time setup
npm install

# Start development server (with HMR)
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build
# Outputs to /dist directory

# Preview production build
npm run preview
```

### Environment Variables

**Required**: `.env.local` file in project root

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important**:

- `.env.local` is gitignored (never commit API keys)
- Prefix with `VITE_` to expose to client-side code
- Restart dev server after changing env vars

**Getting API Key**:

1. Visit https://ai.google.dev/
2. Sign in with Google account
3. Create new API key
4. Copy to `.env.local`

## Dependencies Overview

### Production Dependencies

```json
{
  "react": "^19.2.0", // UI framework
  "react-dom": "^19.2.0", // React DOM renderer
  "@google/genai": "^1.30.0", // Gemini AI SDK
  "lucide-react": "^0.554.0", // Icon library
  "recharts": "^3.4.1" // Chart library
}
```

**Total Bundle Size**: ~200KB gzipped (estimated)

### Development Dependencies

```json
{
  "typescript": "~5.8.2", // Type checking
  "@types/node": "^22.14.0", // Node.js type definitions
  "@vitejs/plugin-react": "^5.0.0", // Vite React plugin
  "vite": "^6.2.0" // Build tool
}
```

### No Heavy Dependencies

**Deliberately Avoided**:

- ❌ React Router (using ViewState enum instead)
- ❌ Redux/MobX (using local state instead)
- ❌ Axios (using native fetch)
- ❌ Moment.js (using native Date API)
- ❌ Lodash (using native JS methods)

**Why Minimal Dependencies**:

- Smaller bundle size
- Fewer security vulnerabilities
- Less maintenance burden
- Faster installation
- Better tree-shaking

## Browser Support

### Target Browsers

- Chrome/Edge 100+ (Chromium)
- Firefox 100+
- Safari 15+ (macOS, iOS)

### Required Features

- ES2020 JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- Local Storage API
- Fetch API
- matchMedia (for dark mode detection)

### Progressive Enhancement

**Core Features Work Without**:

- Service Workers (not implemented)
- Push Notifications (not implemented)
- Offline mode (not implemented)

**Graceful Degradation**:

- If AI API fails → Show fallback message
- If localStorage unavailable → Use in-memory state
- If media queries fail → Default to light theme

## Code Quality Tools

### TypeScript Compiler

**Strict Mode Enabled**:

```json
{
  "strict": true, // All strict checks on
  "noImplicitAny": true, // No implicit 'any' types
  "strictNullChecks": true, // Null safety
  "strictFunctionTypes": true // Function parameter safety
}
```

### ESLint ✅ (Phase 0a - Configured)

**Status**: Fully configured with React/TypeScript recommended rules

**Configuration**: `eslint.config.js` (ESM format)

**Key Features**:
- React Hooks rules (enforces dependencies, prevents common mistakes)
- TypeScript type safety (no explicit `any`, unused variables)
- Fast Refresh support for Vite
- Browser globals configured

**Rules Enforced**:
```javascript
{
  "react-hooks/exhaustive-deps": "warn",
  "react-hooks/rules-of-hooks": "error",
  "@typescript-eslint/no-unused-vars": "error", // except ^_
  "@typescript-eslint/no-explicit-any": "error"
}
```

**npm Scripts**:
- `npm run lint` - Check for linting errors (fails on warnings)
- `npm run lint:fix` - Auto-fix linting errors where possible

**Current Status**: 77 errors, 2 warnings identified (will fix during refactoring)

### Prettier ✅ (Phase 0a - Configured)

**Status**: Fully configured for consistent code formatting

**Configuration**: `.prettierrc`

**Formatting Rules**:
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

**npm Scripts**:
- `npm run format` - Format all files
- `npm run format:check` - Check formatting (CI use)

**Files Formatted**: 25 files across entire codebase

**Ignored Files**: `.prettierignore` excludes build outputs, node_modules, lock files, markdown

### Vitest ✅ (Phase 0a - Configured)

**Status**: Testing infrastructure configured (no tests written yet)

**Configuration**: `vitest.config.ts`

**Key Features**:
- jsdom environment for React component testing
- @testing-library/react integration
- jest-dom matchers for better assertions
- Coverage reporting with v8
- UI mode for interactive test running

**npm Scripts**:
- `npm run test` - Run tests in watch mode (TDD)
- `npm run test:ui` - Open Vitest UI in browser
- `npm run test:run` - Run tests once (CI use)
- `npm run test:coverage` - Generate coverage report

**Test Setup**: `src/test/setup.ts` configures testing-library matchers

**Note**: Infrastructure ready, actual tests will be written in Phase 7

## Development Constraints

### No Backend (Yet)

**Current State**: Pure frontend application

- No authentication system
- No API endpoints
- No database
- All state in memory (lost on refresh)

**Implications**:

- Can't persist data between sessions
- Can't share data between users
- Can't validate server-side
- Limited to client-side capabilities

**Future Architecture**:

```
Frontend (Vite) → Backend (Node.js/Express) → Database (PostgreSQL)
                       ↓
                   AI Service (Gemini)
                   Social APIs (Twitter, etc.)
```

### API Rate Limits

**Gemini API Free Tier**:

- 60 requests per minute
- 1,500 requests per day
- Must handle rate limit errors gracefully

**Current Handling**:

```typescript
// Basic error handling
try {
  const result = await geminiService.generate(prompt);
} catch (error) {
  console.error("AI request failed:", error);
  // Fallback to manual content creation
}
```

**Future Improvements**:

- Request queuing
- Retry with exponential backoff
- User feedback on rate limits
- Caching common responses

### Local Storage Limits

**Browser Limit**: ~5-10MB per domain

**Current Usage**:

- Theme preference (~10 bytes)
- Settings (~1KB)

**Not Stored** (but should be):

- Posts, drafts, media
- User authentication
- Analytics data

### Performance Budgets

**Target Metrics**:

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Bundle Size: < 300KB gzipped

**Current Performance**:

- ✅ Instant page transitions (SPA)
- ✅ Fast HMR in development
- ⚠️ No code splitting yet
- ⚠️ No image optimization
- ⚠️ No lazy loading

## Tool Usage Patterns

### Vite Dev Server

**Features Used**:

- Hot Module Replacement (HMR)
- Instant server start
- On-demand compilation
- Automatic dependency pre-bundling

**Dev Server Behavior**:

- Watches file changes
- Auto-refreshes browser
- Preserves state when possible
- Shows build errors in browser overlay

### React DevTools (Recommended)

**Browser Extension**: Install for debugging

**Useful Features**:

- Component tree inspection
- Props and state viewing
- Performance profiling
- Hook debugging

### VS Code Extensions (Recommended)

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **TypeScript and JavaScript Language Features** - Built-in
4. **Tailwind CSS IntelliSense** - Class autocomplete
5. **Error Lens** - Inline error display

## Git Workflow

### Current Repository

**Remote**: git@github.com:noobskies/socialflow.git
**Branch Strategy**: Single branch (main) for MVP

**Gitignore** (`.gitignore`):

```
node_modules/
dist/
.env.local
.DS_Store
*.log
```

### Commit Conventions (Recommended)

```
feat: Add trending topics widget
fix: Resolve calendar date parsing bug
docs: Update README with setup instructions
style: Format code with Prettier
refactor: Extract toast logic to custom hook
test: Add unit tests for geminiService
```

## Deployment Strategy

### Current Deployment

**Status**: Not yet deployed publicly

**Local Development Only**:

- Runs on `localhost:5173`
- No production build created yet
- No hosting configured

### Planned Deployment

**Recommended Platforms**:

1. **Vercel** (Primary choice)

   - Zero-config React deployment
   - Automatic HTTPS
   - Preview deployments for PRs
   - Edge network (fast global access)
   - Free tier sufficient for MVP

2. **Netlify** (Alternative)

   - Similar features to Vercel
   - Drag-and-drop deployment
   - Form handling built-in
   - Free tier available

3. **GitHub Pages** (Fallback)
   - Free for public repos
   - Requires workflow configuration
   - No backend support

**Deployment Process**:

```bash
# Build for production
npm run build

# Deploy to Vercel (after installing Vercel CLI)
vercel deploy

# Or connect GitHub repo for automatic deployments
```

**Environment Variables on Vercel**:

1. Add `VITE_GEMINI_API_KEY` in Vercel dashboard
2. Automatically injected at build time
3. Not exposed in client bundle (prefixed with `VITE_`)

## Monitoring & Analytics (Planned)

### Error Tracking

**Planned**: Sentry integration

```bash
npm install @sentry/react
```

**Captures**:

- JavaScript errors
- Promise rejections
- Network failures
- Performance metrics

### User Analytics

**Planned**: Plausible or PostHog

**Track**:

- Page views by ViewState
- Feature usage (Composer, Calendar, etc.)
- AI generation success rates
- User retention

### Performance Monitoring

**Planned**: Web Vitals tracking

```bash
npm install web-vitals
```

**Metrics**:

- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## Security Considerations

### Current Security Posture

**Good**:

- ✅ API key in environment variable (not in code)
- ✅ TypeScript prevents type-related bugs
- ✅ No user-generated content execution
- ✅ HTTPS enforced (when deployed)

**Risks**:

- ⚠️ API key exposed in client bundle (Vite limitation)
- ⚠️ No input sanitization
- ⚠️ No rate limiting
- ⚠️ No CSRF protection (no backend yet)
- ⚠️ No authentication

### Future Security Measures

1. **Backend API Proxy**:

   - Move Gemini API key to server
   - Client calls backend, backend calls AI
   - Prevents key exposure

2. **Input Validation**:

   - Sanitize user content
   - Validate file uploads
   - Prevent XSS attacks

3. **Authentication**:

   - JWT tokens or session cookies
   - OAuth for social logins
   - Role-based access control

4. **Rate Limiting**:
   - Prevent API abuse
   - DDoS protection
   - Per-user quotas

## Testing Infrastructure (Planned)

### Unit Testing

**Framework**: Vitest (Vite's test runner)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Test Location**: `__tests__` folders or `.test.ts` files

### Integration Testing

**Framework**: React Testing Library

**Test Scenarios**:

- Form submissions
- Component interactions
- State management flows

### End-to-End Testing

**Framework**: Playwright

```bash
npm install -D @playwright/test
```

**Test Scenarios**:

- Complete user journeys
- Multi-step workflows
- Cross-browser compatibility

## Documentation

### Code Documentation

**Current**:

- TypeScript types serve as inline documentation
- JSDoc comments on complex functions
- README.md for setup instructions

**Planned**:

- API documentation (when backend exists)
- Component library (Storybook)
- Architecture decision records (ADRs)

### Memory Bank (This Documentation)

**Purpose**: Preserve context between AI sessions

**Structure**:

- `projectbrief.md` - Vision and scope
- `productContext.md` - User needs and UX goals
- `systemPatterns.md` - Architecture and patterns
- `techContext.md` - This file (technical details)
- `activeContext.md` - Current work focus
- `progress.md` - Status tracking

**Usage**:

- Read at start of each session
- Update after significant changes
- Keep synchronized with codebase

## Known Technical Limitations

1. **Client-Side Only**: No server-side rendering or data persistence
2. **No Offline Support**: Requires internet connection
3. **Memory Constraints**: Large datasets may cause performance issues
4. **Bundle Size**: All code loaded upfront (no lazy loading)
5. **Browser Compatibility**: Modern browsers only (no IE11)
6. **API Dependencies**: Relies on external services (Gemini)
7. **No Real-Time**: No WebSockets or live updates
8. **Limited File Uploads**: Client-side only, no backend storage

## Migration Path to Production

### Phase 1: Backend Setup

1. Node.js/Express server
2. PostgreSQL database
3. Redis for caching
4. JWT authentication

### Phase 2: API Integration

1. Social platform OAuth
2. Real posting capabilities
3. Analytics aggregation
4. Webhook handling

### Phase 3: Scale & Optimize

1. CDN for static assets
2. Database indexing
3. Caching strategies
4. Load balancing

### Phase 4: Enterprise Features

1. Multi-tenancy
2. SSO integration
3. Advanced security
4. SLA guarantees
