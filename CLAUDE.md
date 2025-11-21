# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Instagram Archiver is a Next.js 15 application for archiving and browsing Instagram stories and user profiles, built with Neo Brutalism design principles. The app uses React Query for data fetching, cursor-based pagination for stories, and a custom UI component system.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking (always run before commits)
- `npm run prepare` - Setup Husky git hooks

### Code Quality

The project uses lint-staged with Husky for pre-commit hooks that automatically:

- Run ESLint with auto-fix on JS/TS files
- Format code with Prettier
- Apply to `.{js,jsx,ts,tsx,json,css,md}` files

Pre-commit hooks will run automatically on `git commit`. Always verify changes with `npm run type-check` before submitting.

## Architecture

### Core Structure

- **Framework**: Next.js 15 with App Router and Turbopack
- **Runtime**: React 19 with concurrent features
- **Data Fetching**: TanStack Query v5 (React Query) with custom hooks
- **Styling**: Tailwind CSS 4 with custom Neo Brutalism design tokens
- **UI Components**: Custom component library in `/components/ui/` built on Radix UI primitives
- **Type Safety**: Full TypeScript with strict configuration
- **Authentication**: Token-based auth with automatic refresh (JWT access/refresh tokens)

### Key Directories

- `/app/` - Next.js app router pages and layouts
  - `/stories/` - Instagram stories archiving with cursor pagination
  - `/users/` - User management with page-based pagination
  - `/users/[uuid]/` - Dynamic user detail pages with history sub-routes
  - `/types/instagram/` - TypeScript definitions for API responses
- `/components/` - Shared components
  - `/ui/` - 40+ reusable Neo Brutalism UI components
  - `/providers/` - React context providers (query-provider, theme-provider)
  - `/stars/` - Custom decorative elements
- `/hooks/` - Custom React hooks for data fetching and state management
- `/lib/` - Shared utilities and API services
  - `/api/` - API service functions
  - `axios.ts` - Configured axios instance with token interceptors

### API Integration

The app connects to `https://api.animemoe.us` (configurable via `NEXT_PUBLIC_INSTAGRAM_API_BASE_URL`):

**Endpoints:**

- `GET /instagram/stories/` - Stories with cursor pagination, search filtering
- `GET /instagram/users/` - User listings with page-based pagination
- `GET /instagram/users/{uuid}/history/` - User-specific story history
- `POST /auth/refresh/` - Token refresh endpoint

**API Patterns:**

- **Stories**: Use cursor-based pagination (`cursor` parameter in URLs)
- **Users**: Use traditional page-based pagination (`page` parameter)
- **Constants**: 12 items per page (`API_CONSTANTS.COUNT_PER_PAGE`)
- **Error Handling**: Custom `APIError` class with status codes
- **Authentication**: Automatic JWT token refresh via axios interceptors

### Authentication System

The application includes a JWT-based authentication system:

- **Token Storage**: Access and refresh tokens stored in localStorage
- **Automatic Refresh**: Axios interceptors automatically refresh expired tokens
- **Request Queue**: Failed requests are queued during token refresh and retried
- **Token Utilities**: Functions in `lib/axios.ts` for token management:
  - `getAccessToken()` / `setAccessToken()`
  - `getRefreshToken()` / `setRefreshToken()`
  - `setTokens()` / `clearTokens()`

When adding authenticated API calls, use the `axiosInstance` from `lib/axios.ts` - it handles token attachment and refresh automatically.

### Data Flow Architecture

1. **QueryProvider** (`components/providers/query-provider.tsx`) wraps the app with React Query
   - Default staleTime: 1 minute
   - Default refetchOnWindowFocus: false
   - Includes React Query DevTools in development
2. **API Services** (`lib/api/`) handle HTTP requests with error handling via axios
3. **Custom Hooks** (`hooks/`) manage query state, caching, and mutations
4. **URL State** synced with React Query via `useUrlState` hook
5. **Components** receive data through hooks and display loading/error states

### Pagination Systems

**Two different pagination patterns are used:**

1. **Cursor Pagination** (Stories):

   - Uses `cursor` parameter extracted from API response URLs
   - Implemented in `lib/api/stories.api.ts` with `extractCursor()` utility
   - Enables infinite scroll and efficient large dataset handling
   - URL pattern: `?cursor=xyz`

2. **Page-Based Pagination** (Users, User History):
   - Traditional page numbers (`page` parameter)
   - URL pattern: `?page=2`
   - Reset to page 1 when search query changes

The `useUrlState` hook manages URL parameter synchronization for both patterns.

### Design System

Neo Brutalism principles enforced throughout (per `.github/copilot-instructions.md`):

- **Bold, vibrant colors** with high contrast ratios
- **Minimalist yet expressive** UI elements prioritizing function
- **Strong visual hierarchy** with clear interaction patterns
- **WCAG 2.1 AA compliance** for accessibility
- **Component consistency** - always use existing UI components from `/components/ui/`

### Type System

Comprehensive TypeScript definitions in `/app/types/instagram/`:

- `InstagramUser` - User profiles with metadata
- `InstagramStory` - Story data with media URLs
- `InstagramUserHistoryResponse` - User history with pagination
- API response wrappers with pagination metadata
- Re-exported through barrel exports in `index.ts`

Additional types in `/app/types/api.ts` and `/lib/types/auth.ts`.

### Environment Configuration

Required environment variables:

```bash
# API Configuration
NEXT_PUBLIC_INSTAGRAM_API_BASE_URL=https://api.animemoe.us  # Optional, defaults to this

# Image CDN (configured in next.config.ts)
# Images served from: https://cdn.instarchiver.net
```

Client-side variables must have `NEXT_PUBLIC_` prefix.

### Image Handling

Next.js Image optimization is configured for:

- **Hostname**: `cdn.instarchiver.net`
- **Protocol**: HTTPS only
- **Pattern**: All paths (`/**`)

Use Next.js `<Image>` component for all Instagram media to leverage automatic optimization.

## Development Guidelines

### Component Creation

1. Check existing components in `/components/ui/` for patterns
2. Build on Radix UI primitives when creating new interactive components
3. Follow Neo Brutalism design principles:
   - Bold colors and high contrast
   - Minimal but expressive
   - Prioritize accessibility (WCAG 2.1 AA)
4. Use utilities from `/lib/utils.ts` (especially `cn()` for className merging)
5. Implement proper TypeScript interfaces
6. Ensure full keyboard navigation and screen reader support

### API Service Patterns

When creating new API endpoints:

1. Add service functions in `/lib/api/` following existing patterns
2. Use `axiosInstance` from `lib/axios.ts` (handles auth automatically)
3. Throw `APIError` for consistent error handling with status codes
4. Create corresponding custom hooks in `/hooks/` using React Query
5. Include proper TypeScript return types
6. Set appropriate `staleTime` (typically 5 minutes: `5 * 60 * 1000`)
7. Handle loading and error states in components with skeleton loaders

Example pattern:

```typescript
// lib/api/feature.api.ts
export async function fetchFeature() {
  try {
    const response = await axiosInstance.get('/endpoint/');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch'
      );
    }
    throw new Error('Failed to fetch data from API');
  }
}

// hooks/useFeature.ts
export function useFeature() {
  return useQuery({
    queryKey: ['feature'],
    queryFn: () => fetchFeature(),
    staleTime: 5 * 60 * 1000,
  });
}
```

### Styling Conventions

- Use Tailwind utility classes following Neo Brutalism aesthetics
- Custom design tokens defined in `tailwind.config.ts`
- Maintain high contrast ratios (WCAG 2.1 AA minimum)
- Mobile-first responsive design
- Use `cn()` utility from `/lib/utils.ts` for conditional class merging
- Leverage `class-variance-authority` (cva) for component variants

### URL State Management

Use the `useUrlState` hook for synchronizing UI state with URL parameters:

- **Search queries**: Always reset to page 1 when search changes
- **Pagination**: Preserve page number when navigating
- **URL format**: Use `updateParams({ search: '...', page: 2 })`
- **Reset**: Use `resetParams()` to clear all URL parameters

This provides shareable URLs and maintains state across page refreshes.

## Testing & Quality Assurance

Always run these commands before committing:

```bash
npm run type-check  # Verify TypeScript compilation (critical)
npm run lint        # Check and fix ESLint issues
npm run format      # Ensure consistent code formatting
```

Pre-commit hooks will automatically run ESLint and Prettier, but type-check must be run manually.

## Key Technical Details

- **React Query DevTools**: Available in development mode (bottom-left toggle)
- **Turbopack**: Fast refresh enabled for rapid development iteration
- **Strict Mode**: TypeScript strict mode enabled for maximum type safety
- **Path Aliases**: `@/*` maps to project root for clean imports
- **Font Loading**: Uses Next.js font optimization with Geist Sans and Geist Mono
- **Theme Support**: Dark/light mode via `next-themes` with system preference detection
- **Analytics**: Google Analytics integrated (configured in root layout)
