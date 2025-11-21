/**
 * GuestGuardWrapper - Prevents rendering auth UI for authenticated users
 *
 * This wrapper ensures that:
 * 1. Nothing is shown to authenticated users
 * 2. Authenticated users are immediately redirected to APP_DOMAIN
 * 3. Only unauthenticated users see the auth forms (login, signup, etc.)
 */

import { type PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "../model/auth-store";
import { getAuthConfig } from "@/app/config";

export function GuestGuardWrapper({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    // Redirect immediately when we know the user is authenticated
    if (isInitialized && isAuthenticated) {
      const config = getAuthConfig();

      // Check if there's a returnTo parameter in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const returnToUrl = urlParams.get("returnTo");

      // Redirect to the specified URL or default to app domain
      const targetUrl = returnToUrl || config.redirects.afterLogin;
      window.location.href = targetUrl;
    }
  }, [isAuthenticated, isInitialized]);

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
