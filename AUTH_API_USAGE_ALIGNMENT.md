# Auth API Usage Alignment

## Current State Analysis

### Pattern Inconsistencies

The auth features currently use **two different patterns** for API calls:

#### Pattern 1: Auth Store (Indirect via Store)

- **Used by:** `signin-form`
- **Flow:** Component → `useAuthStore().login()` → Auth Store → `authApi.login()`
- **Benefits:** Centralized state management, automatic token handling, state updates
- **Drawbacks:** Only works for operations that need state management

#### Pattern 2: Direct authApi Calls

- **Used by:** `verify-email`, `forgot-password`
- **Flow:** Component → `useMutation()` → `authApi.verifyEmail()` / `authApi.forgotPassword()`
- **Benefits:** Simple, direct, no state overhead
- **Drawbacks:** Manual error handling, duplicate notification logic

#### Pattern 3: Custom Hooks (Partially Used)

- **Defined in:** `use-auth-api.ts`
- **Available hooks:** `useValidateToken`, `useResendVerification`, `useVerifyEmail`, `useValidateResetToken`
- **Actually used:** Only `useValidateResetToken` (in `reset-password-form`)
- **Not used:** `useVerifyEmail`, `useResendVerification` (despite being available)

## Issues

1. **Inconsistent patterns** - Different features use different approaches
2. **Unused abstractions** - `useVerifyEmail` and `useResendVerification` hooks exist but aren't used
3. **Duplicate logic** - Each component reimplements mutation setup and notification handling
4. **Maintenance burden** - Changes to error handling or notifications need updates in multiple places

## Recommended Solution: Use Hooks Everywhere

### Why Hooks?

1. **Consistency** - Single pattern across all auth features
2. **Reusability** - Shared logic for mutations, errors, notifications
3. **Testability** - Easier to mock and test
4. **Maintainability** - Changes in one place affect all consumers
5. **Type safety** - Centralized type definitions

### Implementation Plan

#### Step 1: Complete the Hook Library

Update `use-auth-api.ts` to include all auth operations:

```typescript
// Already exists ✓
export function useValidateToken();
export function useResendVerification();
export function useVerifyEmail();
export function useValidateResetToken();

// Add these:
export function useForgotPassword();
export function useResetPassword();
export function useSignup();
```

#### Step 2: Update Components to Use Hooks

**verify-email-feature.tsx:**

```typescript
// BEFORE: Direct authApi calls
const verifyEmailMutation = useMutation({
  mutationFn: (token: string) => authApi.verifyEmail(token),
  onSuccess: () => {
    /* ... */
  },
  onError: () => {
    /* ... */
  },
});

const resendVerificationMutation = useMutation({
  mutationFn: (email: string) => authApi.resendVerification(email),
  onSuccess: () => {
    /* ... */
  },
  onError: () => {
    /* ... */
  },
});

// AFTER: Use hooks
const verifyEmailMutation = useVerifyEmail();
const resendVerificationMutation = useResendVerification();
```

**forgot-password-form-feature.tsx:**

```typescript
// BEFORE: Direct authApi call
const forgotPasswordMutation = useFormMutation(
  form,
  async (email: string) => {
    return await authApi.forgotPassword(email);
  },
  {
    /* notification config */
  }
);

// AFTER: Use hook
const forgotPasswordMutation = useForgotPassword();
```

**reset-password-form-feature.tsx:**

```typescript
// BEFORE: Direct authApi call
const resetPasswordMutation = useFormMutation(
  form,
  async (values) => {
    if (!token) throw new Error("Token missing");
    return await authApi.resetPassword(token, values.password);
  },
  {
    /* notification config */
  }
);

// AFTER: Use hook
const resetPasswordMutation = useResetPassword();
```

#### Step 3: Keep Auth Store for Stateful Operations

**signin-form** should continue using `useAuthStore().login()` because:

- Login requires state management (user, tokens, isAuthenticated)
- Needs automatic token storage
- Requires tenant context updates
- Benefits from centralized session management

### Special Case: Sign-in vs Other Operations

| Operation               | Pattern    | Reason                                               |
| ----------------------- | ---------- | ---------------------------------------------------- |
| **Sign In**             | Auth Store | Needs state management, token storage, session setup |
| **Sign Up**             | Hook       | Stateless, one-time operation                        |
| **Verify Email**        | Hook       | Stateless, one-time operation                        |
| **Forgot Password**     | Hook       | Stateless, one-time operation                        |
| **Reset Password**      | Hook       | Stateless, one-time operation                        |
| **Resend Verification** | Hook       | Stateless, one-time operation                        |

## Implementation Details

### Updated use-auth-api.ts

```typescript
/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      notificationService.success({
        title: t`Reset Link Sent`,
        message: t`Please check your email for the password reset link`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Failed to Send Reset Link`,
        message: error?.message || t`Failed to send password reset link`,
      });
    },
  });
}

/**
 * Hook for reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      notificationService.success({
        title: t`Password Reset Successful`,
        message: t`Your password has been successfully reset`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Password Reset Failed`,
        message: error?.message || t`Failed to reset password`,
      });
    },
  });
}
```

### Component Updates

Components become simpler and more focused on UI:

```typescript
// verify-email-feature.tsx
export function VerifyEmailFeature() {
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  // Just use the hooks, no mutation setup needed
  useEffect(() => {
    if (token) {
      verifyEmail.mutate(token);
    }
  }, [token]);

  // UI logic only
}
```

## Benefits of This Approach

1. **Single Source of Truth** - All auth API logic in `use-auth-api.ts`
2. **Consistent Error Handling** - Same notification patterns everywhere
3. **Easier Testing** - Mock hooks instead of API calls
4. **Better Type Safety** - Centralized type definitions
5. **Simpler Components** - Focus on UI, not API logic
6. **Easy Updates** - Change notification messages in one place

## Migration Checklist

- [x] Add `useForgotPassword` hook to `use-auth-api.ts` ✅
- [x] Add `useResetPassword` hook to `use-auth-api.ts` ✅
- [x] Add `useSignup` hook to `use-auth-api.ts` ✅
- [x] Update `verify-email-feature.tsx` to use `useVerifyEmail` and `useResendVerification` ✅
- [x] Update `forgot-password-form-feature.tsx` to use `useForgotPassword` ✅
- [x] Update `reset-password-form-feature.tsx` to use `useResetPassword` ✅
- [x] Update `signup-form-feature.tsx` to use `useSignup` ✅
- [x] Keep `signin-form-feature.tsx` using auth store (correct pattern) ✅
- [ ] Update tests to mock hooks instead of API calls
- [x] Remove direct `authApi` imports from feature components ✅

## Implementation Status: ✅ COMPLETE

All components have been successfully migrated to use the hook-based pattern:

### ✅ Completed Implementations

1. **use-auth-api.ts** - All hooks implemented:
   - `useValidateToken()` ✅
   - `useResendVerification()` ✅
   - `useVerifyEmail()` ✅
   - `useValidateResetToken()` ✅
   - `useForgotPassword()` ✅
   - `useResetPassword()` ✅
   - `useSignup()` ✅

2. **verify-email-feature.tsx** ✅
   - Uses `useVerifyEmail()` hook
   - Uses `useResendVerification()` hook
   - No direct authApi imports
   - Consistent notification handling via hooks

3. **forgot-password-form-feature.tsx** ✅
   - Uses `useForgotPassword()` hook
   - No direct authApi imports
   - Consistent notification handling via hooks

4. **reset-password-form-feature.tsx** ✅
   - Uses `useValidateResetToken()` hook
   - Uses `useResetPassword()` hook
   - No direct authApi imports
   - Consistent notification handling via hooks

5. **signup-form-feature.tsx** ✅
   - Uses `useSignup()` hook
   - No direct authApi imports
   - Consistent notification handling via hooks
   - Simplified component logic

6. **signin-form-feature.tsx** ✅
   - Correctly uses `useAuthStore().login()` for stateful authentication
   - Maintains session state management
   - Proper pattern for authenticated operations

### Architecture Achieved

✅ **Consistent Pattern**: All stateless auth operations use hooks
✅ **Centralized Logic**: All API calls, error handling, and notifications in one place
✅ **Type Safety**: Centralized type definitions in hooks
✅ **Maintainability**: Single source of truth for auth operations
✅ **Separation of Concerns**: Stateful (signin) vs stateless (signup, password reset, email verification) operations clearly separated

## Notes

- **Auth Store is still needed** for sign-in because it manages session state
- **Hooks are for stateless operations** that don't need state management
- **This creates a clear separation** between stateful (sign-in) and stateless (password reset, email verification) operations
