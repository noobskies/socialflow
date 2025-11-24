<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# SocialFlow AI

### AI-First Social Media Management Platform

[![Phase](https://img.shields.io/badge/Phase-7%20Complete-success)](https://github.com/noobskies/socialflow)
[![Frontend](https://img.shields.io/badge/Frontend-Production%20Ready-success)](https://github.com/noobskies/socialflow)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![Code Quality](https://img.shields.io/badge/ESLint-0%20Errors-brightgreen)](https://eslint.org/)

</div>

---

## Overview

**SocialFlow AI** is a next-generation social media management platform that empowers creators, teams, and agencies to manage content across 7+ social platforms with unprecedented efficiency through AI-powered intelligence.

Unlike traditional tools (Buffer, Hootsuite, Later), SocialFlow AI treats artificial intelligence as a **first-class citizen** - not an afterthought. Every workflow includes intelligent assistance, from content creation to trend discovery to crisis detection.

### Key Differentiators

- **AI-First Architecture** - Intelligence baked into every feature, not bolted on
- **Speed & Simplicity** - Professional features with consumer-grade simplicity  
- **Context Intelligence** - Understands your niche, voice, and audience
- **Proactive Insights** - Surfaces opportunities before they're missed
- **Modern Stack** - Built with 2025 tech (React 19, TypeScript, Gemini AI)

### Target Users

- **Content Creators** - Freelancers and influencers managing personal brands
- **Social Media Managers** - Professionals managing brand presence across platforms
- **Marketing Teams** - Collaborative teams with approval workflows
- **Agencies** - Multi-client organizations requiring white-label solutions

---

## Key Features

### Content Management
- Multi-platform post composer with AI assistance
- Visual calendar with drag-and-drop scheduling
- Media library with organization and templates
- Quick drafts and content reuse
- Bulk operations and batch scheduling

### AI Capabilities
- Trending topics discovery and analysis
- AI-generated post suggestions and optimization
- AI image generation and alt text creation
- Smart reply suggestions for engagement
- Content sentiment analysis
- Crisis detection and alerts

### Platform Integration
- Social account connections (Twitter, LinkedIn, Instagram, Facebook, TikTok, YouTube, Pinterest)
- Platform-specific features (Instagram first comment, Twitter threads, etc.)
- Link shortening and bio page management
- Account health monitoring

### Analytics & Insights
- Engagement metrics and trend visualization
- Performance reports (exportable)
- Competitor analysis
- Link click tracking
- Audience growth monitoring

### Collaboration & Workflow
- Team member management with roles
- Approval workflows
- Notifications and social inbox
- Command palette for power users
- Automation workflows and integrations

---

## Current Status

### Phase 7 Complete (Frontend Production-Ready)

**Major Achievement**: Professional frontend architecture with 81% code reduction

```
Before:  6,897 lines across monolithic components
After:   1,300 lines across 135+ focused components
Result:  -81% reduction while adding features
```

**Completed Work**:
- **9 Major Features** - Dashboard, Composer, Calendar, Analytics, Settings, Inbox, Library, LinkManager, Automations
- **135+ Components** - Focused, testable, following orchestrator pattern
- **14 Custom Hooks** - 5 reusable + 9 feature-specific for state management
- **UI Library** - 4 reusable primitives (Button, Input, Modal, Card)
- **Zero Linting Errors** - Professional code quality with ESLint/Prettier
- **100% Type Safety** - Strict TypeScript with zero `any` types
- **14/15 AI Features** - Gemini integration complete (only video captions unused)
- **Feature-Based Organization** - Professional `/src` structure with path aliases

### Phase 8 Next (Backend Planning)

**Upcoming Goals**:
- Database schema design (Users, Posts, Accounts, Media, Teams, Workflows)
- API architecture decisions (REST vs GraphQL)
- Authentication strategy (Firebase Auth, Auth0, custom JWT)
- Tech stack selection (Express/Fastify/Nest.js, ORM choice)
- Hosting infrastructure planning (Vercel, Railway, AWS, Render)

---

## Tech Stack

### Frontend
- **Framework**: React 19.2.0 (with concurrent features)
- **Language**: TypeScript 5.8.2 (strict mode, 100% type coverage)
- **Build Tool**: Vite 6.2.0 (lightning-fast HMR, optimized builds)
- **Styling**: Tailwind CSS (utility-first, dark mode support)
- **Icons**: Lucide React 0.554.0 (1000+ tree-shakeable icons)
- **Charts**: Recharts 3.4.1 (declarative, responsive)

### AI Integration
- **Provider**: Google Gemini 1.30.0 (`@google/genai`)
- **Features**: Content generation, trend discovery, image generation, sentiment analysis
- **Cost**: Free tier with generous limits (60 req/min, 1,500/day)

### Development Tools
- **Linting**: ESLint with React/TypeScript rules
- **Formatting**: Prettier (consistent code style)
- **Testing**: Vitest + React Testing Library (infrastructure ready)
- **Package Manager**: npm with lock file

### Architecture Patterns
- **Organization**: Feature-based structure under `/src`
- **State Management**: React useState at root (migrating to Context/Zustand)
- **Component Pattern**: Orchestrator pattern with custom hooks
- **Code Quality**: SOLID principles, DRY methodology
- **Type System**: Organized across 4 modules (domain, ui, features, ai)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (included with Node.js)
- **Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:noobskies/socialflow.git
   cd socialflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   
   > **Important**: Prefix with `VITE_` for client-side access

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Production build (dist/ directory)
npm run preview      # Preview production build locally
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting (CI)
npm run test         # Run tests in watch mode
npm run test:ui      # Launch Vitest UI
npm run test:run     # Run tests once (CI)
npm run test:coverage # Generate coverage report
```

---

## Project Structure

```
/socialflow
├── App.tsx                 # Root orchestrator (228 lines)
├── index.tsx               # Application entry point
│
├── /src                    # All source code organized here
│   ├── /features           # Feature-based organization (9 features)
│   │   ├── /dashboard      # Dashboard with 12 components
│   │   ├── /composer       # Composer with 15 components
│   │   ├── /calendar       # Calendar with 16 components
│   │   ├── /analytics      # Analytics with 15 components
│   │   ├── /settings       # Settings with 19 components
│   │   ├── /inbox          # Inbox with 12 components
│   │   ├── /library        # Library with 18 components
│   │   ├── /linkmanager    # LinkManager with 14 components
│   │   └── /automations    # Automations with 10 components
│   │
│   ├── /components         # Shared/reusable components
│   │   ├── /ui             # Base UI primitives
│   │   ├── /layout         # Layout components
│   │   └── /feedback       # User feedback components
│   │
│   ├── /hooks              # Custom hooks (14 total)
│   │   ├── useToast.ts     # Toast notifications
│   │   ├── useModal.ts     # Modal state management
│   │   ├── useTheme.ts     # Theme switching
│   │   ├── useKeyboard.ts  # Keyboard shortcuts
│   │   └── useLocalStorage.ts # localStorage with debounce
│   │
│   ├── /services           # External services
│   │   └── geminiService.ts # Gemini AI integration
│   │
│   ├── /types              # TypeScript type definitions
│   │   ├── domain.ts       # Core domain types
│   │   ├── ui.ts           # UI-specific types
│   │   ├── features.ts     # Feature-specific types
│   │   └── ai.ts           # AI service types
│   │
│   ├── /utils              # Utility functions
│   │   ├── constants.ts    # Mock data and constants
│   │   ├── dates.ts        # Date utilities
│   │   ├── formatting.ts   # Formatting utilities
│   │   └── validation.ts   # Validation utilities
│   │
│   └── /test               # Test configuration
│       └── setup.ts        # Vitest setup
│
├── /docs                   # Project documentation
│   └── /phases             # Phase-specific docs
│
└── /memory-bank            # AI context files
    ├── projectbrief.md     # Project vision and goals
    ├── productContext.md   # User problems and solutions
    ├── systemPatterns.md   # Architecture patterns
    ├── techContext.md      # Tech stack details
    ├── activeContext.md    # Current work focus
    └── progress.md         # Progress tracking
```

### Path Aliases

All imports use clean path aliases configured in `tsconfig.json` and `vite.config.ts`:

```typescript
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { Post } from '@/types'
import { geminiService } from '@/services/geminiService'
```

---

## Development

### Architecture Pattern: Orchestrator

All major features follow the **Orchestrator Pattern** for scalability:

```typescript
// 1. Custom Hook - State management
export function useFeature() {
  const [state, setState] = useState();
  // ... all state logic
  return { state, actions };
}

// 2. Orchestrator Component - Composition (100-200 lines)
export const Feature: React.FC<Props> = (props) => {
  const feature = useFeature();
  
  return (
    <div>
      <SubComponent1 {...feature} />
      <SubComponent2 {...feature} />
    </div>
  );
};

// 3. Focused Sub-Components - Single responsibility (20-50 lines)
```

**Benefits**:
- Orchestrators stay clean (~200 lines max)
- Sub-components are focused and testable
- Custom hooks manage complex state
- Easy to understand and maintain
- Scales from simple to complex features

### Code Quality Guidelines

**SOLID Principles**:
- **Single Responsibility**: Each component has ONE clear job
- **Open/Closed**: Extend through composition, not modification
- **Dependency Inversion**: Depend on props (interfaces), not implementations

**DRY Methodology**:
- See duplicate code? Extract to hook, utility, or shared component
- Proven wins: `FeatureGateOverlay` (3 reuses), `PostCard` (3 views)

**No Backwards Compatibility**:
- Freedom to make breaking changes for better architecture
- Refactor aggressively when better patterns emerge
- This enabled the 81% code reduction

### Component Structure

```typescript
// 1. Imports
import React, { useState } from 'react'
import { Icon } from 'lucide-react'
import { Type } from '@/types'

// 2. Interface (if props exist)
interface ComponentProps {
  data: Type
  onAction: (value: string) => void
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // State, effects, handlers
  return <div>{/* JSX */}</div>
}
```

### Testing Strategy (Phase 10)

Testing deferred until after backend integration to avoid test rewrites:

- **Unit Tests**: Hooks and utilities
- **Component Tests**: UI library and shared components
- **Integration Tests**: Complete user flows
- **E2E Tests**: Critical paths (Playwright)

Current confidence: Clean code with zero linting errors and 100% type safety

---

## Roadmap

### Completed

- **Phase 0a** - Development tools (ESLint, Prettier, Vitest)
- **Phase 1** - Foundation setup (/src structure, path aliases)
- **Phase 2** - Custom hooks extraction
- **Phase 3** - Dashboard refactoring (orchestrator pattern)
- **Phase 4** - Composer refactoring (1,850 → 217 lines)
- **Phase 5** - Shared components (UI library)
- **Phase 6** - Remaining features (7 more features)
- **Phase 7** - Code cleanup and quality (zero errors, 100% type safety)

### Current

- **Phase 8** - Backend Planning & Design (database, API, auth, hosting)

### Next

- **Phase 9** - Backend Development
  - Node.js/Express API server
  - PostgreSQL database
  - JWT authentication
  - Social platform OAuth
  - API endpoints
  
- **Phase 10** - Integration & Testing
  - Connect frontend to backend
  - Replace mock data with real data
  - Write comprehensive test suite
  - Real social platform integrations
  - Performance optimization

### Future

- **Phase 11** - Scale & Enhance
  - Mobile native apps
  - Advanced video editing
  - Marketplace for templates
  - Third-party integrations (Zapier)
  - AI model customization

---

## Contributing

We welcome contributions! Here's how to get started:

### Code Review Priorities

When reviewing code, check for:
- TypeScript errors resolved
- No console errors
- Dark mode tested
- Mobile responsiveness verified
- Error handling present
- Follows established patterns (orchestrator, hooks)

### Development Philosophy

1. **SOLID/DRY First** - These principles guide all decisions
2. **No Backwards Compatibility** - Refactor fearlessly for better patterns
3. **Component Size** - Orchestrators 100-200 lines, sub-components 20-50 lines
4. **Extract Duplication** - Immediately extract to hooks/utilities/components
5. **TypeScript Strict** - 100% type coverage, zero `any` types

### Commit Conventions

```
feat: Add trending topics widget
fix: Resolve calendar date parsing bug
docs: Update README
style: Format code with Prettier
refactor: Extract toast logic to custom hook
test: Add unit tests for geminiService
```

---

## Documentation

- **Memory Bank** - AI context files in `/memory-bank/`
  - `projectbrief.md` - Project vision and goals
  - `productContext.md` - User problems and solutions  
  - `systemPatterns.md` - Architecture patterns
  - `techContext.md` - Tech stack details
  - `activeContext.md` - Current work focus
  - `progress.md` - Progress tracking

- **Phase Docs** - Detailed phase documentation in `/docs/phases/`

---

## Project Metrics

- **Lines of Code**: 6,897 → 1,300 (-81% reduction)
- **Components**: 135+ focused, testable components
- **Custom Hooks**: 14 total (5 reusable + 9 feature-specific)
- **UI Library**: 4 reusable primitives
- **TypeScript Errors**: 0
- **Linting Errors**: 0
- **Type Coverage**: 100%
- **Bundle Size**: ~200KB gzipped

---

## License

This project is part of a private development effort. All rights reserved.

---

## Links

- **Repository**: [github.com/noobskies/socialflow](https://github.com/noobskies/socialflow)
- **AI Studio App**: [View in AI Studio](https://ai.studio/apps/drive/1F_c6lWBJUDwtaBcuV9DrEyWVrZ-oFRpi)
- **Gemini API**: [Get API Key](https://ai.google.dev/)

---

<div align="center">

**Built with React 19, TypeScript, and Google Gemini AI**

*Next-generation social media management for the AI era*

</div>
