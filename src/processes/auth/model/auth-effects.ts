/**
 * Auth Effects
 * Side effects and background processes for authentication
 */

import { useAuthStore } from "./auth-store";
import { TokenManager } from "../lib/token-manager";

const tokenManager = TokenManager.getInstance();

/**
 * Auto token refresh effect
 * Automatically refreshes tokens when they're about to expire
 */
export class AuthEffects {
  private static instance: AuthEffects;
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60 * 1000; // Check every minute

  static getInstance(): AuthEffects {
    if (!AuthEffects.instance) {
      AuthEffects.instance = new AuthEffects();
    }
    return AuthEffects.instance;
  }

  /**
   * Start automatic token refresh monitoring
   */
  startTokenRefreshMonitoring(): void {
    if (this.refreshInterval) {
      return; // Already running
    }

    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshToken();
    }, this.CHECK_INTERVAL);
  }

  /**
   * Stop automatic token refresh monitoring
   */
  stopTokenRefreshMonitoring(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Check if token needs refresh and refresh if necessary
   */
  private async checkAndRefreshToken(): Promise<void> {
    const { isAuthenticated, refreshTokens } = useAuthStore.getState();

    if (!isAuthenticated) {
      return;
    }

    const accessToken = tokenManager.getAccessToken();

    if (accessToken && tokenManager.shouldRefreshToken(accessToken)) {
      try {
        await refreshTokens();
        console.log("Token refreshed automatically");
      } catch (error) {
        console.error("Auto token refresh failed:", error);
        // The store will handle clearing the session
      }
    }
  }

  /**
   * Handle page visibility change
   * Refresh token when page becomes visible if needed
   */
  handleVisibilityChange = (): void => {
    if (document.visibilityState === "visible") {
      this.checkAndRefreshToken();
    }
  };

  /**
   * Handle storage events (for multi-tab synchronization)
   */
  handleStorageChange = (event: StorageEvent): void => {
    const tokenStorage = tokenManager.getTokenStorageConfig();

    // If tokens were cleared in another tab
    if (
      (event.key === tokenStorage.accessTokenKey ||
        event.key === tokenStorage.refreshTokenKey) &&
      event.newValue === null
    ) {
      const { logout } = useAuthStore.getState();
      logout();
    }
  };

  /**
   * Initialize all auth effects
   */
  initialize(): void {
    this.startTokenRefreshMonitoring();

    // Listen for page visibility changes
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Listen for storage changes (multi-tab sync)
    window.addEventListener("storage", this.handleStorageChange);
  }

  /**
   * Cleanup all auth effects
   */
  cleanup(): void {
    this.stopTokenRefreshMonitoring();
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    window.removeEventListener("storage", this.handleStorageChange);
  }
}
