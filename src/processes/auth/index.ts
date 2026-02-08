/**
 * Auth Process Layer
 * Public API for authentication process
 */

// Store and state management
export { useAuthStore } from "./model/auth-store";
export { AuthEffects } from "./model/auth-effects";

// Selectors and hooks
export {
  useCurrentUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthInitialized,
  useAuthError,
  useHasAuthority,
  useHasPermission,
  useHasAnyAuthority,
  useHasAnyPermission,
  useUserFullName,
  useUserInitials,
} from "./model/auth-selectors";

// Guards and protection
export {
  isAuthenticated,
  requireAuth,
  requireGuest,
  requireRole,
  requireAnyRole,
  requirePermission,
} from "./lib/auth-guards";

// Utilities
export {
  getAuthHeader,
  formatUserDisplayName,
  getUserInitials,
  isAdmin,
  isSuperAdmin,
  isTenantOwner,
  getUserAuthorityPriority,
  isSessionExpiringSoon,
  getTimeUntilExpiration,
} from "./lib/auth-utils";

// HTTP Interceptors setup
export { attachAuthInterceptors } from "./lib/http-interceptors";

// UI Components
export { AuthProvider } from "./ui/auth-provider";
export { GuestGuardWrapper } from "./ui/guest-guard-wrapper";

// Token management
export { TokenManager } from "./lib/token-manager";

// Types
export type {
  AuthState,
  LoginCredentials,
  AuthTokens,
  AuthSession,
  AuthError,
  AuthActions,
  AuthStore,
} from "./model/types";
