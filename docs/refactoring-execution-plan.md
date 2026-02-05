# Refactoring Execution Plan

## Status

- **Phase 1 (Cleanup & Standardization)**: ✅ Completed
  - Removed dead code: `entities/form`, `shared/lib/error-utils.ts`, `shared/lib/use-error-handler.ts`, `features/signin-form/ui/index.ts`.
  - Standardized notifications: Updated `use-auth-api.ts` to use `notificationService` instead of direct `notifications.show`.
  - Refactored `SignUpFormFeature`: Adopted `useFormMutation` for standardized error/success handling.
  - Refactored `SignInFormFeature`: Adopted `useFormMutation` (replacing raw `useMutation`).

- **Phase 2 (Pattern Consolidation)**: ✅ Completed
  - **Refined `use-auth-api` hooks**: Removed `useForgotPassword` and `useResetPassword`. Features now use `useFormMutation` directly with `authApi`.
  - **Extracted `AuthFormCard`**: Standardized the look and feel of auth forms.
  - **Extracted Navigation Helpers**: Created reusable `AuthLinkTo*` components.
  - **Refactored `auth-store`**: Updated logic to propagate errors so `useFormMutation` can handle them correctly.

## Phase 3: Structural Improvements (Future)

- **Strict Types**: Add generics to `useFormMutation` for better type safety.
- **Entity vs Shared**: Finalize rule that entities are for business data, shared for generic utils.
