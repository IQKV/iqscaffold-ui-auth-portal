# 🔐 IQKV Auth Portal

> Modern authentication frontend providing user registration, login, password management, and seamless integration with the IQKV microservices platform.

## Business Purpose

A dedicated authentication portal that handles:

- **User Registration** - Self-service account creation with email verification workflow
- **User Authentication** - Secure login with JWT token-based session management
- **Password Management** - Forgot password and reset password flows with secure token validation
- **Session Management** - Token refresh, logout, and multi-device session handling
- **External Integration** - Seamless redirect to main application domain upon successful authentication
- **Multi-Language Support** - Internationalization with Lingui for global user base

## Overview

This is the authentication frontend for the IQKV microservices platform. It provides a modern, accessible, and performant user interface for identity management, delegating authentication concerns to the backend User Service while maintaining a clean separation between authentication flows and application-specific features.

## What It Demonstrates

### 🎨 Modern Frontend Architecture

- Feature-Sliced Design (FSD) methodology for scalable architecture
- React 19 with concurrent features and improved performance
- TypeScript strict mode for enhanced type safety
- Vite 7 for lightning-fast development and optimized builds
- TanStack Router for type-safe routing with code splitting

### 🔐 Authentication Patterns

- JWT-based stateless authentication with token lifecycle management
- Automatic token refresh before expiration
- Secure token storage with localStorage
- Multi-tab session synchronization
- Route protection with declarative guards
- User context extraction and propagation

### 📊 State Management

- Zustand store for centralized auth state
- TanStack Query for server state synchronization and caching
- Immer integration for immutable state updates
- Type-safe selectors and actions
- DevTools support for debugging

### 🎯 Form Management

- React Hook Form with Zod validation
- Type-safe form schemas
- Real-time validation feedback
- Accessible form controls with Mantine UI
- Error handling with user-friendly messages

### 🌍 Internationalization

- Lingui framework with macro support
- Message extraction and compilation
- Pluralization and formatting
- Language switching without page reload
- Translation-ready component architecture

### ♿ Accessibility & UX

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- Focus management and ARIA attributes
- Responsive design for all devices
- Dark mode support with Mantine theme

### 🧪 Testing & Quality

- Vitest for unit and integration testing
- Playwright for end-to-end testing with UI mode
- Mock Service Worker for API mocking
- Testing Library for component testing
- Coverage reporting and CI integration

### 🔍 Code Quality

- ESLint 9 with flat config and React rules
- Prettier for consistent code formatting
- Stylelint for CSS/SCSS linting
- Husky for pre-commit validation
- Commitlint for conventional commits
- Knip for dead code elimination

## Architecture Patterns

### Feature-Sliced Design Structure

```
src/
├── app/              # Application initialization and configuration
├── processes/        # Complex business processes (auth flow)
├── pages/            # Route pages and layouts
├── widgets/          # Composite UI blocks (auth layout)
├── features/         # User interactions (signin, signup, password reset)
├── entities/         # Business entities (form models)
├── shared/           # Reusable infrastructure (API, UI, utils)
└── types/            # Global type definitions
```

### Authentication Process Layer

- Centralized auth state management with Zustand
- Token lifecycle management (validation, refresh, expiration)
- Route guards for protected pages
- User context selectors and utilities
- Side effects management (token refresh, storage sync)
- HTTP interceptors for request/response handling

### API Integration

- Axios-based HTTP client with interceptors
- Type-safe API contracts with TypeScript
- Error handling with standardized responses
- Request/response transformation
- Correlation ID propagation
- Environment-specific configuration

## Technical Highlights

### Performance Optimization

- Code splitting with TanStack Router
- Lazy loading for route components
- Bundle size optimization with Vite
- Tree shaking for unused code elimination
- Production build with SWC compiler
- Console statement removal in production

### Security Features

- JWT token validation and expiration checking
- Secure token storage with localStorage
- XSS prevention with input sanitization
- CSRF protection via token-based auth
- Secure password reset flow with token validation
- Rate limiting awareness (backend-enforced)

### Developer Experience

- Hot Module Replacement for instant updates
- TypeScript strict mode for type safety
- Comprehensive ESLint rules for code quality
- Prettier integration for consistent formatting
- Storybook for component development (ready)
- DevTools for debugging (React Query, Router)

### Operational Features

- Docker containerization with multi-stage builds
- Environment-specific configuration via .env
- Health checks and monitoring readiness
- Structured logging for production
- CI/CD integration with GitHub Actions
- Automated dependency updates with Dependabot

## Use Cases Implemented

### User Registration Flow

- Registration form with validation (username, email, password, names)
- Password strength requirements enforcement
- Email verification workflow initiation
- Tenant ID support for multi-tenancy
- Success redirect to login page
- Error handling with user feedback

### User Authentication Flow

- Login form with username/email and password
- Remember me functionality for extended sessions
- JWT token reception and storage
- Automatic redirect to main application domain
- Session persistence across page reloads
- Multi-device session support

### Password Management

- Forgot password form with email input
- Password reset request with backend validation
- Reset password form with token validation
- Token expiration handling
- Password strength validation
- Success confirmation and redirect

### Session Management

- Automatic token refresh before expiration
- Logout with token cleanup
- Logout from all devices support
- Session expiration handling
- Multi-tab synchronization via storage events
- Page visibility change detection

### Route Protection

- Public routes (login, signup, forgot password, reset password)
- Protected routes (change password, user profile)
- Automatic redirect for unauthenticated users
- Role-based access control support
- Permission-based access control support
- Email verification requirement enforcement

## API Integration

### Backend Endpoints

The auth portal integrates with the User Service API:

**Public Endpoints:**

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/validate` - Validate JWT token
- `GET /api/v1/auth/email/verify` - Verify email address
- `POST /api/v1/auth/email/resend` - Resend verification email
- `POST /api/v1/auth/password/forgot` - Initiate password reset
- `POST /api/v1/auth/password/reset` - Reset password with token

**Protected Endpoints:**

- `PATCH /api/v1/users/me/password` - Change password
- `POST /api/v1/auth/logout` - Logout current session
- `POST /api/v1/auth/logout-all` - Logout all sessions
- `GET /api/v1/auth/email/status` - Get email verification status

### Configuration

Environment variables for API integration:

- `VITE_API_URL_SERVER` - Backend API base URL (User Service)
- `VITE_AUTH_DOMAIN_AUTH` - Auth portal domain
- `VITE_AUTH_DOMAIN_APP` - Main application domain
- `VITE_AUTH_REDIRECT_AFTER_LOGIN` - Post-login redirect URL
- `VITE_AUTH_REDIRECT_AFTER_LOGOUT` - Post-logout redirect URL
- `VITE_AUTH_REDIRECT_AFTER_SIGNUP` - Post-signup redirect URL

## Learning Points

This implementation serves as a reference for:

- Building modern authentication frontends with React and TypeScript
- Implementing Feature-Sliced Design for scalable architecture
- Managing authentication state with Zustand
- Handling JWT token lifecycle and refresh patterns
- Creating accessible and responsive UI with Mantine
- Implementing internationalization with Lingui
- Testing frontend applications with Vitest and Playwright
- Integrating with RESTful authentication APIs
- Managing environment-specific configuration
- Implementing route protection and guards

## Adapting for Your Domain

This authentication portal demonstrates patterns applicable to various scenarios:

### Identity Management Frontends

- Employee authentication portals
- Customer identity platforms
- Partner access management
- Multi-tenant SaaS authentication

### Form-Based Workflows

- Registration and onboarding flows
- Profile management interfaces
- Settings and preferences pages
- Multi-step form wizards

### Token-Based Authentication

- JWT token management patterns
- Refresh token rotation
- Session persistence strategies
- Multi-device session handling

### Modern Frontend Architecture

- Feature-Sliced Design implementation
- State management patterns
- API integration strategies
- Testing and quality assurance

The patterns demonstrated here apply to any domain requiring modern authentication frontends, scalable architecture, and integration with microservices backends.

## Integration with Backend Services

### User Service Integration

The auth portal communicates with the User Service for all authentication operations:

```typescript
// Login flow
const response = await authApi.login({
  username: "user@example.com",
  password: "password",
  rememberMe: true,
});

// Store tokens and user context
tokenManager.setTokens(response.accessToken, response.refreshToken);
authStore.setUser(response.user);

// Redirect to main application
window.location.href = config.redirectAfterLogin;
```

### Gateway Integration

Requests to protected endpoints include JWT tokens:

```typescript
// Automatic token injection via interceptor
axios.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Token Refresh Flow

Automatic token refresh before expiration:

```typescript
// Monitor token expiration
useEffect(() => {
  const interval = setInterval(() => {
    if (isTokenExpiringSoon()) {
      refreshTokens();
    }
  }, 60000); // Check every minute

  return () => clearInterval(interval);
}, []);
```

---

**Use this as a blueprint** for building modern authentication frontends with React, TypeScript, and Feature-Sliced Design. The code demonstrates production-ready patterns for identity management, token lifecycle handling, and seamless integration with microservices backends.
