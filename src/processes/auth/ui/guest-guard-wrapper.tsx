/**
 * GuestGuardWrapper - Prevents rendering auth UI for authenticated users
 *
 * This wrapper ensures that:
 * 1. Nothing is shown to authenticated users
 * 2. Authenticated users are immediately redirected to APP_DOMAIN with tokens
 * 3. Only unauthenticated users see the auth forms (login, signup, etc.)
 */

import { type PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "../model/auth-store";
import { getAuthConfig } from "@/app/config";

export function GuestGuardWrapper({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  useEffect(() => {
    // Redirect immediately when we know the user is authenticated
    if (isInitialized && isAuthenticated && accessToken && refreshToken) {
      const config = getAuthConfig();

      // Check if there's a returnTo parameter in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const returnToUrl = urlParams.get("returnTo");

      // Redirect to the specified URL or default to app domain
      let targetUrl = returnToUrl || config.redirects.afterLogin;

      // Pass tokens via URL parameters for cross-domain authentication
      const separator = targetUrl.includes("?") ? "&" : "?";
      const tokenParams = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      targetUrl = `${targetUrl}${separator}${tokenParams.toString()}`;

      window.location.href = targetUrl;
    }
  }, [isAuthenticated, isInitialized, accessToken, refreshToken]);

  // Don't render anything until we're initialized
  if (!isInitialized) {
    return null;
  }

  // Don't render anything for authenticated users
  // This prevents any flash of auth forms
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
