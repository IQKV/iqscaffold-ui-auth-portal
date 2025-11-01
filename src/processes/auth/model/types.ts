/**
 * Auth Process Layer Types
 * Centralized types for authentication process
 */

import type { User } from "@/entities/user";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface AuthError {
  type: "auth" | "network" | "validation" | "server";
  message: string;
  code?: string;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export type AuthStore = AuthState & AuthActions;
