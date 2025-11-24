# Technical Context: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Project

**Current State**: AI Studio-generated MVP needs professional code organization

**Focus**: Refactoring frontend code with SOLID/DRY principles

**Not Building**: Backend infrastructure (future phase)

**Goal**: Production-ready frontend codebase prepared for backend integration

---

## Technology Stack

### Frontend Framework

**React 19.2.0** - Latest React with concurrent features, Server Components support (not used yet), improved hydration

**Why**: Modern, large ecosystem, excellent TypeScript support, performance improvements, team familiarity

### Build Tool

**Vite 6.2.0** - Lightning-fast HMR, ESM-first, optimized production builds

**Why**: 10x faster than CRA, simple config, instant updates, modern tooling (esbuild, Rollup)

### Language

**TypeScript 5.8.2** - Strict type checking enabled, full IDE support

**Why**: Prevents bugs, better refactoring, excellent tooling, industry standard, team collaboration

**Config**: Strict mode enabled - `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`

### UI & Styling

**Tailwind CSS** - Utility-first CSS framework via CDN/classes

**Features**: Responsive design utilities, dark mode via `.dark` class, custom design tokens

**Design Tokens**:
- Primary: Indigo (600/500)
- Success: Emerald (500)
- Warning: Amber (500)
- Error: Rose (500)
- Neutral: Slate (50-950)

**Icons**: Lucide React (v0.554.0) - 1000+ icons, tree-shakeable, Tailwind-compatible

### Charts

**Recharts 3.4.1** - Declarative React chart library, responsive, clean design

**Usage**: Bar charts for engagement analytics (Dashboard), line charts planned

### AI Integration

**Google Gemini 1.30.0** (`@google/genai`)

**Why**: Free tier with generous limits, fast responses, multimodal support, cost-effective

**Config**: API key in `.env.local` (gitignored), accessed via `import.meta.env.VITE_GEMINI_API_KEY`

## Development Environment

### Package Manager

**npm** - Lock file: `package-lock.json` (committed)

### Runtime

**Node.js 18+** - LTS version recommended

### Workflow

```bash
npm install          # First time setup
npm run dev          # Dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Environment Variables

**Required**: `.env.local` file in project root

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important**: Prefix with `VITE_` for client-side access, restart server after changes

**Get API Key**: https://ai.google.dev/ → Sign in → Create key

## Dependencies

### Production (Minimal by Design)

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@google/genai": "^1.30.0",
  "lucide-react": "^0.554.0",
  "recharts": "^3.4.1"
}
```

**Bundle Size**: ~200KB gzipped (estimated)

### Development

```json
{
  "typescript": "~5.8.2",
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "vite": "^6.2.0"
}
```

### Deliberately Avoided

- ❌ React Router (using ViewState enum)
- ❌ Redux/MobX (using local state)
- ❌ Axios (using fetch)
- ❌ Moment.js (using native Date)
- ❌ Lodash (using native JS)

**Why**: Smaller bundle, fewer vulnerabilities, less maintenance, faster install

## Browser Support

**Target**: Chrome/Edge 100+, Firefox 100+, Safari 15+

**Required**: ES2020, CSS Grid/Flexbox, CSS Variables, localStorage, Fetch API, matchMedia

**Graceful Degradation**: Fallback messages if AI fails, in-memory state if localStorage unavailable, default to light theme

## Code Quality Tools ✅

### ESLint (Phase 0a Complete)

**Status**: Configured with React/TypeScript recommended rules

**Config**: `eslint.config.js` (ESM format)

**Rules**: React Hooks enforcement, TypeScript type safety, no explicit `any`, unused variables

**Scripts**:
- `npm run lint` - Check for errors
- `npm run lint:fix` - Auto-fix where possible

**Current**: 77 errors, 2 warnings (will fix during refactoring)

### Prettier (Phase 0a Complete)

**Status**: Configured for consistent formatting

**Config**: `.prettierrc` (semi: true, singleQuote: false, tabWidth: 2, printWidth: 80)

**Scripts**:
- `npm run format` - Format all files
- `npm run format:check` - Check formatting (CI)

**Result**: 25 files formatted across entire codebase

### Vitest (Phase 0a Complete)

**Status**: Testing infrastructure configured (no tests written yet)

**Config**: `vitest.config.ts` (jsdom environment, @testing-library/react, jest-dom matchers)

**Scripts**:
- `npm run test` - Watch mode (TDD)
- `npm run test:ui` - Interactive UI
- `npm run test:run` - Run once (CI)
- `npm run test:coverage` - Coverage report

**Setup**: `src/test/setup.ts` configures testing-library

**Note**: Tests will be written in Phase 7

### TypeScript

**Strict Mode**: Enabled completely

**Compile Status**: ✅ Zero errors

## Development Constraints

### No Backend (Yet)

**Current**: Pure frontend - no auth, no API, no database, state in memory (lost on refresh)

**Future**: Frontend (Vite) → Backend (Node.js/Express) → Database (PostgreSQL) + AI/Social APIs

### API Rate Limits

**Gemini Free Tier**: 60 requests/min, 1,500/day

**Handling**: Try/catch with fallback messages, will add queuing/retry/caching later

### Local Storage

**Browser Limit**: ~5-10MB per domain

**Current Usage**: Theme preference (~10 bytes), Settings (~1KB)

**Future**: Posts, drafts, media, auth, analytics (requires backend)

### Performance Budgets

**Targets**: FCP < 1.5s, TTI < 3s, Lighthouse > 90, Bundle < 300KB gzipped

**Current**: ✅ Instant transitions (SPA), ✅ Fast HMR, ⚠️ No code splitting/lazy loading yet

## Recommended Tools

### VS Code Extensions

1. **ESLint** - Linting
2. **Prettier** - Formatting
3. **TypeScript and JavaScript Language Features** - Built-in
4. **Tailwind CSS IntelliSense** - Class autocomplete
5. **Error Lens** - Inline errors

### Browser Extensions

**React DevTools** - Component tree, props/state inspection, performance profiling

## Git Workflow

**Remote**: git@github.com:noobskies/socialflow.git  
**Branch**: main (single branch for MVP)

**Gitignore**: node_modules/, dist/, .env.local, .DS_Store, *.log

**Commit Conventions** (recommended):
```
feat: Add trending topics widget
fix: Resolve calendar date parsing bug
docs: Update README
style: Format code with Prettier
refactor: Extract toast logic to custom hook
test: Add unit tests for geminiService
```

## Deployment (Planned)

**Current**: Not deployed - local development only (localhost:5173)

**Recommended Platform**: Vercel
- Zero-config React deployment
- Automatic HTTPS
- Preview deployments for PRs
- Free tier sufficient for MVP

**Process**: `npm run build` → Deploy to Vercel → Add `VITE_GEMINI_API_KEY` in dashboard

## Security Considerations

### Current

**Good**:
- ✅ API key in environment variable (not in code)
- ✅ TypeScript prevents type bugs
- ✅ No user-generated content execution

**Risks**:
- ⚠️ API key exposed in client bundle (Vite limitation)
- ⚠️ No input sanitization
- ⚠️ No rate limiting
- ⚠️ No authentication

### Future (With Backend)

1. Backend API proxy (hide API key)
2. Input validation and sanitization
3. Authentication (JWT/OAuth)
4. Rate limiting and DDoS protection

## Known Technical Limitations

1. **Client-Side Only** - No SSR or data persistence
2. **No Offline Support** - Requires internet
3. **Memory Constraints** - Large datasets may cause issues
4. **No Code Splitting** - All code loaded upfront
5. **Modern Browsers Only** - No IE11 support
6. **API Dependencies** - Relies on external services
7. **No Real-Time** - No WebSockets
8. **No File Storage** - Client-side only

## Path to Production

### Phase 1: Backend Setup (Future)
- Node.js/Express server
- PostgreSQL database
- JWT authentication
- Redis caching

### Phase 2: API Integration (Future)
- Social platform OAuth
- Real posting capabilities
- Analytics aggregation
- Webhook handling

### Phase 3: Scale & Optimize (Future)
- CDN for static assets
- Database indexing
- Caching strategies
- Load balancing

---

## Current Development Status

**Tooling**: ✅ Complete (ESLint, Prettier, Vitest configured)  
**Structure**: ✅ Complete (/src organization, types split, path aliases)  
**Hooks**: ✅ Complete (5 custom hooks extracted)  
**Dashboard**: ✅ Complete (refactored into 12 files, 550 → 100 lines)  
**Composer**: ✅ Complete (refactored into 15 files, 1,850 → 217 lines)  
**UI Library**: ✅ Complete (4 reusable components created)  
**Shared Components**: ✅ Complete (11 components organized in /src/components/)  
**TypeScript**: ✅ Zero compilation errors  
**Dev Server**: ✅ Working on port 3001  
**Bundle**: ~200KB gzipped (acceptable for MVP)

**Phase 5 Complete**: UI library established, shared components organized  
**Phase 6a Complete**: Analytics refactored (677 → 60 lines, 15 components)  
**Phase 6b Complete**: Settings refactored (813 → 150 lines, 19 components)  
**Phase 6c Documentation**: Comprehensive refactoring plan ready for Calendar  
**Next**: Execute Phase 6c (Calendar refactoring) → 6d (App.tsx simplification)
