/**
 * Auth Guards
 * Route protection and authorization utilities
 */

import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../model/auth-store";
import { TokenManager } from "./token-manager";
import { getAuthConfig } from "@/app/config";

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
 * Redirects to app domain since auth portal doesn't have protected pages
 */
export const requireAuth = () => {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname,
      },
    });
  } else {
    // User is authenticated, redirect to app domain
    const authConfig = getAuthConfig();
    window.location.href = authConfig.redirects.afterLogin;
  }
};

/**
 * Require guest (non-authenticated) for route access
 * Redirects to app domain if already authenticated
 */
export const requireGuest = () => {
  if (isAuthenticated()) {
    const authConfig = getAuthConfig();
    window.location.href = authConfig.redirects.afterLogin;
  }
};

/**
 * Require specific role for route access
 * Note: Auth portal doesn't have protected pages, so this redirects to app domain
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

  // Auth portal doesn't handle authorization, redirect to app domain
  const authConfig = getAuthConfig();
  window.location.href = authConfig.redirects.afterLogin;
};

/**
 * Require any of the specified roles for route access
 * Note: Auth portal doesn't have protected pages, so this redirects to app domain
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

  // Auth portal doesn't handle authorization, redirect to app domain
  const authConfig = getAuthConfig();
  window.location.href = authConfig.redirects.afterLogin;
};

/**
 * Require specific permission for route access
 * Note: Auth portal doesn't have protected pages, so this redirects to app domain
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

  // Auth portal doesn't handle authorization, redirect to app domain
  const authConfig = getAuthConfig();
  window.location.href = authConfig.redirects.afterLogin;
};

/**
 * Require any of the specified permissions for route access
 * Note: Auth portal doesn't have protected pages, so this redirects to app domain
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

  // Auth portal doesn't handle authorization, redirect to app domain
  const authConfig = getAuthConfig();
  window.location.href = authConfig.redirects.afterLogin;
};

/**
 * Check if email verification is required
 * Note: Auth portal doesn't handle email verification, redirect to app domain
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

  // Auth portal doesn't handle email verification, redirect to app domain
  const authConfig = getAuthConfig();
  window.location.href = authConfig.redirects.afterLogin;
};
