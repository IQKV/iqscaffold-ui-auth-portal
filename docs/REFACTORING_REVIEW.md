# Project Refactoring Review

**Auth Portal (auth.iqscaffold.com)** — Analysis for FSD, TanStack, Mantine UI, business features, and technical debt.

---

## 1. Feature-Sliced Design (FSD) Assessment

### Strengths

- Clear layer hierarchy: `app` → `pages` → `widgets` → `features` → `entities` → `shared`
- Processes layer for cross-cutting auth/tenant concerns
- Public API via `index.ts` in features, widgets, processes, shared
- Architecture tests enforce structure and conventions
- Features follow `ui/` + `model/` segments

### Issues & Recommendations

| Issue                                         | Location                     | Recommendation                                                                                                     |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Empty entities layer**                      | `src/entities/`              | Only `.gitkeep`. Either introduce real entities (User, Tenant) or document that auth portal has no entities.       |
| **Missing processes in main layer list**      | `architecture.test.ts`       | Add `processes` to the main layer list to match AGENTS.md and FSD.                                                 |
| **use-auth-api not in shared/lib public API** | `shared/lib/use-auth-api.ts` | Imported by path. Either export from `shared/lib/index.ts` or move to `shared/api` as auth query hooks.            |
| **Auth types in shared/api**                  | `auth-api.ts`                | `AuthUser`, `TokenResponse`, etc. are domain concepts. Consider moving to `entities/user` when that layer is used. |

---

## 2. TanStack (Router & Query) Assessment

### Strengths

- TanStack Router with file-based routing and type-safe `routeTree`
- TanStack Query for mutations and server state
- `queryClient` passed via router context
- `useFormMutation` with RFC 7807 error handling

### Issues & Recommendations

| Issue                                      | Location                   | Recommendation                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@tanstack/zod-adapter unused**           | `package.json`             | Remove if not used for route params/search validation.                                                                                                                                                                                                                                                                          |
| **Direct `authApi` vs hooks**              | Features                   | `signin-form` uses auth store + `authApi` indirectly. `verify-email`, `forgot-password`, `reset-password` use `authApi` directly. `use-auth-api` provides `useValidateResetToken`, `useVerifyEmail`, etc., but only reset-password uses them. Align: either use hooks everywhere or document when to use hooks vs direct calls. |
| **verify-email duplicates mutation logic** | `verify-email-feature.tsx` | `useVerifyEmail` and `useResendVerification` in `use-auth-api` duplicate in-component logic. Prefer using these hooks.                                                                                                                                                                                                          |

---

## 3. Mantine UI Assessment

### Strengths

- Consistent use of Mantine components (Stack, Button, Alert, TextInput, etc.)
- `enhanced-form-hook` with Zod validation and Mantine form
- Theme and ModalsProvider configured in app
- Dedicated auth form fields in shared UI

### Issues & Recommendations

| Issue                                    | Location                   | Recommendation                                                                                                                                                               |
| ---------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **verify-email uses raw useMantineForm** | `verify-email-feature.tsx` | Uses `useForm` from `@mantine/form` with inline `validate` instead of `useForm` + Zod schema from `enhanced-form-hook`. Use `formSchemas.emailVerification` for consistency. |
| **Inconsistent form patterns**           | Features                   | signin, signup, forgot-password, reset-password use enhanced form hook + auth fields. verify-email uses raw Mantine form. Standardize on enhanced form.                      |

---

## 4. Business Features Orientation

### Current Features

| Feature              | Purpose            | Status                |
| -------------------- | ------------------ | --------------------- |
| signin-form          | Login              | OK                    |
| signup-form          | Registration       | OK                    |
| forgot-password-form | Request reset      | OK                    |
| reset-password-form  | Set new password   | OK                    |
| verify-email         | Email verification | Inconsistent patterns |

### Unused / Orphan Components

| Component      | Location                          | Note                                                                                         |
| -------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| **UserMenu**   | `processes/auth/ui/user-menu.tsx` | Exported, tested, never used in any page or widget. Auth portal has no authenticated layout. |
| **TenantInfo** | `widgets/tenant-info/`            | Exported, tested, never used. May be intended for main app.                                  |
| **publicApi**  | `shared/lib/public-client.ts`     | Exported, never imported. `/public` API client unused.                                       |

### Recommendations

- **UserMenu / TenantInfo**: Either integrate into auth portal (e.g. post-login preview) or move to a shared packages / main app.
- **publicApi**: Remove if no public endpoints exist, or document and use where needed.

---

## 5. Outdated / Useless Code

### Dead Code

| Item                                | Location                              | Action                                                                                                                    |
| ----------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **commonSchemas**                   | `form-validation.ts:345`              | Legacy alias for `validationSchemas`. Remove and update any references.                                                   |
| **api (client alias)**              | `shared/lib/client.ts`                | Re-exports `apiClient`. Only referenced in docs. Migrate remaining uses to `apiClient` from `@/shared/api` and remove.    |
| **Unused variables in auth-guards** | `requireRole`, `requireAnyRole`, etc. | `user` destructured but unused. Remove or use.                                                                            |
| **dates, string-helper**            | `shared/lib/`                         | Exported but not used in app code (only in tests). Keep if planned for future; otherwise mark internal or remove exports. |

### Potentially Unused Dependencies

| Package                           | Use              | Recommendation             |
| --------------------------------- | ---------------- | -------------------------- |
| `@xyflow/react`                   | Not found in src | Remove if unused           |
| `chroma-js`                       | Not found in src | Remove if unused           |
| `collect.js`                      | Not found in src | Remove if unused           |
| `compression`                     | Not found in src | Remove (server-side)       |
| `cookie-parser`                   | Not found in src | Remove (server-side)       |
| `lottie-web`, `react-lottie`      | Not found in src | Remove if unused           |
| `react-infinite-scroll-component` | Not found in src | Remove if unused           |
| `react-hook-form`                 | Not found in src | Remove (Mantine form used) |
| `query-string`                    | Not found in src | Remove if unused           |
| `react-icons`                     | Not found in src | Remove (Tabler used)       |
| `nuqs`                            | Not found in src | Remove if unused           |
| `@tanstack/zod-adapter`           | Not found in src | Remove if unused           |

Run `pnpm knip` to verify before removal.

### Form Validation Bloat

`form-validation.ts` defines many schemas not used by auth flows:

- `phone`, `url`, `requiredString`, `optionalString`, `positiveNumber`
- `arraySchemas`, `fileSchemas`, `dateSchemas`
- `createFormResolver`, `createFormSchema`, `createArraySchemas`, etc.

**Recommendation**: Extract auth-related schemas to a smaller module, or move generic schemas to a separate `shared/lib/form-validation-extended` and import only where needed.

---

## 6. Documentation & Examples Drift

### processes/auth/examples.md

Examples reference APIs that do not exist:

| Example references                 | Actual exports                          |
| ---------------------------------- | --------------------------------------- |
| `useHasRole`                       | `useHasAuthority`, `useHasAnyAuthority` |
| `useHasAnyRole`                    | `useHasAnyAuthority`                    |
| `getUserTenant`, `belongsToTenant` | Not exported from auth                  |

**Recommendation**: Update examples to match current API or add `useHasRole` / tenant helpers if needed.

### useIsEmailVerified

Defined in `auth-selectors.ts` but not exported from `processes/auth/index.ts`. Add to public API if used.

---

## 7. MSW Mock Alignment

### shared/mocks/handlers/auth.ts

| Issue                    | Detail                                                                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login response shape** | Mock `user` has `id`, `name`, `avatar`, `role`. `AuthUser` expects `userId`, `username`, `firstName`, `lastName`, `authorities`, `permissions`, `tenantId`, etc. |
| **Signup request**       | Mock expects `email`, `password`, `name`. Real API uses `username`, `email`, `password`, `firstName`, `lastName`.                                                |
| **Signup response**      | Mock returns `user` + tokens. Real API returns `UserRegistrationResponse` (no tokens).                                                                           |
| **TokenResponse**        | Mock omits `tokenType`; real API includes it.                                                                                                                    |

**Recommendation**: Align mock request/response types with `auth-api.ts` and `AuthUser` / `TokenResponse` / `UserRegistrationResponse`.

---

## 8. Suggested Refactoring Priority

### High Priority

1. Align MSW handlers with `auth-api` and types
2. Update verify-email to use enhanced form and `formSchemas.emailVerification`
3. Fix or remove `processes/auth/examples.md` vs real API
4. Remove or relocate unused widgets (UserMenu, TenantInfo) and `publicApi`

### Medium Priority

5. Run `pnpm knip` and remove unused dependencies
6. Add `use-auth-api` to shared public API or move to `shared/api`
7. Remove `commonSchemas` and finish migration from `api` to `apiClient`
8. Clean up auth-guards (unused variables)

### Low Priority

9. Trim form-validation to auth-related schemas
10. Decide on entities layer and add User/Tenant if needed
11. Add `processes` to architecture layer tests

---

## 9. Architecture Test Gap

`architecture.test.ts` validates layers: `app`, `pages`, `widgets`, `features`, `entities`, `shared`. The `processes` layer exists and is used but is not in the main layer list. Add it for consistency with AGENTS.md and the real structure.

---

_Generated from codebase analysis. Run tests and type-check after refactoring._
