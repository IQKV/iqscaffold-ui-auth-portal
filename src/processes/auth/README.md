# Auth Process Layer

This directory contains the centralized authentication process layer that manages all auth-related business logic, state, and side effects.

## Architecture

The auth process layer follows Feature-Sliced Design principles and provides a clean separation between authentication logic and UI components.

### Structure

```
src/processes/auth/
├── model/
│   ├── auth-store.ts          # Zustand store for auth state
│   ├── auth-effects.ts        # Side effects (token refresh, etc.)
│   ├── auth-selectors.ts      # Derived state selectors
│   └── types.ts               # Process-specific types
├── lib/
│   ├── token-manager.ts       # Token storage & validation
│   ├── auth-guards.ts         # Route protection logic
│   └── auth-utils.ts          # Utility functions
├── ui/
│   ├── auth-provider.tsx      # Auth initialization provider
│   └── user-menu.tsx          # User menu component
└── index.ts                   # Public API
```

## Key Features

### 1. Centralized State Management

- Single source of truth for authentication state
- Zustand store with TypeScript support
- Immer integration for immutable updates
- DevTools support for debugging

### 2. Automatic Token Management

- JWT token validation and expiration checking
- Automatic token refresh before expiration
- Secure token storage in localStorage
- Multi-tab synchronization

### 3. Route Protection

- Declarative route guards
- Role-based access control
- Permission-based access control
- Automatic redirects for unauthorized access

### 4. Side Effects Management

- Background token refresh monitoring
- Page visibility change handling
- Storage event synchronization
- Cleanup on component unmount

## Usage

### Basic Authentication

```tsx
import { useAuthStore, useIsAuthenticated } from "@/processes/auth";

function LoginButton() {
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = async () => {
    try {
      await login({
        username: "user@example.com",
        password: "password",
        rememberMe: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome!</div>;
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### Route Protection

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, requireRole } from "@/processes/auth";

// Require authentication
export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    requireAuth();
  },
  component: DashboardPage,
});

// Require specific role
export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    requireRole("admin");
  },
  component: AdminPage,
});
```

### User Information

```tsx
import {
  useCurrentUser,
  useUserFullName,
  useHasRole,
  useHasPermission,
} from "@/processes/auth";

function UserProfile() {
  const user = useCurrentUser();
  const fullName = useUserFullName();
  const isAdmin = useHasRole("admin");
  const canEdit = useHasPermission("edit:profile");

  return (
    <div>
      <h1>{fullName}</h1>
      <p>Email: {user?.email}</p>
      {isAdmin && <AdminPanel />}
      {canEdit && <EditButton />}
    </div>
  );
}
```

### Auth Provider Setup

```tsx
import { AuthProvider } from "@/processes/auth";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
```

## API Reference

### Store Actions

- `login(credentials)` - Authenticate user
- `logout()` - Clear session and logout
- `refreshTokens()` - Refresh access token
- `initialize()` - Initialize auth state from storage
- `clearError()` - Clear error state
- `setUser(user)` - Update user data

### Selectors

- `useCurrentUser()` - Get current user
- `useIsAuthenticated()` - Check if authenticated
- `useAuthLoading()` - Check if auth is loading
- `useAuthInitialized()` - Check if auth is initialized
- `useAuthError()` - Get auth error
- `useHasRole(role)` - Check if user has role
- `useHasPermission(permission)` - Check if user has permission
- `useUserFullName()` - Get user's full name
- `useUserInitials()` - Get user's initials

### Guards

- `requireAuth()` - Require authentication
- `requireGuest()` - Require non-authenticated
- `requireRole(role)` - Require specific role
- `requirePermission(permission)` - Require specific permission
- `requireEmailVerification()` - Require verified email

### Utilities

- `getAuthHeader()` - Get authorization header
- `formatUserDisplayName(user)` - Format user display name
- `isAdmin(user)` - Check if user is admin
- `canPerformAction(action, resource)` - Check permissions
- `isSessionExpiringSoon()` - Check if session expires soon

## Migration from Previous Implementation

The previous auth implementation was scattered across different layers:

- API calls directly in components
- Token storage in localStorage manually
- No centralized state management
- No automatic token refresh
- No route protection utilities

The new process layer provides:

- ✅ Centralized auth state management
- ✅ Automatic token lifecycle management
- ✅ Declarative route protection
- ✅ Type-safe auth utilities
- ✅ Better error handling
- ✅ Multi-tab synchronization
- ✅ Background token refresh

## Benefits

1. **Maintainability**: All auth logic in one place
2. **Reusability**: Auth utilities can be used across features
3. **Type Safety**: Full TypeScript support
4. **Performance**: Optimized state updates and selectors
5. **Developer Experience**: Clear API and good debugging tools
6. **Security**: Proper token handling and validation
7. **Scalability**: Easy to extend with new auth features
