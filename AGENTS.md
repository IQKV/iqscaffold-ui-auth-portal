# AI Agent Development Guide

## Project Overview

**IQKV Auth Portal** - A dedicated authentication service built with Feature-Sliced Design (FSD) architecture. This is a standalone authentication gateway that handles user sign up, sign in, password reset, and redirects to the main application upon successful login.

**Key Characteristics:**

- Type-safe development with strict TypeScript configuration
- Feature-Sliced Design with enforced layer boundaries (architecture tests)
- Comprehensive error handling with RFC 7807 Problem Details support
- Modern build tooling with Vite 7 and SWC
- Internationalization with Lingui (lazy-loaded translations)
- Mock Service Worker (MSW) for API mocking in development
- Production-ready with Docker and CI/CD workflows

## Tech Stack

### Core Framework

- **React 19** - Latest React with concurrent features and improved performance
- **TypeScript** - Strict type safety with latest language features
- **Vite 7** - Lightning-fast development with SWC compiler
- **PNPM** - Fast, disk space efficient package manager

### UI & Styling

- **Mantine UI v8** - Complete component library with theming system
- **Mantine Extensions** - Form, Hooks, Modals, Notifications
- **Tabler Icons** - 4000+ SVG icons optimized for React
- **PostCSS** - CSS processing with Mantine preset

### Routing & State

- **TanStack Router v1** - Type-safe routing with code splitting and file-based routing
- **TanStack Query v5** - Server state management and caching
- **Zustand** - Lightweight client state management with Immer middleware
- **nuqs** - Type-safe URL search params state management

### Data & API

- **Axios** - HTTP client with interceptors and RFC 7807 error handling
- **Zod** - Runtime type validation and schema parsing
- **Mantine Form** - Form state management with Zod resolver
- **Enhanced Form Hook** - Custom wrapper for Mantine forms with standardized Zod validation
- **Mock Service Worker (MSW)** - API mocking for development and testing

### Development & Quality

- **Vitest** - Fast unit testing with coverage and UI
- **Playwright** - Reliable end-to-end testing with auto-start dev server
- **Storybook 8** - Component development in isolation
- **ESLint 9** - Modern linting with flat config (Mantine preset + custom rules)
- **Prettier** - Code formatting with package.json plugin
- **Stylelint** - CSS/SCSS linting
- **Husky** - Git hooks for quality gates
- **Commitlint** - Conventional commit message validation
- **Knip** - Dead code elimination and dependency analysis

### Internationalization & Accessibility

- **Lingui** - Modern i18n with macro support and pluralization
- **Built-in A11y** - Accessibility features and testing

## Architecture: Feature-Sliced Design (FSD)

The project follows Feature-Sliced Design methodology with strict layer hierarchy and **automated architecture tests**:

```
src/
├── app/          # Application layer (providers, routing, global styles, config)
├── processes/    # Process layer (cross-feature business processes like auth)
├── pages/        # Page layer (route components)
├── widgets/      # Widget layer (complex UI blocks)
├── features/     # Feature layer (user scenarios, business logic)
├── entities/     # Entity layer (business entities, data models)
├── shared/       # Shared layer (reusable code, UI kit, utilities)
└── architecture.test.ts  # Automated FSD compliance tests
```

**Note:** This project includes a `processes/` layer for cross-cutting concerns like authentication and tenant management that span multiple features.

### FSD Layer Rules (CRITICAL - ENFORCED BY TESTS)

1. **Import Rule**: Higher layers can ONLY import from lower layers
   - ❌ `shared` cannot import from `features`
   - ✅ `features` can import from `shared` and `entities`
   - ✅ `processes` can import from `features`, `entities`, and `shared`

2. **Public API (MANDATORY)**: Each slice MUST expose functionality through `index.ts`
   - ✅ All imports must go through public API: `from "@/features/signin-form"`
   - ❌ Never import internal files: `from "@/features/signin-form/model/validation"`
   - **Architecture tests verify all slices have index.ts files**

3. **Cross-Feature Isolation**: Features cannot depend on each other
   - Use `shared` layer for common functionality
   - Use `processes` layer for cross-feature orchestration
   - Communicate through `app` layer or events

4. **Segment Structure**: Each slice contains standardized segments

   ```
   feature-name/
   ├── ui/           # React components (REQUIRED - verified by tests)
   ├── model/        # Business logic, stores, types (REQUIRED - verified by tests)
   ├── api/          # API calls and contracts (optional)
   ├── lib/          # Utilities specific to this feature (optional)
   └── index.ts      # Public API exports (REQUIRED - verified by tests)
   ```

5. **Naming Conventions (ENFORCED BY TESTS)**:
   - Pages: kebab-case (e.g., `login.tsx`, `forgot-password.tsx`)
   - Shared UI components: kebab-case folders (e.g., `form-field/`, `error-boundary/`)
   - Features: kebab-case folders (e.g., `signin-form/`, `reset-password-form/`)

6. **Architecture Testing**: Run `pnpm test:arch` to verify FSD compliance
   - Tests verify layer structure exists
   - Tests verify all slices have public API (index.ts)
   - Tests verify required segments (ui/, model/) exist
   - Tests verify naming conventions

## AI Agent Development Guidelines

### Code Generation Principles

1. **Always Follow FSD Architecture**: Respect layer boundaries and public APIs
2. **Type-First Development**: Define TypeScript interfaces before implementation
3. **Component Composition**: Prefer composition over complex prop drilling
4. **Performance by Default**: Use React.memo, useMemo, useCallback appropriately
5. **Accessibility First**: Include ARIA attributes and semantic HTML
6. **Test-Driven Approach**: Generate tests alongside components

### AI-Assisted Development Workflow

```typescript
// 1. Define types first
interface UserProfileProps {
  userId: string;
  onEdit?: (user: User) => void;
  variant?: "compact" | "detailed";
}

// 2. Create component with proper FSD location
// features/user-profile/ui/user-profile.tsx

// 3. Implement with Mantine components
// 4. Add Storybook story
// 5. Write unit tests
// 6. Export through public API
```

### Code Quality Checklist for AI

- [ ] TypeScript strict mode compliance
- [ ] Proper error boundaries and loading states
- [ ] Mantine theme integration
- [ ] Responsive design with Mantine breakpoints
- [ ] Internationalization with Lingui macros
- [ ] Accessibility attributes (ARIA, semantic HTML)
- [ ] Performance optimizations (memoization)
- [ ] Unit tests with React Testing Library
- [ ] Storybook story with variants

## Development Guidelines

### Component Development Standards

1. **Mantine Components First**: Use Mantine UI components as building blocks
2. **TypeScript Interfaces**: Define strict interfaces for all props
3. **Component Naming**: PascalCase, file name matches component name (kebab-case)
4. **Feature-Sliced Structure**: Organize by features, not by file types
5. **Lingui Integration**: Use `msg` macro for labels and `useLingui()._()` for runtime translation

**Example: The project has a comprehensive FormField component in `shared/ui/form-field/`**

```tsx
// shared/ui/form-field/form-field.tsx
// This is a REAL component from the project - supports 15+ field types
import { TextInput, PasswordInput, Select, Checkbox } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";

interface BaseFormFieldProps {
  name: string;
  label: string | MessageDescriptor;
  form: UseFormReturnType<any>;
  placeholder?: string | MessageDescriptor;
  description?: string | MessageDescriptor;
  tooltip?: string | MessageDescriptor;
  showValidationStatus?: boolean;
  withAsterisk?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

// Supports: text, email, password, textarea, number, select, multiselect,
// date, time, datetime, checkbox, switch, radio, file, color
type FormFieldProps = TextFormFieldProps | PasswordFormFieldProps | ...;

export function FormField(props: FormFieldProps) {
  const { _ } = useLingui();
  const { name, label, form, type } = props;

  const resolveMessage = (msg: string | MessageDescriptor | undefined) => {
    if (!msg) return "";
    return typeof msg === "string" ? msg : _(msg);
  };

  const baseProps = {
    label: resolveMessage(label),
    ...form.getInputProps(name),
    error: form.errors[name],
  };

  // Switch based on type with full validation, character counts,
  // password strength indicators, etc.
  switch (type) {
    case "text": return <TextInput {...baseProps} />;
    case "password": return <PasswordInput {...baseProps} />;
    // ... 13 more types
  }
}
```

**Usage in Features:**

```tsx
// features/signin-form/ui/signin-form-feature.tsx
import { FormField } from "@/shared/ui";
import { t } from "@lingui/core/macro";

<FormField
  type="text"
  name="username"
  label={t`Username or Email`}
  placeholder={t`Enter your username or email`}
  leftSection={<IconUser size={16} />}
  required
  form={form}
/>;
```

### State Management Standards

#### TanStack Query for Server State with Enhanced Error Handling

**The project has a sophisticated `useFormMutation` hook with RFC 7807 support:**

```tsx
// shared/lib/use-form-mutation.ts (ACTUAL IMPLEMENTATION)
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UseFormReturnType } from "@mantine/form";
import {
  normalizeAxiosError,
  toMantineErrors,
  shouldShowError,
  getErrorTitle,
} from "./http-error";
import { notificationService } from "./notifications";

export type NotifyConfig = {
  title?: string;
  message?: string;
  fallback?: string;
};

export type FormMutationOptions<TData, TVariables, TContext> =
  UseMutationOptions<TData, unknown, TVariables, TContext> & {
    notifySuccess?: NotifyConfig | false;
    notifyError?:
      | (NotifyConfig & { includeFieldErrorsInMessage?: boolean })
      | false;
    mapField?: (errors: Record<string, string>) => Record<string, string>;
  };

export function useFormMutation<TData, TVariables, TContext = unknown>(
  form: UseFormReturnType<any>,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: FormMutationOptions<TData, TVariables, TContext>
) {
  const { notifySuccess, notifyError, mapField, onError, onSuccess, ...rest } =
    options ?? {};

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Clear previous field errors
      form.setErrors({});

      // Show success notification
      if (
        notifySuccess &&
        (notifySuccess.message || typeof notifySuccess === "object")
      ) {
        notificationService.success({
          title: notifySuccess.title ?? "Success",
          message: notifySuccess.message ?? "Operation completed successfully",
        });
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const normalized = normalizeAxiosError(error);

      // Map field-level errors to form (supports RFC 7807 Problem Details)
      const fieldErrors = toMantineErrors(normalized);
      const mapped = mapField ? mapField(fieldErrors) : fieldErrors;
      if (Object.keys(mapped).length) {
        form.setErrors(mapped);
      }

      // Show error notification with enhanced RFC 7807 support
      if (notifyError !== false && shouldShowError(error)) {
        notificationService.errorFromAxios(error, {
          title: notifyError?.title || getErrorTitle(error),
        });
      }

      onError?.(normalized as any, variables, context);
    },
    ...rest,
  });
}
```

**Key Features:**

- Automatic RFC 7807 Problem Details parsing
- Field-level error mapping to Mantine forms
- Configurable notifications with i18n support
- Custom field mapping for backend/frontend field name differences
- Proper error type detection (network, timeout, auth, validation, server)

#### Zustand for Client State (Process Layer Pattern)

**The project uses Zustand in the `processes/` layer for cross-cutting concerns:**

```tsx
// processes/auth/model/auth-store.ts (ACTUAL PATTERN)
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authApi.login(credentials);
          set((state) => {
            state.user = response.user;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = normalizeAxiosError(error);
            state.isLoading = false;
          });
          throw error;
        }
      },

      logout: async () => {
        await authApi.logout();
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
        });
      },

      // ... other actions
    })),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors (exported from auth-selectors.ts)
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
```

**Key Patterns:**

- Use `processes/` layer for stores that span multiple features
- Use Immer middleware for immutable updates
- Use persist middleware for localStorage sync
- Export granular selectors to prevent unnecessary re-renders
- Separate selectors into dedicated files for organization

### API Service Standards with RFC 7807 Support

**The project has sophisticated error handling with RFC 7807 Problem Details:**

```tsx
// shared/lib/client.ts (ACTUAL IMPLEMENTATION)
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getConfig } from "@/app/config";
import { normalizeAxiosError } from "./http-error";
import { notificationService } from "./notifications";
import { resolveTenantId } from "./tenant-utils";

const BASE_URL = getConfig("VITE_API_URL_SERVER");

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Cookie-based auth
});

// Add tenant header interceptor
api.interceptors.request.use((config) => {
  const tenantId = resolveTenantId();
  if (tenantId && !config.headers["X-Tenant-ID"]) {
    config.headers["X-Tenant-ID"] = tenantId;
  }
  return config;
});

// Response interceptor with RFC 7807 support
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    if (!status || !original) {
      return Promise.reject(error);
    }

    const normalized = normalizeAxiosError(error);

    // Show server errors globally (unless suppressed)
    if (normalized.type === "server") {
      const cfg = original as any;
      if (!cfg?.__suppressGlobalError) {
        notificationService.error({
          title: "Server error",
          message: normalized.message,
        });
      }
    }

    return Promise.reject(normalized);
  }
);
```

**RFC 7807 Error Handling (`shared/lib/http-error.ts`):**

```tsx
// Supports RFC 7807 Problem Details format
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  correlationId?: string;
  requestId?: string;
  fields?: Array<{
    field: string;
    rejectedValue?: any;
    message: string;
  }>;
}

export type AppErrorType =
  | "network"
  | "timeout"
  | "canceled"
  | "auth"
  | "validation"
  | "client"
  | "server"
  | "unknown";

export interface AppError {
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

// Normalizes any error to AppError with RFC 7807 support
export function normalizeAxiosError(err: unknown): AppError;

// Extracts field errors for form validation
export function getFieldErrors(err: unknown): Record<string, string[]>;

// Converts to Mantine form errors
export function toMantineErrors(err: unknown): Record<string, string>;
```

**Key Features:**

- Cookie-based authentication (withCredentials: true)
- Multi-tenant support with X-Tenant-ID header
- RFC 7807 Problem Details parsing
- Automatic field error extraction for forms
- Request/correlation ID tracking
- Retryable error detection
- Type-safe error handling

### Form Handling Standards (ACTUAL PROJECT PATTERNS)

**The project uses centralized validation schemas with Lingui i18n:**

```tsx
// shared/lib/form-validation.ts (ACTUAL IMPLEMENTATION)
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { t } from "@lingui/core/macro";

// Factory functions with lazy initialization for i18n
export const createValidationSchemas = () => ({
  email: z
    .string()
    .min(1, t`Email is required`)
    .email(t`Please enter a valid email address`),

  password: z
    .string()
    .min(8, t`Password must be at least 8 characters`)
    .regex(
      /(?=.*[a-z])/,
      t`Password must include at least one lowercase letter`
    )
    .regex(
      /(?=.*[A-Z])/,
      t`Password must include at least one uppercase letter`
    )
    .regex(/(?=.*\d)/, t`Password must include at least one number`)
    .regex(
      /(?=.*[@$!%*?&])/,
      t`Password must include at least one special character`
    ),

  username: z
    .string()
    .min(3, t`Username must be at least 3 characters`)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      t`Username can only contain letters, numbers, and underscores`
    ),

  usernameOrEmail: z
    .string()
    .trim()
    .min(3, t`Username or email must be at least 3 characters`)
    .refine(
      (value) => {
        const isEmail = value.includes("@");
        return isEmail
          ? /^\S+@\S+\.\S+$/.test(value)
          : /^[a-zA-Z0-9_]+$/.test(value);
      },
      t`Please enter a valid username or email address`
    ),
});

// Lazy-loaded proxy for validation schemas
export const validationSchemas = new Proxy(
  {} as ReturnType<typeof createValidationSchemas>,
  {
    get(target, prop) {
      if (!_validationSchemas) {
        _validationSchemas = createValidationSchemas();
      }
      return _validationSchemas[prop];
    },
  }
);

// Pre-built form schemas
export const createFormSchemas = () => {
  const schemas = createValidationSchemas();
  return {
    signIn: z.object({
      username: schemas.usernameOrEmail,
      password: schemas.simplePassword,
      rememberMe: z.boolean().default(false),
    }),

    signUp: z
      .object({
        username: schemas.username,
        email: schemas.email,
        firstName: schemas.firstName,
        lastName: schemas.lastName,
        password: schemas.password,
        confirmPassword: z.string().min(1, t`Please confirm your password`),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t`Passwords do not match`,
        path: ["confirmPassword"],
      }),

    resetPassword: z
      .object({
        password: schemas.password,
        confirmPassword: z.string().min(1, t`Please confirm your password`),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t`Passwords do not match`,
        path: ["confirmPassword"],
      }),
  };
};

// Lazy-loaded form schemas
export const formSchemas = new Proxy(
  {} as ReturnType<typeof createFormSchemas>,
  {
    get(target, prop) {
      if (!_formSchemas) _formSchemas = createFormSchemas();
      return _formSchemas[prop];
    },
  }
);
```

**Enhanced Form Hook (`shared/lib/enhanced-form-hook.ts`):**

```tsx
import {
  useForm as useMantineForm,
  UseFormInput,
  UseFormReturnType,
} from "@mantine/form";
import { z } from "zod";
import { createFormResolver } from "./form-validation";

export interface UseFormInput<T extends Record<string, any>>
  extends Omit<UseFormInput<T>, "validate"> {
  schema: z.ZodType<any, any, any>;
}

// Standardized form hook with automatic Zod validation
export function useForm<T extends Record<string, any>>(
  input: UseFormInput<T>
): UseFormReturnType<T> {
  const { schema, ...mantineFormInput } = input;

  return useMantineForm({
    ...mantineFormInput,
    validate: createFormResolver(schema),
  });
}
```

**Feature Implementation (ACTUAL SIGNIN FORM):**

```tsx
// features/signin-form/model/validation.ts
import { formSchemas } from "@/shared/lib/form-validation";

export const signInFormSchema = formSchemas.signIn;
export type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

export const initialSignInValues: SignInFormSchemaType = {
  username: "",
  password: "",
  rememberMe: false,
};

// features/signin-form/ui/signin-form-feature.tsx
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import { t } from "@lingui/core/macro";
import { signInFormSchema, initialSignInValues } from "../model/validation";

export function SignInFormFeature() {
  const form = useForm({
    initialValues: initialSignInValues,
    schema: signInFormSchema,
  });

  const loginMutation = useMutation({
    mutationFn: async (values) => await login(values),
    onSuccess: () => (window.location.href = authConfig.redirects.afterLogin),
  });

  return (
    <form onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
      <Stack gap="md">
        <FormField
          type="text"
          name="username"
          label={t`Username or Email`}
          placeholder={t`Enter your username or email`}
          leftSection={<IconUser size={16} />}
          required
          form={form}
        />

        <FormField
          type="password"
          name="password"
          label={t`Password`}
          leftSection={<IconLock size={16} />}
          required
          form={form}
        />

        <FormField
          type="checkbox"
          name="rememberMe"
          label={t`Remember me`}
          form={form}
        />

        <Button type="submit" loading={loginMutation.isPending}>
          {t`Sign In`}
        </Button>
      </Stack>
    </form>
  );
}

// features/signin-form/index.ts (PUBLIC API - REQUIRED)
export { SignInFormFeature } from "./ui/signin-form-feature";
export type { SignInFormValues } from "./model/types";
```

**Key Patterns:**

- Centralized validation schemas in `shared/lib/form-validation.ts`
- Lazy-loaded schemas for i18n support
- Enhanced form hook wraps Mantine form with Zod
- Use `formSchemas` for common forms (signIn, signUp, resetPassword)
- All features MUST export through `index.ts` (enforced by tests)

## Environment Setup (ACTUAL PROJECT)

### Development Requirements

- **Node.js**: >= 22.0.0 (LTS)
- **Package Manager**: pnpm (required, version 10.20.0)
- **Editor**: VS Code with recommended extensions

### Environment Variables (ACTUAL)

```env
# Backend API Configuration
VITE_API_URL_SERVER=http://localhost:8080  # User service backend

# Domain Configuration
VITE_AUTH_DOMAIN_AUTH=https://auth.iqkv.com  # Auth portal domain
VITE_AUTH_DOMAIN_APP=https://app.iqkv.com    # Main app domain

# Redirect Configuration
VITE_AUTH_REDIRECT_AFTER_LOGIN=VITE_AUTH_DOMAIN_APP  # After successful login
VITE_AUTH_REDIRECT_AFTER_LOGOUT={AUTH_DOMAIN}/login  # After logout
VITE_AUTH_REDIRECT_AFTER_SIGNUP={AUTH_DOMAIN}/login  # After signup

# Development Configuration
VITE_ENABLE_MSW=true           # Enable Mock Service Worker
VITE_LOG_LEVEL=info            # Logging: silent/info/debug
TZ=UTC                         # Timezone
NODE_ENV=development           # Environment
```

### Runtime Configuration Pattern

```tsx
// app/config/runtime-env.ts (ACTUAL PATTERN)
const env = {
  VITE_API_URL_SERVER: import.meta.env.VITE_API_URL_SERVER,
  VITE_AUTH_DOMAIN_AUTH: import.meta.env.VITE_AUTH_DOMAIN_AUTH,
  VITE_AUTH_DOMAIN_APP: import.meta.env.VITE_AUTH_DOMAIN_APP,
  VITE_ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW === "true",
  VITE_LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || "info",
};

export function getConfig<K extends keyof typeof env>(key: K): (typeof env)[K] {
  return env[key];
}

// app/config/auth-config.ts
export function getAuthConfig() {
  return {
    domains: {
      auth: getConfig("VITE_AUTH_DOMAIN_AUTH"),
      app: getConfig("VITE_AUTH_DOMAIN_APP"),
    },
    redirects: {
      afterLogin:
        getConfig("VITE_AUTH_REDIRECT_AFTER_LOGIN") ||
        getConfig("VITE_AUTH_DOMAIN_APP"),
      afterLogout: `${getConfig("VITE_AUTH_DOMAIN_AUTH")}/login`,
      afterSignup: `${getConfig("VITE_AUTH_DOMAIN_AUTH")}/login`,
    },
  };
}
```

### Editor Configuration

The project uses these formatting rules:

```yaml
# .prettierrc
endOfLine: lf
trailingComma: es5
tabWidth: 2
semi: true
singleQuote: false
```

### Development Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview               # Preview production build

# Testing
pnpm test                  # Run unit tests
pnpm test:coverage         # Run tests with coverage
pnpm test:ui               # Run tests with UI
pnpm e2e                   # Run E2E tests

# Code Quality
pnpm lint                  # Run ESLint
pnpm lint:fix              # Fix ESLint issues
pnpm prettier:check        # Check formatting
pnpm prettier:write        # Format code
pnpm type-check            # TypeScript type checking

# Internationalization
pnpm messages:extract      # Extract translation messages
pnpm messages:compile      # Compile translations

# Storybook
pnpm storybook             # Start Storybook
pnpm storybook:build       # Build Storybook
```

## Testing Strategy

### Testing Stack

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Component Tests**: Storybook with interactions
- **Coverage**: Vitest coverage with v8

### Unit Testing with Mantine Components

```tsx
// shared/ui/form-field/form-field.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormField } from "./form-field";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const FormFieldTestComponent = ({ type, ...props }: any) => {
  const form = useForm({
    initialValues: { testField: "" },
  });

  return (
    <FormField
      name="testField"
      label="Test Field"
      form={form}
      type={type}
      {...props}
    />
  );
};

describe("FormField", () => {
  it("renders text input correctly", () => {
    render(
      <TestWrapper>
        <FormFieldTestComponent type="text" placeholder="Enter text" />
      </TestWrapper>
    );

    const input = screen.getByLabelText("Test Field");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", "Enter text");
  });

  it("handles user input correctly", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FormFieldTestComponent type="text" />
      </TestWrapper>
    );

    const input = screen.getByLabelText("Test Field");
    await user.type(input, "test value");

    expect(input).toHaveValue("test value");
  });
});
```

### Feature Testing with TanStack Query

```tsx
// features/sample-form/ui/sample-form-feature.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { SampleFormFeature } from "./sample-form-feature";

// Mock the form mutation hook
vi.mock("@/shared/lib", () => ({
  ...vi.importActual("@/shared/lib"),
  useFormMutation: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>{children}</MantineProvider>
    </QueryClientProvider>
  );
};

describe("SampleFormFeature", () => {
  const mockMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useFormMutation } = await import("@/shared/lib");
    (useFormMutation as any).mockReturnValue(mockMutation);
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockMutation.mutateAsync.mockResolvedValue(undefined);

    render(<SampleFormFeature />, { wrapper: createWrapper() });

    // Open modal
    const openButton = screen.getByRole("button", { name: /open form/i });
    await user.click(openButton);

    // Fill form
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");

    // Submit
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });
});
```

### Test Setup Configuration

```tsx
// src/setupTests.ts
import "@testing-library/jest-dom";

// Mock window.matchMedia for Mantine components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

## Performance Optimization

### Code Splitting with TanStack Router

```tsx
// pages/examples.tsx
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { LoadingOverlay } from "@/shared/ui";

const ExamplesPage = lazy(() => import("../widgets/examples-page"));

export const Route = createFileRoute("/examples")({
  component: () => (
    <Suspense
      fallback={<LoadingOverlay visible message="Loading examples..." />}
    >
      <ExamplesPage />
    </Suspense>
  ),
});
```

### Mantine Component Optimization

```tsx
// shared/ui/data-table/data-table.tsx
import { memo, useMemo } from "react";
import { DataTable as MantineDataTable } from "mantine-datatable";
import type { DataTableProps } from "mantine-datatable";

interface OptimizedDataTableProps<T>
  extends Omit<DataTableProps<T>, "records"> {
  data: T[];
  searchQuery?: string;
  searchFields?: (keyof T)[];
}

export const DataTable = memo(
  <T extends Record<string, any>>({
    data,
    searchQuery,
    searchFields = [],
    ...props
  }: OptimizedDataTableProps<T>) => {
    const filteredData = useMemo(() => {
      if (!searchQuery || !searchFields.length) return data;

      return data.filter((item) =>
        searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }, [data, searchQuery, searchFields]);

    return (
      <MantineDataTable
        records={filteredData}
        highlightOnHover
        striped
        {...props}
      />
    );
  }
);
```

### TanStack Query Optimization

```tsx
// shared/lib/queries/use-users-query.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../client";

export function useUsersQuery(params?: {
  page?: number;
  search?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => api.get("/users", { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: params?.enabled ?? true,
  });
}

// Prefetch for better UX
export function usePrefetchUsers() {
  const queryClient = useQueryClient();

  return useCallback(
    (params?: { page?: number; search?: string }) => {
      queryClient.prefetchQuery({
        queryKey: ["users", params],
        queryFn: () => api.get("/users", { params }),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );
}
```

## Internationalization with Lingui (ACTUAL IMPLEMENTATION)

**The project uses lazy-loaded translations with dynamic locale activation:**

### Setup and Usage

```tsx
// shared/locales/index.ts (ACTUAL IMPLEMENTATION)
import { i18n } from "@lingui/core";

export async function dynamicActivateLocale(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

export function getClientLocale(): string {
  // Check localStorage, navigator.language, or default to 'en'
  return (
    localStorage.getItem("locale") || navigator.language.split("-")[0] || "en"
  );
}

// app/app.tsx - Lazy load locale after mount
useEffect(() => {
  const loadLocale = async () => {
    const { dynamicActivateLocale, getClientLocale } = await import(
      "@/shared/locales"
    );
    await dynamicActivateLocale(getClientLocale());
  };
  loadLocale().catch(console.error);
}, []);
```

### Translation Patterns

```tsx
// Use t macro for static strings (compile-time)
import { t } from "@lingui/core/macro";

<FormField
  label={t`Username or Email`}
  placeholder={t`Enter your username or email`}
/>;

// Use Trans for JSX with interpolation
import { Trans } from "@lingui/macro";

<h1>
  <Trans>Welcome, {userName}!</Trans>
</h1>;

// Use useLingui for runtime translations
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

const { _ } = useLingui();
const message = _(msg`Dynamic message`);

// In validation schemas (lazy-loaded)
import { t } from "@lingui/core/macro";

const schema = z.string().min(3, t`Must be at least 3 characters`);
```

### Message Extraction and Compilation

```bash
# Extract messages from source code
pnpm messages:extract

# Compile messages for production
pnpm messages:compile
```

**Key Features:**

- Lazy-loaded translations (not bundled in main chunk)
- Compile-time extraction with `t` macro
- Runtime translation with `useLingui()._()`
- Support for pluralization and context
- Integrated with Zod validation schemas
- FormField component supports MessageDescriptor for labels

## Error Handling Best Practices

### Global Error Boundary

```tsx
// shared/ui/error-boundary/error-boundary.tsx
import { Alert, Button, Container, Stack, Title } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Stack align="center" gap="lg">
            <Title order={2}>Something went wrong</Title>

            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Application Error"
              color="red"
              variant="light"
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </Alert>

            <Button
              leftSection={<IconRefresh size="1rem" />}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
```

## Code Quality Standards

### ESLint Configuration

The project uses Mantine's ESLint configuration with additional rules:

- **TanStack Query**: Enforces query best practices
- **TanStack Router**: Ensures proper route configuration
- **Lingui**: Validates translation usage
- **React Hooks**: Prevents common hook mistakes

### Commit Standards

```bash
# Conventional Commits with Commitizen
pnpm commit  # Interactive commit with proper formatting

# Examples:
feat: add user profile form
fix: resolve validation error in login form
docs: update API documentation
test: add unit tests for form components
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*": ["pnpm prettier:check"],
    "package.json": ["sort-package-json"]
  }
}
```

## Deployment Considerations

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mantine: ["@mantine/core", "@mantine/hooks"],
          tanstack: ["@tanstack/react-query", "@tanstack/react-router"],
        },
      },
    },
  },
});
```

### Environment-specific Configuration

```bash
# Production build
pnpm build

# Preview production build locally
pnpm preview

# Type checking before deployment
pnpm type-check
```
