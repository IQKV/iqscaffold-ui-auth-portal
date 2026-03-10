/**
 * Token Manager
 * Handles token storage, validation, and lifecycle management
 */

import { jwtDecode } from "jwt-decode";
import { getAuthConfig } from "@/app/config";

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

export class TokenManager {
  private static instance: TokenManager;
  private config = getAuthConfig();

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Store tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.config.tokenStorage.accessTokenKey, accessToken);
    localStorage.setItem(this.config.tokenStorage.refreshTokenKey, refreshToken);
  }

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.config.tokenStorage.accessTokenKey);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.config.tokenStorage.refreshTokenKey);
  }

  /**
   * Clear all tokens from storage
   */
  clearTokens(): void {
    localStorage.removeItem(this.config.tokenStorage.accessTokenKey);
    localStorage.removeItem(this.config.tokenStorage.refreshTokenKey);
  }

  /**
   * Check if access token exists and is valid
   */
  isTokenValid(token?: string): boolean {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      const currentTime = Date.now() / 1000;

      // Check if token is expired (with 30 second buffer)
      return decoded.exp > currentTime + 30;
    } catch {
      return false;
    }
  }

  /**
   * Check if token needs refresh (expires within 5 minutes)
   */
  shouldRefreshToken(token?: string): boolean {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      const currentTime = Date.now() / 1000;
      const fiveMinutes = 5 * 60;

      return decoded.exp < currentTime + fiveMinutes;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token?: string): Date | null {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      return null;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Check if we have valid tokens for authentication
   */
  hasValidSession(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    return !!(accessToken && refreshToken && this.isTokenValid(accessToken));
  }

  /**
   * Check if we have tokens that can be refreshed
   */
  canRefreshSession(): boolean {
    const refreshToken = this.getRefreshToken();
    return !!refreshToken;
  }

  /**
   * Get token storage configuration
   */
  getTokenStorageConfig() {
    return this.config.tokenStorage;
  }
}
