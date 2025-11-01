# 📜 API Documentation

## Overview

This document provides comprehensive information about the API endpoints, authentication, and integration patterns used in the Mantine UI Project Layout.

## Base Configuration

The API client is configured in `src/shared/api/base.ts` using Axios with the following features:

- Error normalization and notifications
- Base URL configuration from environment variables
- Authentication interceptors are attached from `processes/auth` at app startup

### Environment Variables

```bash
# API Configuration
VITE_API_URL_SERVER=http://localhost:3000
```

## Authentication

### Token-based Authentication

The application uses JWT tokens for authentication:

```typescript
// Login endpoint
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Token Storage

Tokens are managed by the `TokenManager` in `processes/auth` and stored in `localStorage` using keys from `getAuthConfig().tokenStorage`:

```typescript
import { TokenManager } from "@/processes/auth";

const tokenManager = TokenManager.getInstance();

// Read tokens
const accessToken = tokenManager.getAccessToken();
const refreshToken = tokenManager.getRefreshToken();
```

## API Client Usage

### Basic Usage

```typescript
import { apiClient } from "@/shared/api";

// GET request
const users = await apiClient.get("/api/v1/users");

// POST request
const newUser = await apiClient.post("/api/v1/users", {
  name: "John Doe",
  email: "john@example.com",
});

// PUT request
const updatedUser = await apiClient.put("/api/v1/users/123", {
  name: "Jane Doe",
});

// DELETE request
await apiClient.delete("/api/v1/users/123");
```

### With TanStack Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: () => apiClient.get("/api/v1/users"),
});

// Mutation
const createUserMutation = useMutation({
  mutationFn: (userData) => apiClient.post("/api/v1/users", userData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

## Error Handling

### Standard Error Response

```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### Error Codes

| Code               | Description              | HTTP Status |
| ------------------ | ------------------------ | ----------- |
| `VALIDATION_ERROR` | Input validation failed  | 400         |
| `UNAUTHORIZED`     | Authentication required  | 401         |
| `FORBIDDEN`        | Insufficient permissions | 403         |
| `NOT_FOUND`        | Resource not found       | 404         |
| `RATE_LIMIT`       | Too many requests        | 429         |
| `SERVER_ERROR`     | Internal server error    | 500         |

## Mock Service Worker (MSW)

For development and testing, the project uses MSW to mock API responses:

### Setup

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: "1", name: "John Doe", email: "john@example.com" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json({ id: "2", ...newUser });
  }),
];
```

### Browser Setup

```typescript
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

## API Endpoints Reference

### Users

```typescript
// Get all users
GET /api/users
Response: User[]

// Get user by ID
GET /api/users/:id
Response: User

// Create user
POST /api/users
Body: CreateUserRequest
Response: User

// Update user
PUT /api/users/:id
Body: UpdateUserRequest
Response: User

// Delete user
DELETE /api/users/:id
Response: void
```

### Authentication

```http
# Login
POST /api/v1/auth/login
Body: { username: string; password: string; rememberMe: boolean }
Response: { accessToken, refreshToken, tokenType, expiresIn, user }

# Logout
POST /api/v1/auth/logout
Response: 204 No Content

# Refresh token
POST /api/v1/auth/refresh
Body: { refreshToken: string }
Response: { accessToken, refreshToken, tokenType, expiresIn, user }
```

## Type Definitions

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  role?: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  username?: string;
  role?: string;
}

interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UserResponse {
  data: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RefreshTokenRequest {
  refreshToken: string;
}
```

## Best Practices

### Query Keys

Use consistent query key patterns:

```typescript
// Good
const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  userPosts: (userId: string) => ["users", userId, "posts"] as const,
};
```

### Error Boundaries

Implement error boundaries for API error handling:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <UserList />
</ErrorBoundary>
```

### Loading States

Handle loading states consistently:

```typescript
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return <UserTable users={users} />;
}
```

## Testing API Integration

### Unit Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from './useUsers';

test('should fetch users', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useUsers(), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockUsers);
});
```

### E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test("should load users list", async ({ page }) => {
  await page.goto("/users");

  // Wait for API call to complete
  await page.waitForResponse("/api/users");

  // Verify users are displayed
  await expect(page.locator('[data-testid="user-list"]')).toBeVisible();
  await expect(page.locator('[data-testid="user-item"]')).toHaveCount(3);
});
```
