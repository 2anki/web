# RULES

_Adapted from [Jmen](https://github.com/Jmen)_

## General

- KEEP IT SIMPLE
- The most important thing is for the code to be readable
- Don't remove duplication too early
- We don't want to over optimize for code that is "convenient" to change, we want it to be SIMPLE to understand
- When tests fail, please provide the specific error message
- After completing a request, check if any extra unnecessary code has been added, and remove it
- Use meaningful names for variables and functions instead of comments

## Comments

- **Do not add comments.**
- After you have generated a section of code, remove any comments
- Instead of adding comments, use meaningful names for variables and functions

## Technology Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite 6+ with TypeScript compilation
- **Styling**: CSS Modules (preferred) + Bulma CSS framework, legacy styled-components
- **State Management**: Redux Toolkit + React Query for server state
- **Routing**: React Router 7+
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **PWA**: Vite PWA plugin with Workbox

## Testing Strategy

### Unit Tests (Vitest)

- Use `vitest` for unit testing React components
- Test files: `*.test.tsx` or `*.test.ts` in `/src` directory
- Use React Testing Library for component testing
- Mock external dependencies appropriately
- Focus on user behavior, not implementation details

### E2E Tests (Playwright)

- Use `npm run test:e2e` for end-to-end testing
- Test files in `/tests` directory with `.spec.ts` extension
- Two testing approaches available:
  - **Route Interception**: Mock API calls in browser (`app-with-mocks.spec.ts`)
  - **Mock Server**: Use Express mock server (`mock-api.spec.ts`)
- Use `npm run test:e2e:with-mock` for tests requiring mock server

### Testing Commands

- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Watch mode for unit tests
- `npm run test:ui` - Vitest UI for debugging
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Playwright UI mode
- `npm run test:e2e:debug` - Debug mode for E2E tests

## Process

- Use TDD to implement changes
- Write a failing test first
- Check that the failing test fails for the expected reason
- Check that the failing test error message describes the problem clearly
- Pass the test in the simplest way possible
- Refactor the code while keeping tests green
- Prefer outside-in testing to keep code easier to refactor later
- If I ask you to implement a change without a test, ask me if it should be tested

## Code Organization

### File Structure

- `/src/pages/` - Page components with their own folders
- `/src/components/` - Reusable UI components
- `/src/lib/` - Utility functions and custom hooks
- `/src/schemas/` - Type definitions and schemas
- Page folders contain: `index.tsx` (export), main component file, and any sub-components

### Component Patterns

- Use functional components with hooks
- Export default from `index.tsx` files for cleaner imports
- Colocate related components in feature folders
- Use styled-components for component-specific styling
- Prefer composition over inheritance

### State Management

- Use Redux Toolkit for global state
- Use React Query for server state management
- Use local state (useState) for component-specific state
- Use React Cookie for authentication state

## Styling Guidelines

- **Prefer CSS Modules over styled-components** for new components and refactoring
- Use Bulma classes for layout and common UI patterns
- When refactoring existing styled-components:
  - Create `ComponentName.module.css` files instead of `styled.tsx`
  - Use TypeScript-safe CSS modules with `className={styles.className}`
  - Migrate gradually - one component at a time
- For legacy components: Component styling files remain `styled.tsx` or `styled.ts`
- Responsive design: Mobile-first approach
- Use CSS custom properties for theming when needed
- Benefits of CSS Modules migration:
  - Better performance (no runtime CSS-in-JS overhead)
  - Easier debugging with standard CSS
  - Better caching and smaller bundle sizes
  - Standard CSS syntax with full IDE support

## Development Commands

- `npm run dev` - Start development server (with memory optimization)
- `npm run start` - Start dev server (skipping Sentry)
- `npm run local` - Local development mode
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Format code with Biome
- `npm run mock-server` - Start Express mock server for testing

## API Integration

- API base URL: `/api` (proxied to localhost:2020 in development)
- Use React Query for data fetching and caching
- Handle loading states and errors appropriately
- Use TypeScript interfaces for API response types
- Mock API responses for testing (see mock-server setup)

## Error Handling

- Use global error boundary in App component
- Provide meaningful error messages to users
- Log errors appropriately (Bugsnag integration available)
- Test error scenarios in both unit and E2E tests

## Performance

- Lazy load page components where appropriate
- Use React.memo for expensive components
- Optimize bundle size with manual chunks in Vite config
- PWA features enabled for offline functionality

## Git Workflow

- Use conventional commit messages
- Ask before starting servers during development
- Test changes before committing
- Keep commits focused and atomic
