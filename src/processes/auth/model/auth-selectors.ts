/**
 * Auth Selectors
 * Derived state and computed values from auth store
 */

import { useAuthStore } from "./auth-store";
import type { AuthUser } from "@/shared/api";

/**
 * Hook to get current user
 */
export const useCurrentUser = (): AuthUser | null => {
  return useAuthStore((state) => state.user);
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  return useAuthStore((state) => state.isAuthenticated);
};

/**
 * Hook to check if auth is loading
 */
export const useAuthLoading = (): boolean => {
  return useAuthStore((state) => state.isLoading);
};

/**
 * Hook to check if auth is initialized
 */
export const useAuthInitialized = (): boolean => {
  return useAuthStore((state) => state.isInitialized);
};

/**
 * Hook to get auth error
 */
export const useAuthError = (): string | null => {
  return useAuthStore((state) => state.error);
};

/**
 * Hook to check if user has specific authority
 */
export const useHasAuthority = (authority: string): boolean => {
  return useAuthStore((state) => {
    return state.user?.authorities.includes(authority) ?? false;
  });
};

/**
 * Hook to check if user has specific permission
 */
export const useHasPermission = (permission: string): boolean => {
  return useAuthStore((state) => {
    return state.user?.permissions.includes(permission) ?? false;
  });
};

/**
 * Hook to check if user has any of the specified authorities
 */
export const useHasAnyAuthority = (authorities: string[]): boolean => {
  return useAuthStore((state) => {
    if (!state.user?.authorities) {
      return false;
    }
    return authorities.some((authority) =>
      state.user!.authorities.includes(authority)
    );
  });
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: string[]): boolean => {
  return useAuthStore((state) => {
    if (!state.user?.permissions) {
      return false;
    }
    return permissions.some((permission) =>
      state.user!.permissions.includes(permission)
    );
  });
};

/**
 * Hook to get user's full name
 */
export const useUserFullName = (): string => {
  return useAuthStore((state) => {
    if (!state.user) {
      return "";
    }
    return `${state.user.firstName} ${state.user.lastName}`.trim();
  });
};

/**
 * Hook to get user's initials
 */
export const useUserInitials = (): string => {
  return useAuthStore((state) => {
    if (!state.user) {
      return "";
    }
    const first = state.user.firstName.charAt(0).toUpperCase();
    const last = state.user.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  });
};

/**
 * Hook to check if email is verified
 */
export const useIsEmailVerified = (): boolean => {
  return useAuthStore((state) => {
    return state.user?.emailVerified ?? false;
  });
};
