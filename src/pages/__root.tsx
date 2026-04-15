import React from "react";

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Helmet } from "@dr.pogodin/react-helmet";

import { AppLayout } from "@/shared/ui/app-layout";

const env = import.meta.env;
const TanStackRouterDevtools =
  env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtools Panel
        })),
      );

function RootComponent() {
  return (
    <AppLayout>
      <Helmet defaultTitle="IQ  Key Value Platform" titleTemplate="%s | IQ  Key Value Platform" />
      <Outlet />
      <TanStackRouterDevtools />
    </AppLayout>
  );
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    // Catch-all: redirect authenticated users to app domain
    // Allow access only to auth-related routes
    const authRoutes = [
      "/",
      "/login",
      "/register",
      "/signup-organization",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/404",
    ];

    // Check if current path starts with /join/ (invitation routes)
    const isInvitationRoute = location.pathname.startsWith("/join/");

    // If not an auth route and not an invitation route, check authentication
    if (!authRoutes.includes(location.pathname) && !isInvitationRoute) {
      const { useAuthStore } = await import("@/processes/auth");
      const { getAuthConfig } = await import("@/app/config");
      const { isAuthenticated } = useAuthStore.getState();

      if (isAuthenticated) {
        const authConfig = getAuthConfig();
        window.location.href = authConfig.redirects.afterLogin;
      }
    }
  },
  component: RootComponent,
});
