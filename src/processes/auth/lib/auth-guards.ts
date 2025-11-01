/**
 * Auth Guards
 * Route protection and authorization utilities
 */

import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../model/auth-store";
import { TokenManager } from "./token-manager";

const tokenManager = TokenManager.getInstance();

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated && tokenManager.hasValidSession();
};

/**
 * Require authentication for route access
 */
export const requireAuth = () => {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

/**
 * Require guest (non-authenticated) for route access
 */
export const requireGuest = () => {
  if (isAuthenticated()) {
    throw redirect({
      to: "/",
    });
  }
};

/**
 * Require specific role for route access
 */
export const requireRole = (role: string) => {
  const { user } = useAuthStore.getState();

  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }

  if (!user?.roles.includes(role)) {
    throw redirect({
      to: "/unauthorized",
    });
  }
};

/**
 * Require any of the specified roles for route access
 */
export const requireAnyRole = (roles: string[]) => {
  const { user } = useAuthStore.getState();

  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }

  const hasRole = roles.some((role) => user?.roles.includes(role));
  if (!hasRole) {
    throw redirect({
      to: "/unauthorized",
    });
  }
};

/**
 * Require specific permission for route access
 */
export const requirePermission = (permission: string) => {
  const { user } = useAuthStore.getState();

  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }

  if (!user?.permissions.includes(permission)) {
    throw redirect({
      to: "/unauthorized",
    });
  }
};

/**
 * Require any of the specified permissions for route access
 */
export const requireAnyPermission = (permissions: string[]) => {
  const { user } = useAuthStore.getState();

  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }

  const hasPermission = permissions.some((permission) =>
    user?.permissions.includes(permission)
  );

  if (!hasPermission) {
    throw redirect({
      to: "/unauthorized",
    });
  }
};

/**
 * Check if email verification is required
 */
export const requireEmailVerification = () => {
  const { user } = useAuthStore.getState();

  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  }

  if (!user?.emailVerified) {
    throw redirect({
      to: "/verify-email",
      search: {
        token: undefined,
        email: undefined,
      },
    });
  }
};
