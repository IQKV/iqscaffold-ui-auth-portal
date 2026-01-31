# Enhanced Error Handling System

This document describes the comprehensive error handling system that integrates RFC 7807 Problem Details with axios HTTP client and Mantine UI components.

## Overview

The error handling system provides:

- **RFC 7807 Problem Details Support**: Standardized error format from backend
- **Axios Integration**: Enhanced HTTP error handling with automatic retry logic
- **Mantine UI Integration**: User-friendly notifications and error displays
- **Type Safety**: Full TypeScript support with proper error types
- **Retry Logic**: Intelligent retry mechanisms for network and server errors
- **Form Integration**: Seamless validation error handling in forms

## Core Components

### 1. HTTP Error Normalization (`http-error.ts`)

The core module that normalizes all errors into a consistent `AppError` format:

```typescript
interface AppError {
  type: AppErrorType;
  message: string;
  status?: number;
  code?: string | number;
  details?: any;
  requestId?: string;
  correlationId?: string;
  retryable?: boolean;
  cause?: unknown;
}
```

**Key Functions:**

- `normalizeAxiosError(err: unknown): AppError` - Converts any error to AppError
- `getErrorMessage(err: unknown): string` - Gets user-friendly error message
- `getErrorTitle(err: unknown): string` - Gets appropriate error title
- `getFieldErrors(err: unknown): FieldErrors` - Extracts form field errors
- `getRetryConfig(err: unknown)` - Determines retry configuration

### 2. Enhanced Notifications (`notifications.tsx`)

Extended Mantine notifications with error-type-specific styling:

```typescript
// Enhanced error notification with RFC 7807 support
notificationService.errorFromAxios(error, {
  title: "Custom Title",
  onRetry: () => retryFunction(),
});
```

**Features:**

- Error-type-specific icons and colors
- Automatic retry buttons for retryable errors
- Reference ID display for debugging
- Smart auto-close timing based on error type

### 3. Error Handler Hooks (`use-error-handler.ts`)

React hooks for consistent error handling:

```typescript
const { handleError } = useErrorHandler({
  showNotification: true,
  onRetry: () => refetch(),
});

// For React Query
const queryOptions = useQueryErrorHandler({
  showNotification: true,
});

// For mutations
const mutationOptions = useMutationErrorHandler({
  showNotification: false, // Handled by form
});
```

### 4. Axios Configuration (`axios-config.ts`)

Pre-configured axios instance with error handling:

```typescript
import { apiClient } from "./axios-config";

// Automatically handles:
// - Request/response logging
// - Correlation ID injection
// - Error normalization
const response = await apiClient.get("/v1/users");
```

### 5. Error Boundary (`error-boundary.tsx`)

React error boundary with enhanced error display:

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Custom error logging
  }}
  fallback={(error, errorInfo, retry) => (
    // Custom error UI
  )}
>
  <YourApp />
</ErrorBoundary>
```

### 6. Form Integration (`use-form-mutation.ts`)

Enhanced form mutation hook with automatic error handling:

```typescript
const mutation = useFormMutation(form, updateUser, {
  notifySuccess: { title: "Success!", message: "User updated" },
  notifyError: { title: "Update Failed" },
  onSuccess: () => queryClient.invalidateQueries(["users"]),
});
```

## RFC 7807 Problem Details Support

The system fully supports RFC 7807 Problem Details format from the backend:

```json
{
  "type": "urn:problem:validation_error",
  "title": "Request validation failed",
  "status": 400,
  "detail": "One or more fields contain invalid values",
  "instance": "/api/v1/users",
  "code": "VALIDATION_ERROR",
  "method": "POST",
  "correlationId": "corr-12345678",
  "requestId": "req-87654321",
  "fields": [
    {
      "field": "email",
      "rejectedValue": "invalid-email",
      "message": "Invalid email format"
    }
  ]
}
```

**Automatic Handling:**

- Extracts field-level validation errors
- Maps to Mantine form errors
- Shows appropriate notifications
- Includes reference IDs for debugging

## Error Types and Handling

### Network Errors

- **Type**: `network`, `timeout`
- **Behavior**: Automatic retry with exponential backoff
- **UI**: Orange notifications with retry button
- **Retryable**: Yes

### Authentication Errors

- **Type**: `auth`
- **Behavior**: Redirect to login or show auth prompt
- **UI**: Purple notifications with longer display time
- **Retryable**: No

### Validation Errors

- **Type**: `validation`
- **Behavior**: Map to form fields, focus first error
- **UI**: Yellow notifications, persistent display
- **Retryable**: No

### Server Errors

- **Type**: `server`
- **Behavior**: Retry with backoff, show reference ID
- **UI**: Red notifications with reference ID
- **Retryable**: Yes (limited attempts)

### Client Errors

- **Type**: `client`
- **Behavior**: Show error message, no retry
- **UI**: Red notifications
- **Retryable**: No

## Usage Examples

### Basic Query with Error Handling

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { handleError } = useErrorHandler();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.get(`/users/${userId}`).then(res => res.data),
    retry: (failureCount, error) => {
      const appError = handleError(error);
      return appError.retryable && failureCount < 3;
    },
    ...useQueryErrorHandler({
      onRetry: () => refetch(),
    }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return <div>{data.name}</div>;
}
```

### Form with Validation Error Handling

```typescript
function UserForm() {
  const form = useForm({
    initialValues: { name: '', email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const mutation = useFormMutation(
    form,
    (data) => apiClient.post('/users', data).then(res => res.data),
    {
      notifySuccess: { message: "User created successfully" },
      notifyError: { title: "Failed to create user" },
    }
  );

  return (
    <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
      <TextInput
        label="Name"
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Email"
        {...form.getInputProps('email')}
      />
      <Button type="submit" loading={mutation.isPending}>
        Create User
      </Button>
    </form>
  );
}
```

### Manual Error Handling

```typescript
async function performCriticalOperation() {
  try {
    await apiClient.post("/critical-operation");
  } catch (error) {
    handleError(error, {
      onRetry: performCriticalOperation,
      redirectToLogin: () => router.navigate("/login"),
      showNotification: true,
      maxRetries: 2,
    });
  }
}
```

### Complete App Setup

```typescript
function App() {
  return (
    <ErrorBoundary>
      <MantineProvider>
        <Notifications />
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </ModalsProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}
```

## Best Practices

### 1. Use Appropriate Error Handlers

- **Queries**: Use `useQueryErrorHandler` for automatic retry and notifications
- **Mutations**: Use `useFormMutation` for form integration
- **Manual calls**: Use `handleError` utility function

### 2. Configure Retry Logic

- Network errors: 2-3 retries with exponential backoff
- Server errors: 1-2 retries with longer delays
- Client/validation errors: No retries

### 3. Show Appropriate UI Feedback

- Use notifications for background operations
- Use form errors for validation issues
- Use error boundaries for critical failures
- Include reference IDs for server errors

### 4. Handle Authentication Gracefully

- Redirect to login for 401 errors
- Show re-authentication prompts for 403 errors
- Clear user state on auth failures

### 5. Log Errors Appropriately

- Log all errors in development
- Log server errors with reference IDs in production
- Include correlation IDs for request tracing

## Configuration

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Axios Configuration

```typescript
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  enableLogging: import.meta.env.DEV,
});
```

### Error Handler Defaults

```typescript
const defaultErrorHandler = useErrorHandler({
  showNotification: true,
  logError: import.meta.env.DEV,
  showRetryButton: true,
});
```

This error handling system provides a robust, user-friendly way to handle all types of errors in your React application while maintaining consistency with backend RFC 7807 standards.
