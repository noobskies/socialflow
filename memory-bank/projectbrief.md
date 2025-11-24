# Project Brief: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Project

**Current Phase**: Phase 6g Complete - All 9 Features Refactored! 🎉

**What This Is**: A functional MVP exported from Google AI Studio that needs professional refactoring

**Focus**: Restructuring frontend code with SOLID/DRY principles and organizing files for future scalability

**Freedom**: No backwards compatibility constraints - we can make breaking changes for better architecture

**Backend**: NOT in scope yet - this is frontend-only work preparing for future backend integration

---

## Vision

Build an AI-first social media management platform that empowers individuals, teams, and agencies to create, schedule, and analyze content across multiple platforms with unprecedented efficiency and intelligence.

## Core Objectives

### Primary Goals

1. **Simplify Multi-Platform Management**: Provide a unified interface for managing content across 7+ social platforms (Twitter, LinkedIn, Instagram, Facebook, TikTok, YouTube, Pinterest)
2. **AI-Powered Content Creation**: Leverage Google Gemini to generate, optimize, and suggest content based on trends and user context
3. **Intelligent Scheduling**: Enable smart scheduling with calendar views, bulk operations, and automated posting
4. **Actionable Analytics**: Deliver insights that drive decision-making through engagement metrics, trend analysis, and performance tracking
5. **White-Label Solution**: Support agency use cases with customizable branding and multi-workspace capabilities

### Target Users

- **Individual Content Creators**: Freelancers and influencers managing personal brands
- **Social Media Managers**: Professionals managing brand presence across platforms
- **Marketing Teams**: Collaborative teams needing approval workflows and shared calendars
- **Agencies**: Multi-client organizations requiring white-label solutions and team management

## Key Features (In Scope)

### Content Management

- Multi-platform post composer with AI assistance
- Content calendar with drag-and-drop scheduling
- Media library with organization and templates
- Quick drafts and content reuse

### AI Capabilities

- Trending topics discovery and analysis
- AI-generated post suggestions
- Content optimization recommendations
- Sentiment analysis and crisis detection

### Platform Integration

- Social account connections and health monitoring
- Cross-platform posting
- Platform-specific options (Instagram first comment, Twitter threads, etc.)
- Link shortening and bio page management

### Analytics & Insights

- Engagement metrics and trend visualization
- Performance reports (exportable)
- Link click tracking
- Audience growth monitoring

### Collaboration & Workflow

- Team member management with roles
- Approval workflows
- Notifications and inbox for social interactions
- Command palette for power users

### Monetization Tiers

- **Free**: Basic features, limited AI credits, 1 workspace
- **Pro**: Advanced features, more AI credits, priority support
- **Agency**: White-label, unlimited workspaces, team management, API access

## Out of Scope (Current Phase)

- Native mobile applications (web-responsive only)
- Advanced video editing (basic trim/caption only)
- Direct social platform API integrations (using mock data)
- Real-time collaboration (concurrent editing)
- Built-in payment processing for e-commerce

## Success Criteria

### User Experience

- Onboarding completion rate > 80%
- User can schedule first post within 5 minutes
- AI suggestions adoption rate > 60%
- Platform connection success rate > 95%

### Performance

- Page load time < 2 seconds
- AI response time < 5 seconds
- Calendar rendering for 100+ posts < 1 second

### Business

- User retention rate > 70% after 30 days
- Upgrade conversion from Free to Pro > 15%
- Agency tier adoption by qualifying users > 25%

## Technical Constraints

- Modern browser support only (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Google Gemini API dependency for AI features
- Client-side state management (no global state library initially)
- Progressive enhancement approach (graceful degradation)

## Project Boundaries

### Phase 0 (Current) - Frontend Refactoring

**Focus**: Code quality and organization (NOT feature building)

- Reorganize file structure (feature-based folders)
- Apply SOLID principles (break down monolithic components)
- Implement DRY patterns (extract hooks, utilities)
- Improve TypeScript types
- Refactor state management
- Enhance component composition

**Goal**: Professional, maintainable codebase ready for backend integration

### Phase 1 (Future) - MVP Feature Polish

- Complete remaining UI features
- Enhance existing components
- Add missing interactions
- Polish user experience

### Phase 2 (Future) - Backend Integration

- Real social platform integrations
- Backend API and data persistence
- User authentication system
- Advanced automation workflows
- Team collaboration features

### Phase 3 (Future) - Scale & Enhance

- Mobile native apps
- Advanced video editing
- Marketplace for templates/content
- Third-party integrations (Zapier, etc.)
- AI model customization

## Design Philosophy

1. **AI-First**: Every workflow should have an intelligent assistant component
2. **Simplicity**: Complex features should feel simple; reduce cognitive load
3. **Speed**: Interactions should feel instant; no unnecessary loading states
4. **Flexibility**: Power users get shortcuts and advanced options without cluttering basic UI
5. **Beauty**: Professional, modern design that scales from light to dark themes

## Repository Information

- **Project Name**: socialflow-ai
- **Repository**: git@github.com:noobskies/socialflow.git
- **Latest Commit**: 8a0ed676e7bb406fd5de6ee85303f343c4eae82f
- **Primary Language**: TypeScript/React
