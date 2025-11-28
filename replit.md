# WiseConnect - Digital Learning Platform for Older Adults

## Overview

WiseConnect is an accessibility-first educational platform designed to help older adults (ages 50+) learn essential digital technology skills through simple, interactive lessons. The application features personalized learning paths based on initial assessment, step-by-step lessons with visual and audio support, and a supportive community space for peer learning.

The platform prioritizes clarity, generous spacing, and forgiving interfaces to accommodate users with reduced vision, limited tech experience, and varying levels of digital literacy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component Library**
- Shadcn/ui component system built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- "New York" style variant optimized for accessibility
- Custom CSS variables for theming (light/dark modes, high contrast)

**Accessibility Features**
- Dedicated `AccessibilityContext` managing:
  - Text size preferences (medium, large, extra-large)
  - High contrast mode toggle
  - Theme switching (light/dark)
  - Text-to-speech integration using Web Speech API
- Minimum touch target sizes (60-80px) for interactive elements
- WCAG AAA-compliant color contrast ratios
- Keyboard navigation support throughout

**Design System**
- Typography scale starts at 18px minimum
- Generous spacing using Tailwind's 4-based scale (4, 6, 8, 12, 16, 20, 24)
- Large buttons with 64px minimum height
- Icon + label navigation pattern
- Fixed bottom navigation on mobile for easy access

### Backend Architecture

**Server Framework**
- Express.js HTTP server
- HTTP server instance for potential WebSocket upgrades
- Middleware stack: JSON parsing, URL encoding, request logging

**Data Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL dialect configured (via `@neondatabase/serverless`)
- Schema-first approach with shared types between client/server
- In-memory storage implementation (`MemStorage`) for development/testing

**Database Schema Design**

*Users & Personalization*
- `users`: Stores profile, quiz results (digital literacy level, learning style), and accessibility preferences
- User preferences persisted: text size, high contrast mode

*Quiz System*
- `quizQuestions`: Question bank with type classification (literacy vs. learning style)
- `quizOptions`: Multiple choice options with weighted values
- Dynamic scoring algorithm calculates literacy level (beginner/intermediate/advanced)

*Learning Content*
- `lessons`: Module metadata including difficulty, duration, icon, and step count
- `lessonSteps`: Individual instruction screens with content type (text, image, video, action)
- Step-based progression allows users to pause and resume

*Progress Tracking*
- `userProgress`: Tracks current step and completion status per lesson
- Enables personalized "continue where you left off" functionality

*Community Features*
- `communityPosts`: User-generated questions/tips with category tagging
- `communityReplies`: Threaded responses for peer support

**API Design**
- RESTful endpoints under `/api` prefix
- Quiz flow: GET questions → POST submission → returns user profile
- Lesson endpoints: List all, get single with steps, update progress
- Community: CRUD operations for posts and replies
- User ID passed as query parameter (session-less for MVP simplicity)

### State Management

**Client-Side State**
- `UserContext`: Global user profile and authentication state, persisted to localStorage
- `AccessibilityContext`: User preferences for display and interaction
- React Query cache: Server data with intelligent invalidation on mutations

**Server-Side State**
- Stateless request handling
- No session management in current implementation
- User identification via ID in request parameters

### External Dependencies

**Third-Party Libraries**

*UI & Interaction*
- Radix UI: Unstyled accessible component primitives (@radix-ui/react-*)
- Lucide React: Icon library with consistent sizing
- cmdk: Command palette component
- embla-carousel-react: Touch-friendly carousels
- react-day-picker: Calendar/date selection
- vaul: Drawer/sheet components

*Forms & Validation*
- React Hook Form: Form state management
- Zod: Runtime type validation
- @hookform/resolvers: Zod integration for forms
- drizzle-zod: Generate Zod schemas from Drizzle tables

*Utilities*
- clsx & tailwind-merge: Conditional class name composition
- class-variance-authority: Type-safe variant styling
- date-fns: Date formatting and manipulation
- nanoid: Unique ID generation

**Development Tools**
- tsx: TypeScript execution for build scripts and development
- esbuild: Fast JavaScript bundler for production server
- @replit/vite-plugin-*: Replit-specific development enhancements
- drizzle-kit: Database schema management and migrations

**Potential Future Integrations**
- Email service (nodemailer) for notifications
- Session management (express-session, connect-pg-simple)
- Authentication (passport, passport-local)
- Payment processing (stripe)
- AI assistance (@google/generative-ai, openai)
- Real-time features (ws for WebSockets)

### Build & Deployment

**Development Mode**
- Vite dev server with HMR at `/vite-hmr`
- Express middleware mode for API proxying
- Source maps for debugging
- Dynamic template reloading

**Production Build**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.cjs`
- Select dependencies bundled (allowlist) to reduce syscalls
- Static file serving from built client directory

**File Structure**
- `client/`: React application (pages, components, hooks, styles)
- `server/`: Express routes, storage layer, static serving
- `shared/`: Database schema and types shared between client/server
- Path aliases configured: `@/` → client/src, `@shared/` → shared/