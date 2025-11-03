/**
 * Auth Utilities
 * Helper functions for authentication-related operations
 */

import { useAuthStore } from "../model/auth-store";
import { TokenManager } from "./token-manager";
import type { AuthUser } from "@/shared/api";

const tokenManager = TokenManager.getInstance();

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Format user display name
 */
export const formatUserDisplayName = (user: AuthUser): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || user.email;
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: AuthUser): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  return user.email.substring(0, 2).toUpperCase();
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (user?: AuthUser | null): boolean => {
  const currentUser = user || useAuthStore.getState().user;
  return currentUser?.roles.includes("admin") ?? false;
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (user?: AuthUser | null): boolean => {
  const currentUser = user || useAuthStore.getState().user;
  return currentUser?.roles.includes("super_admin") ?? false;
};

/**
 * Get user's highest role priority
 */
export const getUserRolePriority = (user?: AuthUser | null): number => {
  const currentUser = user || useAuthStore.getState().user;
  if (!currentUser?.roles) {
    return 0;
  }

  const rolePriorities: Record<string, number> = {
    super_admin: 100,
    admin: 90,
    manager: 80,
    moderator: 70,
    user: 10,
    guest: 1,
  };

  return Math.max(
    ...currentUser.roles.map((role) => rolePriorities[role] || 0)
  );
};

/**
 * Check if current session is about to expire
 */
export const isSessionExpiringSoon = (
  minutesThreshold: number = 5
): boolean => {
  const token = tokenManager.getAccessToken();
  if (!token) {
    return false;
  }

  const expiration = tokenManager.getTokenExpiration(token);
  if (!expiration) {
    return false;
  }

  const now = new Date();
  const timeDiff = expiration.getTime() - now.getTime();
  const minutesLeft = timeDiff / (1000 * 60);

  return minutesLeft <= minutesThreshold;
};

/**
 * Get time until token expires
 */
export const getTimeUntilExpiration = (): {
  minutes: number;
  seconds: number;
  isExpired: boolean;
} => {
  const token = tokenManager.getAccessToken();
  if (!token) {
    return { minutes: 0, seconds: 0, isExpired: true };
  }

  const expiration = tokenManager.getTokenExpiration(token);
  if (!expiration) {
    return { minutes: 0, seconds: 0, isExpired: true };
  }

  const now = new Date();
  const timeDiff = expiration.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return { minutes: 0, seconds: 0, isExpired: true };
  }

  const minutes = Math.floor(timeDiff / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { minutes, seconds, isExpired: false };
};

/**
 * Validate user permissions for specific actions
 */
export const canPerformAction = (
  action: string,
  resource?: string,
  user?: AuthUser | null
): boolean => {
  const currentUser = user || useAuthStore.getState().user;
  if (!currentUser) {
    return false;
  }

  // Super admin can do everything
  if (isSuperAdmin(currentUser)) {
    return true;
  }

  // Check specific permission
  const permission = resource ? `${action}:${resource}` : action;
  return currentUser.permissions.includes(permission);
};

/**
 * Get user's tenant context
 */
export const getUserTenant = (user?: AuthUser | null): string => {
  const currentUser = user || useAuthStore.getState().user;
  return currentUser?.tenantId || "default";
};

/**
 * Check if user belongs to specific tenant
 */
export const belongsToTenant = (
  tenantId: string,
  user?: AuthUser | null
): boolean => {
  const currentUser = user || useAuthStore.getState().user;
  return currentUser?.tenantId === tenantId;
};
