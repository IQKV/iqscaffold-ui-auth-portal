# Refactoring Review (Auth Portal)

Last updated: 2026-02-05

This document is a **codebase review for further refactoring**. It focuses on **FSD adherence**, **TanStack Router/Query patterns**, **Mantine UI usage**, and **outdated/unused code** candidates.

Related: `docs/refactoring-execution-plan.md` (completed cleanup phases).

---

## Executive Summary

- **FSD**: Structure and public APIs are generally solid; automated architecture tests appear to be guiding this well.
- **Biggest technical smell**: **Two axios clients** exist (`shared/api/base.ts` and `shared/lib/client.ts`) with overlapping responsibilities and different header logic.
- **Business flow consistency**: Auth flows are mostly consistent via `useFormMutation`, but **sign-in is store-driven** (`processes/auth`) while other flows call `authApi` directly.
- **Dead/unused code likely exists**: `shared/lib/use-auth-api.ts` exports multiple hooks that appear **unused** outside itself (only `useValidateResetToken` is currently consumed).
- **Docs drift**: `AGENTS.md` describes a shared `FormField` component that doesn’t exist in `src/shared/ui/form-field/` (not found), while the code uses dedicated field components.

---

## Architecture & FSD (Feature-Sliced Design)

### What looks good

- **Layering is clear** (`src/app`, `src/processes`, `src/pages`, `src/widgets`, `src/features`, `src/shared`).
- **Auth cross-cutting state** is correctly in `processes/auth` (`src/processes/auth/model/auth-store.ts`, selectors in `src/processes/auth/model/auth-selectors.ts`).
- Feature code generally imports via public APIs (based on spot checks in auth form features).

### Smells / decisions to make

- **`src/entities/` is empty** (`src/entities/.gitkeep` only).
  - **Option A** (recommended if you plan domain modeling): introduce minimal entities for auth domain, e.g. `entities/user`, `entities/session`, `entities/tenant`, move shared “domain-ish” types there.
  - **Option B** (recommended if not): remove `entities/` and update architecture tests/docs accordingly (or keep it as a placeholder intentionally).

---

## Business Features & Auth Flows (where things live)

Current primary flows:

- **Sign in**: `src/features/signin-form/ui/signin-form-feature.tsx`
  - Uses `useFormMutation` + **calls Zustand action** `useAuthStore((s) => s.login)` from `processes/auth`.
  - Redirect: external via `window.location.href` using `getAuthConfig()` (supports `returnTo` query param).

- **Sign up**: `src/features/signup-form/ui/signup-form-feature.tsx`
  - Uses `useFormMutation` + **calls `authApi.signup()` directly**.
  - Navigation: uses TanStack Router `useNavigate`.

- **Forgot password**: `src/features/forgot-password-form/ui/forgot-password-form-feature.tsx`
  - Uses `useFormMutation` + **calls `authApi.forgotPassword()` directly**.

- **Reset password**: `src/features/reset-password-form/ui/reset-password-form-feature.tsx`
  - Validates token using `useValidateResetToken()` (React Query) from `src/shared/lib/use-auth-api.ts`.
  - Uses `useFormMutation` + **calls `authApi.resetPassword()` directly**.

### Refactoring target (consistency)

Pick and enforce one of these patterns:

1. **Process-driven orchestration** (recommended for consistency): move “sign up / forgot / reset” into `processes/auth` actions (or process-level services), and make all features call `useAuthStore()` actions.
2. **API-driven features**: keep features calling `authApi.*` directly, and narrow `processes/auth` to session lifecycle (login/logout/refresh/init) only.

Either is fine; the main win is **uniformity** and predictable error/notification handling.

---

## TanStack Query / Mutations

### What looks good

- `useFormMutation` is consistently used in feature forms (see the auth form features above). This is a strong abstraction for:
  - mapping RFC7807 field errors into Mantine form errors
  - centralized success/error notifications

### Likely dead code: `shared/lib/use-auth-api.ts`

File: `src/shared/lib/use-auth-api.ts`

Current usage:

- Imported in:
  - `src/features/reset-password-form/ui/reset-password-form-feature.tsx`
  - `src/features/forgot-password-form/ui/forgot-password-form-feature.tsx`
- Only **`useValidateResetToken`** is used by features (based on current imports and call sites).

Hooks that appear **unused outside the module** (candidates to remove or move behind a “future” boundary):

- `useValidateToken`
- `useChangePassword`
- `useLogoutAll`
- `useResendVerification`
- `useVerifyEmail`
- `useEmailStatus` (not referenced anywhere else currently)

Refactor options:

- **Option A (recommended)**: keep `useValidateResetToken` here and delete the rest until needed (git history retains them).
- **Option B**: move them to an `examples/` or `experimental/` area (if you want to keep them visible but not “production API”).
- **Option C**: reintroduce UI flows that use them, but ensure they match the project’s `useFormMutation` patterns (right now these hooks do their own notifications).

---

## HTTP / Axios Layer (Highest Priority)

You currently have **two axios clients**:

- `src/shared/api/base.ts` exports `apiClient` (+ `apiRequest`), with:
  - tenant header from `processes/tenant` store
  - locale headers (`Accept-Language`, `X-User-Locale`)
  - global server error notifications
- `src/shared/lib/client.ts` exports `api`, with:
  - tenant header via `resolveTenantId()` (different source)
  - global server error notifications

### Why this matters

- The behavior of outgoing requests (tenant header + locale headers) will diverge depending on which client is used.
- It’s easy to accidentally bypass locale/tenant behavior or duplicate interceptors.

### Recommended refactor

Consolidate to **one** client.

- Prefer `src/shared/api/base.ts` as the canonical client because it already encodes:
  - locale headers logic
  - tenant derived from store (consistent with app state)
- Remove or repoint `src/shared/lib/client.ts`:
  - either delete it, or turn it into a re-export/alias of `apiClient` to avoid breaking imports (short-term)

Note: a quick scan suggests `@/shared/lib/client` is not imported anywhere right now, so deletion may be safe once confirmed by tooling (e.g. Knip).

---

## Mantine UI & Form Composition

### What looks good

- Auth features consistently compose Mantine primitives (`Stack`, `Group`, `Button`, `Text`) with shared UI building blocks (`AuthFormCard`, field components, link helpers).

### Cleanup candidates

Many feature components still contain commented-out imports or removed legacy code markers, e.g.:

- `src/features/signin-form/ui/signin-form-feature.tsx` has commented `useMutation` import.
- `src/features/signup-form/ui/signup-form-feature.tsx` has commented imports (`notifications`, `useMutation`).
- `src/features/forgot-password-form/ui/forgot-password-form-feature.tsx` has commented imports.
- `src/features/reset-password-form/ui/reset-password-form-feature.tsx` has multiple commented-out Mantine imports.

Recommendation:

- Remove commented imports and obsolete comments (they add noise and complicate reviews).

### Docs drift: `FormField` example in `AGENTS.md`

`AGENTS.md` documents a large `shared/ui/form-field` component, but `src/shared/ui/form-field/` is not present.

Choose one:

- **Update docs** to match the current approach (dedicated fields like `EmailField`, `PasswordField`, etc.).
- Or **introduce** `shared/ui/form-field/` if you want a single generic field abstraction.

---

## Processes/Auth Store Notes

Files:

- `src/processes/auth/model/auth-store.ts`
- `src/processes/auth/model/auth-selectors.ts`

Observations / opportunities:

- Auth store currently uses **TokenManager** and is **not persisted** via Zustand `persist`. This is a valid design if tokens are the source of truth and you rehydrate state via `initialize()`.
- There is an open TODO in `auth-store.ts` about optionally fetching user data from token/API during initialization.

Refactoring ideas:

- Decide whether `initialize()` should:
  - decode access token into a minimal `AuthUser`, or
  - call a `me` endpoint (if available), or
  - keep user null until first authenticated API call succeeds

Also: `auth-selectors.ts` contains “backward compatibility aliases” (`useHasRole`, `useHasAnyRole`). If nothing imports these aliases anymore, remove them to keep the public surface minimal.

---

## Outdated / Useless Code Candidates (Checklist)

Use this checklist with a dead-code tool (Knip is already in the stack) before removing:

- [ ] Remove unused hooks in `src/shared/lib/use-auth-api.ts` (keep only what is used).
- [ ] Remove `src/shared/lib/client.ts` **if** no longer used, or replace with an alias to `apiClient`.
- [ ] Remove backward-compat aliases in `src/processes/auth/model/auth-selectors.ts` if unused.
- [ ] Remove commented-out imports in auth feature UIs.
- [ ] Revisit `src/entities/` (populate or remove).

---

## Prioritized Refactoring Roadmap

### High priority (most leverage)

- **Unify axios client** (single interceptors chain and header behavior).
- **Standardize auth flow orchestration** (process-driven vs API-driven; remove mixed approach).
- **Trim unused hooks/exports** (`use-auth-api.ts` and backward-compat aliases).

### Medium priority

- Decide “entities vs shared” rule and apply it (or remove empty layer).
- Clarify auth initialization strategy (`initialize()` + user hydration).
- Align docs with implementation (`AGENTS.md` FormField example).

### Low priority

- Commented import cleanup.
- Minor TODO/comment polish once patterns are stable.
